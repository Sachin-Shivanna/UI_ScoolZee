import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    grid: {
        flex: 1,
        flexDirection: 'row',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            padding: '10px'
        }
    },
    label: {
        fontSize: '1rem',
        fontFamily: ["Roboto", "Helvetica", "Arial", 'sans-serif'],
        fontWeight: '400',
        lineHeight: "1.5",
        letterSpacing: '0.00938em',
        color: theme.palette.grey[700],
        '& .MuiTypography-body1': {
            fontSize: '1.3rem !important',
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '1rem !important',
            padding: '7px 10px 0px 7px',
            '& .MuiTypography-body1': {
                fontSize: '1rem !important',
            },
        }
    },
    inputDesign: {
        fontSize: '1rem',
        fontFamily: ["Roboto", "Helvetica", "Arial", 'sans-serif'],
        fontWeight: '400',
        lineHeight: "1.5",
        letterSpacing: '0.00938em',
        '& .MuiInputBase-input': {
            padding: '3px 6px 7px;'
        },
        [theme.breakpoints.down('sm')]: {
            //fontSize: '1rem !important',
            padding: '5px 10px 0px 7px',
            '& .MuiInputBase-input': {
                padding: '6px 0 7px'
            }
        },

    },
    gridElement: {
        margin: '15px 0px',
        display: 'flex',
        padding: '0px 20px 0px 0px',
        [theme.breakpoints.down('sm')]: {
            padding: '0px 0px 15px 0px !important',
            margin: 0
        }
    },
    hideButtons: {
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    checkboxDesign: {
        padding: 0,
        '& .MuiCheckbox-root': {
            padding: '0PX !important'
        }
    },
    addressLine: {
        [theme.breakpoints.down('xs')]: {
            width: '50%'
        }
    },
    header: {
        backgroundColor: '#101F33',
        padding: '5px',
        color: theme.palette.common.white,
        marginTop: '10px'
    }

}));