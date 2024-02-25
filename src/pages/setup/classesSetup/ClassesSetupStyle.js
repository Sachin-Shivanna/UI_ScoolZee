import { makeStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

export const useStyles = makeStyles(theme => ({
    gridElement: {
        margin: '15px 0px',
        display: 'flex',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            padding: '0px 0px 15px 0px !important',
            margin: 0
        }
    },
    modalDesign: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '95%',
        '& > box-116': {
            margin: '0px',
            maxWidth: '0px'
        }
    },
    hideButtons: {
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    header: {
        backgroundColor: '#101F33',
        padding: '5px',
        color: theme.palette.common.white,
        marginTop: '10px'
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

    }
}));

export const StyledStudentTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#e9e9e9',
        color: theme.palette.common.black,
        fontWeight: 800
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

export const StyledCourseTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#e9e9e9',
        padding: '0px',
        fontWeight: 800,
        color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));