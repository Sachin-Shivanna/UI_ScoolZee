/* eslint-disable react/jsx-pascal-case */
import React, { useEffect } from 'react'
import axios, { post } from 'axios';
import { Box, Button, Container, Typography, TextField } from '@material-ui/core';
import { useStyles } from '../EventsStyles';
import { useHistory } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import { Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import { eventTypes } from '../../../constants/EventTypes';
import { eventNotificationMode } from '../../../constants/EventNotificationMode';
import { eventAudienceCategory } from '../../../constants/EventAudienceCategory'
import UserAudience from './UserAudience';
import ClassAudience from './ClassAudience';
import ProfileAudience from './ProfileAudience';
import Loading from '../../../components/loading/Loading';
import { AccessDefinition } from '../../../constants/AccessDefinition/AccessDefinition';
import Custom_Button from '../../../components/reusableElements/Custom_Button';

const NewEvent = (props) => {

    let fileInput = React.createRef();

    const classes = useStyles();
    const history = useHistory();

    let unmounted = false;

    const eventObjPermission = props?.location?.state?.eventObjPermission;


    const url = `${process.env.REACT_APP_SERVER}/add-event/event`;

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    const [invalidList, setInvalidList] = React.useState([]);
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const [isPageLoading, setisPageLoading] = React.useState(false);
    const [isPageLoadingFailed, setisPageLoadingFailed] = React.useState(false);
    const [allActiveUsers, setAllActiveUsers] = React.useState([]);
    const [includeCaregivers, setIncludeCareGivers] = React.useState(false);
    const [fileSize, setFileSize] = React.useState(0);
    const [attachment, setAttachment] = React.useState({});
    const [eventDetails, setEventDetails] = React.useState({
        title: '',
        description: '',
        type: '',
        audianceCategory: '',
        notificationMode: '',
        startDate: '',
        endDate: '',
        owner: '',
        attachment: {}
    });

    useEffect(() => {
        console.log(eventObjPermission);
        setEventDetails({ ...eventDetails, audiance: selectedUsers });
    }, [selectedUsers])

    useEffect(() => {
        setEventDetails({ ...eventDetails, startDate: getTodayDateTime('startDate'), endDate: getTodayDateTime('endDate') })
        getAllActiveUsers();
        if (props.selectedUsers?.length > 0) {
            console.log(props.selectedUsers)
            setSelectedUsers([...props.selectedUsers?.map(student => { return { userId: student._id, userEmail: student.email, userPhone: student.phone1, userProfile: student.profile, userName: student.name } })]);
        }
    }, [])

    useEffect(() => {
        setSelectedUsers([]);
        if (eventDetails.audianceCategory === 'institution') {
            handleSelectedUsers(allActiveUsers);
        }
    }, [eventDetails.audianceCategory])

    useEffect(() => {
        if (props.hideAudienceCategory && includeCaregivers) {
            let careGiverIds = props.selectedUsers.map(student => { return student.caregiver });
            getCareGiversDetails(careGiverIds)
        } else {
            handleSelectedUsers(allActiveUsers)
        }
    }, [includeCaregivers])

    const getCareGiversDetails = async (careGiverIds) => {
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/users-by-ids/user?${careGiverIds.map((n, index) => `IDs[${index}]=${n}`).join('&')}`)
            .then((response) => {
                console.log(response.data);
                setSelectedUsers([...selectedUsers, ...response.data?.map(student => { return { userId: student._id, userEmail: student.email, userPhone: student.phone1, userProfile: student.profile, userName: student.name } })]);
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
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
    }

    const getTodayDateTime = (dateType) => {
        let todayDatetime = new Date();
        todayDatetime.setMinutes(todayDatetime.getMinutes() - todayDatetime.getTimezoneOffset());
        if (dateType === 'endDate') {
            todayDatetime.setDate(todayDatetime.getDate() + parseInt(1))
        }
        return todayDatetime.toISOString().slice(0, 16);
    }

    const getAllActiveUsers = async () => {
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/active-users-info/user`)
            .then((response) => {
                console.log(response.data);
                setAllActiveUsers(response.data)
                //handleSelectedUsers(response.data)
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
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
    }

    const handleSelectedUsers = (usersToSelect) => {
        let tempSelectedList = []
        usersToSelect.forEach(user => {
            if ((includeCaregivers && user.profile?.name === 'Caregiver') || (user.profile?.name !== 'Caregiver')) {
                tempSelectedList.push({ userId: user._id, userEmail: user.email, userPhone: user.phone1 });
            }
        });
        setSelectedUsers([...tempSelectedList])
    }


    const handleAttachmentUpload = (file) => {
        console.log(file)
        setAttachment(file);
        setFileSize((file?.size / (1024 * 1024)).toFixed(2))
    }

    const validate = () => {

        let isValid = true;
        let tempInvalidList = [];

        if (eventDetails.title === null || eventDetails.title === '') {
            tempInvalidList.push(...tempInvalidList, 'title')
            isValid = false;
        }
        if (eventDetails.type === '') {
            tempInvalidList.push(...tempInvalidList, 'type')
            isValid = false;
        }
        if (eventDetails.owner === '') {
            tempInvalidList.push(...tempInvalidList, 'owner')
            isValid = false;
        }
        if (!props.hideAudienceCategory && eventDetails.audianceCategory === '') {
            tempInvalidList.push(...tempInvalidList, 'audianceCategory')
            isValid = false;
        }
        if (eventDetails.notificationMode === '') {
            tempInvalidList.push(...tempInvalidList, 'notificationMode')
            isValid = false;
        }
        if (eventDetails.audianceCategory !== '' && selectedUsers.length === 0) {
            tempInvalidList.push(...tempInvalidList, 'selectedUsers')
            isValid = false;
            toast.error('Please select the Audience')
        }
        if (new Date(eventDetails.startDate + ':00.0z') < new Date()) {
            isValid = false;
            toast.error('Event must be timed in future')
        }

        if (new Date(eventDetails.startDate + ':00.0z') > new Date(eventDetails.endDate + ':00.0z')) {
            isValid = false;
            toast.error('Event end time must be greater than start date')
        }
        if (fileSize > 10) {
            tempInvalidList.push(...tempInvalidList, 'fileSize')
            isValid = false;
        }

        if (!isValid) {
            setInvalidList(tempInvalidList)
        }
        else {
            handleEventSave();
        }


    }

    const handleEventSave = async () => {
        unmounted = false;
        setisPageLoading(true)
        const formData = new FormData();
        formData.append("file", attachment);
        formData.append("eventDetails", JSON.stringify(eventDetails));
        const source = axios.CancelToken.source();
        post(url, formData, config)
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    toast.success(response.data)
                    history.goBack();
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
                setisPageLoading(false)
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
                        <Grid container spacing={5}>
                            <Grid xs={6} md={6} justifyContent='flex-end' style={{ maxWidth: '46%', paddingTop: 10, marginBottom: '1.5%' }} className={classes.gridElement}>
                                <Custom_Button variant='contained' size="medium" onClick={validate} label={'Publish'} accessGranted={eventObjPermission.create}/>
                            </Grid>
                            <Grid xs={6} md={6} justifyContent='flex-start' style={{ maxWidth: '46%', paddingTop: 10, marginBottom: '1.5%' }} className={classes.gridElement}>
                                <Custom_Button variant='contained' size="medium" onClick={() => { props.hasCancel ? props.onCancel() : history.goBack() }} label={'Cancel'} accessGranted={eventObjPermission.create}/>
                            </Grid>
                        </Grid>
                    </Box>
                <Typography className={classes.header}>
                    Event :
                </Typography>
                <Container style={{ paddingTop: 30, backgroundColor: 'white' }}>
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <Box style={{ marginBottom: 20 }}>
                                <Typography className={classes.label}>Title :</Typography>
                                <TextField
                                    style={{ flex: 1 }}
                                    fullWidth
                                    inputProps={{
                                        className: classes.inputDesign
                                    }}
                                    placeholder={`Event Title`}
                                    helperText={!invalidList.includes('title') ? '' : "Title is required"}
                                    error={invalidList.includes('title')}
                                    onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'title')) }}
                                    value={eventDetails.title || ''}
                                    id="name"
                                    onChange={(name) => { setEventDetails({ ...eventDetails, title: name.target.value }) }}
                                    variant="standard"
                                />
                            </Box>
                            <Box style={{ marginBottom: 20 }}>
                                <Typography className={classes.label}>Description :</Typography>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={3}
                                    placeholder="Event Description"
                                    onChange={(desc) => { setEventDetails({ ...eventDetails, description: desc.target.value }) }}
                                    style={{ minWidth: '100%', maxWidth: '100%', minHeight: 143, height: 143 }}
                                    value={eventDetails.description || ''}
                                />
                            </Box>
                            <Box style={{ marginBottom: 20 }}>
                                <Typography style={{ paddingTop: 10, paddingRight: 10 }} className={classes.label}>Type :</Typography>
                                <Autocomplete
                                    style={{ minWidth: 250 }}
                                    disabled={false}
                                    options={eventTypes || []}
                                    getOptionLabel={(option) => option.label || ''}
                                    value={eventTypes.find(type => type.value === eventDetails.type)}
                                    isOptionEqualToValue={(option, value) => option?.value === value}
                                    onChange={(event) => { setEventDetails({ ...eventDetails, type: eventTypes[event.target?.dataset?.optionIndex]?.value }) }}
                                    id="disable-close-on-select"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            required
                                            helperText={!invalidList.includes('type') ? '' : "Event Type is required"}
                                            error={invalidList.includes('type')}
                                            onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'type')) }}
                                            fullWidth
                                            id={`event-type`}
                                            placeholder="Type"
                                        />)}
                                />
                            </Box>
                            {!props.hideAudienceCategory && <Box style={{ marginBottom: 20 }}>
                                <Typography style={{ paddingTop: 10, paddingRight: 10 }} className={classes.label}>Audience Category :</Typography>
                                <Autocomplete
                                    style={{ minWidth: 250 }}
                                    disabled={false}
                                    options={eventAudienceCategory || []}
                                    getOptionLabel={(option) => option.label || ''}
                                    value={eventAudienceCategory.find(category => category.value === eventDetails.audianceCategory)}
                                    isOptionEqualToValue={(option, value) => option?.value === value}
                                    onChange={(event) => { setEventDetails({ ...eventDetails, audianceCategory: eventAudienceCategory[event.target?.dataset?.optionIndex]?.value }) }}
                                    id="disable-close-on-select"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            required
                                            helperText={!invalidList.includes('audianceCategory') ? '' : "Audience Category is required"}
                                            error={invalidList.includes('audianceCategory')}
                                            onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'audianceCategory')) }}
                                            fullWidth
                                            id={`event-type`}
                                            placeholder="audience"
                                        />)}
                                />
                                {(eventDetails.audianceCategory === 'institution') && <Box>
                                    <Typography><Checkbox checked={includeCaregivers} onChange={() => { setIncludeCareGivers(!includeCaregivers) }} /><span>Include Caregivers</span></Typography>
                                </Box>}
                            </Box>}
                            {
                                props.hideAudienceCategory && <Box>
                                    <Typography><Checkbox checked={includeCaregivers} onChange={() => { setIncludeCareGivers(!includeCaregivers) }} /><span>Include Caregivers</span></Typography>
                                </Box>
                            }

                        </Grid>
                        <Grid item xs={6}>
                            <Box style={{ marginBottom: 20 }}>
                                <Typography style={{ paddingTop: 10, paddingRight: 10 }} className={classes.label}>Owner :</Typography>
                                <Autocomplete
                                    style={{ minWidth: 250 }}
                                    disabled={false}
                                    options={allActiveUsers.filter(user => (user.profile?.name === 'Admin' || user.profile?.name === 'Faculty')) || []}
                                    getOptionLabel={(option) => option.name || ''}
                                    value={allActiveUsers.find(user => user._id === eventDetails.owner)}
                                    isOptionEqualToValue={(option, value) => option?._id === value}
                                    onChange={(event) => { setEventDetails({ ...eventDetails, owner: allActiveUsers[event.target?.dataset?.optionIndex]?._id }) }}
                                    id="disable-close-on-select"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            required
                                            helperText={!invalidList.includes('owner') ? '' : "Owner is required"}
                                            error={invalidList.includes('owner')}
                                            onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'owner')) }}
                                            fullWidth
                                            id={`event-type`}
                                            placeholder="Owner"
                                        />)}
                                />
                            </Box>
                            <Box style={{ marginBottom: 20 }}>
                                <Typography style={{ paddingRight: 10 }} className={classes.label}>Notification Mode :</Typography>
                                <Autocomplete
                                    style={{ minWidth: 250 }}
                                    disabled={false}
                                    options={eventNotificationMode || []}
                                    getOptionLabel={(option) => option.label || ''}
                                    value={eventNotificationMode.find(mode => mode.value === eventDetails.notificationMode)}
                                    isOptionEqualToValue={(option, value) => option?.value === value}
                                    onChange={(event) => { setEventDetails({ ...eventDetails, notificationMode: eventNotificationMode[event.target?.dataset?.optionIndex]?.value }) }}
                                    id="disable-close-on-select"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            required
                                            helperText={!invalidList.includes('notificationMode') ? '' : "Notification Mode is required"}
                                            error={invalidList.includes('notificationMode')}
                                            onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'notificationMode')) }}
                                            fullWidth
                                            id={`event-type`}
                                            placeholder="Notification"
                                        />)}
                                />
                            </Box>
                            <Box style={{ marginBottom: 35 }}>
                                <Typography style={{ paddingTop: 10, paddingRight: 10 }} className={classes.label}>Start Date/Time :</Typography>
                                <TextField
                                    id="datetime-local"
                                    type="datetime-local"
                                    defaultValue="2017-05-24T10:30"
                                    value={eventDetails.startDate}
                                    onChange={(startDateTime) => { setEventDetails({ ...eventDetails, startDate: startDateTime.target.value }) }}
                                    sx={{ minWidth: 250 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Box>
                            <Box style={{ marginBottom: 20 }}>
                                <Typography style={{ paddingTop: 10, paddingRight: 10 }} className={classes.label}>End Date/Time :</Typography>
                                <TextField
                                    id="datetime-local"
                                    type="datetime-local"
                                    defaultValue="2017-05-24T10:30"
                                    value={eventDetails.endDate}
                                    onChange={(endDateTime) => { setEventDetails({ ...eventDetails, endDate: endDateTime.target.value }) }}
                                    sx={{ minWidth: 250 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Box>
                            <Box style={{ marginBottom: 20 }}>
                                <Typography style={{ paddingTop: 10, paddingRight: 10 }} className={classes.label}>Attachment :</Typography>
                                <span>
                                    <input
                                        ref={fileInput}
                                        id='fileInput'
                                        accept='application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
                                        text/plain, application/pdf, image/*'
                                        onChange={(event) => handleAttachmentUpload(event.target.files[0])}
                                        type="file"
                                        name='file'
                                    />
                                    {JSON.stringify(eventDetails?.attachment) !== JSON.stringify({}) &&
                                        <span>
                                            <CloseIcon Button style={{ paddingTop: 10, cursor: 'pointer' }} onClick={() => {
                                                fileInput.current.value = '';
                                                setEventDetails({ ...eventDetails, attachment: {} });
                                            }} />
                                        </span>
                                    }
                                    {invalidList.includes('fileSize') &&
                                        <div style={{ color: '#f44336', fontSize: '0.75rem', marginTop: 3, textAlign: 'left', fontWeight: 400 }}>File size can not be more than 10MB</div>
                                    }
                                </span>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
                {props.hideAudienceCategory !== true &&
                    eventDetails.audianceCategory !== '' &&
                    eventDetails.audianceCategory !== 'institution' &&
                    <React.Fragment>
                        {/* {isPageLoading && <LinearProgress color="inherit" style={{ marginTop: 10 }} />} */}
                        <Typography style={{ marginTop: 0 }} className={classes.header}>
                            Audience Detail :
                        </Typography>
                        {
                            eventDetails.audianceCategory === 'users' &&
                            <UserAudience /*pageLoading={(status) => { setisPageLoading(status) }}*/ selectedUsers={(userIdEmailList) => { setSelectedUsers([...userIdEmailList]) }} />

                        }
                        {
                            eventDetails.audianceCategory === 'classes' &&
                            <ClassAudience /*pageLoading={(status) => { setisPageLoading(status) }}*/ selectedUsers={(userIdEmailList) => { setSelectedUsers([...userIdEmailList]) }} />
                        }
                        {
                            eventDetails.audianceCategory === 'profile' &&
                            <ProfileAudience /*pageLoading={(status) => { setisPageLoading(status) }}*/ selectedUsers={(userIdEmailList) => { setSelectedUsers([...userIdEmailList]) }} />
                        }
                    </React.Fragment>
                }
                <Toaster />
            </React.Fragment>
        )
    }
}

export default NewEvent