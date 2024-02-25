import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Button, TextField, InputAdornment, Typography, Dialog } from '@material-ui/core';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Grid from '@mui/material/Grid';
import { Autocomplete } from '@mui/material';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import toast, { Toaster } from 'react-hot-toast';

import { monthsObject } from '../../../constants/MonthsFilterList';
import { useStyles, StyledTableCell, HtmlTooltip } from './EnrolmentsStyle';
import { useHistory } from 'react-router-dom';
import { enrolmentHeader } from '../../../constants/EnrolmentTable';
import Loading from '../../../components/loading/Loading';
import EnrolmentEditModel from './EnrolmentEditModel';
import EnrolmentHistory from './EnrolmentHistory';
import { OBJECT } from '../../../constants/ObjectNames/documentObjNames';


const Enrolments = () => {
  const classes = useStyles();
  const history = useHistory();
  const todayDate = new Date();

  let unmounted = false;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openYearPicker, setOpenYearPicker] = useState(false)
  const [monthIndexFilter, setMonthIndexFilter] = useState(monthsObject.find(month => month.key === todayDate.getMonth()).key);
  const [yearFilter, setYearFilter] = useState(todayDate);
  const [classFilter, setClassFilter] = useState('None')
  const [allClasses, setAllClasses] = React.useState([]);
  const [classDetails, setClassDetails] = React.useState([])
  const [enrolmentDetails, setEnrolmentDetails] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);
  const [isPageLoading, setisPageLoading] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [enrolmentInAction, setEnrolmentInAction] = React.useState({});
  const [openEditEnrollModat, setOpenEnrollModel] = React.useState(false);
  const [showHistoryPaymentId, setShowHistoryPaymentId] = React.useState('');
  const [enrolementObjPermission, setEnrolmentobjPermission] = React.useState({});

  useEffect(() => {
    console.log(allClasses)
  }, [allClasses])

  useEffect(() => {
    getAllClasses();
    getEnrolmentByFilter();
  }, [])

  useEffect(() => {
    console.log(enrolmentInAction)
  }, [enrolmentInAction])

  const getEnrolmentByFilter = async () => {
    unmounted = false;
    setisPageLoading(true);
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/enrolment-info/${OBJECT.ENROLMENT}/${classFilter}/${monthIndexFilter}/${new Date(yearFilter).getFullYear()}`)
      .then((response) => {
        if (response.status === 200) {
          setEnrolmentobjPermission(response.data?.accessDefination);
          setisPageLoading(false)
          console.log(response.data)
          setEnrolmentDetails(response.data?.enrolementDetails)
          setTableData(response.data?.enrolementDetails);
          setClassDetails(response.data?.classDetails);
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
      })
      .finally(() => {
        return function () {

          unmounted = true;
          source.cancel("Cancelling in cleanup");
        };
      });
  }

  const getAllClasses = async () => {
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/classes-info/${OBJECT.CLASS}`)
      .then((response) => {
        if (response.status === 200) {
          let classData = [];
          console.log(response.data)
          response.data?.classDetails.forEach(classRec => {
            classData.push({ label: classRec.name, id: classRec._id });
          });
          setAllClasses([{ label: 'None', id: 'None' }, ...classData]);
        }
      })
      .catch((error) => {
        if (!unmounted) {
          console.log(error)
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

  const handleResendPaymentLink = async(enrolmentInAction) => {
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.patch(`${process.env.REACT_APP_SERVER}/resend-payment-link/${OBJECT.ASSESSMENT}`, {
      enrolmentId: enrolmentInAction._id,
      paymentLinkId : enrolmentInAction?.payments?.paymentLinkID
  })
  .then((response) => {
    console.log(response)
  })
  .catch((error) => {
    if (!unmounted) {
      console.log(error)
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

  const open = Boolean(anchorEl);
  const handleClick = (event,row) => {
    setEnrolmentInAction(row)
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const handleMonthUpdate = (monthIndex) => {
    setMonthIndexFilter(monthIndex)
  }

  const handleYearUpdate = (date) => {
    setYearFilter(new Date(date))
  }

  const handleSearch = (searchString) => {
    if (searchString?.trim() === '' || searchString?.trim() === null || searchString?.length < 3) {
      setTableData([...enrolmentDetails]);
    }
    else {
      setTableData([...enrolmentDetails?.filter(enrolment => enrolment.student.name?.includes(searchString))]);
    }
  }

  const handleOpenEditEnrollModal = () => {
    setOpenEnrollModel(true)
  }

  const studentDetails = (row) => {
    return (
      <React.Fragment>
        <Box style={{ padding: 5 }}>
          <Typography style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            Class:
          </Typography>
          <Typography style={{ fontSize: '0.875rem' }}>
            <div>{classDetails?.find(classRec => classRec?.students.includes(row?.student?._id))?.className}, {classDetails?.find(classRec => classRec?.students.includes(row?.student?._id))?.classDiv}</div>
          </Typography>
          <Divider />
          <Typography style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            Caregiver:
          </Typography>
          <Typography style={{ fontSize: '0.875rem' }}>
            <div>{row?.student?.caregiver?.name}</div>
            <div>{row?.student?.caregiver?.phone1}</div>
            <div>{row?.student?.caregiver?.email}</div>
          </Typography>
        </Box>
      </React.Fragment>
    )
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
        <Box component="span">
          <Grid container>
            <Grid item xs={6} style={{ justifyContent: 'start' }} className={classes.gridElement}>
              <Box style={{ marginBottom: 20 }}>
                <Autocomplete
                  style={{ width: 400 }}
                  disabled={false}
                  options={allClasses || []}
                  getOptionLabel={(option) => option.label || ''}
                  value={allClasses.find(classRec => classRec.id === classFilter) || { label: 'None', id: 'None' }}
                  isOptionEqualToValue={(option, value) => option === value}
                  onChange={(classRec) => { setClassFilter(allClasses[classRec.target?.dataset?.optionIndex]?.id) }}
                  id="class-auto"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Class'
                      variant="standard"
                      required
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                      }}
                      id={`class`}
                      placeholder="Class"
                    />)}
                />
              </Box>
            </Grid>
            <Grid item xs={6} style={{ justifyContent: 'space-around' }} className={classes.gridElement}>
              <Box>
                <LocalizationProvider style={{ margin: 0, marginLeft: 10 }} dateAdapter={AdapterDateFns}>
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      open={openYearPicker}
                      onOpen={() => setOpenYearPicker(true)}
                      onClose={() => setOpenYearPicker(false)}
                      views={['year']}
                      label='Year'
                      value={yearFilter}
                      inputFormat="yyyy"
                      onChange={(date) => { handleYearUpdate(date) }}
                      inputProps={{
                        style: {
                          padding: 4
                        }
                      }}
                      components={{
                        OpenPickerIcon: CalendarTodayIcon
                      }}
                      renderInput={(params) => (
                        <TextField
                          required
                          id={`year`}
                          onClick={() => { setOpenYearPicker(true) }}
                          placeholder="Year"
                          variant='standard'
                          style={{ width: 150 }}
                          {...params} />)}
                    />
                  </Stack>
                </LocalizationProvider>
              </Box>
              <Box style={{ marginBottom: 20 }}>
                <Autocomplete
                  style={{ width: 200 }}
                  disabled={false}
                  options={monthsObject || []}
                  getOptionLabel={(option) => option.value || ''}
                  value={monthsObject.find(month => month.key === monthIndexFilter)}
                  isOptionEqualToValue={(option, value) => option === value}
                  onChange={(month) => { handleMonthUpdate(monthsObject[month.target?.dataset?.optionIndex].key) }}
                  id="month-auto"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Month'
                      variant="standard"
                      required
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">
                            <CalendarMonthIcon />
                            {params.InputProps.endAdornment}
                          </InputAdornment>
                        ),
                      }}
                      id={`month`}
                      placeholder="Month"
                    />)}
                />
              </Box>
              <Box style={{ paddingTop: 6 }}>
                <Button style={{ borderColor: '#000000de', color: '#000000de' }} variant='outlined' size="medium" onClick={() => { getEnrolmentByFilter() }}>Update</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              onInput={(searchStr) => { handleSearch(searchStr.target.value) }}
              placeholder="Filter By Student Name"
              inputProps={{}}
            />
            <IconButton disableRipple type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon disabled />
            </IconButton>
          </Paper>
        </Box>
        <Box>
          <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '10px' }}>
            <TableContainer sx={{ maxHeight: '100vh' }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead >
                  <TableRow>
                    {enrolmentHeader.map((column) => (
                      <StyledTableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                          {enrolmentHeader.map((column, headerIndex) => {
                            return (
                              <TableCell align={column.align} key={headerIndex + '_' + index}>
                                {(column.id === 'name') ?
                                  <HtmlTooltip key={headerIndex + '_' + index} title={studentDetails(row)} placement="top" arrow classes={{ arrow: classes.tooltipArrow }}>
                                    <span style={{ marginBottom: "20px", cursor: 'pointer' }}>
                                      {row.student?.name}
                                    </span>
                                  </HtmlTooltip>
                                  : (column.id === 'email') ? row.student?.email
                                    : (column.id === 'phone') ? row.student?.phone1
                                      : (column.id === 'status') ? row.payments?.status
                                        : (column.id === 'action') ?
                                          <span key={headerIndex}>
                                            {/* <ActionItems props={row} /> */}
                                            <IconButton key={headerIndex} onClick={(event) => {handleClick(event,row)}} type="button" sx={{ p: '10px' }} aria-label="actions">
                                              <ArrowDropDownIcon />
                                            </IconButton>
                                            <Menu
                                              key={index + '_' + headerIndex}
                                              anchorEl={anchorEl}
                                              id="account-menu"
                                              open={open}
                                              onClose={handleClose}
                                              onClick={handleClose}
                                              PaperProps={{
                                                elevation: 0,
                                                sx: {
                                                  marginTop: -12,
                                                  overflow: 'visible',
                                                  filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.32))',
                                                  mt: 1.5,
                                                  '& .MuiAvatar-root': {
                                                    width: 32,
                                                    height: 32,
                                                    ml: -0.5,
                                                    mr: 1,
                                                  },
                                                  '&:before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 14,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'background.paper',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                  },
                                                },
                                              }}
                                              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                            >
                                              {enrolementObjPermission.edit &&
                                                <span>
                                                  <MenuItem key={index + '_' + headerIndex} onClick={() => { handleOpenEditEnrollModal() }}>
                                                    Edit
                                                  </MenuItem>
                                                  <Divider />
                                                </span>}
                                              {enrolementObjPermission.create &&
                                                <MenuItem disabled = {enrolmentInAction?.payments?.status === 'Complete'} onClick={() => { handleResendPaymentLink(enrolmentInAction) }}>
                                                  Resend Payment Link
                                                </MenuItem>}
                                              <MenuItem onClick={() => { setShowHistoryPaymentId(enrolmentInAction.payments._id) }}>
                                                Track History
                                              </MenuItem>
                                            </Menu>
                                          </span>
                                          : ''

                                }
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={tableData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Paper>
        </Box>

        <Dialog
          classes={{ paper: classes.paper }}
          open={openEditEnrollModat}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <EnrolmentEditModel style={{ width: '100%' }} editEnrolment={enrolmentInAction} handleEditCancel={() => {
            setEnrolmentInAction({})
            setOpenEnrollModel(false)
            getEnrolmentByFilter()
          }} />
        </Dialog>

        <Dialog
          classes={{ paper: classes.paper }}
          open={showHistoryPaymentId !== ''}
          onClose={() => { setShowHistoryPaymentId('') }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <EnrolmentHistory paymentId={showHistoryPaymentId} />
        </Dialog>

        <Toaster />
      </React.Fragment>
    )
  }
}

export default Enrolments