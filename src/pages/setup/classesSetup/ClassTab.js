import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import queryString from "query-string"
import axios from 'axios';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from '@material-ui/core';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useHistory } from 'react-router-dom';
import { useStyles } from './ClassesSetupStyle';
import ClassDetails from './ClassDetails';
import RelatedSections from './RelatedSections';
import { breadcrumbsContext, titleContext } from '../../../components/context/Context'

const ClassTab = (params) => {
  const history = useHistory();
  const classes = useStyles();
  const queryParams = queryString.parse(window.location.search)

  let unmounted = false;

  const [value, setValue] = useState('1');
  const [classDetails, setClassDetails] = useState({});
  const [classupdated, setClassUpdated] = useState(false);
  const [titleVal, setTitleVal] = useContext(titleContext);
  const [breadcrumbsList, setBreadcrumbsList] = React.useContext(breadcrumbsContext);

  useEffect(() => {
    console.log(window.location.pathname + window.location.search)
    getClassDetails();
  }, []);

  useEffect(() => {
    setTitleVal(classDetails?.name);
    setClassUpdated(true);
    setTimeout(() => {
      setClassUpdated(false);
    }, 0);
  }, [classDetails])

  useEffect(() => {
    if (JSON.stringify({}) !== JSON.stringify(classDetails)) {
      setBreadcrumbsList([
        breadcrumbsList,
        <Link
          underline="hover"
          style={{ display: 'flex', alignItems: 'center', marginBottom : 5 }}
          color="inherit"
          href="#"
        >
          Class Details
        </Link>,
      ])
    }
  }, [classDetails])


  const getClassDetails = async () => {
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/class-section-by-id/class/${queryParams.division}`)
      .then((response) => {
        console.log(response.data)
        setClassDetails(response.data);
      })
      .catch((error) => {
        console.log(error);
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
    console.log(newValue)
    setValue(newValue);
  };
  return (
    <React.Fragment>

      <Stack spacing={2}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" style={{marginBottom: 5}} />}
          aria-label="breadcrumb"
        >
          {breadcrumbsList}
        </Breadcrumbs>
      </Stack>

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList variant='scrollable' onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Details" value="1" />
              <Tab label="Related" value="2" />
            </TabList>
          </Box>
          <TabPanel className={classes.tabPanel} value="1">
            {!classupdated &&
              <ClassDetails eventObjPermission={params?.location?.state?.eventObjPermission} classObjPermission={params?.location?.state?.classObjPermission} classInfo={classDetails} handleRefresh={getClassDetails} />
            }</TabPanel>
          <TabPanel className={classes.tabPanel} value="2"><RelatedSections classObjPermission={params?.location?.state?.classObjPermission} classInfo={classDetails} updateDetails={handleChange} /></TabPanel>
        </TabContext>
      </Box>
    </React.Fragment>
  )
}

export default ClassTab