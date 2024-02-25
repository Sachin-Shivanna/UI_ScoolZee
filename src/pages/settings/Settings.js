import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Link, TextField, Typography, Checkbox } from '@material-ui/core';
import toast, { Toaster } from "react-hot-toast";
import { useStyles } from './SettingsStyle';
import { useHistory } from 'react-router-dom';

const Settings = (props) => {
  const history = useHistory();
  const classes = useStyles();

  let unmounted = false;

  const [isEditMode, setIsEditMode] = useState(false)
  const [invalidList, setInvalidList] = React.useState([]);
  const [enableCollection, setEnableCollection] = React.useState(false);
  const [showStopCollectionMsg, setShowStopCollectionMsg] = useState(false)
  const [bankDetails, setBankDetails] = React.useState({
    ifscCode: '',
    accountNumber: '',
    cfmAccountNumber: '',
    beneficiary: ''
  });

  useEffect(() => {
    getinstitutionDetails();
  }, [])

  const getinstitutionDetails = async () => {
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/inst-settings-info/institution-setting`)
      .then((response) => {
        console.log(response.data);
        let orgSettings = response.data
        let { linkedAccountDetails } = response.data;
        setEnableCollection(orgSettings?.collectDigiFees || false);
        setBankDetails({
          ifscCode: linkedAccountDetails.ifscCode,
          accountNumber: linkedAccountDetails.accountNumber,
          cfmAccountNumber: linkedAccountDetails.accountNumber,
          beneficiary: linkedAccountDetails.beneficiary
        })

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

  const clearBankDetails = () => {
    setBankDetails({
      ifscCode: '',
      accountNumber: '',
      cfmAccountNumber: '',
      beneficiary: ''
    });
    setInvalidList([]);
    setShowStopCollectionMsg(false);
    setEnableCollection(!enableCollection)
  }

  const validateBankDetails = () => {
    let isValid = true;
    let tempInvalidList = [];
    if (enableCollection && bankDetails.ifscCode?.trim() === '') {
      tempInvalidList.push('ifsc')
      isValid = false;
    }
    if (enableCollection && bankDetails.ifscCode?.trim()?.length !== 11) {
      tempInvalidList.push('invalidIfsc')
      isValid = false;
    }
    if (enableCollection && bankDetails.accountNumber?.trim() === '') {
      tempInvalidList.push('accNum')
      isValid = false;
    }
    if (enableCollection && bankDetails.cfmAccountNumber?.trim() === '') {
      tempInvalidList.push('cfmAccNum')
      isValid = false;
    }
    if (enableCollection && (bankDetails.cfmAccountNumber?.trim() !== bankDetails.accountNumber?.trim())) {
      tempInvalidList.push('unMatchAcc')
      isValid = false;
    }
    if (enableCollection && bankDetails.beneficiary?.trim() === '') {
      tempInvalidList.push('benfName')
      isValid = false;
    }
    if (!isValid) {
      setInvalidList([...tempInvalidList]);
      return
    }
    saveSetting();
  }

  const saveSetting = async () => {
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.post(`${process.env.REACT_APP_SERVER}/add-institution-settings/institution-setting`, {
      enableCollection,
      bankDetails
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          toast.success(response.data)
          setIsEditMode(false);
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
        return function () {
          unmounted = true;
          source.cancel("Cancelling in cleanup");
        };
      });
  }

  return (
    <React.Fragment>
      {JSON.parse(localStorage.getItem('userDetail'))?.profile?.name === 'Admin' ?
        (<Box component="span" className={classes.hideButtons}>
          <Grid container spacing={5}>
            <Grid xs={6} md={6} justifyContent='flex-end' className={classes.gridElement}>
              <Button variant='contained' size="medium" onClick={() => { (isEditMode === true) ? validateBankDetails() : setIsEditMode(!isEditMode) }}>{isEditMode ? 'Save' : 'Edit'}</Button>
            </Grid>
            <Grid xs={6} md={6} justifyContent='flex-start' className={classes.gridElement}>
              <Button variant='contained' size="medium" onClick={() => { props.onClose() }}>Cancel</Button>
            </Grid>
          </Grid>
        </Box>) : <span></span>
      }
      <Typography className={classes.header}>
        Settings :
      </Typography>
      <Container style={{ paddingTop: 30, backgroundColor: 'white' }}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Box style={{ marginBottom: 20 }}>
              <Typography className={classes.label}>Enable Fees Collection :
                <Checkbox
                  checked={enableCollection}
                  onChange={() => { enableCollection === false ? setEnableCollection(!enableCollection) : setShowStopCollectionMsg(true) }}
                  disabled={localStorage.getItem('subscribedProd') === 'Basic' || !isEditMode}
                />
              </Typography>
            </Box>
            {enableCollection &&
              <Box>
                <Typography style={{ fontWeight: 800 }} className={classes.label}>Bank Account Details : </Typography>
                <Box style={{ marginLeft: 10 }}>
                  <div className={classes.rowColumn}>
                    <Typography style={{ padding: 10, width: 240 }} className={classes.label}>IFSC Code : </Typography>
                    <TextField
                      variant={isEditMode ? 'outlined' : 'standard'}
                      size='small'
                      style={{ outline: 'none', width: 400, paddingTop : isEditMode ? 3 : 10 }}
                      placeholder={isEditMode ? `IFSC Code` : ''}
                      helperText={invalidList.includes('ifsc') ? "IFSC Code is required" : invalidList.includes('invalidIfsc') ? 'IFSC code must be 11 characters' : ''}
                      error={invalidList.includes('ifsc') || invalidList.includes('invalidIfsc')}
                      onFocus={() => { 
                        setInvalidList(invalidList.filter(value => value !== 'ifsc'))
                        setInvalidList(invalidList.filter(value => value !== 'invalidIfsc'))
                       }}
                      value={bankDetails.ifscCode}
                      id="ifscCode"
                      InputProps={{
                        readOnly: !isEditMode,
                        disableUnderline: !isEditMode,
                        className: classes.inputDesign
                      }}
                      onChange={(ifsc) => { setBankDetails({ ...bankDetails, ifscCode: ifsc.target.value }) }} />
                  </div>
                  <div className={classes.rowColumn}>
                    <Typography style={{ padding: 10, width: 240 }} className={classes.label}>Account Number : </Typography>
                    <TextField
                      variant={isEditMode ? 'outlined' : 'standard'}
                      size='small'
                      type='password'
                      style={{ outline: 'none', width: 400,paddingTop : isEditMode ? 3 : 10 }}
                      placeholder={isEditMode ? `Account Number` : ''}
                      helperText={!invalidList.includes('accNum') ? '' : "Account Number is required"}
                      error={invalidList.includes('accNum')}
                      onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'accNum')) }}
                      value={bankDetails.accountNumber}
                      id="accNum"
                      InputProps={{
                        readOnly: !isEditMode,
                        disableUnderline: !isEditMode,
                        className: classes.inputDesign
                      }}
                      onChange={(accNum) => { setBankDetails({ ...bankDetails, accountNumber: accNum.target.value }) }} />
                  </div>
                  {isEditMode &&
                    <div className={classes.rowColumn}>
                      <Typography style={{ padding: 10, width: 240 }} className={classes.label}>Confirm Account Number : </Typography>
                      <TextField
                        variant={isEditMode ? 'outlined' : 'standard'}
                        size='small'
                        style={{ outline: 'none', width: 400, paddingTop : isEditMode ? 3 : 10 }}
                        placeholder={isEditMode ? `Account Number` : ''}
                        helperText={invalidList.includes('cfmAccNum') ? "Confirm the Account Number" : invalidList.includes('unMatchAcc') ? 'Account Number does not match' : ''}
                        error={invalidList.includes('cfmAccNum') || invalidList.includes('unMatchAcc')}
                        onFocus={() => { 
                          setInvalidList(invalidList.filter(value => value !== 'cfmAccNum'))
                          setInvalidList(invalidList.filter(value => value !== 'unMatchAcc'))
                         }}
                        value={bankDetails.cfmAccountNumber}
                        id="cfmAccNum"
                        InputProps={{
                          readOnly: !isEditMode,
                          disableUnderline: !isEditMode,
                          className: classes.inputDesign
                        }}
                        onChange={(cfmAccNum) => { setBankDetails({ ...bankDetails, cfmAccountNumber: cfmAccNum.target.value }) }} />
                    </div>}
                  <div className={classes.rowColumn}>
                    <Typography style={{ padding: 10, width: 240 }} className={classes.label}>Beneficiary Name : </Typography>
                    <TextField
                      variant={isEditMode ? 'outlined' : 'standard'}
                      size='small'
                      style={{ outline: 'none', width: 400, paddingTop : isEditMode ? 3 : 10 }}
                      placeholder={isEditMode ? `Beneficiary Name` : ''}
                      helperText={!invalidList.includes('benfName') ? '' : "Beneficiary Name is required"}
                      error={invalidList.includes('benfName')}
                      onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'benfName')) }}
                      value={bankDetails.beneficiary}
                      InputProps={{
                        readOnly: !isEditMode,
                        disableUnderline: !isEditMode,
                        className: classes.inputDesign
                      }}
                      id="benfName"
                      onChange={(beneficiary) => { setBankDetails({ ...bankDetails, beneficiary: beneficiary.target.value }) }} />
                  </div>
                </Box>
              </Box>}
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={showStopCollectionMsg}
        onClose={() => {
          setShowStopCollectionMsg(false)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Confirm!!`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Disabling <span style={{ fontWeight: 'bold' }}>Enable Fees Collection</span> will stop payment link generation and fees collection.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowStopCollectionMsg(false)
            }}>Cancel</Button>
          <Button onClick={clearBankDetails} autoFocus>
            Okay!
          </Button>
        </DialogActions>
      </Dialog>
      <Toaster />
    </React.Fragment>
  )
}

export default Settings