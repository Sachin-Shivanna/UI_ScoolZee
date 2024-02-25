/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Link } from '@material-ui/core';
import { useStyles } from './FeeStructureStyle';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Custom_Button from '../../../components/reusableElements/Custom_Button';
import Loading from '../../../components/loading/Loading';

const FeeStructure = () => {
  const classes = useStyles();
  const history = useHistory();

  const [allFeeStructure, setAllFeeStructure] = useState([]);
  const [isPageLoading, setisPageLoading] = useState(false);
  const [feeStructureObjPermission, setFeeStructureObjPermission] = React.useState({});

  let unmounted = false;

  useEffect(() => {
    getAllFeeStructure();
  }, [])

  const getAllFeeStructure = async () => {
    unmounted = false;
    setisPageLoading(true);
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/fees-structure-info/fee-structure`)
      .then((response) => {
        console.log(response.data?.feeStructureList);
        setFeeStructureObjPermission(response.data?.accessDefination)
        setAllFeeStructure(response.data?.feeStructureList)

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
        setisPageLoading(false);
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
      {JSON.parse(localStorage.getItem('userDetail'))?.profile?.name === 'Admin' ?
        (<Box component="span" className={classes.hideButtons}>
          <Grid container spacing={5}>
            <Grid xs={6} md={6} justifyContent='flex-end' className={classes.gridElement}>
              <Custom_Button variant='contained' size="medium" accessGranted={feeStructureObjPermission.create} onClick={() => { history.push(`setup/add-fee`,{feeStructureObjPermission}) }} label={'Add Fee'}/>
            </Grid>
          </Grid>
        </Box>) : <span></span>
      }
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {allFeeStructure.map(
            (fee) => {
              return (
                <Grid item key={fee._id}>
                  <Card style={{ minWidth: 300, width: 'auto', margin: 20 }}>
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {fee.name}
                      </Typography>
                      <Box style={{ margin: 20 }}>
                        <Grid container style={{ marginBottom: 10 }}>
                          <Grid >
                            <Typography style={{ paddingRight: 5 }} variant='body1' color="text.secondary">
                              Total Fees:
                            </Typography>
                          </Grid>
                          <Grid>
                            {fee?.details?.map(fee => { return fee.amount }).reduce((x, y) => parseFloat(x) + parseFloat(y))}
                          </Grid>
                        </Grid>
                      </Box>
                      <CardActions style={{ position: 'relative' }}>
                        <Link onClick={() => { history.push(`/setup/fee-details?feeId=${fee._id}`,{feeStructureObjPermission}) }} variant='text' size="small" style={{ position: 'absolute', right: 0, top: 0, cursor: 'pointer' }}>Details <ArrowForwardIosIcon style={{ fontSize: 9, cursor: 'pointer' }} /></Link>
                      </CardActions>
                    </CardContent>
                  </Card>
                </Grid>
              )
            }
          )
          }
        </Grid>
      </Box>
    </React.Fragment>
  )
        }
}

export default FeeStructure