import { makeStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

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

        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #484850",
        }

    },
    tableHead : {
        height: 400,
        width: '100%',
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#122339',
          color: 'white',
          fontWeight: 500,
        },
        '& .MuiDataGrid-menuIcon':{
            backgroundColor: 'white'
        }
      }
}))