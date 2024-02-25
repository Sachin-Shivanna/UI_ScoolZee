import React, { useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useParams, useHistory } from 'react-router-dom';
import TabPanel from '@mui/lab/TabPanel';
import { useStyles } from './../EventsStyles';
import EventDetail from './EventDetail';
import EventRelated from './EventRelated';

const EventDetailTab = (params) => {
  let { id } = useParams();
  const history = useHistory();
  const classes = useStyles();

  let unmounted = false;

  const [value, setValue] = React.useState('1');
  const [isPageLoading, setisPageLoading] = React.useState(false);
  const [savedEvent, setSavedEvent] = React.useState({});

  useEffect(() => {
    console.log(params.location?.state?.eventObjPermission)
    getEventDetail();
  }, []);

  useEffect(() => {
    setisPageLoading(true);
    setTimeout(() => {
      setisPageLoading(false);
    }, 0);
  }, [savedEvent])

  const getEventDetail = async () => {
    setisPageLoading(true);
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/event-details/event/${id}`)
      .then((response) => {
        console.log(response.data);
        setSavedEvent(response.data);
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



  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList variant='scrollable' onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Details" value="1" />
            <Tab label="Related" value="2" />
          </TabList>
        </Box>
        {!isPageLoading && <TabPanel className={classes.tabPanel} value="1"><EventDetail eventObjPermission = {params.location?.state?.eventObjPermission} savedEvent={savedEvent} /></TabPanel>}
        {!isPageLoading && <TabPanel className={classes.tabPanel} value="2"><EventRelated eventObjPermission = {params.location?.state?.eventObjPermission} onUpdateFile={getEventDetail} savedEvent={savedEvent} /></TabPanel>}
      </TabContext>
    </Box>
  )
}

export default EventDetailTab