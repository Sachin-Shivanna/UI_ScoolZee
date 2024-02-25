import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
;
const Loading = (props) => {

  const [open,setopen] = React.useState(false)

  React.useEffect(() => {
    setopen(props.isPageLoading)
  },[])

  return (
    <React.Fragment>
      <div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </React.Fragment>
  );
}


export default React.memo(Loading);