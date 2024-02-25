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
    hideButtons: {
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    header: {
        backgroundColor: '#101F33',
        padding: '5px',
        color: theme.palette.common.white,
        marginTop: '10px',
        marginBottom : '10px'
    },
    grid: {
        flex: 1,
        flexDirection: 'row',
        marginRight: '33px',
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
            width:10,
            padding: '3px 5px 7px !important'
        },
        [theme.breakpoints.down('sm')]: {
            padding: '5px 10px 0px 7px',
            '& .MuiInputBase-input': {
                padding: '2px 0 7px'
            }
        },

    },
    border:{
        '& .css-1yhpg23-MuiTableCell-root':{
            borderBottom : '0px !important'
        }
    }
}))

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#e9e9e9',
      color: theme.palette.common.black,
      padding: '0px',
        fontWeight: 800,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));