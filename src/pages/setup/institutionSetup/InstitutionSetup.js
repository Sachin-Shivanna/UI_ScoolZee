/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Modal from '@mui/material/Modal';
import { Box, Button, Container, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Paper, Checkbox } from '@material-ui/core';
import NumericInput from 'react-numeric-input';
import Loading from '../../../components/loading/Loading';
import { useStyles } from './InstitutionSetupStyle';
import { useHistory } from 'react-router-dom';
import { OBJECT } from '../../../constants/ObjectNames/documentObjNames';
import Custom_Button from '../../../components/reusableElements/Custom_Button';
import SubscriptionManagement from './subscriptionManagement/SubscriptionManagement';

const InstitutionSetup = () => {
  const classes = useStyles();
  const history = useHistory();

  let unmounted = false;

  const [isPageLoading, setisPageLoading] = useState(false);
  const [isPageLoadingFailed, setisPageLoadingFailed] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [institutionDetails, setInstitutionDetails] = useState({});
  const [invalidList, setInvalidList] = React.useState([]);
  const [institutionObjPermission, setInstitutionObjPermission] = useState({});
  const [subscriptionObjPermission, setSubscriptionObjPermission] = useState({});
  const [openSubscriptionModal, setOpenSubscriptionModal] = useState(false);
  const [enableChangePlanModal, setEnableChangePlanModal] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState({});
  const [productInfo, setProductInfo] = useState({});
  const [invoice, setInvoice] = useState({});
  const [billingAddress, setBillingAddress] = useState({});
  const [updatingPlan, setUpdatingPlan] = useState({});
  const [assessmentGrades, setAssessmentGrades] = React.useState([]);
  const [checkedAvailableGrades, setCheckedAvailableGrades] = React.useState([]);
  const [checkedSelectedGrades, setCheckedSelectedGrades] = React.useState([]);
  const [availableGrades, setAvailableGrades] = React.useState([]);
  const [selectedGrades, setSelectedGrades] = React.useState([]);
  const [addNewGrades, setAddNewGrades] = React.useState(false);
  const [deleteGrades, setDeteteGrade] = React.useState(false);
  const [newGradeName, setNewGradeName] = React.useState('')


  useEffect(() => {
    getInstitutionInfo();
    getBillingDetails();
    getAssessmentGrades()
  }, []);

  useEffect(() => {
    setAvailableGrades([...availableGrades, ...assessmentGrades.filter(grade => grade.active === false)])
    setSelectedGrades([...availableGrades, ...assessmentGrades.filter(grade => grade.active === true)])
  }, [assessmentGrades])

  useEffect(() => {
    let tempList = []

    availableGrades.forEach(grade => {
      if (grade.active) {
        grade.active = false;
        tempList.push(grade)
      }
    });

    tempList?.length > 0 && setAvailableGrades(tempList);

  }, [availableGrades])

  useEffect(() => {
    let tempList = []

    selectedGrades.forEach(grade => {
      if (!grade.active) {
        grade.active = true;
        tempList.push(grade)
      }
    });

    tempList?.length > 0 && setSelectedGrades(tempList);
  }, [selectedGrades])

  const getBillingDetails = async () => {
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/billing-info/${OBJECT.SUBSCRIPTION}`)
      .then((response) => {
        console.log(response.data.billingDetails?.productInfo)
        setProductInfo(response.data.billingDetails?.productInfo);
        setSubscriptionInfo(response.data.billingDetails?.subscriptionInfo);
        setInvoice(response.data.billingDetails?.invoice);
        setBillingAddress(response.data.billingDetails?.billingAddress);
        localStorage.setItem('subscribedProd', response.data?.billingDetails?.productInfo?.name);
        localStorage.setItem('activeSubscription', (response.data?.billingDetails?.subscriptionInfo?.status === 'active') ? 'true' : 'false');
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

  const getAssessmentGrades = async () => {
    unmounted = false;
    const source = axios.CancelToken.source();
    setAssessmentGrades([]);
    await axios.get(`${process.env.REACT_APP_SERVER}/get-assessment-grades/${OBJECT.INSTITUTION_SETTINGS}`)
      .then((assessmentGrades) => {
        console.log(assessmentGrades.data)
        setAssessmentGrades([...assessmentGrades?.data]);
      })
      .catch((error) => {
        if (!unmounted) {
          console.log(error)
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
      })
  }

  const getInstitutionInfo = async () => {
    setisPageLoading(true);
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/institution-info/${OBJECT.INSTITUTION}`)
      .then((response) => {
        console.log(response.data.accessDefination)
        setSubscriptionObjPermission(response.data.subscriptionAccess);
        setInstitutionDetails(response.data.instituteDetails);
        setInstitutionObjPermission(response.data.accessDefination);
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

  const handleInstNameChange = (instName) => {
    setInstitutionDetails({ ...institutionDetails, name: instName.target.value });
  }
  const handleInstEmailChange = (instEmail) => {
    setInstitutionDetails({ ...institutionDetails, email: instEmail.target.value });
  }
  const handleInstPhoneChange = (instPhone) => {
    setInstitutionDetails({ ...institutionDetails, phone: instPhone.target.value });
  }
  const handleInstAddressLine1Change = (addressLine1) => {
    let instAddress = institutionDetails.address;
    instAddress.addressLine1 = addressLine1.target.value;
    setInstitutionDetails({ ...institutionDetails, address: instAddress });
  }
  const handleInstAddressLine2Change = (addressLine2) => {
    let instAddress = institutionDetails.address;
    instAddress.addressLine2 = addressLine2.target.value;
    setInstitutionDetails({ ...institutionDetails, address: instAddress });
  }
  const handleInstCityChange = (city) => {
    let instAddress = institutionDetails.address;
    instAddress.city = city.target.value;
    setInstitutionDetails({ ...institutionDetails, address: instAddress });
  }
  const handleInstDistrictChange = (district) => {
    let instAddress = institutionDetails.address;
    instAddress.district = district.target.value;
    setInstitutionDetails({ ...institutionDetails, address: instAddress });
  }
  const handleInstStateChange = (state) => {
    let instAddress = institutionDetails.address;
    instAddress.state = state.target.value;
    setInstitutionDetails({ ...institutionDetails, address: instAddress });
  }
  const handleInstCountryChange = (country) => {
    let instAddress = institutionDetails.address;
    instAddress.country = country.target.value;
    setInstitutionDetails({ ...institutionDetails, address: instAddress });
  }
  const handleInstZipCodeChange = (zipCode) => {
    let instAddress = institutionDetails.address;
    instAddress.zipCode = zipCode.target.value;
    setInstitutionDetails({ ...institutionDetails, address: instAddress });
  }
  const handleWorkingSessions = (day, sessions) => {

    let filteredWorkingSessions = institutionDetails.workingDays?.filter(element => element.day !== day);
    let tempWorkingSession = [...filteredWorkingSessions, { day, sessions }];
    setInstitutionDetails({ ...institutionDetails, workingDays: tempWorkingSession });

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

    if (!institutionDetails.name) {
      tempInvalidList.push('name');
      isValid = false;
    }
    if (!institutionDetails.phone) {
      tempInvalidList.push('phone');
      isValid = false;
    }
    if (/[a-zA-Z]/g.test(institutionDetails.phone)) {
      tempInvalidList.push('phoneInvalid');
      isValid = false;
    }
    if (institutionDetails.phone?.length !== 10) {
      tempInvalidList.push('phoneInvalid');
      isValid = false;
    }
    if (!institutionDetails.email) {
      tempInvalidList.push('email');
      isValid = false;
    }
    if (!institutionDetails.email.match(/\S+@\S+\.\S+/)) {
      tempInvalidList.push('emailInvalid');
      isValid = false;
    }
    console.log(institutionDetails.address?.addressLine1);
    if (!institutionDetails.address?.addressLine1) {
      tempInvalidList.push('addrLine1');
      isValid = false;
    }
    console.log(institutionDetails.address?.city);
    if (!institutionDetails.address?.city) {
      tempInvalidList.push('city');
      isValid = false;
    }
    console.log(!institutionDetails.address?.district);
    if (!institutionDetails.address?.district) {
      tempInvalidList.push('district');
      isValid = false;
    }
    console.log(institutionDetails.address?.state);
    if (!institutionDetails.address?.state) {
      tempInvalidList.push('state');
      isValid = false;
    }
    console.log(institutionDetails.address?.country);
    if (!institutionDetails.address?.country) {
      tempInvalidList.push('country');
      isValid = false;
    }
    console.log(institutionDetails.address?.zipCode);
    if (!institutionDetails.address?.zipCode) {
      tempInvalidList.push('pinCode');
      isValid = false;
    }
    if (isValid) {
      updateInstitutionDetails();
      updateInstutionSettings();
    }
    else {
      setInvalidList(tempInvalidList);
    }
  }

  const updateInstutionSettings = async () => {
    setisPageLoading(true);
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.patch(`${process.env.REACT_APP_SERVER}/update-assessment-grades/${OBJECT.INSTITUTION_SETTINGS}`, {
      selectedGrades
    })
      .then((instSetting) => {
        getAssessmentGrades();
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setisPageLoading(false);
        return function () {
          unmounted = true;
          source.cancel("Cancelling in cleanup");
        };
      })
  }

  const updateInstitutionDetails = async () => {
    setisPageLoading(true);
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.patch(`${process.env.REACT_APP_SERVER}/institution-update/${OBJECT.INSTITUTION}`, {
      institutionDetails
    })
      .then((response) => {
        setIsEditMode(!isEditMode);
        toast.success("Saved!!");
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
          if (error.request.status === 400) {
            toast.error("Something went wtong! Please try again...");
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

  const handleSubscriptionManagement = async () => {
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.post(`${process.env.REACT_APP_SERVER}/manage-subscription/${OBJECT.SUBSCRIPTION}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        console.log(response.data);
        window.open(`${response.data.url}`, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
      })
      .catch((error) => {

      })
      .finally(() => {
        return function () {
          unmounted = true;
          source.cancel("Cancelling in cleanup");
        };
      });
  }
  const handleUpdatePlan = async () => {
    setisPageLoading(true);
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.patch(`${process.env.REACT_APP_SERVER}/billing-update/${OBJECT.SUBSCRIPTION}`, {
      updatedPrice: updatingPlan.id
    })
      .then((response) => {
        console.log(response.data);
        toast.success("Subscription updated!");
        setEnableChangePlanModal(false);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
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
          if (error.request.status === 400) {
            toast.error("Something went wtong! Please try again...");
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

  const handleScbscriptionActions = (selectedplan) => {
    console.log(selectedplan);
    setUpdatingPlan(selectedplan);
    setEnableChangePlanModal(true);
    //setOpenSubscriptionModal(false)
  }

  const handleAddNewAssessmentGrade = async () => {
    console.log(newGradeName)
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.patch(`${process.env.REACT_APP_SERVER}/add-assessment-grades/${OBJECT.INSTITUTION_SETTINGS}`, {
      assessmentGradeName: newGradeName
    })
      .then((response) => {
        console.log(response)
        setAddNewGrades(false)
        setNewGradeName('')
        getAssessmentGrades();
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setisPageLoading(false);
        return function () {
          unmounted = true;
          source.cancel("Cancelling in cleanup");
        };
      });

  }

  const handleSelectAvailableGrades = () => {
    setSelectedGrades([...selectedGrades, ...availableGrades]);
    setAvailableGrades([]);
    setCheckedAvailableGrades([])
    setCheckedSelectedGrades([])
  }

  const handleSelectCheckedGrades = () => {
    setSelectedGrades([...selectedGrades, ...checkedAvailableGrades]);
    setAvailableGrades([...availableGrades.filter(gd => !checkedAvailableGrades.map(grade => { return grade.value })?.includes(gd.value))])
    setCheckedAvailableGrades([])
    setCheckedSelectedGrades([])
  }

  const handleDeselectCheckedGrades = () => {
    setAvailableGrades([...availableGrades, ...checkedSelectedGrades]);
    setSelectedGrades([...selectedGrades.filter(gd => !checkedSelectedGrades.map(grade => { return grade.value })?.includes(gd.value))])
    setCheckedSelectedGrades([]);
    setCheckedAvailableGrades([])
  }

  const handleDeselectSelectedGrades = () => {
    setAvailableGrades([...availableGrades, ...selectedGrades]);
    setSelectedGrades([]);
    setCheckedAvailableGrades([])
    setCheckedSelectedGrades([])
  }


  const handleOnGradeCheck = (grade) => {
    if (grade.active) {
      if (checkedSelectedGrades?.findIndex(checkedgd => checkedgd.value === grade.value) > -1) {
        setCheckedSelectedGrades([...checkedSelectedGrades?.filter(gd => gd.value !== grade.value)]);
      }
      else {
        setCheckedSelectedGrades([...checkedSelectedGrades, grade]);
      }
    }
    else {
      if (checkedAvailableGrades?.findIndex(checkedgd => checkedgd.value === grade.value) > -1) {
        setCheckedAvailableGrades([...checkedAvailableGrades?.filter(gd => gd.value !== grade.value)]);
      }
      else {
        setCheckedAvailableGrades([...checkedAvailableGrades, grade]);
      }
    }
  }

  const handleGradeDelete = () => {

  }

  const customList = (items) => {
    if (availableGrades.length === 0 && selectedGrades.length === 0) {
      return (
        <Paper style={{ minHeight: 264 }}>
          <Typography className={classes.label} style={{ textAlign: 'center', paddingTop: '30%' }}> No grades added. </Typography>
        </Paper>
      )
    }
    return (
      <React.Fragment>
        <Paper style={{ minHeight: 305, maxHeight: 305, overflow: 'auto' }}>
          <List dense component="div" role="list">
            {items.map((grade, index) => {
              const labelId = `transfer-list-item-${grade}-label`;

              return (
                <ListItem
                  key={index}
                  role="listitem"
                  button
                  disabled={!isEditMode}
                  onClick={() => { handleOnGradeCheck(grade) }}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={checkedAvailableGrades?.findIndex(gd => gd.value === grade.value) > -1 || checkedSelectedGrades?.findIndex(gd => gd.value === grade.value) > -1}
                      tabIndex={-1}
                      disableRipple
                      disabled={!isEditMode}
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={`${grade?.value}`} />
                </ListItem>
              );
            })}
            <ListItem />
          </List>
        </Paper>
      </React.Fragment>)
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
            <Grid container spacing={5} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Grid xs={6} md={6} justifyContent='flex-end' className={classes.gridElement}>
                <Custom_Button variant='contained' size="medium" label={isEditMode ? 'Save' : 'Edit'} accessGranted={institutionObjPermission.edit} onClick={handleButton} />
              </Grid>
              <Grid xs={6} md={6} justifyContent='flex-end' className={classes.gridElement}>
                {/* <Link onClick={() => { history.push("setup/billing-details") }} style={{ cursor: 'pointer' }}>Billing Details</Link> */}

                <Custom_Button style={{ marginRight: 5 }} variant='outlined' color="primary" size="medium" label={'Manage Subscription'} accessGranted={subscriptionObjPermission.read} onClick={() => { setOpenSubscriptionModal(true) }} />
                <Custom_Button variant='outlined' color="secondary" size="medium" label={'Billing Details'} accessGranted={subscriptionObjPermission.read} onClick={handleSubscriptionManagement} />
              </Grid>
            </Grid>
          </Box>) : <span></span>
        }

        <Typography className={classes.header}>
          Information :
        </Typography>
        <Container style={{ paddingTop: 30, backgroundColor: 'white', paddingLeft: 45 }}>
          <Grid container spacing={5} className={classes.grid}>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>Institution :</Typography>
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
                value={institutionDetails.name}
                id="name"
                onChange={(name) => { handleInstNameChange(name) }}
                variant="standard"
              />
            </Grid>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>Email :</Typography>
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
                value={institutionDetails.email}
                id="email"
                onChange={(email) => { handleInstEmailChange(email) }}
                aria-describedby="component-error-text"
                variant="standard"
              />
            </Grid>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>Phone :</Typography>
              <TextField
                style={{ flex: 1 }}
                InputProps={{
                  readOnly: !isEditMode,
                  disableUnderline: !isEditMode,
                  className: classes.inputDesign
                }}
                value={institutionDetails.phone}
                id="phone"
                helperText={invalidList.includes('phone') ? "Phone Number is required" : invalidList.includes('phoneInvalid') ? 'Phone Number is invalid' : ''}
                error={invalidList.includes('phone') || invalidList.includes('phoneInvalid')}
                onFocus={() => { setInvalidList(invalidList.filter(value => !value.includes('phone'))) }}
                onChange={(phone) => { handleInstPhoneChange(phone) }}
                aria-describedby="component-error-text"
                variant="standard"
              />
            </Grid>
          </Grid>
        </Container>
        <Typography className={classes.header}>
          Address :
        </Typography>
        <Container style={{ paddingTop: 30, backgroundColor: 'white', paddingLeft: 45 }}>
          <Grid container spacing={5} className={classes.grid}>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={[classes.label, classes.addressLine]}>Address Line 1 :</Typography>
              <TextField
                style={{ flex: 1 }}
                InputProps={{
                  readOnly: !isEditMode,
                  disableUnderline: !isEditMode,
                  className: classes.inputDesign
                }}
                value={institutionDetails.address?.addressLine1}
                id="addressLine1"
                helperText={!invalidList.includes('addrLine1') ? '' : "Address Line 1 is required"}
                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'addrLine1')) }}
                error={invalidList.includes('addrLine1')}
                onChange={(addressLine1) => { handleInstAddressLine1Change(addressLine1) }}
                variant="standard"
              />
            </Grid>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={[classes.label, classes.addressLine]}>Address Line 2 :</Typography>
              <TextField
                style={{ flex: 1 }}
                InputProps={{
                  readOnly: !isEditMode,
                  disableUnderline: !isEditMode,
                  className: classes.inputDesign
                }}
                value={institutionDetails.address?.addressLine2}
                id="addressLine2"
                onChange={(addressLine2) => { handleInstAddressLine2Change(addressLine2) }}
                variant="standard"
              />
            </Grid>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>City :</Typography>
              <TextField
                style={{ flex: 1 }}
                InputProps={{
                  readOnly: !isEditMode,
                  disableUnderline: !isEditMode,
                  className: classes.inputDesign
                }}
                value={institutionDetails.address?.city}
                id="city"
                helperText={!invalidList.includes('city') ? '' : "City is required"}
                error={invalidList.includes('city')}
                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'city')) }}
                onChange={(city) => { handleInstCityChange(city) }}
                variant="standard"
              />
            </Grid>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>District :</Typography>
              <TextField
                style={{ flex: 1 }}
                InputProps={{
                  readOnly: !isEditMode,
                  disableUnderline: !isEditMode,
                  className: classes.inputDesign
                }}
                value={institutionDetails.address?.district}
                helperText={!invalidList.includes('district') ? '' : "District is required"}
                error={invalidList.includes('district')}
                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'district')) }}
                id="district"
                onChange={(district) => { handleInstDistrictChange(district) }}
                variant="standard"
              />
            </Grid>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>State :</Typography>
              <TextField
                style={{ flex: 1 }}
                InputProps={{
                  readOnly: !isEditMode,
                  disableUnderline: !isEditMode,
                  className: classes.inputDesign
                }}
                value={institutionDetails.address?.state}
                id="state"
                helperText={!invalidList.includes('state') ? '' : "State is required"}
                error={invalidList.includes('state')}
                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'state')) }}
                onChange={(state) => { handleInstStateChange(state) }}
                variant="standard"
              />
            </Grid>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>Country :</Typography>
              <TextField
                style={{ flex: 1 }}
                InputProps={{
                  readOnly: !isEditMode,
                  disableUnderline: !isEditMode,
                  className: classes.inputDesign
                }}
                value={institutionDetails.address?.country}
                id="country"
                helperText={!invalidList.includes('country') ? '' : "Country is required"}
                error={invalidList.includes('country')}
                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'country')) }}
                onChange={(country) => { handleInstCountryChange(country) }}
                variant="standard"
              />
            </Grid>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>PIN Code :</Typography>
              <TextField
                style={{ flex: 1 }}
                InputProps={{
                  readOnly: !isEditMode,
                  disableUnderline: !isEditMode,
                  className: classes.inputDesign
                }}
                value={institutionDetails.address?.zipCode}
                id="zipCode"
                helperText={!invalidList.includes('pinCode') ? '' : "Pin Code is required"}
                error={invalidList.includes('pinCode')}
                onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'pinCode')) }}
                onChange={(zipCode) => { handleInstZipCodeChange(zipCode) }}
                variant="standard"
              />
            </Grid>
          </Grid>
        </Container>
        <Typography className={classes.header}>
          Course sessions per day :
        </Typography>
        <Container style={{ paddingTop: 30, backgroundColor: 'white', paddingLeft: 45 }}>
          <Grid container spacing={5} className={classes.grid}>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>Monday :</Typography>
              <NumericInput readOnly={!isEditMode} min={0} max={10} onChange={(session) => { handleWorkingSessions('Monday', session) }} value={institutionDetails.workingDays?.find(element => element.day === 'Monday')?.sessions} />
            </Grid>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>Tuesday :</Typography>
              <NumericInput readOnly={!isEditMode} min={0} max={10} onChange={(session) => { handleWorkingSessions('Tuesday', session) }} value={institutionDetails.workingDays?.find(element => element.day === 'Tuesday')?.sessions} />
            </Grid>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>Wednesday :</Typography>
              <NumericInput readOnly={!isEditMode} min={0} max={10} onChange={(session) => { handleWorkingSessions('Wednesday', session) }} value={institutionDetails.workingDays?.find(element => element.day === 'Wednesday')?.sessions} />
            </Grid>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>Thursday :</Typography>
              <NumericInput readOnly={!isEditMode} min={0} max={10} onChange={(session) => { handleWorkingSessions('Thursday', session) }} value={institutionDetails.workingDays?.find(element => element.day === 'Thursday')?.sessions} />
            </Grid>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>Friday :</Typography>
              <NumericInput readOnly={!isEditMode} min={0} max={10} onChange={(session) => { handleWorkingSessions('Friday', session) }} value={institutionDetails.workingDays?.find(element => element.day === 'Friday')?.sessions} />
            </Grid>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>Saturday :</Typography>
              <NumericInput readOnly={!isEditMode} min={0} max={10} onChange={(session) => { handleWorkingSessions('Saturday', session) }} value={institutionDetails.workingDays?.find(element => element.day === 'Saturday')?.sessions} />
            </Grid>
            <Grid xs={12} md={6} className={classes.gridElement}>
              <Typography className={classes.label}>Sunday :</Typography>
              <NumericInput readOnly={!isEditMode} min={0} max={10} onChange={(session) => { handleWorkingSessions('Sunday', session) }} value={institutionDetails.workingDays?.find(element => element.day === 'Sunday')?.sessions} />
            </Grid>
          </Grid>
        </Container>
        <Typography className={classes.header}>
          Assessment Grades :
        </Typography>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <Box style={{ padding: 5 }}>
                  <Button variant='outlined' style={{ width: '45%' }} color='inherit' size="small" disabled={!isEditMode} onClick={() => { setAddNewGrades(true) }}><AddCircleOutlineIcon style={{ paddingRight: 3 }} />Add</Button>
                  <Button variant='outlined' style={{ width: '45%', float: 'right' }} color='inherit' size="small" disabled={checkedAvailableGrades?.length === 0 && !isEditMode} onClick={() => { setDeteteGrade(true) }}><DeleteOutlineIcon style={{ paddingRight: 3 }} />Delete</Button>
                </Box>
                <Typography style={{ backgroundColor: '#e9e9e9', color: 'black' }} className={classes.header}>
                  Available Grades :
                </Typography>
                {customList(availableGrades)}
              </Grid>
              <Grid item xs={2} style={{ paddingTop: 47 }}>
                <Grid container direction="column" alignItems="center" style={{ paddingTop: '75px' }}>
                  <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleSelectAvailableGrades}
                    disabled={availableGrades.length === 0 || !isEditMode}
                    aria-label="move all right"
                  >
                    ≫
                  </Button>
                  <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleSelectCheckedGrades}
                    disabled={checkedAvailableGrades.length === 0 || !isEditMode}
                    aria-label="move selected right"
                  >
                    &gt;
                  </Button>
                  <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleDeselectCheckedGrades}
                    disabled={checkedSelectedGrades.length === 0 || !isEditMode}
                    aria-label="move selected left"
                  >
                    &lt;
                  </Button>
                  <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleDeselectSelectedGrades}
                    disabled={selectedGrades.length === 0 || !isEditMode}
                    aria-label="move all left"
                  >
                    ≪
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={5} style={{ paddingTop: 47 }}>
                <Typography style={{ backgroundColor: '#e9e9e9', color: 'black' }} className={classes.header}>
                  Selected Grades :
                </Typography>
                {customList(selectedGrades)}
              </Grid>
              <Grid>

              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            {/************Empty Grid*************/}
          </Grid>
        </Grid>
        <Modal
          open={openSubscriptionModal}
          onClose={() => { setOpenSubscriptionModal(false) }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={classes.modalDesign}>
            <SubscriptionManagement onCancel={(resp) => { setOpenSubscriptionModal(resp) }} onActions={handleScbscriptionActions} currentProduct={productInfo.name} />
          </Box>
        </Modal>

        <Dialog
          open={enableChangePlanModal}
          onClose={() => { setEnableChangePlanModal(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Change in subscription plan!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure of changing to <span style={{ fontWeight: 'bold' }}>{updatingPlan.product?.name}</span> plan?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setUpdatingPlan({});
              setEnableChangePlanModal(false)
            }
            }>Close</Button>
            <Button onClick={handleUpdatePlan} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Toaster />
        <Dialog open={addNewGrades} onClose={() => {
          setNewGradeName('')
          setAddNewGrades(false)
        }}>
          <DialogTitle>New Assessment Grade</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the Grade Name.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Grade :"
              type="string"
              fullWidth
              value={newGradeName}
              onChange={(name) => {
                setNewGradeName(name.target.value)
              }}
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setAddNewGrades(false)
              }}>Cancel</Button>
            <Button
              variant='contained'
              style={{ backgroundColor: '#101F33', color: 'white' }}
              onClick={() => {
                handleAddNewAssessmentGrade()
              }}>
              Add Grade
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={deleteGrades}
          onClose={() => { setDeteteGrade(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete Selected Grades?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {checkedAvailableGrades.map(grade => { return grade.value })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setDeteteGrade(false) }} autoFocus>Cancel</Button>
            <Button onClick={() => { handleGradeDelete() }}>
              Okay!
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default InstitutionSetup