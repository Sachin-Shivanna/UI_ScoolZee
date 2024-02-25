import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    box: {
        maxWidth: '85%', 
        minHeight: "80vh",
         margin: "10px auto"
      },
      gridContainer: {
        flex: 1, 
        justifyContent: 'space-around',
        [theme.breakpoints.down('sm')]: {
            flexDirection:'column'
          }
      },
      grid: {
        width: '30%', 
        [theme.breakpoints.down('sm')]: {
            width: '90%'
          }
      },
      card:{
        height: '60vh', 
        position: 'relative',
        [theme.breakpoints.down('sm')]: {
            height: 'auto',
            position: 'initial'
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
      },
      centerScreen: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: '100vh',
      },
      successBox: {
        background: '#fff',
        textAlign: 'center',
        //padding: '50px 30px',
        marginBottom: '30px',
        borderRadius: '3px',
        boxShadow: '0 10px 30px rgb(0 0 0 / 10%)',
    }
}))