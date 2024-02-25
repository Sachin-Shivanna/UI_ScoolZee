/* eslint-disable react/jsx-pascal-case */
import { Box, Button, Container,InputLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Autocomplete from '@mui/material/Autocomplete';
import Loading from '../../../components/loading/Loading';
import { useStyles } from './NewUserStyle';
import { Checkbox, Modal } from '@mui/material';
import UserDetail from '../userDetail/UserDetail';
import Custom_Button from '../../../components/reusableElements/Custom_Button';

const NewUser = (params) => {
    const history = useHistory();
    const classes = useStyles();

    let unmounted = false;

    const userObjPermission = params?.location?.state?.userObjPermission;

    const [isPageLoading, setisPageLoading] = React.useState(false);
    const [isPageLoadingFailed, setisPageLoadingFailed] = React.useState(false);
    const [invalidList, setInvalidList] = React.useState([]);
    const [userDetail, setUserDetail] = React.useState({ dob: new Date('2015-01-01T21:11:54') });
    const [userAddress, setUserAddress] = React.useState({});
    const [profileList, setProfileList] = React.useState([]);
    const [createOneMore, setCreateOneMore] = React.useState(false);
    const [duplicateUser, setDuplicateUser] = React.useState(false);
    const [fullUserDetails, setFullUserDetails] = React.useState({});
    const [fullCaregiverDetails, setFullCaregiverDetails] = React.useState({});
    const [showDuplicateUser, setshowDuplicateUser] = React.useState(false);
    const [duplicateUserId, setDuplicateUserId] = React.useState('');
    const [allClasses, setAllClasses] = React.useState([]);
    const [caregiverDetail, setCaregiverDetail] = React.useState({});
    const [caregiverAddress, setCaregiverAddress] = React.useState({});
    const [isSameAddress, setIsSameAddress] = React.useState(false)
    const [showExistingCaregiver, setShowExistingCaregiver] = React.useState(false)
    const [findCaregiverEmail, setFindCaregiverEmail] = React.useState('');
    const [existingCareTaker, setExistingCareTaker] = React.useState(false);
    const [countryDetails, setCountryDetails] = React.useState([]);
    const [selectedCountry, setSelectedCountry] = React.useState({});
    const [selectedCaregiverCountry, setSelectedCaregiverCountry] = React.useState({})
    


    useEffect(() => {
        getAllProfiles()
        getAllClasses();
        getCountryDetails();
    }, []);

    useEffect(() => {
        if (fullUserDetails.address) {
            initiateInsertUser()
        }
    }, [fullUserDetails]);

    useEffect(() => {
        // console.log(countryDetails.find(country => country.iso3 === 'IND'))
        setSelectedCountry(countryDetails.find(country => country.iso3 === 'IND'));
        setSelectedCaregiverCountry(countryDetails.find(country => country.iso3 === 'IND'));
        setUserAddress({
            ...userAddress,
            country: countryDetails.find(country => country.iso3 === 'IND')?.name
        });
        setCaregiverAddress({
            ...caregiverAddress,
            country: countryDetails.find(country => country.iso3 === 'IND')?.name
        });
    }, [countryDetails])

    const getCountryDetails = async () => {
        setisPageLoading(true);
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/country-details`)
            .then((countryInfo) => {
                //console.log(countryInfo.data[100]);
                let tempCountryList = [];
                countryInfo.data.forEach(country => {
                    tempCountryList.push(country);
                });
                setCountryDetails(tempCountryList)
            })
            .catch((error) => {
                console.log(error);
                if (!unmounted) {
                    toast.error('Failed to get location options!');
                }
                setisPageLoadingFailed(true);
            })
            .finally(() => {
                setisPageLoading(false);
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            })
    }

    const getAllClasses = async () => {
        setisPageLoading(true);
        setProfileList([]);
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/classes-info/class`)
            .then((response) => {
                console.log(response.data)
                if (response.status === 200) {
                    let classData = [];
                    response.data?.classDetails?.forEach(classRec => {
                        classData.push({ label: classRec.name, id: classRec._id, sections: getClassSection(classRec.divisions) });
                    });
                    setUserDetail({ ...userDetail, class: 'None' });
                    setAllClasses([{ label: 'None', id: 'None', sections: ['None'] }, ...classData]);
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
                }
                setisPageLoadingFailed(true);
            })
            .finally(() => {
                //setisPageLoading(false);
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
    }

    const getClassSection = (divisions) => {
        let sections = ['A'];
        for (let i = 1; i < divisions.length; i++) {
            sections = [...sections, String.fromCharCode(sections[i - 1].charCodeAt(0) + 1)]
        }
        return sections;
    }

    const getAllProfiles = async () => {
        setisPageLoading(true);
        setProfileList([]);
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/all-profiles/profile`)
            .then((response) => {
                setUserDetail({ ...userDetail, profile: response.data[0]._id });
                setProfileList(response.data);
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
                //setisPageLoading(false);
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
    }

    const getCaregiverByEmail = async () => {
        if (!findCaregiverEmail || !findCaregiverEmail?.match(/\S+@\S+\.\S+/)) {
            toast.error('Invalid Email Address')
            return;
        }
        //setisPageLoading(true);
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/caregiver-by-email/user/${findCaregiverEmail}`)
            .then((response) => {
                console.log(response.data)
                if (response.data === null || JSON.stringify(response.data) === JSON.stringify({})) {
                    toast.error(`No Caregiver registered with the email address: ${findCaregiverEmail}`)
                    return
                }

                let { address, ...caregiverDetails } = response.data;

                setUserDetail({ ...userDetail, profile: profileList.find(profile => profile.name === 'Student')._id })

                setCaregiverAddress({ ...address });

                setCaregiverDetail({ ...caregiverDetails });

                setExistingCareTaker(true)

                setIsSameAddress(false)

            })
            .catch((error) => {
                console.log(error)
                if (!unmounted) {
                    if (error.request?.status === 403) {
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
                setShowExistingCaregiver(false)
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });

    }


    const handleuserAddressLine1Change = (addressLine1) => {
        setUserAddress({
            ...userAddress,
            addressLine1: addressLine1.target.value
        });
    }
    const handleuserAddressLine2Change = (addressLine2) => {
        setUserAddress({
            ...userAddress,
            addressLine2: addressLine2.target.value
        });
    }
    const handleUserCityChange = (city) => {
        setUserAddress({
            ...userAddress,
            city: city.target.value
        });
    }
    const handleUserDistrictChange = (district) => {
        setUserAddress({
            ...userAddress,
            district: district.target.value
        });
    }
    const handleUserStateChange = (state) => {
        setUserAddress({
            ...userAddress,
            state: state.name
        });
    }
    const handleUserCountryChange = (country) => {
        setSelectedCountry(country)
        setUserAddress({
            ...userAddress,
            country: country.name,
            state: {}
        });
    }
    const handleUserZipCodeChange = (zipCode) => {
        setUserAddress({
            ...userAddress,
            zipCode: zipCode.target.value
        });
    }

    const handleSave = async (createNewUser) => {
        if (validate()) {
            setFullUserDetails({ ...userDetail, address: userAddress, profile: userDetail.profile ? userDetail.profile : profileList[0]?._id });
            setFullCaregiverDetails({ ...caregiverDetail, ...caregiverAddress })
            setCreateOneMore(createNewUser);
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
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && userDetail.class === 'None') {
            tempInvalidList.push('class');
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && (!userDetail.section || userDetail.section === 'None' || userDetail.section === '')) {
            tempInvalidList.push('section');
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile !== profileList.find(profile => profile.name === 'Student')?._id && !userDetail.email?.match(/\S+@\S+\.\S+/)) {
            tempInvalidList.push('emailInvalid');
            isValid = false;
        }
        if (!userAddress.addressLine1) {
            tempInvalidList.push('addrLine1');
            isValid = false;
        }
        if (!userAddress.city) {
            tempInvalidList.push('city');
            isValid = false;
        }
        if (!userAddress.district) {
            tempInvalidList.push('district');
            isValid = false;
        }
        if (!userAddress.state) {
            tempInvalidList.push('state');
            isValid = false;
        }
        console.log(userAddress)
        if (!userAddress.country) {
            tempInvalidList.push('country');
            isValid = false;
        }
        if (!userAddress.zipCode) {
            tempInvalidList.push('pinCode');
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && JSON.stringify(caregiverDetail) === JSON.stringify({})) {
            toast.error('Caregiver details are required for Students')
            isValid = false;
        }
        else if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && JSON.stringify(caregiverAddress) === JSON.stringify({})) {
            toast.error('Caregiver address are required for Students')
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && !caregiverDetail.name) {
            tempInvalidList.push('caregiverName')
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && !caregiverDetail.email) {
            tempInvalidList.push('caregiverEmail')
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && /[a-zA-Z]/g.test(caregiverDetail.phone1)) {
            tempInvalidList.push('caregiverPhoneInvalid')
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && caregiverDetail.phone1?.length !== 10) {
            tempInvalidList.push('caregiverPhoneInvalid')
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && !caregiverDetail.phone1) {
            tempInvalidList.push('caregiverPhone')
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && !caregiverDetail.email?.match(/\S+@\S+\.\S+/)) {
            tempInvalidList.push('caregiverEmailInvalid')
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && !caregiverAddress.addressLine1) {
            tempInvalidList.push('caregiverAddrLine1')
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && !caregiverAddress.city) {
            tempInvalidList.push('caregiverCity')
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && !caregiverAddress.district) {
            tempInvalidList.push('caregiverDistrict')
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && !caregiverAddress.state) {
            tempInvalidList.push('caregiverState')
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && !caregiverAddress.country) {
            tempInvalidList.push('caregiverCountry')
            isValid = false;
        }
        if (userDetail.profile && userDetail.profile === profileList.find(profile => profile.name === 'Student')?._id && !caregiverAddress.zipCode) {
            tempInvalidList.push('caregiverPinCode')
            isValid = false;
        }
        if (!isValid) {
            setInvalidList(tempInvalidList);
        }
        console.log('Validated' + isValid);
        return isValid;
    }

    const initiateInsertUser = async () => {
        handleInsertUser()
            .then((response) => {
                if (response.status === 200) {
                    toast.success('New user created');
                    console.log(userDetail)
                    setUserDetail({ profile: userDetail?.id });
                    setUserAddress({});
                    if (!createOneMore) {
                        history.goBack();
                    }
                }
            })
            .catch((error) => {
                if (error.response?.status === 409) {
                    setDuplicateUserId(error.response?.data?._id)
                }
                switch (error.response.status) {
                    case 409:
                        return setDuplicateUser(true)
                    case 400:
                        return toast.error('Something went wrong. Please try again');
                    default:
                        setisPageLoadingFailed(true)
                }
            })
            .finally(() => {
                setisPageLoading(false);
            })
    }

    const handleInsertUser = async () => {
        //Update Request
        setisPageLoading(true);
        unmounted = false;
        const source = axios.CancelToken.source();
        return await axios.post(`${process.env.REACT_APP_SERVER}/add-new-user/user`, {
            userDetail: fullUserDetails,
            caregiverDetails: fullCaregiverDetails,
            isSameAddress
        })
    }

    const unlinkCaregiver = () => {
        setCaregiverAddress({});
        setCaregiverDetail({});
        setExistingCareTaker(false);
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
                {JSON.parse(localStorage.getItem('userDetail'))?.profile?.name === 'Admin' ?
                    (<Box component="span" className={classes.hideButtons}>
                        <Grid container spacing={5}>
                            <Grid xs={6} md={6} justifyContent='flex-end' className={classes.gridElement}>
                                <Custom_Button variant='contained' size="medium" label={"Save"} accessGranted={userObjPermission.create} onClick={() => { handleSave(false) }} />
                            </Grid>
                            <Grid xs={6} md={6} justifyContent='flex-start' className={classes.gridElement}>
                                <Custom_Button variant='contained' size="medium" label={"Save and New"} accessGranted={userObjPermission.create} onClick={() => { handleSave(true) }} />
                            </Grid>
                        </Grid>
                    </Box>) : <span></span>
                }

                <Typography className={classes.header}>
                    User :
                </Typography>
                <Container style={{ paddingTop: 30 }}>
                    <Grid container spacing={5} className={classes.grid}>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required className={[classes.label, classes.required]} htmlFor="component-error">Name :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                inputProps={{
                                    className: classes.inputDesign
                                }}
                                placeholder={`User's Name`}
                                helperText={!invalidList.includes('name') ? '' : "Name is required"}
                                error={invalidList.includes('name')}
                                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'name')) }}
                                value={userDetail.name || ''}
                                id="name"
                                onChange={(name) => { setUserDetail({ ...userDetail, name: name.target.value }); }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required className={[classes.label, classes.required]}>Email :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                inputProps={{
                                    className: classes.inputDesign
                                }}
                                placeholder={`User's Email`}
                                helperText={invalidList.includes('email') ? "Email is required" : invalidList.includes('emailInvalid') ? 'Email is invalid' : ''}
                                error={invalidList.includes('email') || invalidList.includes('emailInvalid')}
                                onFocus={() => { setInvalidList(invalidList.filter(value => !value.includes('email'))) }}
                                value={userDetail.email || ''}
                                id="email"
                                onChange={(email) => { setUserDetail({ ...userDetail, email: email.target.value }); }}
                                aria-describedby="component-error-text"
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required className={[classes.label, classes.required]}>Phone :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                inputProps={{
                                    className: classes.inputDesign
                                }}
                                placeholder={`Phone Number`}
                                value={userDetail.phone1 || ''}
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
                            <InputLabel required className={[classes.label, classes.required]}>Profile :</InputLabel>

                            <TextField
                                id="profile"
                                style={{ flex: 1 }}
                                select
                                defaultValue={profileList[0]?._id || ''}
                                value={
                                    profileList.find(profile => profile._id === userDetail.profile?._id)?._id
                                }
                                onChange={(profileSel) => {
                                    setUserDetail({ ...userDetail, profile: profileList.find(profile => profile._id === profileSel.target.value)?._id })
                                }}
                                variant="standard"
                                inputProps={{
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
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel className={[classes.label, classes.required]}>DOB :</InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    inputFormat="dd/MM/yyyy"
                                    value={userDetail.dob}
                                    className={classes.inputDesign}
                                    onChange={(dateOfBirth) => { setUserDetail({ ...userDetail, dob: dateOfBirth }) }}
                                    renderInput={(params) => <TextField {...params} style={{ width: '91%' }} className={classes.dateDesign} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        {profileList.find(profile => profile._id === userDetail.profile)?.name === 'Student' &&
                            <Grid xs={12} md={6} style={{ marginTop: 0 }} className={classes.gridElement}>
                                <Grid xs={12} md={6} className={classes.gridElement}>
                                    <InputLabel required className={[classes.label, classes.required]}>Class :</InputLabel>
                                    <TextField
                                        id="class"
                                        style={{ flex: 1 }}
                                        select
                                        helperText={invalidList.includes('class') ? "Associate student to a class" : ''}
                                        error={invalidList.includes('class')}
                                        defaultValue={allClasses[1]?.id || ''}
                                        onFocus={() => { setInvalidList(invalidList.filter(value => !value.includes('class'))) }}
                                        value={
                                            allClasses.find(classRec => classRec.id === userDetail?.class)?.label || allClasses.find(classRec => classRec.label === 'None')?.label
                                        }
                                        onChange={(classRec) => {
                                            setUserDetail({ ...userDetail, class: allClasses.find(classInst => classInst.label === classRec.target.value)?.id, section: 'None' })
                                        }}
                                        variant="standard"
                                        inputProps={{
                                            className: classes.inputDesign,
                                        }}
                                    >
                                        {allClasses.map((option) => (
                                            <MenuItem
                                                classes={{
                                                    root: classes.profileSelect
                                                }}
                                                key={option.id} value={option.label}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid xs={12} md={6} className={classes.gridElement}>
                                    <InputLabel required className={[classes.label, classes.required]}>Section :</InputLabel>
                                    <TextField
                                        id="class"
                                        style={{ flex: 1 }}
                                        select
                                        defaultValue={allClasses[0]?.sections[0] || 'None'}
                                        helperText={invalidList.includes('section') ? "Select a section" : ''}
                                        error={invalidList.includes('section')}
                                        onFocus={() => { setInvalidList(invalidList.filter(value => !value.includes('section'))) }}
                                        value={
                                            userDetail.section || allClasses.find(classRec => classRec.label === 'None')?.sections[0]
                                        }
                                        onChange={(classRec) => {
                                            setUserDetail({ ...userDetail, section: classRec.target.value })
                                        }}
                                        variant="standard"
                                        inputProps={{
                                            className: classes.inputDesign,
                                        }}
                                    >
                                        {allClasses.find(classRec => classRec.id === userDetail.class)?.sections.map((option) => (
                                            <MenuItem
                                                classes={{
                                                    root: classes.profileSelect
                                                }}
                                                key={option} value={option}>
                                                {option || 'None'}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                </Container>
                <Typography className={classes.header}>
                    Address :
                </Typography>
                <Container style={{ paddingTop: 30 }}>
                    <Grid container spacing={5} className={classes.grid}>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required className={[classes.label, classes.required,classes.addressLine]}>Address Line 1 :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                inputProps={{
                                    className: classes.inputDesign
                                }}
                                placeholder={`Address Line 1`}
                                value={userAddress?.addressLine1 || ''}
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
                                inputProps={{
                                    className: classes.inputDesign
                                }}
                                placeholder={`Address Line 2`}
                                value={userAddress?.addressLine2 || ''}
                                id="addressLine2"
                                onChange={(addressLine2) => { handleuserAddressLine2Change(addressLine2) }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required className={[classes.label, classes.required]}>City :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                inputProps={{
                                    className: classes.inputDesign
                                }}
                                placeholder={`City`}
                                value={userAddress?.city || ''}
                                id="city"
                                helperText={!invalidList.includes('city') ? '' : "City is required"}
                                error={invalidList.includes('city')}
                                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'city')) }}
                                onChange={(city) => { handleUserCityChange(city) }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required className={[classes.label, classes.required]}>District :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                inputProps={{
                                    className: classes.inputDesign
                                }}
                                placeholder={`District`}
                                value={userAddress?.district || ''}
                                helperText={!invalidList.includes('district') ? '' : "District is required"}
                                error={invalidList.includes('district')}
                                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'district')) }}
                                id="district"
                                onChange={(district) => { handleUserDistrictChange(district) }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required className={[classes.label, classes.required]}>State :</InputLabel>
                            <Autocomplete
                                sx={{ width: 355, bottom: 5, position: 'relative', marginLeft: '8px' }}
                                options={selectedCountry?.states || []}
                                autoHighlight
                                value={selectedCountry?.states?.find(state => state.name === userAddress?.state) || {}}
                                getOptionLabel={(option) => option.name || ''}
                                id="state"
                                onChange={(event, value) => { handleUserStateChange(value) }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        required
                                        helperText={!invalidList.includes('state') ? '' : "Invalid state value"}
                                        error={invalidList.includes('state')}
                                        onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'state')) }}
                                        fullWidth
                                        id={`state`}
                                        placeholder="State"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required className={[classes.label, classes.required]}>Country :</InputLabel>
                            <Autocomplete
                                sx={{ width: 355, bottom: 5, position: 'relative', marginLeft: '8px' }}
                                options={countryDetails}
                                autoHighlight
                                value={selectedCountry || {}}
                                getOptionLabel={(option) => option.name || ''}
                                id="country"
                                onChange={(event, value) => {
                                    handleUserCountryChange(value)
                                }}
                                renderOption={(props, option) => (
                                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0, margin: 5 } }} {...props}>
                                        <img
                                            loading="lazy"
                                            width="20"
                                            src={`https://flagcdn.com/w20/${option.iso2.toLowerCase()}.png`}
                                            srcSet={`https://flagcdn.com/w40/${option.iso2.toLowerCase()}.png 2x`}
                                            alt=""
                                        />
                                        {option.name} ({option.iso3}) +{option.phone_code}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        required
                                        helperText={!invalidList.includes('country') ? '' : "Country is required"}
                                        error={invalidList.includes('country')}
                                        onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'country')) }}
                                        fullWidth
                                        id={`event-type`}
                                        placeholder="Country"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid xs={12} md={6} className={classes.gridElement}>
                            <InputLabel required className={[classes.label, classes.required]}>PIN Code :</InputLabel>
                            <TextField
                                style={{ flex: 1 }}
                                inputProps={{
                                    className: classes.inputDesign
                                }}
                                placeholder={`PIN Code`}
                                value={userAddress?.zipCode || ''}
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
                {
                    profileList.find(profile => profile._id === userDetail.profile)?.name === 'Student' &&
                    <span>
                        <Typography style={{ marginTop: 20 }} className={classes.header}>
                            Caregiver Information :
                        </Typography>
                        <Box component="span">
                            <Grid container spacing={5}>
                                <Grid xs={12} md={12} justifyContent='center' style={{ marginTop: 35 }} className={classes.gridElement}>
                                    <Button color='inherit' variant='contained' size="small" onClick={() => { !existingCareTaker ? setShowExistingCaregiver(true) : unlinkCaregiver() }}>{!existingCareTaker ? 'Link existing caregiver' : 'Unlink caregiver'}</Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <Container style={{ paddingTop: 30 }}>
                            <Grid container spacing={5} className={classes.grid}>
                                <Grid xs={12} md={6} className={classes.gridElement}>
                                    <InputLabel required className={[classes.label, classes.required]}>Name :</InputLabel>
                                    <TextField
                                        style={{ flex: 1 }}
                                        inputProps={{
                                            className: classes.inputDesign
                                        }}
                                        disabled={existingCareTaker}
                                        placeholder={`Caregiver Name`}
                                        helperText={!invalidList.includes('caregiverName') ? '' : "Name is required"}
                                        error={invalidList.includes('caregiverName')}
                                        onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'caregiverName')) }}
                                        value={caregiverDetail?.name || ''}
                                        id="caregiverName"
                                        onChange={(name) => { setCaregiverDetail({ ...caregiverDetail, name: name.target.value }) }}
                                        variant="standard"
                                    />
                                </Grid>
                                <Grid xs={12} md={6} className={classes.gridElement}>
                                    <InputLabel required className={[classes.label, classes.required]}>Email :</InputLabel>
                                    <TextField
                                        style={{ flex: 1 }}
                                        inputProps={{
                                            className: classes.inputDesign
                                        }}
                                        disabled={existingCareTaker}
                                        placeholder={`Caregiver Email`}
                                        helperText={invalidList.includes('caregiverEmail') ? "Email is required" : invalidList.includes('emailInvalid') ? 'Email is invalid' : ''}
                                        error={invalidList.includes('caregiverEmail') || invalidList.includes('caregiverEmailInvalid')}
                                        onFocus={() => { setInvalidList(invalidList.filter(value => !value.includes('caregiverEmail'))) }}
                                        value={caregiverDetail?.email || ''}
                                        id="caregiverEmail"
                                        onChange={(email) => { setCaregiverDetail({ ...caregiverDetail, email: email.target.value }) }}
                                        aria-describedby="component-error-text"
                                        variant="standard"
                                    />
                                </Grid>
                                <Grid xs={12} md={6} className={classes.gridElement}>
                                    <InputLabel required className={[classes.label, classes.required]}>Phone :</InputLabel>
                                    <TextField
                                        style={{ flex: 1 }}
                                        inputProps={{
                                            className: classes.inputDesign
                                        }}
                                        disabled={existingCareTaker}
                                        placeholder={`Phone Number`}
                                        value={caregiverDetail?.phone1 || ''}
                                        id="caregiverPhone"
                                        helperText={invalidList.includes('caregiverPhone') ? "Phone Number is required" : invalidList.includes('phoneInvalid') ? 'Phone Number is invalid' : ''}
                                        error={invalidList.includes('caregiverPhone') || invalidList.includes('caregiverPhoneInvalid')}
                                        onFocus={() => { setInvalidList(invalidList.filter(value => !value.includes('caregiverPhone'))) }}
                                        onChange={(phone) => { setCaregiverDetail({ ...caregiverDetail, phone1: phone.target.value }) }}
                                        aria-describedby="component-error-text"
                                        variant="standard"
                                    />
                                </Grid>
                            </Grid>
                        </Container>
                        <Typography style={{ marginTop: 20 }} className={classes.header}>
                            Caregiver Address :
                        </Typography>
                        <Container style={{ paddingTop: 30 }}>
                            <Grid container spacing={5} style={{ marginBottom: 10 }} className={classes.grid}>
                                <InputLabel style={{ paddingTop: 7, fontWeight: 800 }} className={[classes.label, classes.addressLine]}>Same as Student Address :</InputLabel>
                                <Checkbox color="success" disabled={existingCareTaker} onChange={(changeVal) => {
                                    if (changeVal.target.checked) {
                                        setIsSameAddress(true)
                                        setCaregiverAddress({ ...userAddress })
                                    }
                                    else {
                                        setIsSameAddress(false)
                                        setCaregiverAddress({})
                                    }
                                }} />
                            </Grid>
                            <Grid container spacing={5} className={classes.grid}>
                                <Grid xs={12} md={6} className={classes.gridElement}>
                                    <InputLabel required className={[classes.label, classes.required, classes.addressLine]}>Address Line 1 :</InputLabel>
                                    <TextField
                                        style={{ flex: 1 }}
                                        inputProps={{
                                            className: classes.inputDesign
                                        }}
                                        disabled={isSameAddress || existingCareTaker}
                                        placeholder={`Address Line 1`}
                                        value={caregiverAddress?.addressLine1 || ''}
                                        id="caregiverAddrLine1"
                                        helperText={!invalidList.includes('caregiverAddrLine1') ? '' : "Address Line 1 is required"}
                                        onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'caregiverAddrLine1')) }}
                                        error={invalidList.includes('caregiverAddrLine1')}
                                        onChange={(addressLine1) => { setCaregiverAddress({ ...caregiverAddress, addressLine1: addressLine1.target.value }) }}
                                        variant="standard"
                                    />
                                </Grid>
                                <Grid xs={12} md={6} className={classes.gridElement}>
                                    <InputLabel className={[classes.label, classes.addressLine]}>Address Line 2 :</InputLabel>
                                    <TextField
                                        style={{ flex: 1 }}
                                        inputProps={{
                                            className: classes.inputDesign
                                        }}
                                        disabled={isSameAddress || existingCareTaker}
                                        placeholder={`Address Line 2`}
                                        value={caregiverAddress?.addressLine2 || ''}
                                        id="caregiverAddressLine2"
                                        onChange={(addressLine2) => { setCaregiverAddress({ ...caregiverAddress, addressLine2: addressLine2.target.value }) }}
                                        variant="standard"
                                    />
                                </Grid>
                                <Grid xs={12} md={6} className={classes.gridElement}>
                                    <InputLabel required className={[classes.label, classes.required]}>City :</InputLabel>
                                    <TextField
                                        style={{ flex: 1 }}
                                        inputProps={{
                                            className: classes.inputDesign
                                        }}
                                        disabled={isSameAddress || existingCareTaker}
                                        placeholder={`City`}
                                        value={caregiverAddress?.city || ''}
                                        id="caregiverCity"
                                        helperText={!invalidList.includes('caregiverCity') ? '' : "City is required"}
                                        error={invalidList.includes('caregiverCity')}
                                        onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'caregiverCity')) }}
                                        onChange={(city) => { setCaregiverAddress({ ...caregiverAddress, city: city.target.value }) }}
                                        variant="standard"
                                    />
                                </Grid>
                                <Grid xs={12} md={6} className={classes.gridElement}>
                                    <InputLabel required className={[classes.label, classes.required]}>District :</InputLabel>
                                    <TextField
                                        style={{ flex: 1 }}
                                        inputProps={{
                                            className: classes.inputDesign
                                        }}
                                        disabled={isSameAddress || existingCareTaker}
                                        placeholder={`District`}
                                        value={caregiverAddress?.district || ''}
                                        helperText={!invalidList.includes('caregiverDistrict') ? '' : "District is required"}
                                        error={invalidList.includes('caregiverDistrict')}
                                        onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'caregiverDistrict')) }}
                                        id="caregiverDistrict"
                                        onChange={(district) => { setCaregiverAddress({ ...caregiverAddress, district: district.target.value }) }}
                                        variant="standard"
                                    />
                                </Grid>
                                <Grid xs={12} md={6} className={classes.gridElement}>
                                    <InputLabel required className={[classes.label, classes.required]}>State :</InputLabel>
                                    <Autocomplete
                                        sx={{ width: 355, bottom: 5, position: 'relative', marginLeft: '8px' }}
                                        options={selectedCaregiverCountry.states || []}
                                        autoHighlight
                                        //value={selectedCountry || {}}
                                        getOptionLabel={(option) => option.name || ''}
                                        id="state"
                                        onChange={(event, value) => { setCaregiverAddress({ ...caregiverAddress, state: value }) }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                required
                                                helperText={!invalidList.includes('caregiverState') ? '' : "Invalid state value"}
                                                error={invalidList.includes('caregiverState')}
                                                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'caregiverState')) }}
                                                fullWidth
                                                id={`caregiverState`}
                                                placeholder="State"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid xs={12} md={6} className={classes.gridElement}>
                                    <InputLabel required className={[classes.label, classes.required]}>Country :</InputLabel>
                                    <Autocomplete
                                        sx={{ width: 355, bottom: 5, position: 'relative', marginLeft: '8px' }}
                                        options={countryDetails}
                                        autoHighlight
                                        value={selectedCaregiverCountry || {}}
                                        getOptionLabel={(option) => option.name || ''}
                                        id="country"
                                        onChange={(event, value) => {
                                            setCaregiverAddress({ ...caregiverAddress, state: {}, country: value })
                                            setSelectedCaregiverCountry(value)
                                        }}
                                        renderOption={(props, option) => (
                                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0, margin: 5 } }} {...props}>
                                                <img
                                                    loading="lazy"
                                                    width="20"
                                                    src={`https://flagcdn.com/w20/${option.iso2.toLowerCase()}.png`}
                                                    srcSet={`https://flagcdn.com/w40/${option.iso2.toLowerCase()}.png 2x`}
                                                    alt=""
                                                />
                                                {option.name} ({option.iso3}) +{option.phone_code}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                required
                                                helperText={!invalidList.includes('caregiverCountry') ? '' : "Country is required"}
                                                error={invalidList.includes('caregiverCountry')}
                                                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'caregiverCountry')) }}
                                                fullWidth
                                                id={`caregiverCountry`}
                                                placeholder="Country"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid xs={12} md={6} className={classes.gridElement}>
                                    <InputLabel required className={[classes.label, classes.required]}>PIN Code :</InputLabel>
                                    <TextField
                                        style={{ flex: 1 }}
                                        inputProps={{
                                            className: classes.inputDesign
                                        }}
                                        disabled={isSameAddress || existingCareTaker}
                                        placeholder={`PIN Code`}
                                        value={caregiverAddress?.zipCode || ''}
                                        id="caregiverPinCode"
                                        helperText={!invalidList.includes('caregiverPinCode') ? '' : "Pin Code is required"}
                                        error={invalidList.includes('caregiverPinCode')}
                                        onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'caregiverPinCode')) }}
                                        onChange={(zipCode) => { setCaregiverAddress({ ...caregiverAddress, zipCode: zipCode.target.value }) }}
                                        variant="standard"
                                    />
                                </Grid>
                            </Grid>
                        </Container>
                    </span>
                }
                <Toaster />
                <Dialog
                    open={duplicateUser}
                    onClose={() => { }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {`Duplicate user found!`}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            An user with {userDetail.email} is found in the organization.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setDuplicateUser(false)
                            }}>Cancel</Button>
                        <Button onClick={() => {
                            setDuplicateUser(false)
                            setshowDuplicateUser(true);
                        }} autoFocus>
                            Show Details!
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={showExistingCaregiver} onClose={() => { setShowExistingCaregiver(false) }}>
                    <DialogTitle>Select Caregiver</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the email of existing Caregiver:
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            value={findCaregiverEmail}
                            fullWidth
                            onChange={(email) => { setFindCaregiverEmail(email.target.value) }}
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setShowExistingCaregiver(false) }}>Cancel</Button>
                        <Button onClick={getCaregiverByEmail}>Find</Button>
                    </DialogActions>
                </Dialog>

                <Modal
                    open={showDuplicateUser}
                    onClose={() => { setshowDuplicateUser(false) }}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className={classes.modalDesign}>
                        <UserDetail userId={duplicateUserId} hideButtons={true} />
                    </Box>
                </Modal>
            </React.Fragment>
        )
    }
}

export default NewUser