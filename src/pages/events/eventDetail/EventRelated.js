/* eslint-disable react/jsx-pascal-case */
import React from 'react'
import axios, { post, patch } from 'axios';
import toast, { Toaster } from "react-hot-toast";
import { useHistory } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import { Container, Typography, Grid, Box, Link } from '@material-ui/core';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useStyles } from '../EventsStyles';
import Loading from '../../../components/loading/Loading';
import Custom_Button from '../../../components/reusableElements/Custom_Button';

const EventRelated = (params) => {
  const history = useHistory();
  const classes = useStyles();
  let unmounted = false;

  let currentUser = JSON.parse(localStorage.getItem('userDetail'));

  const url = `${process.env.REACT_APP_SERVER}/update-file/event`;

  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  }

  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [isPageLoading, setisPageLoading] = React.useState(false);

  let uploadRef = React.createRef();


  const downloadAttachment = async () => {
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/get-file/event`, {
      params: JSON.stringify(params?.savedEvent?.attachmant)
    })
      .then((res) => {
        const linkSource = `data:${params?.savedEvent?.attachmant?.mimetype};base64,${res.data}`;
        const downloadLink = document.createElement("a");
        const fileName = params?.savedEvent?.attachmant?.originalname;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
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
      })
      .finally(() => {
        return function () {
          unmounted = true;
          source.cancel("Cancelling in cleanup");
        };
      });
  }

  const handleDeleteAttachment = async () => {
    setConfirmDelete(false)
    setisPageLoading(true);
    console.log('Entered');
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.delete(`${process.env.REACT_APP_SERVER}/delete-file/event/${params.savedEvent?._id}`)
      .then((response) => {
        if (response.status === 200) {
          setisPageLoading(false);
          console.log('Returned');
          params.savedEvent.attachmant = {}
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
            toast.error(error.response.data)
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

  const handleUploadAttachment = (file) => {
    console.log(file)
    setisPageLoading(true);
    if ((file?.size / (1024 * 1024)).toFixed(2) > 10) {
      return toast.error('File size can not be more than 10MB')
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("eventId", params.savedEvent?._id);
    const source = axios.CancelToken.source();
    patch(url, formData, config)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log(response.data)
          params.onUpdateFile();
        }
        else {
          toast.error('Update failed')
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
          Attachment :
        </Typography>
        <Container style={{ paddingTop: 30, backgroundColor: 'white' }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box style={{ marginBottom: 20 }}>
                <Link onClick={() => { downloadAttachment() }} underline="always" style={{ color: 'inherit', cursor: 'pointer' }}>{params?.savedEvent?.attachmant?.originalname}</Link>
                {params?.savedEvent?.attachmant?.originalname && <Custom_Button variant='contained' color='error' label={'Delete'} accessGranted={currentUser._id === params?.savedEvent?.owner?._id || params.eventObjPermission.delete} onClick={() => { setConfirmDelete(true) }} style={{ float: 'right', bottom: 25 }}/>}
                { !params?.savedEvent?.attachmant?.originalname && <Custom_Button label={'Upload'} accessGranted={currentUser._id === params?.savedEvent?.owner?._id || params.eventObjPermission.edit}
                onClick={() => {uploadRef.click()}} 
                   variant='contained' color='inherit' style={{ left: '42%' }}/>}
                <input type='file' accept='application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
                                        text/plain, application/pdf, image/*' ref={ele => uploadRef = ele} onChange={(event) => { handleUploadAttachment(event.target.files[0]) }} name='file' id='file-upoad' style={{ display: 'none' }} />
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Dialog
          open={confirmDelete}
          onClose={() => { setConfirmDelete(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete the attachment?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Attachment sent through email can not be reverted!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setConfirmDelete(false) }} >Cancel</Button>
            <Button onClick={() => { handleDeleteAttachment() }} color="warning">
              Okay!
            </Button>
          </DialogActions>
        </Dialog>

        <Toaster />

      </React.Fragment>
    )
  }
}

export default EventRelated