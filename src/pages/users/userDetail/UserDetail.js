/* eslint-disable react/jsx-pascal-case */
import { Box, Button, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem, TextField, Typography, InputLabel } from '@material-ui/core';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useParams, useHistory } from 'react-router-dom'
import Loading from '../../../components/loading/Loading';
import { useStyles } from './UserDetailStyle';
import Custom_Button from '../../../components/reusableElements/Custom_Button';
import { breadcrumbsContext } from '../../../components/context/Context';

const UserDetail = (props) => {

    const classes = useStyles();
    const history = useHistory();
    let { id } = useParams();

    let unmounted = false;

    const [isPageLoading, setisPageLoading] = React.useState(false);
    const [isPageLoadingFailed, setisPageLoadingFailed] = React.useState(false);
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [invalidList, setInvalidList] = React.useState([]);
    const [userDetail, setUserDetail] = React.useState({});
    const [profileList, setProfileList] = React.useState([]);
    const [confirmPasswordReset, setConfirmPasswordReset] = React.useState(false);
    const [requestSent, setRequestSent] = React.useState(false);
    const [emailUpdated, setEmailUpdated] = React.useState(false);
    const [currentEmail, setCurrentEmail] = React.useState('');
    const [userObjPermission, setUserObjPermission] = React.useState({});
    const [confirmStudProfileUpdate, setConfirmStudProfileUpdate] = React.useState({ open: false, profileId: '' })

    const [breadcrumbsList, setBreadcrumbsList] = React.useContext(breadcrumbsContext);

    if (!id) {
        id = props.userId;
    }


    useEffect(() => {
        getUserDetail();
    }, []);

    useEffect(() => {
        if (JSON.stringify({}) !== JSON.stringify(userDetail)) {
            let router = `/users/user-details/${userDetail?._id}`
            setBreadcrumbsList([
                breadcrumbsList,
                <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="inherit"
                    href="#"
                >
                    User Details
                </Link>,
            ])
        }
    }, [userDetail])

    const getUserDetail = async () => {
        setisPageLoading(true);
        setProfileList([]);
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/user-details/user/${id}`)
            .then((response) => {
                setUserObjPermission(response.data?.accessDefination);
                setUserDetail(response.data?.user);
                setProfileList(response.data?.profiles);
                setCurrentEmail(response.data?.user?.email);
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

    const handleuserAddressLine1Change = (addressLine1) => {
        let userAddress = userDetail.address;
        userAddress.addressLine1 = addressLine1.target.value;
        setUserDetail({ ...userDetail, address: userAddress });
    }
    const handleuserAddressLine2Change = (addressLine2) => {
        let userAddress = userDetail.address;
        userAddress.addressLine2 = addressLine2.target.value;
        setUserDetail({ ...userDetail, address: userAddress });
    }
    const handleUserCityChange = (city) => {
        let userAddress = userDetail.address;
        userAddress.city = city.target.value;
        setUserDetail({ ...userDetail, address: userAddress });
    }
    const handleUserDistrictChange = (district) => {
        let userAddress = userDetail.address;
        userAddress.district = district.target.value;
        setUserDetail({ ...userDetail, address: userAddress });
    }
    const handleUserStateChange = (state) => {
        let userAddress = userDetail.address;
        userAddress.state = state.target.value;
        setUserDetail({ ...userDetail, address: userAddress });
    }
    const handleUserCountryChange = (country) => {
        let userAddress = userDetail.address;
        userAddress.country = country.target.value;
        setUserDetail({ ...userDetail, address: userAddress });
    }
    const handleUserZipCodeChange = (zipCode) => {
        let userAddress = userDetail.address;
        userAddress.zipCode = zipCode.target.value;
        setUserDetail({ ...userDetail, address: userAddress });
    }

    const handleButton = () => {
        if (isEditMode) {
            validate();
        }
        else {
            setIsEditMode(!isEditMode);
        }
    }

    const validate = () => {
        let isValid = true;
        let tempInvalidList = [];
        if (!userDetail.name) {
            tempInvalidList.push('name');
            isValid = false;
        }
        if (!userDetail.phone1) {
            tempInvalidList.push('phone');
            isValid = false;
        }
        if (/[a-zA-Z]/g.test(userDetail.phone1)) {
            tempInvalidList.push('phoneInvalid');
            isValid = false;
        }
        if (userDetail.phone1?.length !== 10) {
            tempInvalidList.push('phoneInvalid');
            isValid = false;
        }
        if (!userDetail.email) {
            tempInvalidList.push('email');
            isValid = false;
        }
        if (!userDetail.email.match(/\S+@\S+\.\S+/)) {
            tempInvalidList.push('emailInvalid');
            isValid = false;
        }
        if (!userDetail.address?.addressLine1) {
            tempInvalidList.push('addrLine1');
            isValid = false;
        }
        if (!userDetail.address?.city) {
            tempInvalidList.push('city');
            isValid = false;
        }
        if (!userDetail.address?.district) {
            tempInvalidList.push('district');
            isValid = false;
        }
        if (!userDetail.address?.state) {
            tempInvalidList.push('state');
            isValid = false;
        }
        if (!userDetail.address?.country) {
            tempInvalidList.push('country');
            isValid = false;
        }
        if (!userDetail.address?.zipCode) {
            tempInvalidList.push('pinCode');
            isValid = false;
        }
        if (isValid) {
            if (currentEmail !== userDetail.email) {
                setEmailUpdated(true);
            }
            else {
                handleUpdateUser();
            }
        }
        else {
            setInvalidList(tempInvalidList);
        }
    }

    const handleUpdateUser = async () => {
        setEmailUpdated(false)
        //Update Request
        setisPageLoading(true);
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.patch(`${process.env.REACT_APP_SERVER}/user-details-update/user`, {
            userDetail
        })
            .then((response) => {
                if (response.status === 200) {
                    setIsEditMode(false);
                }
                else {
                    toast.error(response.error)
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
                        //toast.error(error.request.error)
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

    const handleInitiatePasswordReset = () => {
        setConfirmPasswordReset(true);
    }

    const handlePasswordReset = async () => {
        unmounted = false;
        setRequestSent(true);
        const source = axios.CancelToken.source();
        await axios.patch(`${process.env.REACT_APP_SERVER}/users-password-reset/user`, {
            userId: id
        })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    toast.success('Reset request sent')
                }
                else {
                    toast.error(response.data)
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
                        toast.error(error)
                    }
                }
            })
            .finally(() => {
                setConfirmPasswordReset(false);
                setRequestSent(false);
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
    }

    const handleProfileUpdate = (profileId) => {
        if (profileList.find(profile => profile._id === userDetail.profile?._id)?.name === 'Student') {
            console.log(profileList.find(profile => profile?.name === 'Student'));
            setConfirmStudProfileUpdate({ open: true, profileId })
        }
        else {
            setUserDetail({ ...userDetail, profile: profileList.find(profile => profile._id === profileId) })
        }
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

                <Stack spacing={2}>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        aria-label="breadcrumb"
                    >
                        {breadcrumbsList}
                    </Breadcrumbs>
                </Stack>

                {JSON.parse(localStorage.getItem('userDetail'))?.profile?.name === 'Admin' && !props.hideButtons ?
                    (<Box component="span" className={classes.hideButtons}>
                        <Grid container spacing={5}>
                            <Grid xs={6} md={6} justifyContent='flex-end' className={classes.gridElement}>
                                <Custom_Button variant='contained' size="medium" label={isEditMode ? 'Save' : 'Edit'} accessGranted={userObjPermission.edit} onClick={handleButton} />
                            </Grid>
                            <Grid xs={6} md={6} style={{ flexDirection: 'row', justifyContent: 'space-between' }} className={classes.gridElement}>
                                <Custom_Button variant='contained' size="medium" label={'Cancel'} disabled={!isEditMode} accessGranted={userObjPermission.edit} onClick={() => {
                                    setIsEditMode(false)
                                    getUserDetail()
                                }} />
                                {userDetail.profile?.name !== 'Student' && userDetail.profile?.name !== 'Caregiver' && <Custom_Button color="secondary" size="medium" label={'Reset Password'} accessGranted={userObjPermission.edit} onClick={handleInitiatePasswordReset} />}
                            </Grid>
                        </Grid>
                    </Box>) : <span></span>
                }
                <Typography className={classes.header}>
                    User :
                </Typography>
                <Container style={{ paddingTop: 30, backgroundColor: 'white', paddingLeft: 45 }}>
                    <Grid container spacing={5} className={classes.grid}>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required={isEditMode} className={[classes.label, classes.required]}>Name :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                InputProps={{
                                    readOnly: !isEditMode,
                                    disableUnderline: !isEditMode,
                                    className: classes.inputDesign
                                }}
                                helperText={!invalidList.includes('name') ? '' : "Name is required"}
                                error={invalidList.includes('name')}
                                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'name')) }}
                                value={userDetail.name}
                                id="name"
                                onChange={(name) => { setUserDetail({ ...userDetail, name: name.target.value }); }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel className={classes.label}>Active :</InputLabel>
                            <Checkbox
                                style={{ bottom: '9px' }}
                                disabled={!isEditMode || JSON.parse(localStorage.getItem('userDetail'))?._id?.toString() === userDetail._id?.toString()}
                                InputProps={{
                                    readOnly: !isEditMode,
                                    disableUnderline: !isEditMode,
                                    className: classes.inputDesign
                                }}
                                checked={Boolean(userDetail.active)}

                                id="active"
                                onClick={(status) => { setUserDetail({ ...userDetail, active: status.target.checked }) }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required={isEditMode} className={[classes.label, classes.required]}>Email :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                InputProps={{
                                    readOnly: !isEditMode,
                                    disableUnderline: !isEditMode,
                                    className: classes.inputDesign
                                }}
                                helperText={invalidList.includes('email') ? "Email is required" : invalidList.includes('emailInvalid') ? 'Email is invalid' : ''}
                                error={invalidList.includes('email') || invalidList.includes('emailInvalid')}
                                onFocus={() => { setInvalidList(invalidList.filter(value => !value.includes('email'))) }}
                                value={userDetail.email}
                                id="email"
                                onChange={(email) => { setUserDetail({ ...userDetail, email: email.target.value }); }}
                                aria-describedby="component-error-text"
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required={isEditMode} className={[classes.label, classes.required]}>Phone :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                InputProps={{
                                    readOnly: !isEditMode,
                                    disableUnderline: !isEditMode,
                                    className: classes.inputDesign
                                }}
                                value={userDetail.phone1}
                                id="phone"
                                helperText={invalidList.includes('phone') ? "Phone Number is required" : invalidList.includes('phoneInvalid') ? 'Phone Number is invalid' : ''}
                                error={invalidList.includes('phone') || invalidList.includes('phoneInvalid')}
                                onFocus={() => { setInvalidList(invalidList.filter(value => !value.includes('phone'))) }}
                                onChange={(phone) => { setUserDetail({ ...userDetail, phone1: phone.target.value }); }}
                                aria-describedby="component-error-text"
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel className={classes.label}>Profile :</InputLabel>

                            <TextField
                                id="profile"
                                style={{ flex: 1 }}
                                select={isEditMode}
                                value={
                                    !isEditMode ?
                                        profileList.find(profile => profile._id === userDetail.profile?._id)?.name :
                                        profileList.find(profile => profile._id === userDetail.profile?._id)?._id
                                }
                                onChange={(profileSel) => {
                                    handleProfileUpdate(profileSel.target.value)
                                    //setUserDetail({ ...userDetail, profile: profileList.find(profile => profile._id === profileSel.target.value) })
                                }}
                                variant="standard"
                                InputProps={{
                                    readOnly: !isEditMode,
                                    disableUnderline: !isEditMode,
                                    className: classes.inputDesign,
                                }}
                            >
                                {profileList.map((option) => (
                                    <MenuItem
                                        classes={{
                                            root: classes.profileSelect
                                        }}
                                        key={option._id} value={option._id}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        {/* <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel style={{ paddingRight: 3 }} className={classes.label}>Profile Photo :</InputLabel>
                            <Link>View</Link>
                        </Grid> */}
                    </Grid>
                </Container>
                <Typography className={classes.header}>
                    Address :
                </Typography>
                <Container style={{ paddingTop: 30, backgroundColor: 'white', paddingLeft: 45 }}>
                    <Grid container spacing={5} className={classes.grid}>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required={isEditMode} className={[classes.label, classes.required, classes.addressLine]}>Address Line 1 :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                InputProps={{
                                    readOnly: !isEditMode,
                                    disableUnderline: !isEditMode,
                                    className: classes.inputDesign
                                }}
                                value={userDetail.address?.addressLine1}
                                id="addressLine1"
                                helperText={!invalidList.includes('addrLine1') ? '' : "Address Line 1 is required"}
                                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'addrLine1')) }}
                                error={invalidList.includes('addrLine1')}
                                onChange={(addressLine1) => { handleuserAddressLine1Change(addressLine1) }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel className={[classes.label, classes.addressLine]}>Address Line 2 :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                InputProps={{
                                    readOnly: !isEditMode,
                                    disableUnderline: !isEditMode,
                                    className: classes.inputDesign
                                }}
                                value={userDetail.address?.addressLine2}
                                id="addressLine2"
                                onChange={(addressLine2) => { handleuserAddressLine2Change(addressLine2) }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required={isEditMode} className={[classes.label, classes.required]}>City :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                InputProps={{
                                    readOnly: !isEditMode,
                                    disableUnderline: !isEditMode,
                                    className: classes.inputDesign
                                }}
                                value={userDetail.address?.city}
                                id="city"
                                helperText={!invalidList.includes('city') ? '' : "City is required"}
                                error={invalidList.includes('city')}
                                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'city')) }}
                                onChange={(city) => { handleUserCityChange(city) }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required={isEditMode} className={[classes.label, classes.required]}>District :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                InputProps={{
                                    readOnly: !isEditMode,
                                    disableUnderline: !isEditMode,
                                    className: classes.inputDesign
                                }}
                                value={userDetail.address?.district}
                                helperText={!invalidList.includes('district') ? '' : "District is required"}
                                error={invalidList.includes('district')}
                                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'district')) }}
                                id="district"
                                onChange={(district) => { handleUserDistrictChange(district) }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required={isEditMode} className={[classes.label, classes.required]}>State :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                InputProps={{
                                    readOnly: !isEditMode,
                                    disableUnderline: !isEditMode,
                                    className: classes.inputDesign
                                }}
                                value={userDetail.address?.state}
                                id="state"
                                helperText={!invalidList.includes('state') ? '' : "State is required"}
                                error={invalidList.includes('state')}
                                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'state')) }}
                                onChange={(state) => { handleUserStateChange(state) }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required={isEditMode} className={[classes.label, classes.required]}>Country :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                InputProps={{
                                    readOnly: !isEditMode,
                                    disableUnderline: !isEditMode,
                                    className: classes.inputDesign
                                }}
                                value={userDetail.address?.country}
                                id="country"
                                helperText={!invalidList.includes('country') ? '' : "Country is required"}
                                error={invalidList.includes('country')}
                                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'country')) }}
                                onChange={(country) => { handleUserCountryChange(country) }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required={isEditMode} className={[classes.label, classes.required]}>PIN Code :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                InputProps={{
                                    readOnly: !isEditMode,
                                    disableUnderline: !isEditMode,
                                    className: classes.inputDesign
                                }}
                                value={userDetail.address?.zipCode}
                                id="zipCode"
                                helperText={!invalidList.includes('pinCode') ? '' : "Pin Code is required"}
                                error={invalidList.includes('pinCode')}
                                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'pinCode')) }}
                                onChange={(zipCode) => { handleUserZipCodeChange(zipCode) }}
                                variant="standard"
                            />
                        </Grid>
                    </Grid>
                </Container>

                <Toaster />
                <Dialog
                    open={confirmPasswordReset}
                    onClose={() => {
                        setConfirmPasswordReset(false)
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {requestSent &&
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress color="inherit" />
                        </Box>
                    }
                    <DialogTitle id="alert-dialog-title">
                        {`Reset ${userDetail.name}'s password?`}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Password reset request will be sent to {userDetail.name}'s email.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            disabled={requestSent}
                            onClick={() => {
                                setConfirmPasswordReset(false)
                            }}>Cancel</Button>
                        <Button disabled={requestSent} onClick={handlePasswordReset} autoFocus>
                            Okay!
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={emailUpdated}
                    onClose={() => { }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {`Authentication is required`}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Updating {userDetail.name}'s email needs re-authentication.
                            An email will be sent to the user.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            disabled={requestSent}
                            onClick={() => {
                                setEmailUpdated(false)
                            }}>Cancel</Button>
                        <Button onClick={handleUpdateUser} autoFocus>
                            Okay!
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={confirmStudProfileUpdate.open}
                    onClose={() => { setConfirmStudProfileUpdate({ open: false, profileId: '' }) }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Are you sure!!
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Updating student's profile will provide extra access. Please confirm to continue.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setConfirmStudProfileUpdate({ open: false, profileId: '' }) }} autoFocus>Cancel</Button>
                        <Button onClick={() => {
                            setUserDetail({ ...userDetail, profile: profileList.find(profile => profile._id === confirmStudProfileUpdate.profileId) })
                            setConfirmStudProfileUpdate({ open: false, profileId: '' })
                        }} autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}

export default UserDetail