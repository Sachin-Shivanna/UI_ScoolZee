import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
  container: {
    padding: '10px'
  },
  form: {
    padding: "20% 30px 30px 30px",
    height: '100vh',
    width: '80%',
    margin: "20px auto"
  },
  leftGrid: {
    width: '60%',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    }
  },
  rightGrid: {
    width: '40%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    }
  },
  input: {
    padding: '5px 0px 5px 0px'
  },
  checkbox: {
    padding: '5px 0px 5px 8px'
  },
  button: {
    padding: '10px 0px 5px 0px'
  },
  centerScreen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    minHeight: '100vh',
  },
  modalWidth: {
    background: '#fff',
    textAlign: 'center',
    //padding: '50px 30px',
    marginBottom: '30px',
    borderRadius: '3px',
    boxShadow: '0 10px 30px rgb(0 0 0 / 10%)',
    width: '30%',
    height: '50vh',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    }
  }
}))