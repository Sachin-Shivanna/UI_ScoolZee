/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Stack from '@mui/material/Stack';
import { Box, Button, Typography, Link } from '@material-ui/core';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Loading from '../../components/loading/Loading';
import { useStyles } from './EventsStyles';
import { useHistory } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { formateTime } from '../../components/commonController/commonController';
import Custom_Button from '../../components/reusableElements/Custom_Button';

const Events = () => {

  const classes = useStyles();
  const history = useHistory();

  let unmounted = false;

  const [isPageLoading, setisPageLoading] = useState(false);
  const [isPageLoadingFailed, setisPageLoadingFailed] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState(new Date(new Date().getFullYear(), 0, 1));
  const [filterEndDate, setFilterEndDate] = useState(new Date(new Date().getFullYear(), 11, 31));
  const [allEvents, setAllEvents] = useState([]);
  const [eventObjPermission, setEventObjPermission] = React.useState({});

  useEffect(() => {
    getAllEvents();
  }, [filterStartDate, filterEndDate]);

  const getAllEvents = async () => {
    setisPageLoading(true);
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/event-info/event/${filterStartDate}/${filterEndDate}`)
      .then((response) => {
        console.log(response.data);
        setAllEvents(response.data?.eventList);
        setEventObjPermission(response.data?.accessDefination);

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
        <Box component="span">
          <Grid container>
              <Grid item xs={6} style={{ justifyContent: 'flex-end' }} className={[classes.gridElement, classes.hideButtons]}>
                <Custom_Button variant='contained' size="medium" onClick={() => { history.push(`events/add-event`,{eventObjPermission}) }} label={'Add Event'} accessGranted={eventObjPermission.create}/>
              </Grid>
            <Grid item xs={6} style={{ justifyContent: 'space-around' }} className={classes.gridElement}>
              <LocalizationProvider style={{ margin: 0, marginRight: 10 }} dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DesktopDatePicker
                    label='Start Date'
                    value={filterStartDate}
                    inputFormat="MM/dd/yyyy"
                    onChange={(date) => { setFilterStartDate(date) }}
                    renderInput={(params) => <TextField variant='standard' style={{ width: 150, padding: 0 }} {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
              <LocalizationProvider style={{ margin: 0, marginLeft: 10 }} dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DesktopDatePicker
                    label='End Date'
                    value={filterEndDate}
                    inputFormat="MM/dd/yyyy"
                    onChange={(date) => { setFilterEndDate(date) }}
                    renderInput={(params) => <TextField variant='standard' style={{ width: 150, padding: 0 }} {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Grid container rowSpacing={1} columnSpacing={1}>
            {
              allEvents?.length > 0 && allEvents?.map((event) => {
                return (<Grid item style={{ minwidth: 370 }}>
                  <Card style={{ minWidth: 370, margin: 20 }}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div" style={{ color: 'grey', textAlign: 'center' }}>
                        {event?.title}
                      </Typography>
                      <Typography style={{ padding: 10 }}>
                        <span className={classes.label}>Owner : </span> {event.owner?.name}
                      </Typography>
                      <Typography style={{ padding: 10 }}>
                        <span className={classes.label}>Start Date/Time : </span> {(new Date(event.startDateTime)).toDateString() + ', ' + formateTime(new Date(event.startDateTime))?.strTime}
                      </Typography>
                      <Typography style={{ padding: 10 }}>
                        <span className={classes.label}>End Date/Time : </span> {(new Date(event.endDateTime)).toDateString() + ', ' + formateTime(new Date(event.endDateTime))?.strTime}
                      </Typography>
                      <CardActions style={{ position: 'relative' }}>
                        <Link onClick={() => { history.push(`/events/event-detail/${event._id}`,{eventObjPermission}) }} variant='text' size="small" style={{ position: 'absolute', right: 0, top: 0, cursor: 'pointer' }}>Details <ArrowForwardIosIcon style={{ fontSize: 9, cursor: 'pointer' }} /></Link>
                      </CardActions>
                    </CardContent>
                  </Card>
                </Grid>)
              })
            }
          </Grid>
        </Box>
      </React.Fragment>
    )
  }
}

export default Events