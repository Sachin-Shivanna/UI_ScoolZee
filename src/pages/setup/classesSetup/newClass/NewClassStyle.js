import { makeStyles } from "@material-ui/core/styles";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

export const useStyles = makeStyles(theme => ({
    gridElement: {
        margin: '15px 0px',
        display: 'flex',
        padding: '0px 0px 10px 0px',
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
    header: {
        backgroundColor: '#101F33',
        padding: '5px',
        color: theme.palette.common.white,
    },
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
        padding: '3px 5px 7px !important',
        letterSpacing: '0.00938em',
        '& .MuiInputBase-input': {
            width: 10,
            padding: '3px 5px 7px !important'
        },
        [theme.breakpoints.down('sm')]: {
            padding: '5px 10px 0px 7px',
            '& .MuiInputBase-input': {
                padding: '2px 0 7px'
            }
        },

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
    rootDesign: {
        "& .Mui-focused": {

        }
    },
    error: {
        "& .MuiFormHelperText-marginDense": {
            marginTop: '0px !important'
        }
    },
    pagination: {
        "& .css-jtlhu6-MuiTablePagination-root": {
            overflow: 'inherit'
        }
    },
    paginationPosition: {
        "& .css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar": {
            position: 'absolute',
            bottom: '10px',
            right: '0px'
        }
    }


}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#101F33',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

export const StyledStudentTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#e9e9e9',
        padding: '0px',
        color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));