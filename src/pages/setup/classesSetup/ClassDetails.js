/* eslint-disable react/jsx-pascal-case */
import { Box, Button, Container, Link, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from '@material-ui/core';
import Grid from '@mui/material/Grid';
import React, { useState, useEffect, useContext } from 'react'
import { useStyles, StyledCourseTableCell, StyledStudentTableCell } from './ClassesSetupStyle';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import LinearProgress from '@mui/material/LinearProgress';
import toast, { Toaster } from "react-hot-toast";
import queryString from "query-string"
import { Autocomplete, Paper, Switch } from '@mui/material';
import { useHistory } from 'react-router-dom';
import Loading from '../../../components/loading/Loading';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircleIcon from '@mui/icons-material/Circle';
import TablePagination from '@mui/material/TablePagination';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import { columns } from '../../../constants/UsersTableHeaders';
import { courseColumns } from '../../../constants/ClassDetailsCourseTable';
import { loginContext } from '../../../components/context/Context';
import NewEvent from '../../events/newEvent/NewEvent';
import ModifyStudents from './ModifyStudents';
import { AccessDefinition } from '../../../constants/AccessDefinition/AccessDefinition';
import Custom_Button from '../../../components/reusableElements/Custom_Button';



const ClassDetails = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const queryParams = queryString.parse(window.location.search)

  let unmounted = false;

  const currentUserProfile = JSON.parse(localStorage.getItem('userDetail'))?.profile?.name;
  const accessDfn = AccessDefinition.find(definition => definition.route === window.location.pathname);

  const [isEditMode, setIsEditMode] = useState(false);
  const [allowEdit, setAllowEdit] = useState(JSON.parse(localStorage.getItem('userDetail'))?.profile?.name === 'Admin');
  const [allFacultyList, setAllFacultyList] = React.useState([]);
  const [isPageLoading, setisPageLoading] = useState(false);
  const [isPageLoadingFailed, setisPageLoadingFailed] = useState(false);
  const [classDetails, setClassDetails] = useState({});
  const [classDetailsSaved, setClassDetailsSaved] = useState({});
  const [addStudentsEnable, setAddStudentsEnable] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [confirmPasswordReset, setConfirmPasswordReset] = React.useState(false);
  const [requestSent, setRequestSent] = React.useState(false);
  const [userToReset, setUserToReset] = React.useState({});
  const [isLoggedIn, setIsLoggedIn] = useContext(loginContext);
  const [feeStructureList, setFeeStructureList] = React.useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [allStudentsInfo, setAllStudentsInfo] = useState([]);
  const [classObjPermission, setClassObjPermission] = React.useState(props?.classObjPermission);
  const [eventObjPermission, setEventObjPermission] = React.useState(props?.eventObjPermission);

  window.onbeforeunload = () => {
    props.handleRefresh();
  }

  useEffect(() => {
    console.log(props.eventObjPermission)
    setClassDetails({ ...props.classInfo });
    setClassDetailsSaved({ ...props.classInfo })
    getFacultyList();
    getAllFeeStructurs();
    console.log(window.location.pathname)
  }, []);

  const getAllFeeStructurs = async () => {
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/fees-structure-info/fee-structure`)
      .then((response) => {
        console.log(response.data);
        setFeeStructureList([...response.data])
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

  const getFacultyList = async () => {
    setAllFacultyList([])
    setisPageLoading(true);
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/faculty-info/user`)
      .then((response) => {
        console.log(response.data);
        setAllFacultyList(response.data)
      })
      .catch((error) => {
        if (!unmounted) {
          if (error.request.status === 403) {
            setIsLoggedIn(false);
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

  const handleInitiatePasswordReset = (user) => {
    console.log(user)
    setUserToReset(user);
    setConfirmPasswordReset(true);
  }

  const handlePasswordReset = async () => {
    unmounted = false;
    setRequestSent(true);
    const source = axios.CancelToken.source();
    await axios.patch(`${process.env.REACT_APP_SERVER}/users-password-reset/user`, {
      userId: userToReset._id
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          toast.success(response.data)
        }
        else {
          toast.error(response.data)
        }
      })
      .catch((error) => {
        if (!unmounted) {
          if (error.request.status === 403) {
            setIsLoggedIn(false);
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
        setUserToReset({});
        setConfirmPasswordReset(false);
        setRequestSent(false);
        return function () {
          unmounted = true;
          source.cancel("Cancelling in cleanup");
        };
      });
  }

  const handleUpdateLeadFaculty = (index) => {
    let tempClassDetails = classDetails;
    tempClassDetails.divisions.find(div => div._id === queryParams.division).leadInstructor = allFacultyList[index];
    setClassDetails({ ...tempClassDetails });
  }

  const handleSubFacultyUpdate = (subjectId, index) => {
    let tempClassDetails = classDetails;
    tempClassDetails.divisions.find(div => div._id === queryParams.division).courses.find(course => course.subject?._id === subjectId).instructor = allFacultyList[index];
    setClassDetails({ ...tempClassDetails });
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditSave = async () => {
    if (isEditMode) {
      unmounted = false;
      const source = axios.CancelToken.source();
      await axios.patch(`${process.env.REACT_APP_SERVER}/update-class/class`, {
        classDetails,
        divisionId: queryParams.division
      })
        .then((response) => {
          console.log(response);
          history.goBack();
        })
        .catch((error) => {
          if (!unmounted) {
            if (error.request.status === 403) {
              setIsLoggedIn(false);
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
          setUserToReset({});
          setConfirmPasswordReset(false);
          setRequestSent(false);
          return function () {
            unmounted = true;
            source.cancel("Cancelling in cleanup");
          };
        });
    }
    else {

    }
    setIsEditMode(!isEditMode)
  }

  const handleEventSetup = (toOpen) => {
    setAllStudentsInfo([...classDetails?.divisions?.find(div => div._id === queryParams.division)?.students])
    setShowEventModal(toOpen)
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
          <Grid container spacing={1}>
            <Grid item xs={6} md={6} justifyContent='flex-end' style={{ paddingRight: 4 }} className={classes.gridElement}>
              <Custom_Button variant='contained' style={{ marginRight: 5 }} size="medium" onClick={() => { handleEditSave() }} label={isEditMode ? 'Save' : 'Edit'} accessGranted={classObjPermission?.edit} />
            </Grid>
            <Grid item xs={6} md={6} justifyContent='space-between' style={{ paddingLeft: 12 }} className={classes.gridElement}>
              <Custom_Button variant='contained' size="medium" onClick={() => { handleEventSetup(true) }} label={'Add Event'} accessGranted={eventObjPermission?.create} />
              <Button variant='outlined' size="small" style={{ right: '18px' }} onClick={() => { }}>Timetable</Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} style={{ minHeight: 350 }}>
            <Grid item xs={6}>
              <Typography className={classes.header}>
                Information :
              </Typography>
              <Container style={{ paddingTop: 5, backgroundColor: 'white', height: '88%', maxHeight: '100vh' }}>
                <Box container spacing={2} className={classes.grid}>
                  <Box xs={12} md={6} className={classes.gridElement}>
                    <Typography className={classes.label}>Section : <span className={classes.inputDesign}>{classDetails?.divisions?.find(div => div._id === queryParams.division)?.section}</span></Typography>
                  </Box>
                </Box>
                <Grid xs={12} md={6} style={{ maxWidth: '100%' }} className={classes.gridElement}>
                  <Typography style={{ minWidth: 125, marginTop: 10 }} className={classes.label}>Lead Instructor :
                    {
                      (!allowEdit || !isEditMode) && <Link onClick={() => { history.push(`/users/user-details/${allFacultyList.find(faculty => faculty._id === classDetails?.divisions?.find(div => div._id === queryParams.division)?.leadInstructor?._id)?._id}`) }} style={{ cursor: 'pointer', color: 'inherit', marginLeft: 5 }} underline="always" >{allFacultyList.find(faculty => faculty._id === classDetails?.divisions?.find(div => div._id === queryParams.division)?.leadInstructor?._id)?.name || ''}</Link>
                    }
                  </Typography>
                  {allowEdit && isEditMode && <Autocomplete
                    style={{ minWidth: 250 }}
                    disabled={false}
                    options={allFacultyList || []}
                    getOptionLabel={(option) => option.name || ''}
                    value={allFacultyList.find(faculty => faculty._id === classDetails?.divisions?.find(div => div._id === queryParams.division)?.leadInstructor?._id) || ''}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    onChange={(event) => { handleUpdateLeadFaculty(event.target?.dataset?.optionIndex) }}
                    id="disable-close-on-select"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        required
                        fullWidth
                        id={`leadInstructor-${classDetails?.divisions?.find(div => div._id === queryParams.division)?.section}`}
                        placeholder="Name"
                      />)}
                  />}

                </Grid>
                <Grid xs={12} md={6} style={{ maxWidth: '100%' }} className={classes.gridElement}>
                  <Typography className={classes.label}>Fees :</Typography>
                  {(!allowEdit || !isEditMode) &&
                    <Box container spacing={2} className={classes.grid}>
                      <Box xs={12} md={6} style={{ marginTop: 1, marginLeft: 5 }} className={classes.gridElement}>
                        <span className={classes.inputDesign}>{classDetails.feesAmount}</span>
                      </Box>
                    </Box>}
                  {allowEdit && isEditMode && <Autocomplete
                    style={{ width: 350 }}
                    options={feeStructureList || []}
                    disableClearable
                    getOptionLabel={(option) => option.name}
                    value={feeStructureList.find(fee => fee._id === classDetails.feeStructure) || null}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    onChange={(event) => { setClassDetails({ ...classDetails, feeStructure: feeStructureList[event.target?.dataset?.optionIndex]?._id }) }}
                    id="disable-close-on-select"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        required
                        id={`feeStructure`}
                        style={{ paddingLeft: 4 }}
                        placeholder="Fee Structure"
                      />)}
                  />}

                </Grid>

              </Container>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.header}>
                Courses :
              </Typography>
              <TableContainer sx={{ maxHeight: '100vh', backgroundColor: 'white' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {courseColumns.map((column) => (
                        <StyledCourseTableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </StyledCourseTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      classDetails?.divisions?.find(div => div._id === queryParams.division)?.courses?.map((course) => {
                        return (
                          <TableRow role="checkbox" tabIndex={-1} key={course._id}>
                            {
                              courseColumns.map((column) => {
                                return (
                                  <TableCell key={column.id} align={column.align} style={{ padding: 15 }}>
                                    {
                                      column.id === 'subject'
                                        ? course?.subject?.name
                                        : column.id === 'instructor'
                                          ? (allowEdit && isEditMode) ? <Autocomplete
                                            disabled={false}
                                            options={allFacultyList || []}
                                            disableClearable
                                            getOptionLabel={(option) => option.name || ''}
                                            value={course?.instructor || ''}
                                            isOptionEqualToValue={(option, value) => option?._id === course?.instructor?._id}
                                            onChange={(event) => { handleSubFacultyUpdate(course?.subject?._id, event.target?.dataset?.optionIndex); }}
                                            id="disable-close-on-select"
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                variant="outlined"
                                                required
                                                fullWidth
                                                id={`instructor-${course?.instructor?._id}`}
                                                placeholder="Name"
                                              />)}
                                          /> : <Link onClick={() => { history.push(`/users/user-details/${course?.instructor?._id}`) }} style={{ cursor: 'pointer', color: 'inherit' }} underline="always" >{course?.instructor?.name || ''}</Link>
                                          : ''
                                    }
                                  </TableCell>
                                );
                              })
                            }
                          </TableRow>
                        )
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Typography className={classes.header}>
            <Grid container spacing={1}>
              <Grid item xs={6} md={6} justifyContent='space-between' style={{ paddingLeft: 12 }} className={classes.gridElement}>
                Students :
              </Grid>
              <Grid item xs={6} md={6} justifyContent='flex-end' style={{ paddingLeft: 12 }} className={classes.gridElement}>
                {accessDfn.editAccess?.includes(currentUserProfile) && <Button variant='contained' size="small" style={{ right: '18px' }} onClick={() => { setAddStudentsEnable(!addStudentsEnable) }}>Add/Remove</Button>}
              </Grid>
            </Grid>
          </Typography>
          <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '10px' }}>
            <TableContainer sx={{ maxHeight: '100vh' }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead >
                  <TableRow>
                    {columns.map((column) => (
                      column.id !== 'profile' && (column.id === 'reset' && (allFacultyList.find(faculty => faculty._id === classDetails?.divisions?.find(div => div._id === queryParams.division)?.leadInstructor?._id)?._id === JSON.parse(localStorage.getItem('userDetail'))._id
                        || JSON.parse(localStorage.getItem('userDetail'))?.profile?.name === 'Admin') || column.id !== 'reset') && <StyledStudentTableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                        {column.label}
                      </StyledStudentTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classDetails?.divisions?.find(div => div._id === queryParams.division)?.students
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow role="checkbox" tabIndex={-1} key={row.id}>
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              column.id !== 'profile' && <TableCell key={column.id} align={column.align}>
                                {column.id === 'phone'
                                  ? row.phone1
                                  : column.id === 'status'
                                    ? row.active ? <CircleIcon color='success' sx={{ fontSize: 15 }} /> : <CircleIcon color='error' sx={{ fontSize: 15 }} />
                                    : (allFacultyList.find(faculty => faculty._id === classDetails?.divisions?.find(div => div._id === queryParams.division)?.leadInstructor?._id)?._id === JSON.parse(localStorage.getItem('userDetail'))._id
                                      || JSON.parse(localStorage.getItem('userDetail'))?.profile?.name === 'Admin') &&
                                      column.id === 'reset'
                                      ?
                                      <Button onClick={() => { handleInitiatePasswordReset(row) }}>
                                        <LockResetRoundedIcon />
                                      </Button>
                                      : column.id === 'name'
                                        ? <Link onClick={() => { history.push(`/users/user-details/${row._id}`) }} style={{ cursor: 'pointer', color: 'inherit' }} underline="always" >{value}</Link> : value}
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
              count={classDetails?.divisions?.find(div => div._id === queryParams.division)?.students?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
        <Toaster />
        <Dialog
          open={confirmPasswordReset}
          onClose={() => {
            setConfirmPasswordReset(false)
            setUserToReset({})
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
            {`Reset ${userToReset.name}'s password?`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Password reset request will be sent to {userToReset.name}'s email.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={requestSent}
              onClick={() => {
                setConfirmPasswordReset(false)
                setUserToReset({})
              }}>Cancel</Button>
            <Button disabled={requestSent} onClick={handlePasswordReset} autoFocus>
              Okay!
            </Button>
          </DialogActions>
        </Dialog>
        <Modal
          open={showEventModal}
          onClose={() => { handleEventSetup(false) }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box style={{ backgroundColor: 'white', height: '83vh', padding: 20 }} className={classes.modalDesign}>
            <NewEvent hideAudienceCategory={true} hasCancel={true}
              selectedUsers={allStudentsInfo}
              onCancel={() => { handleEventSetup(false) }}
            />
          </Box>
        </Modal>
        <Modal
          open={addStudentsEnable}
          onClose={() => { setAddStudentsEnable(false) }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box style={{ backgroundColor: 'white', height: '73vh' }} className={classes.modalDesign}>
            <ModifyStudents
              classId={queryParams.class}
              divisionId={queryParams.division}
              classDetails={classDetails}
              handleCancel={(reload) => {
                if (reload) {
                  window.location.reload(false);
                }
                setAddStudentsEnable(false)
              }} />
          </Box>
        </Modal>
      </React.Fragment>
    )
  }
}

export default ClassDetails