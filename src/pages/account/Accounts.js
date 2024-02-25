import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useStyles } from './AccountsStyle';
import Enrolments from './enrolments/Enrolments'
import Remunerations from './remunerations/Remunerations';

const Accounts =() => {
  const classes = useStyles();

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList variant='scrollable' onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Enrolments" value="1" />
            <Tab label="Remunerations" value="2" />
          </TabList>
        </Box>
        <TabPanel className={classes.tabPanel} value="1"><Enrolments/></TabPanel>
        <TabPanel className={classes.tabPanel} value="2"><Remunerations/></TabPanel>
      </TabContext>
    </Box>
  );
}

export default Accounts;