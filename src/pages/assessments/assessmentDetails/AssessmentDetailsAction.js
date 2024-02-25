import { useHistory } from 'react-router-dom';
import { green } from '@material-ui/core/colors'
import { Check, Save } from '@mui/icons-material'
import toast, { Toaster } from "react-hot-toast";
import { Box, CircularProgress, Fab } from '@mui/material'
import React, { useEffect } from 'react'
import axios from 'axios';
import { OBJECT } from '../../../constants/ObjectNames/documentObjNames';

function AssessmentDetailsAction({params,rowId, setRowId}) {
    
    const history = useHistory();
    let unmounted = false;

    const [loading, setLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)

    useEffect(() => {
        if(rowId === params.id && success){
            setSuccess(false);
        }
    },[rowId])

    const handleSubmit = async() => {
        console.log(params)
        unmounted = true;
        setLoading(true)
        const source = axios.CancelToken.source();
        console.log('Here buddy')
        await axios.patch(`${process.env.REACT_APP_SERVER}/update-assessment-dates/${OBJECT.ASSESSMENT}`, {
            updatedAssessmentData: params?.row
        })
        .then((response) => {
            console.log(response)
            if (response.status === 200) {
                setSuccess(true)
                setRowId(null);
            }
        })
        .catch((error) => {
            console.log(error)
            if (!unmounted) {
                if (error.request?.status === 403) {
                    localStorage.removeItem('userDetail');
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('activeSubscription');
                    history.replace('/login');
                    history.go(0);
                }
                else {
                    toast.success("woops!! Failed to update.")
                    console.log(error.request)
                    //toast.error(error.request.error)
                }
            }
        })
        .finally(() => {
            setLoading(false)
            unmounted = false;
            return function () {
                source.cancel("Cancelling in cleanup");
            };
        });
    }

  return (
    <Box
    sx={{
        m: 1,
        position: 'relative'
    }}
    >
        {success ? (
            <Fab
            color= 'primary'
            sx={{
                width : 40,
                height : 40,
                bgColor : green[500],
                '&:hover' : {bgcolor : green[700]}
            }}>
                <Check/>
            </Fab>
        ) : (
            <Fab
            color= 'primary'
            sx={{
                width : 40,
                height : 40,
                bgColor : green[500],
                '&:hover' : {bgcolor : green[700]}
            }}
            disabled={params.id !== rowId || loading}
            onClick={handleSubmit}
            >
                <Save/>
            </Fab>
        ) }
        {loading && (
            <CircularProgress
            size={52}
            sx={{
                color : green[500],
                position : 'absolute',
                top : -6,
                left : -6,
                zIndex : 1
            }}
            />
        )}
        <Toaster/>
    </Box>
  )
}

export default AssessmentDetailsAction