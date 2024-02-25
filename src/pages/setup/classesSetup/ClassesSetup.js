/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from "react-hot-toast";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { useStyles } from './ClassesSetupStyle';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Grid, Link } from '@material-ui/core';
import Loading from '../../../components/loading/Loading';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { financialYear } from '../../../constants/FinancialYearFilterList';
import { Typography } from '@mui/material';
import Custom_Button from '../../../components/reusableElements/Custom_Button';

const ClassesSetup = () => {

  const classes = useStyles();
  const history = useHistory();

  let unmounted = false;

  const [isPageLoading, setisPageLoading] = useState(false);
  const [isPageLoadingFailed, setisPageLoadingFailed] = useState(false);
  const [allClasses, setAllClasses] = useState();
  const [selectedYear, setSelectedYear] = useState(0);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [classObjPermission, setClassObjPermission] = React.useState({});
  const [eventObjPermission, setEventObjPermission] = React.useState({});

  useEffect(() => {
    console.log(financialYear)
    getAllClasses();
  }, []);

  useEffect(() => {
    setFilteredClasses(allClasses?.filter((classData) => (classData.year?.startsWith(selectedYear?.split('-')[0]))))
  }, [selectedYear])

  const getAllClasses = async () => {
    setisPageLoading(true);
    unmounted = false;
    setSelectedYear(financialYear[financialYear.length - 1].value)
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/classes-info/class`)
      .then((response) => {
        if (response.status === 200) {
            console.log(response.data);
          if (response.data.length === 0) {
            toast(
              <span style={{ color: '#FF9900' }}>
                No classes are found. Please add!!
              </span>,
              {
                icon: <WarningRoundedIcon style={{ color: "#FF9900" }} />,
              }
            );
          }
          else {
            setEventObjPermission(response.data?.eventAccess)
            setClassObjPermission(response.data?.accessDefination);
            setAllClasses(response.data?.classDetails);
            setFilteredClasses(response.data?.classDetails?.filter((classData) => (classData.year?.startsWith(financialYear[financialYear.length - 1].value?.split('-')[0]))))
          }
        }
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
      <React.Fragment>
        {JSON.parse(localStorage.getItem('userDetail'))?.profile?.name === 'Admin' ?
          (<Box component="span" className={classes.hideButtons}>
            <Grid container spacing={5}>
              <Grid xs={6} md={6} justifyContent='flex-end' className={classes.gridElement}>
                <Custom_Button variant='contained' size="medium" onClick={() => { history.push(`setup/add-class`, {classObjPermission}) }} label={'Add Class'}accessGranted={classObjPermission.create}/>
              </Grid>
              <Grid xs={6} md={6} justifyContent='flex-end' className={classes.gridElement}>
                <Box sx={{ minWidth: 120, height: 20 }}>
                  <FormControl fullWidth>
                    <Select
                      variant='standard'
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedYear}
                      label="Filter"
                      onChange={(year) => { setSelectedYear(year.target.value) }}
                    >
                      {
                        financialYear.map((year) => (
                          <MenuItem value={year.value}>{year.label}</MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Box>) : <span></span>
        }
        <Box sx={{ width: '100%' }}>
          <Grid container rowSpacing={1} columnSpacing={1}>
            {
              filteredClasses?.length > 0 && filteredClasses?.map((eachClass) => {
                return (
                  <Grid item>
                    <Card style={{ maxWidth: 345, margin: 20 }}>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {eachClass?.name}
                        </Typography>
                        <Typography style={{ padding: 10 }} variant="body1">
                          {
                            eachClass?.divisions?.map((division) => {
                              return (
                                <Box style={{ margin: 20 }}>
                                  <Typography gutterBottom variant="h6" component="div" color="text.primary">
                                    Section - {division?.section}
                                  </Typography>
                                  <Grid container style={{ marginBottom: 10 }}>
                                    <Grid style={{ marginRight: 10 }}>
                                      <Typography variant='body1' color="text.secondary">
                                        Lead Instructor:
                                      </Typography>
                                    </Grid>
                                    <Grid>
                                      {division?.leadInstructor?.name}
                                    </Grid>
                                  </Grid>
                                  <Grid container style={{ marginBottom: 10 }}>
                                    <Grid style={{ marginRight: 10 }}>
                                      <Typography variant='body1' color="text.secondary">
                                        Total Students:
                                      </Typography>
                                    </Grid>
                                    <Grid>
                                      {division?.students?.length}
                                    </Grid>
                                  </Grid>
                                  <CardActions style={{ position: 'relative' }}>
                                    <Link onClick={() => { history.push(`/section/search?class=${eachClass._id}&division=${division._id}`,{classObjPermission, eventObjPermission}) }} variant='text' size="small" style={{ position: 'absolute', right: 0, top: 0, cursor: 'pointer' }}>Details <ArrowForwardIosIcon style={{ fontSize: 9, cursor: 'pointer' }} /></Link>
                                  </CardActions>
                                  <Divider style={{ marginTop: 10 }} />
                                </Box>
                              )
                            })
                          }
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                )
              })
            }
            {
              filteredClasses?.length === 0 &&
              <Box style={{ position: 'relative' }}>
                <Typography style={{ position: 'relative', marginTop: '10%', left: '25vw', top: '25vh' }}>No Records Found for the year {selectedYear}</Typography>
              </Box>
            }
          </Grid>
        </Box>
        <Toaster />
      </React.Fragment>
    )
  }
}

export default ClassesSetup