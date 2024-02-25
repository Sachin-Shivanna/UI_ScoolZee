/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Box, Button, Container, Grid, Paper, Typography } from '@material-ui/core';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DoneIcon from '@mui/icons-material/Done';
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import toast, { Toaster } from 'react-hot-toast';
import { useStyles } from '../FeeStructureStyle';
import { useHistory } from 'react-router-dom';
import { TextField } from '@mui/material';
import Loading from '../../../../components/loading/Loading';
import Custom_Button from '../../../../components/reusableElements/Custom_Button';

const NewFeeStructure = (params) => {
    const classes = useStyles();
    const history = useHistory();

    let unmounted = false;

    let feeStructureObjPermission = params?.location?.state?.feeStructureObjPermission || params.feeStructureObjPermission;

    function createData(description, amount, isEditMode) {
        return { description, amount, isEditMode };
    }

    const rows = [
        createData('Tution', 0, false),
        createData('Transport', 0, false),
        createData('Stationary', 0, false),
        createData('Admission fee', 0, false),
        createData('Others', 0, false),
    ];

    const [isPageLoading, setisPageLoading] = useState(false);
    const [isPageLoadingFailed, setisPageLoadingFailed] = useState(false);
    const [invalidList, setInvalidList] = React.useState([]);
    const [structureName, setStructureName] = React.useState('');
    const [feeData, setFeeData] = useState([...rows]);
    const [totalFee, setTotalFee] = useState(0);

    useEffect(() => {
        console.log(params.feeStructureObjPermission)
        calculateTotal()
    }, [])


    const handleEdit = (row) => {
        let tempFreeData = [...feeData];
        let editingRow = tempFreeData.find(fee => fee.isEditMode === true);
        if (editingRow?.description === '') {
            return toast.error('Description can not be empty');
        }
        let duplicateDesc = tempFreeData.find(fee => fee.description === editingRow?.description && fee.isEditMode === false) || '';
        if (duplicateDesc !== '') {
            return toast.error('Duplicate description');
        }
        tempFreeData.map(fee => { return fee.isEditMode = false });
        tempFreeData.find(fee => fee.description === row.description).isEditMode = true;
        setFeeData([...tempFreeData]);
        calculateTotal()
    }

    const handleRowSave = (index, row) => {
        let tempFreeData = feeData;
        let duplicateDesc = tempFreeData.find(fee => (fee.description === row.description && fee.isEditMode === false)) || '';
        if (duplicateDesc !== '') {
            return toast.error('Duplicate description');
        }
        if (row.description === '') {
            return toast.error('Description can not be empty');
        }
        tempFreeData[index].isEditMode = false;
        setFeeData([...tempFreeData]);
        calculateTotal()
    }

    const handleAmountChange = (index, amount) => {
        const evaluate = /^[+-]?\d*(?:[.,]\d*)?$/;
        if (amount === '' || evaluate.test(amount)) {
            let tempFreeData = [...feeData];
            tempFreeData[index].amount = amount.replace(/^0+/, '') || 0;
            setFeeData([...tempFreeData]);
        }


    }

    const handleDescriptionChange = (index, description) => {
        let tempFreeData = [...feeData];
        tempFreeData[index].description = description;
        setFeeData([...tempFreeData]);
    }

    const handleRemove = (index) => {
        console.log(index)
        let tempFreeData = feeData;
        tempFreeData.splice(index, 1)
        console.log(tempFreeData)
        setFeeData([...tempFreeData]);
    }
    const handleAdd = () => {
        let tempFreeData = feeData;
        let editingRow = tempFreeData.find(fee => fee.isEditMode === true);
        if (editingRow?.description === '') {
            return toast.error('Description can not be empty');
        }
        let duplicateDesc = tempFreeData.find(fee => fee.description === editingRow?.description && fee.isEditMode === false) || '';
        if (duplicateDesc !== '') {
            return toast.error('Duplicate description');
        }
        tempFreeData.map(fee => { return fee.isEditMode = false });
        tempFreeData.push(createData('', 0, true));
        setFeeData([...tempFreeData]);
    }

    const calculateTotal = () => {
        let tempTotalFee = 0;
        tempTotalFee = feeData.map(fee => { return fee.amount }).reduce((x, y) => parseFloat(x) + parseFloat(y));
        setTotalFee(tempTotalFee)
    }

    const validate = () => {
        let invalidList = [];
        let isValid = true;

        if (structureName === '') {
            invalidList.push('name');
            isValid = false
        }
        if (!isValid) {
            setInvalidList([...invalidList])
        }
        return isValid;
    }

    const reset = () => {
        setFeeData([...rows]);
        setTotalFee(0);
        setStructureName('');
        return;
    }

    const handleRecordSave = async (createNew) => {
        if (!validate()) {
            return
        }
        let finalFeeData = { name: structureName, feeData: feeData.map(fee => { return { description: fee.description, amount: fee.amount } }) }

        console.log(finalFeeData);
        setisPageLoading(true);
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.post(`${process.env.REACT_APP_SERVER}/add-fee-structure/fee-structure`, {
            finalFeeData
        })
            .then((response) => {
                toast.success("Saved!!");
                let action = createNew ? reset() : history.goBack();
            })
            .catch((error) => {
                if (!unmounted) {
                    if (error.request.status === 403) {
                        localStorage.removeItem('userDetail');
                        localStorage.removeItem('userToken');
                        localStorage.removeItem('activeSubscription');
                        history.replace('/login');
                        history.go(0);
                    }
                    if (error.request.status === 400) {
                        toast.error("Something went wtong! Please try again...");
                    }
                }
                setisPageLoadingFailed(true);
            })
            .finally(() => {
                setisPageLoading(false);
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
    }

    if (isPageLoadingFailed) {
        return (
            <Box style={{ paddingTop: '50%', backgroundColor: 'white' }}>
                <Loading isPageLoading={isPageLoading} />
            </Box>
        )
    }
    else if (isPageLoading) {
        return (
            <Box style={{ top: '50%' }}>
                <Loading isPageLoading={isPageLoading} />
            </Box>
        )
    }
    else {
        return (
            <React.Fragment>
                    <Box component="span" className={classes.hideButtons}>
                        <Grid justifyContent='space-between' container spacing={1}>
                            <Grid item xs={6} md={6} style={{ paddingRight: 4, justifyContent: 'flex-end' }} className={classes.gridElement}>
                                <Custom_Button variant='contained' size="medium" onClick={() => { handleRecordSave(false) }} label={'Save'} accessGranted = {feeStructureObjPermission?.create}/>
                            </Grid>
                            <Grid item xs={6} md={6} style={{ paddingLeft: 4 }} className={classes.gridElement}>
                                <Custom_Button variant='contained' size="medium" onClick={() => { handleRecordSave(true) }} label={'Save and New'} accessGranted = {feeStructureObjPermission?.create}/>
                            </Grid>
                        </Grid>
                    </Box>

                <Typography className={classes.header}>
                    Fee Structure :
                </Typography>
                <Container style={{ paddingTop: 30, backgroundColor: 'white' }}>
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <Box style={{ marginBottom: 20 }}>
                                <Typography className={classes.label}>Name :</Typography>
                                <TextField
                                    style={{ flex: 1 }}
                                    fullWidth
                                    inputProps={{
                                        className: classes.inputDesign
                                    }}
                                    placeholder={`Fee Structure Name`}
                                    helperText={!invalidList.includes('name') ? '' : "Name is required"}
                                    error={invalidList.includes('name')}
                                    onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'name')) }}
                                    value={structureName || ''}
                                    id="name"
                                    onChange={(name) => { setStructureName(name.target.value) }}
                                    variant="standard"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold' }}>Amount</TableCell>
                                <TableCell align="center" style={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {feeData.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {!row.isEditMode && <span>{row.description}</span>}
                                        {row.isEditMode && <TextField fullWidth
                                            id='row.description'
                                            value={row.description}
                                            onChange={(desc) => { handleDescriptionChange(index, desc.target.value) }}
                                        />}
                                    </TableCell>
                                    <TableCell align="right">
                                        {!row.isEditMode && <span>{row.amount}</span>}
                                        {row.isEditMode &&
                                            <TextField
                                                fullWidth id='row.description'
                                                inputMode='numeric'
                                                value={row.amount}
                                                onChange={(amt) => { handleAmountChange(index, amt.target.value) }}
                                            />}
                                    </TableCell>
                                    <TableCell align="center">
                                        {
                                            !row.isEditMode &&
                                            <span style={{ paddingRight: 3 }}><ModeEditIcon onClick={(event) => { handleEdit(row) }} /></span>
                                        }
                                        {
                                            row.isEditMode && <span style={{ paddingRight: 3 }}><DoneIcon style={{ paddingRight: 2 }} onClick={() => { handleRowSave(index, row) }} /></span>
                                        }
                                        <span style={{ paddingRight: 3 }}><RemoveCircleOutlineRoundedIcon onClick={() => { handleRemove(index) }} style={{ paddingRight: 2 }} /></span>
                                        {feeData.findIndex(fee => fee.description === row.description) === (feeData.length - 1) &&
                                            <span style={{ paddingRight: 3 }}><ControlPointRoundedIcon onClick={() => { handleAdd() }} style={{ paddingRight: 2 }} /></span>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow >
                                <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                                    Total
                                </TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold' }}>
                                    {totalFee}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Toaster />
            </React.Fragment>
        )
    }
}

export default NewFeeStructure