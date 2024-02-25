import React, { useState, useEffect } from 'react'
import { useStyles } from './SubscriptionStyle';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircleIcon from '@mui/icons-material/Circle';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Grid, List, ListItem, Typography } from '@material-ui/core';
import Loading from '../../components/loading/Loading';

const Subscription = (props) => {
  const classes = useStyles();
  let unmounted = false;

  const [isPageLoading, setisPageLoading] = useState(false);
  const [isPageLoadingFailed, setisPageLoadingFailed] = useState(false);

  useEffect(() => {
    console.log(props.institutionDetails)
    const script = document.createElement('script');
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

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
        <Card variant="outlined" style={{ height: '83vh' }}>
          <Typography variant='h4' className={classes.font} style={{ textAlign: 'center', margin: '20px 20px 0px 20px' }}>
            Explore the right plan for your Instuition
          </Typography>
          <Typography variant='h6' className={classes.font} style={{ textAlign: 'center', margin: '0px 20px 20px 20px' }}>
            Choose a plan that suits you the best!
          </Typography>
          <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
          <stripe-pricing-table pricing-table-id="prctbl_1MAqvuSEfbV0D8Bb3zFJFRY4"
            publishable-key="pk_test_51KqBPeSEfbV0D8Bb22PfwE67DpDDtC7t2GJ6JpF5qMZpQPNJAfSQJGgpMsTarmKJYtf3jQC5P42j0Qhit8mywGfR00UpwXrouK"
            customer-email={props.institutionDetails?.email}>
          </stripe-pricing-table>
          {/* <CardActions style={{ margin: "5px auto", alignItems: "center", justifyContent: "center" }}>
            <Button variant='contained' size="medium" onClick={() => { props.onActions(1, {}) }}>{props.currentProduct !== '' ? 'Close' : 'Previous'}</Button>
          </CardActions> */}
        </Card>
      </Box>
    )

  }
}

export default Subscription