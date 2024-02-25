import { makeStyles, withStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

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
    paper: { minWidth: "500px", maxWidth: 900 },
    backdropParent: {
        position: "relative",
        width: 200,
        height: 200,
        backgroundColor: "red",
        zIndex: 0,
    },
    backdrop: {
        position: "absolute"
    },
    header: {
        backgroundColor: '#101F33',
        padding: '5px',
        margin: 15,
        color: theme.palette.common.white,
    },
    label: {
        fontSize: '0.9rem',
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
    dropdown:{
        '& .MuiOutlinedInput-root':{
            padding:0
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

export const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
    "&:before": {
        border: '1px solid #dadde9'
    }
  }));
