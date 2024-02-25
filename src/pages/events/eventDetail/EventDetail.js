/* eslint-disable react/jsx-pascal-case */
import React, { useEffect } from 'react'
import { Box, Container, Typography, TextField } from '@material-ui/core';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import { Autocomplete } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Modal from '@mui/material/Modal';

import { useStyles, StyledTableCell } from '../EventsStyles';
import { useHistory } from 'react-router-dom';
import Loading from '../../../components/loading/Loading';
import { eventTypes } from '../../../constants/EventTypes';
import { eventNotificationMode } from '../../../constants/EventNotificationMode';
import { columns } from '../../../constants/UsersTableHeaders';
import AddAudience from './AddAudience';
import AuditFields from '../../commomPages/AuditFields';
import Custom_Button from '../../../components/reusableElements/Custom_Button';
import { OBJECT } from '../../../constants/ObjectNames/documentObjNames';

const EventDetail = (params) => {

    const classes = useStyles();
    const history = useHistory();

    let unmounted = false;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isPageLoading, setisPageLoading] = React.useState(false);
    const [isPageLoadingFailed, setisPageLoadingFailed] = React.useState(false);
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [invalidList, setInvalidList] = React.useState([]);
    const [savedEvent, setSavedEvent] = React.useState({});
    const [allActiveUsers, setAllActiveUsers] = React.useState([]);
    const [tempRemoveAudience, setTempRemoveAudience] = React.useState([]);
    const [confirmCancel, setConfirmCancel] = React.useState(false)
    const [openAddAudience, setOpenAddAudience] = React.useState(false)
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    useEffect(() => {
        console.log(params.eventObjPermission)
        if (JSON.stringify(params.savedEvent) !== JSON.stringify({})) {
            setSavedEvent(params.savedEvent)
            getAllActiveUsers();
        }
    }, []);

    const getAllActiveUsers = async () => {
        setisPageLoading(true)
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/active-users-info/${OBJECT.USER}`)
            .then((response) => {
                console.log(response.data);
                setAllActiveUsers(response.data)
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
                setisPageLoadingFailed(true)
            })
            .finally(() => {
                setisPageLoading(false)
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
    }

    const handleAddAudience = (addedUsers) => {
        let tempUsersList = [];
        addedUsers?.forEach(user => {
            if (savedEvent?.audiance?.findIndex(usr => usr._id === user.userId) < 0) {
                tempUsersList.push({ _id: user.userId, name: user.userName, phone1: user.userPhone, email: user.userEmail, profile: user.userProfile })
            }
        });
        tempUsersList.push(...savedEvent?.audiance);
        setSavedEvent({ ...savedEvent, audiance: tempUsersList });
        setOpenAddAudience(false)
    }

    const handleSave = () => {
        if (isEditMode) {
            if (validate() === true) {
                handleEventUpdate();
            }
        }
        else {
            setIsEditMode(!isEditMode);
        }
    }

    const handleEventUpdate = async () => {
        unmounted = false;
        setisPageLoading(true)
        const source = axios.CancelToken.source();
        await axios.patch(`${process.env.REACT_APP_SERVER}/update-event/${OBJECT.EVENT}`, {
            updatedEvent: savedEvent
        })
            .then((response) => {
                console.log(response)
                if (response.status === 200) {
                    setIsEditMode(!isEditMode);
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

    const handleDeleteEvent = async () => {
        setConfirmDelete(false)
        setisPageLoading(true);
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.delete(`${process.env.REACT_APP_SERVER}/delete-event/${OBJECT.EVENT}/${savedEvent?._id}`)
            .then((response) => {
                if (response.status === 200) {
                    setisPageLoading(false);
                    console.log('Returned');
                    history.goBack();
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
                        toast.error('Falied!')
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

    const handleSendRemainder = async () => {
        setisPageLoading(true);
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.patch(`${process.env.REACT_APP_SERVER}/send-event-remainder/${OBJECT.EVENT}`,
            {
                eventId: savedEvent._id
            })
            .then((response) => {
                if (response.status === 200) {
                    setisPageLoading(false);
                    console.log('Returned');
                    //history.goBack();
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
                        toast.error('Falied!')
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

    const validate = () => {

        let isValid = true;
        let tempInvalidList = [];

        if (savedEvent.title === null || savedEvent.title === '') {
            tempInvalidList.push(...tempInvalidList, 'title')
            isValid = false;
        }

        if (savedEvent.type === '' || typeof savedEvent.type === 'undefined') {
            tempInvalidList.push(...tempInvalidList, 'type')
            isValid = false;
        }
        if (savedEvent.owner === '' || typeof savedEvent.owner === 'undefined') {
            tempInvalidList.push(...tempInvalidList, 'owner')
            isValid = false;
        }
        if (savedEvent.notificationMode === '' || typeof savedEvent.notificationMode === 'undefined') {
            tempInvalidList.push(...tempInvalidList, 'notificationMode')
            isValid = false;
        }
        if (savedEvent.audiance?.length === 0) {
            tempInvalidList.push(...tempInvalidList, 'selectedUsers')
            isValid = false;
            toast.error('Please select the Audience')
        }
        if (new Date(savedEvent.startDateTime) < new Date()) {
            isValid = false;
            toast.error('Event must be timed in future')
        }

        if (new Date(savedEvent.startDateTime) > new Date(savedEvent.endDateTime)) {
            isValid = false;
            toast.error('Event end time must be greater than start date')
        }

        if (!isValid) {
            setInvalidList(tempInvalidList)
        }
        return isValid
    }

    const handleRemoveAudiance = () => {
        setSavedEvent({ ...savedEvent, audiance: savedEvent?.audiance.filter(user => (tempRemoveAudience.findIndex(usrId => usrId === user._id) < 0)) })
        setTempRemoveAudience([])
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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
                {JSON.stringify(savedEvent) !== JSON.stringify({}) && <span>
                    {/* {JSON.parse(localStorage.getItem('userDetail'))?.profile?.name === 'Admin' || JSON.parse(localStorage.getItem('userDetail'))._id === savedEvent?.owner?._id ? */}
                        <Box component="span" className={classes.hideButtons}>
                            <Grid container spacing={5}>
                                <Grid xs={6} md={6} justifyContent='flex-end' style={{ maxWidth: '46%', paddingTop: 10, marginBottom: '1.5%' }} className={classes.gridElement}>
                                    <Custom_Button variant='contained' size="medium" style={{ marginRight: 3 }} color='inherit' onClick={handleSave} label={isEditMode ? 'Save' : 'Edit'} accessGranted={params.eventObjPermission.edit}/>
                                    <Custom_Button variant='contained' size="medium" style={{ marginLeft: 3 }} color='inherit' onClick={() => { isEditMode ? setConfirmCancel(true) : history.goBack() }} label={'Cancel'} accessGranted={params.eventObjPermission.edit}/>
                                </Grid>
                                <Grid xs={6} md={6} justifyContent='flex-start' style={{ maxWidth: '46%', paddingTop: 10, marginBottom: '1.5%' }} className={classes.gridElement}>
                                    <Custom_Button variant='outlined' size="medium" color='error' style={{ marginRight: 3 }} onClick={() => { setConfirmDelete(true) }} label={'Delete'} accessGranted={params.eventObjPermission.delete}/>
                                    <Button variant='contained' size="medium" color="success" disabled={isEditMode} style={{ marginLeft: 3 }} onClick={() => { handleSendRemainder() }}>Send Remainder</Button>
                                </Grid>
                            </Grid>
                        </Box>
                   {/* } */}
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
                                        InputProps={{
                                            readOnly: !isEditMode,
                                            disableUnderline: !isEditMode,
                                        }}
                                        placeholder={`Event Title`}
                                        helperText={!invalidList.includes('title') ? '' : "Title is required"}
                                        error={invalidList.includes('title')}
                                        onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'title')) }}
                                        value={savedEvent.title || ''}
                                        id="title"
                                        onChange={(title) => { setSavedEvent({ ...savedEvent, title: title.target.value }) }}
                                        variant="standard"
                                    />
                                </Box>
                                <Box style={{ marginBottom: 20 }}>
                                    <Typography className={classes.label}>Description :</Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        readOnly={!isEditMode}
                                        InputProps={{
                                            readOnly: !isEditMode,
                                            disableUnderline: !isEditMode,
                                        }}
                                        placeholder="Event Description"
                                        onChange={(desc) => { setSavedEvent({ ...savedEvent, description: desc.target.value }) }}
                                        style={{ minWidth: '100%', maxWidth: '100%', minHeight: 143, height: 143, border: !isEditMode ? 'none' : '' }}
                                        value={savedEvent.description || ''}
                                    />
                                </Box>
                                <Box style={{ marginBottom: 20 }}>
                                    <Typography style={{ paddingTop: 10, paddingRight: 10 }} className={classes.label}>Type :</Typography>
                                    {isEditMode && <Autocomplete
                                        style={{ minWidth: 250 }}
                                        disabled={false}
                                        options={eventTypes || []}
                                        getOptionLabel={(option) => option.label || ''}
                                        value={eventTypes.find(type => type.value === savedEvent.type)}
                                        isOptionEqualToValue={(option, value) => option?.value === value}
                                        onChange={(event) => { setSavedEvent({ ...savedEvent, type: eventTypes[event.target?.dataset?.optionIndex]?.value }) }}
                                        id="disable-close-on-select"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                style={{ border: !isEditMode ? 'none' : '' }}
                                                required
                                                helperText={!invalidList.includes('type') ? '' : "Event Type is required"}
                                                error={invalidList.includes('type')}
                                                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'type')) }}
                                                fullWidth
                                                id={`event-type`}
                                                placeholder="Type"
                                            />)}
                                    />}
                                    {!isEditMode &&
                                        <TextField
                                            style={{ flex: 1 }}
                                            fullWidth
                                            InputProps={{
                                                readOnly: !isEditMode,
                                                disableUnderline: !isEditMode,
                                                //className: classes.inputDesign
                                            }}
                                            placeholder={`Event Title`}
                                            value={eventTypes.find(type => type.value === savedEvent.type)?.label || ''}
                                            id="type"
                                            onChange={(name) => { }}
                                            variant="standard"
                                        />}
                                </Box>
                                <Box style={{ marginBottom: 20 }}>
                                    <Typography style={{ paddingTop: 10, paddingRight: 10 }} className={classes.label}>Notification Mode :</Typography>
                                    {isEditMode && <Autocomplete
                                        style={{ minWidth: 250 }}
                                        disabled={false}
                                        options={eventNotificationMode || []}
                                        getOptionLabel={(option) => option.label || ''}
                                        value={eventNotificationMode.find(notification => notification.value === savedEvent.notificationMode)}
                                        isOptionEqualToValue={(option, value) => option?.value === value}
                                        onChange={(event) => { setSavedEvent({ ...savedEvent, notificationMode: eventNotificationMode[event.target?.dataset?.optionIndex]?.value }) }}
                                        id="disable-close-on-select"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                style={{ border: !isEditMode ? 'none' : '' }}
                                                required
                                                helperText={!invalidList.includes('notificationMode') ? '' : "Notification Mode is required"}
                                                error={invalidList.includes('notificationMode')}
                                                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'notificationMode')) }}
                                                fullWidth
                                                id={`notification-mode`}
                                                placeholder="Notification Mode"
                                            />)}
                                    />}
                                    {!isEditMode &&
                                        <TextField
                                            style={{ flex: 1 }}
                                            fullWidth
                                            InputProps={{
                                                readOnly: !isEditMode,
                                                disableUnderline: !isEditMode,
                                                //className: classes.inputDesign
                                            }}
                                            placeholder={`Event Title`}
                                            value={eventNotificationMode.find(notification => notification.value === savedEvent.notificationMode)?.label || ''}
                                            id="notification-mode"
                                            onChange={(name) => { }}
                                            variant="standard"
                                        />}
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box style={{ marginBottom: 20 }}>
                                    <Typography style={{ paddingTop: 10, paddingRight: 10 }} className={classes.label}>Owner :</Typography>
                                    {isEditMode && <Autocomplete
                                        style={{ minWidth: 250 }}
                                        disabled={false}
                                        fullWidth
                                        options={allActiveUsers.filter(user => (user.profile?.name === 'Admin' || user.profile?.name === 'Faculty')) || []}
                                        getOptionLabel={(option) => option.name || ''}
                                        value={allActiveUsers.find(user => user._id === savedEvent.owner?._id)}
                                        isOptionEqualToValue={(option, value) => option?._id === value}
                                        onChange={(event) => { setSavedEvent({ ...savedEvent, owner: allActiveUsers[event.target?.dataset?.optionIndex] }) }}
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
                                    />}
                                    {!isEditMode &&
                                        <TextField
                                            style={{ flex: 1 }}
                                            fullWidth
                                            InputProps={{
                                                readOnly: !isEditMode,
                                                disableUnderline: !isEditMode,
                                            }}
                                            placeholder={`Event Title`}
                                            value={allActiveUsers.find(user => user._id === savedEvent.owner?._id)?.name || ''}
                                            id="notification-mode"
                                            onChange={(name) => { }}
                                            variant="standard"
                                        />}
                                </Box>
                                <Box style={{ marginBottom: 35 }}>
                                    <Typography style={{ paddingTop: 10, paddingRight: 10 }} className={classes.label}>Start Date/Time :</Typography>
                                    <TextField
                                        id="datetime-local"
                                        type="datetime-local"
                                        defaultValue="2017-05-24T10:30"
                                        value={new Date(savedEvent.startDateTime)?.toISOString()?.slice(0, 16)}
                                        onChange={(startDateTime) => { setSavedEvent({ ...savedEvent, startDateTime: startDateTime.target.value }) }}
                                        sx={{ minWidth: 250 }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: !isEditMode,
                                            disableUnderline: !isEditMode,
                                        }}
                                    />
                                </Box>
                                <Box style={{ marginBottom: 20 }}>
                                    <Typography style={{ paddingTop: 10, paddingRight: 10 }} className={classes.label}>End Date/Time :</Typography>
                                    <TextField
                                        id="datetime-local"
                                        type="datetime-local"
                                        defaultValue="2017-05-24T10:30"
                                        value={new Date(savedEvent.endDateTime)?.toISOString()?.slice(0, 16)}
                                        onChange={(endDateTime) => { setSavedEvent({ ...savedEvent, endDateTime: endDateTime.target.value }) }}
                                        sx={{ minWidth: 250 }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: !isEditMode,
                                            disableUnderline: !isEditMode,
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                    <Typography className={classes.header}>
                        Audience Detail :
                    </Typography>
                    {(JSON.parse(localStorage.getItem('userDetail'))?.profile?.name === 'Admin' && isEditMode) ?
                        (<Box component="span" className={classes.hideButtons}>
                            <Grid container spacing={5}>
                                <Grid xs={6} md={6} justifyContent='flex-end' style={{ maxWidth: '46%', paddingTop: 10, marginTop: 35, marginBottom: 0 }} className={classes.gridElement}>
                                    <Custom_Button variant='contained' disabled={!isEditMode || tempRemoveAudience.length === 0} size="medium" style={{ marginTop: 6 }} onClick={handleRemoveAudiance} label={'Remove Audience'} accessGranted={params.eventObjPermission?.edit}/>
                                </Grid>
                                <Grid xs={6} md={6} justifyContent='flex-start' style={{ maxWidth: '46%', paddingTop: 10, marginTop: 35, marginBottom: 0 }} className={classes.gridElement}>
                                    <Custom_Button variant='contained' style={{ marginTop: 6 }} size="medium" onClick={() => { setOpenAddAudience(true) }} label={'Add Audience'} accessGranted={params.eventObjPermission?.edit}/>
                                </Grid>
                            </Grid>
                        </Box>) : <span></span>
                    }
                    <Container style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '10px' }}>
                            <TableContainer sx={{ maxHeight: '100vh' }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead >
                                        <TableRow>
                                            <StyledTableCell
                                                key={'select'}
                                                align='center'
                                                style={{ minWidth: 100 }}
                                            >
                                                <Checkbox style={{ backgroundColor: 'white' }} disabled={!isEditMode} checked={(tempRemoveAudience?.length === savedEvent?.audiance?.length) ? true : false} onChange={() => { (tempRemoveAudience?.length === savedEvent?.audiance?.length) ? setTempRemoveAudience([]) : setTempRemoveAudience([...savedEvent?.audiance.map(user => { return user._id })]) }} />
                                            </StyledTableCell>
                                            {columns.map((column) => (
                                                column.id !== 'status' &&
                                                column.id !== 'reset' &&
                                                <StyledTableCell
                                                    key={column.id}
                                                    align='center'
                                                    style={{ minWidth: column.minWidth }}
                                                >
                                                    {column.label}
                                                </StyledTableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {savedEvent?.audiance
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row) => {
                                                return (
                                                    <TableRow role="checkbox" tabIndex={-1} key={row._id}>
                                                        <TableCell
                                                            key={row._id}
                                                            align='center'
                                                            style={{ minWidth: 100 }}>
                                                            <Checkbox style={{ backgroundColor: 'white' }} disabled={!isEditMode} checked={(tempRemoveAudience?.findIndex(Id => Id === row._id) >= 0) ? true : false} onChange={() => { (tempRemoveAudience?.findIndex(Id => Id === row._id) >= 0) ? setTempRemoveAudience([...tempRemoveAudience.filter(id => id !== row._id)]) : setTempRemoveAudience([...tempRemoveAudience, row._id]) }} />
                                                        </TableCell>
                                                        {columns.map((column) => {
                                                            return (
                                                                column?.id !== 'status' &&
                                                                column?.id !== 'reset' &&
                                                                <TableCell key={column?.id} align='center'>
                                                                    {
                                                                        column?.id === 'phone'
                                                                            ? column?.format(row['phone1']) :
                                                                            column?.id === 'email'
                                                                                ? column?.format(row['email']) :
                                                                                column?.id === 'name'
                                                                                    ? row['name'] :
                                                                                    column?.id === 'profile'
                                                                                        ? row['profile']?.name : ''
                                                                    }
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={savedEvent?.audiance.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Container>

                    <AuditFields record={savedEvent} />

                    <Dialog
                        open={confirmCancel}
                        onClose={() => { setConfirmCancel(false) }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Confirm cancel ?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                All unsaved changes will be lost!
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { setConfirmCancel(false) }} >Cancel</Button>
                            <Button onClick={() => { history.goBack() || window.close() }} color="error">
                                Okay!
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={confirmDelete}
                        onClose={() => { setConfirmDelete(false) }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Delete event ?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                You are about to delete the event!
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { setConfirmDelete(false) }} >Cancel</Button>
                            <Button onClick={() => { handleDeleteEvent() }} color="error">
                                Okay!
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Modal
                        open={openAddAudience}
                        onClose={() => { setOpenAddAudience(false) }}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            bgcolor: 'background.paper',
                            p: 4,
                        }}>
                            <AddAudience onCancel={() => { setOpenAddAudience(false) }} onAddAudience={handleAddAudience} allActiveUsers={allActiveUsers} />
                        </Box>
                    </Modal>
                </span>}

                <Toaster />

            </React.Fragment>
        )
    }
}

export default EventDetail