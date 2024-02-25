import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    drawer: {
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            //background: 'linear-gradient(180deg, #101F33,#172d4a,#1d3759,#264774)',
            //backgroundColor: '#101F33',
            //color: 'rgba(255, 255, 255, 0.7)',
           // boxShadow: '4px 0px 8px 0px #454545'
        },

    },
    drawerPaper: { width: 'inherit',backgroundColor: '#101F33 !important', background: 'linear-gradient(180deg, #101F33,#172d4a,#1d3759,#264774)', boxShadow: '4px 0px 8px 0px #454545 !important'  },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary
    },
    icons: {
        color: 'rgba(255, 255, 255, 0.7)!important',
        marginLeft: '20px',
    },
    text: {
        '& span': {
            marginLeft: '-10px',
            fontWeight: '600',
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)!important'
        }
    },
    notification: {
        position: 'absolute',
        left: '90%',
        [theme.breakpoints.down('sm')]: {
            left: '80%',
        }
    },
    calendar: {
        position: 'absolute',
        left: '85%',
        [theme.breakpoints.down('sm')]: {
            left: '75%',
        }
    },
    timeTable: {
        position: 'absolute',
        left: '80%',
        [theme.breakpoints.down('sm')]: {
            left: '70%',
        }
    },
    avatar: {
        position: 'absolute',
        left: '93%',
        [theme.breakpoints.down('sm')]: {
            left: '83%',
        }
    },
    boxDesign: {
        flexGrow: 1, 
        padding: 24,
         width: '83vw',
        [theme.breakpoints.down('sm')]: {
            width: '100vw',
            padding: 3,
        }
    }
}));