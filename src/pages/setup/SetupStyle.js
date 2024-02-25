import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    tabPanel: {
        padding: 24,
        [theme.breakpoints.down('sm')]: {
            padding: '3px !important',
        }
    }
}));