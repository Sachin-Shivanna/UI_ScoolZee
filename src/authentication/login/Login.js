import React, { useState, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { Avatar, Button, Link, TextField, Typography } from '@material-ui/core';
import SchoolIcon from '@mui/icons-material/School';
import { useHistory } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import loginCard from '../../assets/images/loginCard.jpg'
import { useStyles } from './LoginStyle';
import axios from "axios";
import Loading from "../../components/loading/Loading";
import { loginContext } from "../../components/context/Context";
import { OBJECT } from "../../constants/ObjectNames/documentObjNames";

const Login = () => {
  const history = useHistory();
  const classes = useStyles();

  const [isPageLoading, setisPageLoading] = useState(false);
  const [isPageLoadingFailed, setisPageLoadingFailed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidEmail, setInvalidEmail] = useState('');
  const [invalidPassword, setInvalidPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useContext(loginContext);

  let loginBtn = React.useRef();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email || !email.target.value.match(/\S+@\S+\.\S+/)) {
      setInvalidEmail('Email is invalid');
    }
    else {
      setInvalidEmail('');
    }
    if (!password || !password.target?.value) {
      setInvalidPassword('Password is invalid');
    }
    else {
      setInvalidPassword('');
    }
    if (email.target?.value.match(/\S+@\S+\.\S+/) && password.target?.value) {
      try {
        setisPageLoading(true);
        const { data } = await axios.post(`${process.env.REACT_APP_SERVER}/login`, {
          email: email.target?.value,
          userPassword: password.target?.value
        });
        console.log(data);
        if (data.passwordError) {
          setInvalidPassword(data.passwordError);
        }
        else if (data.emailError) {
          setInvalidEmail(data.emailError);
        }
        else {
          setIsLoggedIn(true);
          localStorage.setItem('accessDefination', JSON.stringify(data.accessDefination));
          localStorage.setItem('userDetail', JSON.stringify(data.user));
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('activeSubscription', data.activeSubscription);
          localStorage.setItem('subscribedProd', data.subscribedProd);

          let nextRoute = (data.activeSubscription === true) ? '/dashboard' : (data.user?.profile?.name === 'Admin') ? ()=>{handleSubscriptionManagement()} : () => {
            localStorage.removeItem('userDetail');
            localStorage.removeItem('userToken');
            localStorage.removeItem('activeSubscription');
            localStorage.removeItem('subscribedProd');
            localStorage.removeItem('accessDefination');
            setIsLoggedIn(false);
            history.go(0);
            return '/login';
          };
          history.replace(nextRoute);
        }
        setisPageLoading(false);
      }
      catch (error) {

        if (error.response?.status === 400 || error.response?.status === 502) {
          console.log(error)
        }
        if (error.response?.status === 403) {
          if (error.response?.data?.error === 'inactive') {
            toast.error('temporarily unable to login. Please contact your administrator');
          }
          //toast.error();
        }
        setisPageLoading(false);
      }
    }
  }

  const handleSubscriptionManagement = async () => {
    const source = axios.CancelToken.source();
    await axios.post(`${process.env.REACT_APP_SERVER}/manage-subscription/${OBJECT.SUBSCRIPTION}`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        console.log(response.data);
        window.open(`${response.data.url}`, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
      })
      .catch((error) => {

      })
      .finally(() => {
        return function () {
          source.cancel("Cancelling in cleanup");
        };
      });
  }

  if (isPageLoadingFailed) {
    return (
      <Box style={{ paddingTop: '50%', backgroundColor: 'white' }}>
        <Loading isPageLoading={isPageLoading} />
        <Toaster />
      </Box>
    )
  }
  else if (isPageLoading) {
    return (
      <Box style={{ top: '50%' }}>
        <Loading isPageLoading={isPageLoading} />
        <Toaster />
      </Box>
    )
  }
  else {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container>
          <Grid item className={classes.leftGrid}>
            <img width="100%" height="100%" alt="Login" src={loginCard} />
          </Grid>
          <Grid item className={classes.rightGrid}>
            <Grid>
              <form elevation={10} className={classes.form} onSubmit={handleLogin}>
                <Grid align='center'>
                  <Avatar style={{ backgroundColor: 'green' }}>
                    <SchoolIcon />
                  </Avatar>
                  <h2>Log In</h2>
                </Grid>
                <div className={classes.input}>
                  <TextField label='Email Id' onFocus={() => { setInvalidEmail('') }} placeholder='Enter Email Id' fullWidth helperText={(invalidEmail === '') ? '' : <Typography style={{ color: 'red', fontSize: '0.75rem', fontWeight: 400 }}>{invalidEmail}</Typography>} onChange={(email) => { setEmail(email) }} />
                </div>
                <div className={classes.input}>
                  <TextField label='Password' onFocus={() => { setInvalidPassword('') }} placeholder='Enter Password' fullWidth type='password' helperText={(invalidPassword === '') ? '' : <Typography style={{ color: 'red', fontSize: '0.75rem', fontWeight: 400 }}>{invalidPassword}</Typography>} onChange={(password) => { setPassword(password) }} />
                </div>
                <div className={classes.button}>
                  <Button type='Submit' color='primary' variant='contained' ref={btn => loginBtn = btn} fullWidth>Log In</Button>
                </div>
                <div style={{ paddingleft: '10px' }}>
                  <Typography> Want to register Institution ?
                    <Link style={{ padding: '5px', cursor: "pointer" }} onClick={() => { history.push("registration"); }}>
                      Register
                    </Link>
                  </Typography>
                </div>
              </form>
            </Grid>
          </Grid>
        </Grid>
        <Toaster />
      </Box>
    );
  }
}

export default Login;