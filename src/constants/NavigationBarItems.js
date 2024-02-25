import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TuneIcon from '@mui/icons-material/Tune';
import GroupIcon from '@mui/icons-material/Group';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SchoolIcon from '@mui/icons-material/School';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

export const NavigationBarItems = [
    {
        id:0,
        icon:<HomeIcon/>,
        label:'Home',
        route: '/home',
        title:'Home',
    },
    {
        id:1,
        icon:<DashboardIcon/>,
        label:'Dashboard',
        route: '/dashboard',
        title:'Dashboard',
    },
    {
        id:2,
        icon:<LocalLibraryIcon/>,
        label:'Classes',
        route: '/classes',
        title: 'Classes',
    },
    {
        id:3,
        icon:<SchoolIcon/>,
        label:'Assessments',
        route: '/assessments',
        title:'Assessments',
    },
    {
        id:4,
        icon:<EventNoteIcon/>,
        label:'Events',
        route: '/events',
        title:'Events',
    },
    {
        id:5,
        icon:<AccountBalanceWalletIcon/>,
        label:'Accounts',
        route: '/accounts',
        title:'Accounts',
    },
    {
        id:6,
        icon:<TuneIcon/>,
        label:'Setup',
        route: '/setup',
        title: 'Setup',
    },
    {
        id:7,
        icon:<GroupIcon/>,
        label:'Users',
        route: '/users',
        title: 'Users',
    },
]