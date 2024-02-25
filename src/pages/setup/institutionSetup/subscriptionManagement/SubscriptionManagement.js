import React, { useState, useEffect } from 'react'
import { useStyles } from './SubscriptionManagementStyle';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircleIcon from '@mui/icons-material/Circle';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Grid, List, ListItem, Typography } from '@material-ui/core';
import Loading from '../../../../components/loading/Loading';

const SubscriptionManagement = (props) => {
  const classes = useStyles();
  let unmounted = false;

  const [isPageLoading, setisPageLoading] = useState(false);
  const [isPageLoadingFailed, setisPageLoadingFailed] = useState(false);
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    console.log(props.currentProduct)
    getAllProducts();
  }, [unmounted]);

  const getAllProducts = async () => {
    setisPageLoading(true);
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/products`)
      .then((response) => {
        console.log(response.data.data)
        setProductDetails(response.data.data);
      })
      .catch((error) => {
        if (!unmounted) {

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
      <Box className={classes.box}>
        <Card variant="outlined" style={{ height: 'auto' }}>
          <Typography variant='h4' className={classes.font} style={{ textAlign: 'center', margin: '20px 20px 0px 20px' }}>
            Explore the right plan for your Instuition
          </Typography>
          <Typography variant='h6' className={classes.font} style={{ textAlign: 'center', margin: '0px 20px 20px 20px' }}>
            Choose a plan that suits you the best!
          </Typography>
          <div style={{ margin: 0 }}>
            <Grid container className={classes.gridContainer}>
              <Grid item className={classes.grid}>
                <Card variant='elevation' elevation={10} className={classes.card}>
                  <Typography variant='h5' className={classes.font} style={{ textAlign: 'center', backgroundColor: '#c0c0c07a' }}>
                    {productDetails[0]?.product?.name}
                  </Typography>
                  <CardContent className={classes.font} style={{ textAlign: 'center' }}>
                    <Typography variant='body1'>
                      <span><h1 style={{margin: 0}}>₹{(productDetails[0]?.tiers[0].flat_amount/100)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h1> <span>upto {productDetails[0]?.tiers[0]?.up_to} active students/ {productDetails[0]?.recurring?.interval}</span></span> <br/> + <h4 style={{margin: 0}}>₹{(productDetails[0]?.tiers[1].unit_amount/100)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h4>/ additional active student/ year.
                    </Typography>
                    <Typography variant='h6'>
                      <List sx={{ listStyleType: 'disc' }}>
                        {
                          productDetails[0]?.product?.metadata?.Features?.split(';').map((feature, index) => (
                            <ListItem key={index} sx={{ display: 'list-item' }}>
                              <CircleIcon style={{ paddingRight: 10 }} />{feature}
                            </ListItem>
                          ))
                        }
                      </List>
                    </Typography>
                  </CardContent>
                  <CardActions style={{ position: 'absolute',bottom: '0px', right: 100 }}>
                    <Button variant='outlined' style={{position: 'relative'}} disabled={props.currentProduct === productDetails[0]?.product?.name} size="medium" onClick={() => { props.onActions(productDetails[0]) }}>Choose the Plan</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item className={classes.grid}>
                <Card variant='elevation' elevation={10} className={classes.card}>
                  <Typography variant='h5' className={classes.font} style={{ textAlign: 'center', backgroundColor: '#c0c0c07a' }}>
                    {productDetails[1]?.product?.name}
                  </Typography>
                  <CardContent className={classes.font} style={{ textAlign: 'center' }}>
                    <Typography variant='body1'>
                    <span><h1 style={{margin: 0}}>₹{(productDetails[1]?.tiers[0].flat_amount/100)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h1> <span>upto {productDetails[1]?.tiers[0].up_to} active students/ {productDetails[1]?.recurring?.interval}</span></span> <br/> + <h4 style={{margin: 0}}>₹{(productDetails[1]?.tiers[1].unit_amount/100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h4>/ additional active student/ year.
                    </Typography>
                    <Typography variant='h6'>
                      <List sx={{ listStyleType: 'disc' }}>
                        {
                          productDetails[1]?.product?.metadata?.Features?.split(';').map((feature, index) => (
                            <ListItem key={index} sx={{ display: 'list-item' }}>
                              <CircleIcon style={{ paddingRight: 10 }} />{feature}
                            </ListItem>
                          ))
                        }
                      </List>
                    </Typography>
                  </CardContent>
                  <CardActions style={{ position: 'absolute',bottom: '0px', right: 100 }}>
                    <Button variant='outlined' style={{position: 'relative'}} size="medium" disabled={props.currentProduct === productDetails[1]?.product?.name} onClick={() => { props.onActions(productDetails[1]) }}>Choose the Plan</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item className={classes.grid}>
                <Card variant='elevation' elevation={10} className={classes.card}>
                  <Typography variant='h5' className={classes.font} style={{ textAlign: 'center', backgroundColor: '#c0c0c07a' }}>
                    {productDetails[2]?.product?.name}
                  </Typography>
                  <CardContent className={classes.font} style={{ textAlign: 'center' }}>
                  <Typography variant='body1'>
                    <span><h1 style={{margin: 0}}>₹{(productDetails[2]?.tiers[0].flat_amount/100)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h1> <span> {productDetails[2]?.tiers[0]?.up_to ? 'upto' : ''} {productDetails[2]?.tiers[0]?.up_to || 'unlimited'} active students/ {productDetails[2]?.recurring?.interval}</span></span> <br/> + <h4 style={{margin: 0}}>₹{(productDetails[2]?.tiers[1]?.unit_amount/100) || 0}</h4>/ additional active student/ year.
                    </Typography>
                    <Typography variant='h6'>
                      <List sx={{ listStyleType: 'disc' }}>
                        {
                          productDetails[2]?.product?.metadata?.Features?.split(';').map((feature, index) => (
                            <ListItem key={index} sx={{ display: 'list-item' }}>
                              <CircleIcon style={{ paddingRight: 10 }} />{feature}
                            </ListItem>
                          ))
                        }
                      </List>
                    </Typography>
                  </CardContent>
                  <CardActions style={{ position: 'absolute',bottom: '0px', right: 100 }}>
                    <Button variant='outlined' style={{position: 'relative'}} size="medium" disabled={props.currentProduct === productDetails[2]?.product?.name} onClick={() => { props.onActions(productDetails[2]) }}>Choose the Plan</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </div>
          <CardActions style={{ margin: "5px auto", alignItems: "center", justifyContent: "center" }}>
            <Button variant='contained' size="medium" onClick={() => { props.onCancel(false) }}>Cancel</Button>
          </CardActions>
        </Card>
      </Box>
    )

  }
}

export default SubscriptionManagement