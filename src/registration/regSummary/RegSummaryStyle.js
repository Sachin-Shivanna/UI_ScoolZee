import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
     container : {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        backgroundColor:'#ffffff',
        border: '0.5px solid #c0c0c07a',
        boxShadow: 24,
        p: 4,
        overflow:'scroll'
      }
    }))