import React, {useEffect, useState} from 'react'
import axios from 'axios';
import Grid from '@mui/material/Grid';
import toast, { Toaster } from 'react-hot-toast';
import { Autocomplete } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useStyles } from './EnrolmentsStyle';
import { enrolmentStatus } from '../../../constants/EnrolmentStatus';
import { monthsObject } from '../../../constants/MonthsFilterList';
import { Box, Button, TextField, Typography, Container } from '@material-ui/core';
import Loading from '../../../components/loading/Loading';

const EnrolmentEditModel = (props) => {
    const classes = useStyles();
    const history = useHistory();

    let unmounted = false;

    useEffect(() => {
        console.log(props);
        setUpdatingEnrolment(props.editEnrolment?.payments)
    },[])

    const [isPageLoading, setisPageLoading] = React.useState(false);
    const [updatingEnrolment, setUpdatingEnrolment] = React.useState({})

    const handleEnrolUpdate = async () => {
        unmounted = false;
        setisPageLoading(true)
        const source = axios.CancelToken.source();
        await axios.patch(`${process.env.REACT_APP_SERVER}/update-enrolment/enrolment`, {
            updatedEnrolment: updatingEnrolment
        })
            .then((response) => {
                console.log(response)
                setisPageLoading(false)
                if (response.status === 200) {
                    props.handleEditCancel()
                    toast.success("Saved")
                }
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
                    else {
                        console.log(error.request)
                    }
                }
            })
            .finally(() => {
                setisPageLoading(false);
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
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
                <Typography className={classes.header}>
                    Enrolment Details :
                </Typography>
                <Container style={{ paddingTop: 5, backgroundColor: 'white' }}>
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <Typography style={{ paddingTop: 5, paddingRight: 5 }} className={classes.label}>Student :</Typography>
                            <Box style={{ marginBottom: 5 }}>
                                <TextField
                                    style={{ flex: 1 }}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true
                                    }}
                                    className={classes.textField}
                                    value={`${props.editEnrolment?.student?.name}` || ''}
                                    id="name"
                                    onChange={(name) => { }}
                                    variant="standard"
                                />
                            </Box>
                            <Box style={{ marginBottom: 5 }}>
                                <Typography style={{ paddingTop: 5, paddingRight: 5 }} className={classes.label}>Email :</Typography>
                                <TextField
                                    style={{ flex: 1 }}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    value={props.editEnrolment?.student?.email || ''}
                                    id="email"
                                    onChange={(name) => { }}
                                    variant="standard"
                                />
                            </Box>
                            <Box style={{ marginBottom: 5 }}>
                                <Typography style={{ paddingTop: 5, paddingRight: 5 }} className={classes.label}>Phone :</Typography>
                                <TextField
                                    style={{ flex: 1 }}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    value={props.editEnrolment?.student?.phone1 || ''}
                                    id="phone1"
                                    onChange={(name) => { }}
                                    variant="standard"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box style={{ marginBottom: 5 }}>
                                <Typography style={{ paddingTop: 5, paddingRight: 5 }} className={classes.label}>Status :</Typography>
                                {console.log(enrolmentStatus.find(enrol => enrol.key === updatingEnrolment?.status))}
                                <Autocomplete
                                    style={{ width: 170, }}
                                    disabled={updatingEnrolment?.type === 'Online'}
                                    options={enrolmentStatus || []}
                                    getOptionLabel={(option) => option.value || ''}
                                    value={enrolmentStatus.find(enrol => enrol.value === updatingEnrolment?.status) || ''}
                                    isOptionEqualToValue={(option, value) => option?.value === value}
                                    onChange={(status) => { 
                                        console.log(enrolmentStatus[status.target?.dataset?.optionIndex]?.value)
                                        setUpdatingEnrolment({...updatingEnrolment, status : enrolmentStatus[status.target?.dataset?.optionIndex]?.value})
                                     }}
                                    id="statusAutoComplete"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            required
                                            className={classes.dropdown}
                                            size='small'
                                            id={`status-mode`}
                                            placeholder="Status"
                                        />)}
                                />
                            </Box>
                            <Box style={{ marginBottom: 5 }}>
                                <Typography style={{ paddingTop: 5, paddingRight: 5 }} className={classes.label}>Amount(Rs) :</Typography>
                                <TextField
                                    style={{ flex: 1, padding: 0 }}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    value={updatingEnrolment?.originalAmount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}
                                    id="phone1"
                                    onChange={(name) => { }}
                                    variant="standard"
                                />
                            </Box>
                            <Box style={{ marginBottom: 5 }}>
                                <Typography style={{ paddingTop: 5, paddingRight: 5 }} className={classes.label}>Month :</Typography>
                                <TextField
                                    style={{ flex: 1 }}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    value={monthsObject.find(month => month.key === new Date(updatingEnrolment?.date)?.getMonth())?.value || ''}
                                    id="phone1"
                                    onChange={(name) => { }}
                                    variant="standard"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
                <Box component="span" style={{ margin: 15, paddingTop: 5 }}>
                    <Grid container spacing={5}>
                        <Grid xs={6} md={6} justifyContent='flex-end' style={{ maxWidth: '46%', paddingTop: 10, marginBottom: '1.5%' }} className={classes.gridElement}>
                            <Button variant='contained' size="small" style={{ marginRight: 3 }} color='inherit' onClick={() => { handleEnrolUpdate() }}>Save</Button>
                        </Grid>
                        <Grid xs={6} md={6} justifyContent='flex-start' style={{ maxWidth: '46%', paddingTop: 10, marginBottom: '1.5%' }} className={classes.gridElement}>
                            <Button variant='outlined' size="small" color='error' style={{ marginRight: 3 }} onClick={() => { props.handleEditCancel() }}>Cancel</Button>
                        </Grid>
                    </Grid>
                </Box>
                <Toaster/>
            </React.Fragment>
        )
    }
}

export default EnrolmentEditModel