import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import { useHistory } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import toast, { Toaster } from 'react-hot-toast';
import Snackbar from '@mui/material/Snackbar';
import InstitutionReg from '../registration/institutionReg/InstitutionReg';
import UserReg from '../registration/userReg/UserReg';
import Subscription from '../registration/subscription/Subscription'
import { Step, StepLabel, Stepper } from '@material-ui/core';
import axios from 'axios';
import RegSummary from './regSummary/RegSummary';
import Modal from '@mui/material/Modal';
import Loading from '../components/loading/Loading';
import { Alert } from '@mui/material';
import { OBJECT } from '../constants/ObjectNames/documentObjNames';

function Registration(params){
    const history = useHistory();
    let unmounted = false;

    const [activeStep, setActiveStep] = useState(0);
    const [institutionDetails, setInstitutionDetails] = useState({});
    const [userDetails, setUserDetails] = useState({});
    const [isPageLoading, setisPageLoading] = useState(false);
    const [isPageLoadingFailed, setisPageLoadingFailed] = useState(false);
    //const [errorMsg, setErrorMsg] = useState({ open: false, message: '', vertical: 'top', horizontal: 'center', severity: 'success' });
    const [duplicateInstitution, setDuplicateInstitution] = useState(false);
    //const { vertical, horizontal, open, message, severity } = errorMsg;
    const [countryDetails, setCountryDetails] = useState([])

    useEffect(() => {
        if (institutionDetails && institutionDetails.email !== undefined && institutionDetails.email !== '') {
            handleCheckDuplicateInst();
        }
    }, [institutionDetails])

    useEffect(() => {
        if (activeStep === 2) {
            handleRegestration(activeStep);
        }
    }, [activeStep])

    useEffect(() => {
        console.log('Its Registration')
    },[])

    // const handleSnackbarClose = () => {
    //     setErrorMsg({ open: false, message: '', vertical: 'top', horizontal: 'center', });
    // }

    const handleCheckDuplicateInst = async () => {
        unmounted = false;
        const source = axios.CancelToken.source();
        console.log(institutionDetails)
        await axios.get(`${process.env.REACT_APP_SERVER}/check-duplicate-inst/${OBJECT.INSTITUTION}/${institutionDetails.email}`)
            .then((response) => {
                if (response.data?.duplicateInst) {
                    if (!response.data?.subscribed) {
                        toast.error(`Subscription for the Institution is pending. Please check the emailbox to complete.`);
                    }
                    else {
                        toast.error(`The institution already has an active account. Please login`);
                    }
                }
                setDuplicateInstitution(response.data?.duplicateInst)
            })
            .catch((error) => {
                if (!unmounted) {

                }
            })
            .finally(() => {
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
    }

    const handleRegestration = async (nextStage) => {
        setisPageLoading(true);
        await axios.post(`${process.env.REACT_APP_SERVER}/signup`, {
            institutionData: institutionDetails,
            userData: userDetails
        }).then(() => {
            setActiveStep(nextStage)
        })
            .catch((error) => {
                console.log(error);
                if (error.response?.status === 400 || error.response?.status === 502) {
                    toast.error(error.response?.data?.error)
                    // setErrorMsg({ open: true, message: error.response?.data?.error, vertical: 'top', horizontal: 'center', severity: 'error' });
                }
            })
        setisPageLoading(false);
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
                <div>
                    <Stepper alternativeLabel activeStep={activeStep}>
                        <Step>
                            <StepLabel>Instuition Registration</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>User Registration</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Subscription</StepLabel>
                        </Step>
                    </Stepper>
                    {
                        activeStep === 0 ?
                            <InstitutionReg institutionDetails={institutionDetails} updateActiveStep={(next) =>{setActiveStep(next)}} countryData = {countryDetails}  countryDetails={(countryData) => {setCountryDetails(countryData)}} handleInstitutionDetails={(data) => { setInstitutionDetails(data) }} />
                            : activeStep === 1 ?
                                <UserReg duplicateInstitution={duplicateInstitution} userDetails={userDetails} countryDetails={countryDetails} updateActiveStep={(next) =>{setActiveStep(next)}} handleUserDetails={(userData) => { setUserDetails(userData) }} />
                                : activeStep === 2 ?
                                    <Subscription institutionDetails={institutionDetails} /> : ''
                    }
                </div>
                {/* <Stack spacing={2} sx={{ width: '100%' }}>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical, horizontal }} key={vertical + horizontal}>
                        <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Snackbar>
                </Stack> */}
                <Toaster />
            </React.Fragment>
        )
    }
}

export default Registration