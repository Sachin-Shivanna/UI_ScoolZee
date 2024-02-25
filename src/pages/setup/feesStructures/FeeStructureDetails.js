/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from 'react'
import { Box, Button, Container, Grid, Paper, Typography } from '@material-ui/core';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import queryString from "query-string"

import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DoneIcon from '@mui/icons-material/Done';
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import toast, { Toaster } from 'react-hot-toast';
import { useStyles } from './FeeStructureStyle';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { TextField } from '@mui/material';
import AuditFields from '../../commomPages/AuditFields';
import Loading from '../../../components/loading/Loading';
import Custom_Button from '../../../components/reusableElements/Custom_Button';

const FeeStructureDetails = (params) => {

    const classes = useStyles();
    const history = useHistory();
    const queryParams = queryString.parse(window.location.search);

    let unmounted = false;
    const feeStructureObjPermission = params?.location?.state?.feeStructureObjPermission;

    const [feeData, setFeeData] = useState({});
    const [totalFee, setTotalFee] = useState(0);
    const [invalidList, setInvalidList] = React.useState([]);
    const [isPageLoading, setisPageLoading] = useState(false);



    useEffect(() => {
        getFeeStructureDetails();
    }, [])

    useEffect(() => {
        if (feeData.details?.length > 0) {
            calculateTotal();
        }
    }, [feeData.details])

    function createData(description, amount, isEditMode) {
        return { description, amount, isEditMode };
    }


    const getFeeStructureDetails = async () => {
        unmounted = false;
        setisPageLoading(true)
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/get-fee-structure-by-id/fee-structure/${queryParams.feeId}`)
            .then((response) => {
                console.log(response.data);
                setFeeData(response.data);
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
                }
            })
            .finally(() => {
                setisPageLoading(false)
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
    }

    const calculateTotal = () => {
        let tempTotalFee = 0;
        tempTotalFee = feeData.details?.map(fee => { return fee.amount }).reduce((x, y) => parseFloat(x) + parseFloat(y));
        setTotalFee(tempTotalFee)
    }

    const handleDetailsEdit = (row) => {
        let tempDataDetails = feeData.details;
        let editingRow = tempDataDetails.find(fee => fee.isEditMode === true);
        if (editingRow?.description === '') {
            return toast.error('Description can not be empty');
        }
        let duplicateDesc = tempDataDetails.find(fee => fee.description === editingRow?.description && fee.isEditMode === false) || '';
        if (duplicateDesc !== '') {
            return toast.error('Duplicate description');
        }
        tempDataDetails.map(fee => { return fee.isEditMode = false });
        tempDataDetails.find(fee => fee.description === row.description).isEditMode = true;
        setFeeData({ ...feeData, details: tempDataDetails });
        calculateTotal()
    }

    const handleRemove = (index) => {
        console.log(index)
        let tempDataDetails = feeData.details;
        tempDataDetails?.splice(index, 1)
        console.log(tempDataDetails)
        setFeeData({ ...feeData, details: tempDataDetails });
    }

    const handleRowSave = (index, row) => {
        let tempDataDetails = feeData.details;
        let duplicateDesc = tempDataDetails.find(fee => (fee.description === row.description && fee.isEditMode === false)) || '';
        if (duplicateDesc !== '') {
            return toast.error('Duplicate description');
        }
        if (row.description === '') {
            return toast.error('Description can not be empty');
        }
        tempDataDetails[index].isEditMode = false;
        setFeeData({ ...feeData, details: tempDataDetails });
        calculateTotal()
    }

    const handleAdd = () => {
        let tempDataDetails = feeData.details;
        let editingRow = tempDataDetails.find(fee => fee.isEditMode === true);
        if (editingRow?.description === '') {
            return toast.error('Description can not be empty');
        }
        let duplicateDesc = tempDataDetails.find(fee => fee.description === editingRow?.description && fee.isEditMode === false) || '';
        if (duplicateDesc !== '') {
            return toast.error('Duplicate description');
        }
        tempDataDetails.map(fee => { return fee.isEditMode = false });
        tempDataDetails.push(createData('', 0, true));
        setFeeData({ ...feeData, details: tempDataDetails });
    }

    const handleAmountChange = (index, amount) => {
        const evaluate = /^[+-]?\d*(?:[.,]\d*)?$/;
        if (amount === '' || evaluate.test(amount)) {
            let tempDataDetails = [...feeData.details];
            tempDataDetails[index].amount = amount.replace(/^0+/, '') || 0;
            setFeeData({ ...feeData, details: tempDataDetails });
        }


    }

    const handleDescriptionChange = (index, description) => {
        let tempDataDetails = [...feeData.details];
        tempDataDetails[index].description = description;
        setFeeData({ ...feeData, details: tempDataDetails });
    }

    const handleCancel = () => {
        history.goBack();
    }

    const handleSave = async () => {
        if (!validate()) {
            return
        }

        let updatedFeeData = { ...feeData, name: feeData.name, details: feeData.details?.map(fee => { return { description: fee.description, amount: fee.amount } }) }

        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.patch(`${process.env.REACT_APP_SERVER}/update-fee-structure-by-id/fee-structure`, {
            updatedFeeData
        })
            .then((response) => {
                toast.success("Saved!!");
                history.goBack();
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
            })
            .finally(() => {
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
    }

    const validate = () => {
        let invalidList = [];
        let isValid = true;

        if (feeData.name === '') {
            invalidList.push('name');
            isValid = false
        }
        if (!isValid) {
            setInvalidList([...invalidList])
        }
        return isValid;
    }

    if (isPageLoading) {
        return (
            <Box style={{ top: '50%' }}>
                <Loading isPageLoading={isPageLoading} />
            </Box>
        )
    }
    else {
        return (
            <React.Fragment>
                {JSON.parse(localStorage.getItem('userDetail'))?.profile?.name === 'Admin' ?
                    (<Box component="span" className={classes.hideButtons}>
                        <Grid justifyContent='space-between' container spacing={1}>
                            <Grid item xs={6} md={6} style={{ paddingRight: 4, justifyContent: 'flex-end' }} className={classes.gridElement}>
                                <Custom_Button variant='contained' size="medium" onClick={() => { handleSave() }} label={'Save'} accessGranted={feeStructureObjPermission.edit}/>
                            </Grid>
                            <Grid item xs={6} md={6} style={{ paddingLeft: 4 }} className={classes.gridElement}>
                                <Custom_Button variant='contained' size="medium" onClick={() => { handleCancel() }} label={'Cancel'} accessGranted={feeStructureObjPermission.edit}/>
                            </Grid>
                        </Grid>
                    </Box>) : <span></span>
                }

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
                                    onFocus={() => { }}
                                    value={feeData.name}
                                    id="name"
                                    onChange={(name) => { setFeeData({ ...feeData, name: name.target.value }) }}
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
                            {feeData?.details?.map((row, index) => (
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
                                            <span style={{ paddingRight: 3 }}><ModeEditIcon onClick={(event) => { handleDetailsEdit(row) }} /></span>
                                        }
                                        {
                                            row.isEditMode && <span style={{ paddingRight: 3 }}><DoneIcon style={{ paddingRight: 2 }} onClick={() => { handleRowSave(index, row) }} /></span>
                                        }
                                        <span style={{ paddingRight: 3 }}><RemoveCircleOutlineRoundedIcon onClick={() => { handleRemove(index) }} style={{ paddingRight: 2 }} /></span>
                                        {feeData.details?.findIndex(fee => fee.description === row.description) === (feeData.details?.length - 1) &&
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
                <AuditFields record={feeData} />
                <Toaster />
            </React.Fragment>
        )
    }
}

export default FeeStructureDetails