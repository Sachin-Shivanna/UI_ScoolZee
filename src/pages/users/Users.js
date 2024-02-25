/* eslint-disable react/jsx-pascal-case */
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import exportFromJSON from 'export-from-json'
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Switch, Typography } from '@material-ui/core';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { columns } from '../../constants/UsersTableHeaders';
import { StyledTableCell, useStyles } from './UsersStyle';
import axios, { post } from 'axios';
import Loading from '../../components/loading/Loading';
import Custom_Button from '../../components/reusableElements/Custom_Button';
import { NavigationBarItems } from '../../constants/NavigationBarItems';
import { breadcrumbsContext } from '../../components/context/Context';

const Users = () => {
  const classes = useStyles();
  const history = useHistory();

  let unmounted = false;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isPageLoading, setisPageLoading] = React.useState(false);
  const [isPageLoadingFailed, setisPageLoadingFailed] = React.useState(false);
  const [allUsers, setAllUsers] = React.useState([]);
  const [confirmPasswordReset, setConfirmPasswordReset] = React.useState(false);
  const [userToReset, setUserToReset] = React.useState({});
  const [requestSent, setRequestSent] = React.useState(false);
  const [userObjPermission, setUserObjPermission] = React.useState({});
  const [breadcrumbsList, setBreadcrumbsList] = React.useContext(breadcrumbsContext);

  const url = `${process.env.REACT_APP_SERVER}/upload-users/user`;

  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  }

  useEffect(() => {
    setBreadcrumbsList([
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href={NavigationBarItems.find(nav => nav.route === history.location.pathname)?.route}
      >
        <span style={{ margin: '5px 5px 0px 0px', fontSize: 'inherit' }} fontSize="inherit">
          {NavigationBarItems.find(nav => nav.route === history.location.pathname)?.icon}
        </span>
        {NavigationBarItems.find(nav => nav.route === history.location.pathname)?.label}
      </Link>,
    ]);
    setAllUsers([]);
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    setisPageLoading(true);
    let usersList = [];
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/users-info/user`)
      .then((response) => {
        console.log(response.data);
        setUserObjPermission(response.data?.accessDefination);
        response.data?.users.forEach(user => {
          usersList.push(createData(user._id, user.name, user.profile?.name, user.email, user.phone1, user.active, 'Reset'));
        });
        setAllUsers(usersList)
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function createData(id, name, profile, email, phone, status, resetIcon) {
    console.log(status)
    return { id, name, profile, email, phone, status, resetIcon };
  }

  const handlePasswordReset = async () => {
    unmounted = false;
    setRequestSent(true);
    const source = axios.CancelToken.source();
    await axios.patch(`${process.env.REACT_APP_SERVER}/users-password-reset/user`, {
      userId: userToReset.id
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          toast.success('Reset request sent')
        }
        else {
          toast.error('Failed')
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
        setUserToReset({});
        setConfirmPasswordReset(false);
        setRequestSent(false);
        return function () {
          unmounted = true;
          source.cancel("Cancelling in cleanup");
        };
      });
  }

  const handleInitiatePasswordReset = (user) => {
    setUserToReset(user);
    setConfirmPasswordReset(true);
  }

  const handleUploadAttachment = (file) => {
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.fileName);
    const source = axios.CancelToken.source();
    post(url, formData, config)
      .then((response) => {
        if (response.status === 200) {
          if (response.data?.length > 0) {
            let failedData = [...response.data];
            let fileName = 'Failed Records';
            let exportType = exportFromJSON.types.xls
            console.log(failedData);
            exportFromJSON({ data: failedData, fileName, exportType })
          }
          else {
            toast.success('All users inserted successfully')
          }
        }
        else {
          toast.error('Update failed')
        }
      })
      .catch((error) => {
        console.log(error)
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

  const handleStatusChange = async (userId) => {
    if (JSON.parse(localStorage.getItem("userDetail"))._id === userId) {
      toast.error('Can not deactivate your own account.');
      return;
    }
    setisPageLoading(true);
    let usersList = [];
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.patch(`${process.env.REACT_APP_SERVER}/users-status-update/user`, {
      userId
    })
      .then((response) => {
        getAllUsers();
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

        {JSON.parse(localStorage.getItem('userDetail')).profile?.name === 'Admin' ?
          (<Box component="span" className={classes.hideButtons}>
            <Grid container spacing={5}>
              <Grid xs={6} md={6} justifyContent='flex-end' className={classes.gridElement}>
                {/* <Button variant='contained' size="medium" onClick={() => { history.push(`users/add-user`) }}>New</Button> */}
                <Custom_Button variant='contained' size="medium" label={"New"} accessGranted={userObjPermission.create} onClick={() => { history.push(`users/add-user`, { userObjPermission }) }} />
              </Grid>
              <Grid xs={6} md={6} justifyContent='flex-end' className={classes.gridElement}>
                <Button style={{ backgroundColor: '#101F33' }} variant='text' size="medium" onClick={() => { document.getElementById('file-upoad').click() }}><FileUploadIcon style={{ color: 'white' }} /></Button>
                <input type='file' accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(event) => { handleUploadAttachment(event.target.files[0]) }} name='file' id='file-upoad' style={{ display: 'none' }} />
              </Grid>
            </Grid>
          </Box>) : <span></span>
        }
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '10px' }}>
          <TableContainer sx={{ maxHeight: '100vh' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead >
                <TableRow>
                  {columns.map((column) => (
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
                {allUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          console.log(row)
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : column.format && typeof value === 'boolean'
                                  ? <Switch onChange={() => { handleStatusChange(row.id) }} checked={value} />
                                  : column.id === 'reset'
                                    ?
                                    <Button disabled={row.profile !== 'Faculty' && row.profile !== 'Admin'} onClick={() => { handleInitiatePasswordReset(row) }}>
                                      <LockResetRoundedIcon />
                                    </Button>
                                    : column.id === 'name'
                                      ? <Link onClick={() => { history.push(`users/user-details/${row.id}`) }} style={{ cursor: 'pointer', color: 'inherit' }} underline="always" >{value}</Link> : value}
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
            count={allUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
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
      </React.Fragment>
    )
  }
}

export default Users;