import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
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
    header: {
        backgroundColor: '#101F33',
        padding: '5px',
        color: theme.palette.common.white,
        marginTop: '10px',
        marginBottom : '10px'
    },
}))