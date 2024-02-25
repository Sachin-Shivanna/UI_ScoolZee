import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { useHistory } from 'react-router-dom';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import InstitutionSetup from './institutionSetup/InstitutionSetup';
import ClassesSetup from './classesSetup/ClassesSetup';
import { useStyles } from './SetupStyle';
import FeeStructure from './feesStructures/FeeStructure';
import { breadcrumbsContext } from '../../components/context/Context';
import { Link } from '@material-ui/core';
import { NavigationBarItems } from '../../constants/NavigationBarItems';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';

const Setup = () => {
  const classes = useStyles();
  const history = useHistory();

  const [value, setValue] = React.useState('1');
  const [breadcrumbsList, setBreadcrumbsList] = React.useContext(breadcrumbsContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    setBreadcrumbsList([
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href={NavigationBarItems.find(nav => nav.route === history.location.pathname)?.route}
      >
        <span style={{ display: 'flex', fontSize: 'inherit' }} fontSize="inherit">
          <span style={{marginRight: 5}}>
          {NavigationBarItems.find(nav => nav.route === history.location.pathname)?.icon}
          </span>
          {NavigationBarItems.find(nav => nav.route === history.location.pathname)?.label}
        </span>
      </Link>,
    ]);
  }, [])
  return (
    <React.Fragment>

      <Stack spacing={2}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbsList}
        </Breadcrumbs>
      </Stack>

      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList variant='scrollable' onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Institution Setup" value="1" />
              <Tab label="Classes Setup" value="2" />
              <Tab label="Fee Structures" value="3" />
            </TabList>
          </Box>
          <TabPanel className={classes.tabPanel} value="1"><InstitutionSetup /></TabPanel>
          <TabPanel className={classes.tabPanel} value="2"><ClassesSetup /></TabPanel>
          <TabPanel className={classes.tabPanel} value="3"><FeeStructure /></TabPanel>
        </TabContext>
      </Box>
    </React.Fragment>
  );
}

export default Setup;