import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    box: {
        maxWidth: '80%', 
        minHeight: "80vh",
         margin: "10px auto"
      },
      grid: {
        width: '50%'
      },
      inputContainer : {
        paddingBottom: 20
      },
      input:{
          width: '300px',
        [theme.breakpoints.down('sm')]: {
            width: '250px',
          }
      },
      font:{
        color: 'rgba(0, 0, 0, 0.54)',
        padding: 0,
        fontsize: '1rem',
        fontfamily: ["Roboto", "Helvetica", "Arial", 'sans-serif'],
        fontweight: 400,
        lineheight: 1,
        letterspacing: '0.00938em'
      }
}))