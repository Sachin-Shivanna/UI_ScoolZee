import { makeStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

export const useStyles = makeStyles(theme => ({
    gridElement: {
        margin: '20px 10px',
        display: 'flex',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            padding: '0px 0px 15px 0px !important',
            margin: 0
        }
    },
    header: {
        backgroundColor: '#101F33',
        padding: '5px',
        color: theme.palette.common.white,
        marginTop: '10px',
        marginBottom: '10px'
    }
}));

export const StyledTitleHeaderCell = styled(TableCell)(({ theme }) => ({
   // position: -webkit - sticky, /* Safari & IE */
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#E5E4E2',
        color: theme.palette.common.black,
        borderBottom: '.05px solid #101F33'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));
export const StyledTitleCell = styled(TableCell)(({ theme }) => ({
    position: 'sticky',
    top: 0,
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#E5E4E2',
        color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
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