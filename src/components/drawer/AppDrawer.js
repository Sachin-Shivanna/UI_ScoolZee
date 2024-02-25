import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import Logout from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { NavigationBarItems } from '../../constants/NavigationBarItems';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import AppRouter from '../routers/AppRouter';
import { useStyles } from './AppDrawerStyle';
import { useLocation } from 'react-router-dom'
import { useHistory } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarViewDayRoundedIcon from '@mui/icons-material/CalendarViewDayRounded';
import { titleContext } from '../context/Context'
import Calendar from './Calendar';
import Settings from '../../pages/settings/Settings';
import { AccessDefinition } from '../../constants/AccessDefinition/AccessDefinition';


const drawerWidth = 240;

function AppDrawer(props) {
  const history = useHistory();
  const location = useLocation();
  console.log('Location>> ', location);

  const classes = useStyles();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [titleVal, setTitleVal] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openCalendar, setOpenCalendar] = React.useState(false);
  const [openSettings, setOpenSettings] = React.useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      {NavigationBarItems.map((tab, index) =>
      
        <List key={tab.id}>
          {(AccessDefinition.find(ra => ra.route === tab.route)?.routAccess?.includes(JSON.parse(localStorage.getItem('userDetail'))?.profile?.name)) &&
          <Link to={tab.route} className={classes.link}>
            <ListItem button style={{backgroundColor: location.pathname.startsWith(`${tab.route}`) ? '#045174' :''}} selected={location.pathname.startsWith(`${tab.route}`)}>
              <ListItemIcon className={classes.icons}>
                {tab.icon}
              </ListItemIcon>
              <ListItemText className={classes.text} primary={tab.label} />
            </ListItem>
          </Link>}
        </List>)}
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <titleContext.Provider value={[titleVal, setTitleVal]}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          style={{background: 'linear-gradient(270deg, #1976d2,#1362b0,#0e4c88,#101F33)'}}
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              style={{  display: 'none' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {NavigationBarItems.find(navigation => location.pathname.substring().includes(`${navigation.route}`))?.title || titleVal}
            </Typography>
            <div className={classes.timeTable}>
              <CalendarViewDayRoundedIcon fontSize="large" style={{ cursor: 'pointer', marginTop: 7 }}></CalendarViewDayRoundedIcon>
            </div>
            <div className={classes.calendar}>
              <CalendarMonthIcon fontSize="large" onClick={() => { setOpenCalendar(true) }} style={{ cursor: 'pointer', marginTop: 7 }}></CalendarMonthIcon>
            </div>
            <div className={classes.notification}>
              <CircleNotificationsIcon fontSize="large" style={{ cursor: 'pointer', marginTop: 7 }}></CircleNotificationsIcon>
            </div>
            <div className={classes.avatar}>
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar style={{ cursor: 'pointer' }}></Avatar>
                </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  style: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatarRoot': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => { history.push(`/users/user-details/${JSON.parse(localStorage.getItem('userDetail'))?._id}`) }}>
                  <Avatar /> {JSON.parse(localStorage.getItem('userDetail'))?.name}
                </MenuItem>
                <Divider />
                {JSON.parse(localStorage.getItem('userDetail'))?.profile?.name === 'Admin' && 
                <MenuItem onClick={() => {setOpenSettings(true)}}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>}
                <MenuItem onClick={() => {
                  localStorage.removeItem('userDetail');
                  localStorage.removeItem('userToken');
                  localStorage.removeItem('activeSubscription');
                  localStorage.removeItem('subscribedProd');
                  localStorage.removeItem('accessDefination');
                  history.replace('/login');
                  history.go(0);
                }}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            classes={{ paper: classes.drawerPaper }}
            sx={[classes.drawer, {
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }]}
          >
            {drawer}
          </Drawer> */}
          <Drawer
            variant="permanent"
            classes={{ paper: classes.drawerPaper }}
            style={{boxShadow: '4px 0px 8px 0px #454545'}}
            sx={[classes.drawer, {
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }]}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          className={classes.boxDesign}
        >
          <Toolbar />
          <Switch>
            <AppRouter />
          </Switch>
        </Box>
      </Box>
      <Modal
        open={openCalendar}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '90%',
          bgcolor: 'background.paper',
          p: 4,
        }}>
          <Calendar onClose={() => { setOpenCalendar(false) }} />
        </Box>
      </Modal>
      <Modal
        open={openSettings}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '90%',
          bgcolor: 'background.paper',
          p: 4,
        }}>
          <Settings onClose={() => { setOpenSettings(false) }}/>
        </Box>
      </Modal>
    </titleContext.Provider>
  );
}

export default AppDrawer;
