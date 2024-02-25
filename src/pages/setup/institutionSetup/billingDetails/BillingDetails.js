import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Link, TextField, Tooltip, Typography } from '@material-ui/core';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect, useState, } from 'react';
import { useHistory } from 'react-router-dom';
import Loading from '../../../../components/loading/Loading';
import { useStyles } from './BillingDetailsStyle';
import { Modal } from '@mui/material';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { OBJECT } from '../../../../constants/ObjectNames/documentObjNames';

// const BillingDetails = () => {
//   const classes = useStyles();
//   const history = useHistory();
//   const toolTipMessage = `Download the invoice and activate the subscription to get full access of the Application.`;

//   let unmounted = false;


//   const [isPageLoading, setisPageLoading] = useState(false);
//   const [isPageLoadingFailed, setisPageLoadingFailed] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [subscriptionInfo, setSubscriptionInfo] = useState({});
//   const [productInfo, setProductInfo] = useState({});
//   const [invoice, setInvoice] = useState({});
//   const [billingAddress, setBillingAddress] = useState({});
//   const [openSubscriptionModal, setOpenSubscriptionModal] = useState(false);
//   const [enableChangePlanModal, setEnableChangePlanModal] = useState(false);
//   const [updatingPlan, setUpdatingPlan] = useState({});

//   useEffect(() => {
//     getBillingDetails();
//   }, []);

//   const getBillingDetails = async () => {
//     setisPageLoading(true);
//     unmounted = false;
//     const source = axios.CancelToken.source();
//     await axios.get(`${process.env.REACT_APP_SERVER}/billing-info/subscription`)
//       .then((response) => {
//         setProductInfo(response.data.billingDetails?.productInfo);
//         setSubscriptionInfo(response.data.billingDetails?.subscriptionInfo);
//         setInvoice(response.data.billingDetails?.invoice);
//         setBillingAddress(response.data.billingDetails?.billingAddress);
//         localStorage.setItem('subscribedProd', response.data?.billingDetails?.productInfo?.name);
//         localStorage.setItem('activeSubscription', (response.data?.billingDetails?.subscriptionInfo?.status === 'active') ? 'true' : 'false');
//       })
//       .catch((error) => {
//         if (!unmounted) {
//           if (error.request.status === 403) {
//             localStorage.removeItem('userDetail');
//             localStorage.removeItem('userToken');
//             localStorage.removeItem('activeSubscription');
//             history.replace('/login');
//             history.go(0);
//           }
//         }
//         setisPageLoadingFailed(true);
//       })
//       .finally(() => {
//         setisPageLoading(false);
//         return function () {
//           unmounted = true;
//           source.cancel("Cancelling in cleanup");
//         };
//       });
//   }

//   const handleCloseModal = (step) => {
//     setOpenSubscriptionModal(false);
//     if (step !== 1) {
//       setEnableChangePlanModal(true);
//     }
//   }

//   const handleSubscriptionManagement = async() => {
//     unmounted = false;
//     const source = axios.CancelToken.source();
//     await axios.post(`${process.env.REACT_APP_SERVER}/manage-subscription/${OBJECT.SUBSCRIPTION}`,{
//       headers:{
//         "Content-Type":"application/json"
//       }
//     })
//     .then((response) => {
//       console.log(response.data);
//       window.location.href = response.data?.url;
      
//     })
//     .catch((error) => {
     
//     })
//     .finally(() => {
//       return function () {
//         unmounted = true;
//         source.cancel("Cancelling in cleanup");
//       };
//     });
//   }

//   const handleUpdatePlan = async () => {
//     setisPageLoading(true);
//     unmounted = false;
//     const source = axios.CancelToken.source();
//     await axios.patch(`${process.env.REACT_APP_SERVER}/billing-update/subscription`, {
//       updatedPrice: updatingPlan.id
//     })
//       .then((response) => {
//         console.log(response.data);
//         toast.success("Subscription updated!");
//         setEnableChangePlanModal(false);
//         setTimeout(() => {
//           window.location.reload();
//         }, 1500);
//       })
//       .catch((error) => {
//         if (!unmounted) {
//           if (error.request.status === 403) {
//             localStorage.removeItem('userDetail');
//             localStorage.removeItem('userToken');
//             localStorage.removeItem('activeSubscription');
//             history.replace('/login');
//             history.go(0);
//           }
//           if (error.request.status === 400) {
//             toast.error("Something went wtong! Please try again...");
//           }
//         }
//         setisPageLoadingFailed(true);
//       })
//       .finally(() => {
//         setisPageLoading(false);
//         return function () {
//           unmounted = true;
//           source.cancel("Cancelling in cleanup");
//         };
//       });
//   }

//   const handlePlanConfirmClose = () => {
//     setEnableChangePlanModal(false)
//   }

//   if (isPageLoadingFailed) {
//     return (
//       <Box style={{ paddingTop: '50%', backgroundColor: 'white' }}>
//         <Loading isPageLoading={isPageLoading} />
//       </Box>
//     )
//   }
//   else if (isPageLoading) {
//     return (
//       <Box style={{ top: '50%' }}>
//         <Loading isPageLoading={isPageLoading} />
//       </Box>
//     )
//   }
//   else {
//     return (
//       <React.Fragment>
//         {JSON.parse(localStorage.getItem('userDetail')).profile?.name === 'Admin' ?
//           (<Box component="span" className={classes.hideButtons}>
//             <Grid container spacing={5}>
//               <Grid xs={6} md={6} justifyContent='flex-end' className={classes.gridElement}>
//                   <Button variant='contained' size="medium" onClick={handleSubscriptionManagement}>{productInfo.name === 'Premium+' || productInfo.name === 'Premium' ? 'Change Plan' : 'Upgrade Plan'}</Button>
//                </Grid>
//               <Grid xs={6} md={6} justifyContent='flex-end' className={classes.gridElement}>
//                 <Link onClick={() => { window.open(invoice) }} style={{ cursor: 'pointer' }}>Download Invoice</Link>
//               </Grid>
//             </Grid>
//           </Box>) : <span></span>
//         }
//         <Typography className={classes.header}>
//           Information :
//         </Typography>
//         <Container style={{ paddingTop: 30 }}>
//           <Grid container spacing={5} className={classes.grid}>
//             <Grid xs={12} md={6} className={classes.gridElement}>
//               <Typography className={classes.label}>Custimer ID :</Typography>
//               <TextField
//                 InputProps={{
//                   readOnly: !isEditMode,
//                   disableUnderline: !isEditMode,
//                   className: classes.inputDesign
//                 }}
//                 value={subscriptionInfo.customer}
//                 id="name"
//                 onChange={(name) => { }}
//                 variant="standard"
//               />
//             </Grid>
//             <Grid xs={12} md={6} className={classes.gridElement}>
//               <Typography className={classes.label}>Status :</Typography>
//               <TextField
//                 InputProps={{
//                   readOnly: !isEditMode,
//                   disableUnderline: !isEditMode,
//                   className: classes.inputDesign,
//                   color: subscriptionInfo.status === 'active' ? 'green' : 'red'
//                 }}
//                 value={subscriptionInfo.status === 'active' ? 'Active' : 'Inactive'}
//                 id="status"
//                 onChange={(status) => { }}
//                 aria-describedby="component-error-text"
//                 variant="standard"
//               />
//               <Tooltip className={classes.hideToolTip} title={toolTipMessage}>
//                 <InfoRoundedIcon className={classes.toolTip} sx={{ m: 1 }} />
//               </Tooltip>
//             </Grid>
//             <Grid xs={12} md={6} className={classes.gridElement}>
//               <Typography className={classes.label}>Current Plan :</Typography>
//               <TextField
//                 style={{ flex: 1 }}
//                 InputProps={{
//                   readOnly: !isEditMode,
//                   disableUnderline: !isEditMode,
//                   className: classes.inputDesign
//                 }}
//                 value={productInfo.name}
//                 id="product"
//                 onChange={(product) => { }}
//                 aria-describedby="component-error-text"
//                 variant="standard"
//               />
//             </Grid>
//             <Grid xs={12} md={6} className={classes.gridElement}>
//               <Typography className={classes.label}>Price :</Typography>
//               <TextField
//                 style={{ flex: 1 }}
//                 InputProps={{
//                   readOnly: !isEditMode,
//                   disableUnderline: !isEditMode,
//                   className: classes.inputDesign
//                 }}
//                 value={`₹${subscriptionInfo.plan?.amount / 100}`}
//                 id="product"
//                 onChange={(product) => { }}
//                 aria-describedby="component-error-text"
//                 variant="standard"
//               />
//             </Grid>
//             <Grid xs={12} md={6} className={classes.gridElement}>
//               <Typography className={classes.label}>Plan Features :</Typography>
//               <TextField
//                 style={{ flex: 1 }}
//                 InputProps={{
//                   readOnly: !isEditMode,
//                   disableUnderline: !isEditMode,
//                   className: classes.multiLineInputDesign
//                 }}
//                 value={productInfo.metadata?.Features}
//                 multiline={true}
//                 id="email"
//                 onChange={(email) => { }}
//                 aria-describedby="component-error-text"
//                 variant="standard"
//               />
//             </Grid>
//             <Grid xs={12} md={6} className={classes.gridElement}>
//               <Typography className={classes.label}>Billing Address :</Typography>
//               <TextField
//                 style={{ flex: 1 }}
//                 InputProps={{
//                   readOnly: !isEditMode,
//                   disableUnderline: !isEditMode,
//                   className: classes.multiLineInputDesign
//                 }}
//                 value={`${billingAddress.line1}, ${billingAddress.line1}, ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.country}, ${billingAddress.postal_code}`}
//                 multiline={true}
//                 id="email"
//                 onChange={(email) => { }}
//                 aria-describedby="component-error-text"
//                 variant="standard"
//               />
//             </Grid>
//             <Grid xs={12} md={6} className={classes.gridElement}>
//               <Typography className={classes.label}>Last Billing Date :</Typography>
//               <TextField
//                 style={{ flex: 1 }}
//                 InputProps={{
//                   readOnly: !isEditMode,
//                   disableUnderline: !isEditMode,
//                   className: classes.inputDesign
//                 }}
//                 value={new Date(subscriptionInfo.current_period_start * 1000).toDateString()}
//                 id="email"
//                 onChange={(email) => { }}
//                 aria-describedby="component-error-text"
//                 variant="standard"
//               />
//             </Grid>
//             <Grid xs={12} md={6} className={classes.gridElement}>
//               <Typography className={classes.label}>Next Billing Date :</Typography>
//               <TextField
//                 style={{ flex: 1 }}
//                 InputProps={{
//                   readOnly: !isEditMode,
//                   disableUnderline: !isEditMode,
//                   className: classes.inputDesign
//                 }}
//                 value={new Date(subscriptionInfo.current_period_end * 1000).toDateString()}
//                 id="email"
//                 onChange={(email) => { }}
//                 aria-describedby="component-error-text"
//                 variant="standard"
//               />
//             </Grid>
//           </Grid>
//         </Container>
//         {/* <Modal
//           open={openSubscriptionModal}
//           onClose={handleCloseModal}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//         >
//           <Box className={classes.modalDesign}>
//             <Subscription onActions={handleScbscriptionActions} currentProduct={productInfo.name} />
//           </Box>
//         </Modal> */}

//         <Dialog
//           open={enableChangePlanModal}
//           onClose={handlePlanConfirmClose}
//           aria-labelledby="alert-dialog-title"
//           aria-describedby="alert-dialog-description"
//         >
//           <DialogTitle id="alert-dialog-title">
//             {"Change in subscription plan!"}
//           </DialogTitle>
//           <DialogContent>
//             <DialogContentText id="alert-dialog-description">
//               Are you sure of changing to <span style={{ fontWeight: 'bold' }}>{updatingPlan.product?.name}</span> plan?
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handlePlanConfirmClose}>Close</Button>
//             <Button onClick={handleUpdatePlan} autoFocus>
//               Confirm
//             </Button>
//           </DialogActions>
//         </Dialog>

//         <Toaster />
//       </React.Fragment>
//     )
//   }
// }

//export default BillingDetails