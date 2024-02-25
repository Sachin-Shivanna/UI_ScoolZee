import * as React from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import Card from '@mui/material/Card';
import Autocomplete from '@mui/material/Autocomplete';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import toast, { Toaster } from "react-hot-toast";
import { FormControl } from '@mui/material';
import { Grid } from '@mui/material';
import { Container, InputLabel } from '@material-ui/core';
import { useStyles } from './UserStyle';
import TextField from '@mui/material/TextField';
import Loading from '../../components/loading/Loading';


const UserReg = (props) => {
  const classes = useStyles();
  const [userName, setUserName] = React.useState(props.userDetails.name || '');
  const [stateDetails, setStateDetails] = React.useState(props.stateDate || []);
  const [userPhone, setUserPhone] = React.useState(props.userDetails.phone || '');
  const [userEmail, setUserEmail] = React.useState(props.userDetails.email || '');
  const [addrLine1, setAddrLine1] = React.useState(props.userDetails.addressLine1 || '');
  const [addrLine2, setAddrLine2] = React.useState(props.userDetails.addressLine2 || '');
  const [city, setCity] = React.useState(props.userDetails.city || '');
  const [district, setDistrict] = React.useState(props.userDetails.district || '');
  const [state, setState] = React.useState(props.userDetails.state || '');
  const [country, setCountry] = React.useState(props.userDetails.country || '');
  const [pinCode, setPincode] = React.useState(props.userDetails.zipCode || '');
  const [invalidList, setInvalidList] = React.useState([]);
  const [isPageLoading, setisPageLoading] = React.useState(false);

  const countryDetails = props.countryDetails;
  let unmounted = false;

  React.useEffect(() => {
    console.log(props.userDetails)
  }, [])

  React.useEffect(() => {
    if(country === '' || country===undefined){
      setCountry(countryDetails.find(country => country.country_short_name === 'IN')?.country_name);
    }
  }, [countryDetails])

  React.useEffect(() => {
    if(country){
      getStateDetails()
    }
  },[country])

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const validate = (nextStep) => {
    let isValid = true;
    let tempInvalidList = [];

    if (nextStep === 2) {

      if (!userName) {
        tempInvalidList.push('name');
        isValid = false;
      }
      if (!userPhone) {
        tempInvalidList.push('phone');
        isValid = false;
      }
      if (/[a-zA-Z]/g.test(userPhone)) {
        tempInvalidList.push('phone');
        isValid = false;
      }
      if (userPhone.length !== 10) {
        tempInvalidList.push('phone');
        isValid = false;
      }
      if (!userEmail) {
        tempInvalidList.push('email');
        isValid = false;
      }
      if (!userEmail.match(/\S+@\S+\.\S+/)) {
        tempInvalidList.push('email');
        isValid = false;
      }
      if (!addrLine1) {
        tempInvalidList.push('addrLine1');
        isValid = false;
      }
      if (!city) {
        tempInvalidList.push('city');
        isValid = false;
      }
      if (!district) {
        tempInvalidList.push('district');
        isValid = false;
      }
      if (JSON.stringify(state) === JSON.stringify({})) {
        tempInvalidList.push('state');
        isValid = false;
      }
      if (JSON.stringify(country) === JSON.stringify({})) {
        tempInvalidList.push('country');
        isValid = false;
      }
      if (!pinCode) {
        tempInvalidList.push('pinCode');
        isValid = false;
      }

    }

    if (isValid) {
      let UserData = {
        'name': userName,
        'email': userEmail,
        'phone': userPhone,
        'addressLine1': addrLine1,
        'addressLine2': addrLine2,
        'city': city,
        'district': district,
        'state': state,
        'country': country,
        'zipCode': pinCode
      };
      handleForwardReg(nextStep, UserData);
    }
    else {
      setInvalidList(tempInvalidList);
    }
  }

  const handleForwardReg = (nextStep, UserData) => {
    props.updateActiveStep(nextStep);
    props.handleUserDetails(UserData);
  }

  const getStateDetails = async() => {
    setisPageLoading(true);
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/state-details/${country}`)
      .then((stateDetails) => {
        console.log(stateDetails.data);
        setStateDetails(stateDetails.data)
      })
      .catch((error) => {
        console.log(error);
        if (!unmounted) {
          toast.error('Failed to get location options!');
        }
      })
      .finally(() => {
        setisPageLoading(false);
        return function () {
          unmounted = true;
          source.cancel("Cancelling in cleanup");
        };
      })
  }
  if (isPageLoading) {
    return (
      <Box style={{ top: '50%' }}>
        <Loading isPageLoading={isPageLoading} />
      </Box>
    )
  }
  else{
  return (
    <Box className={classes.box}>
      <Card variant="outlined">
        <CardContent>
          <Grid container>
            <Grid item className={classes.grid}>
              <FormControl variant="standard">
                <Container className={classes.inputContainer}>
                  <InputLabel required htmlFor="component-error">User Name</InputLabel>
                  <TextField
                    error={invalidList.includes('name')}
                    id="name"
                    value={userName}
                    onChange={handleUserNameChange}
                    aria-describedby="component-error-text"
                    helperText={!invalidList.includes('name') ? '' : "Name is invalid"}
                    variant="standard"
                    className={classes.input}
                  />
                </Container>
                <Container className={classes.inputContainer}>
                  <InputLabel required htmlFor="component-error">User Phone</InputLabel>
                  <TextField
                    error={invalidList.includes('phone')}
                    id="phone"
                    value={userPhone}
                    onChange={(userPhone) => { setUserPhone(userPhone.target.value) }}
                    aria-describedby="component-error-text"
                    helperText={!invalidList.includes('phone') ? '' : "Phone Number is invalid"}
                    variant="standard"
                    className={classes.input}
                  />
                </Container>

              </FormControl>
            </Grid>
            <Grid item>
              <Container className={classes.inputContainer}>
                <InputLabel required htmlFor="component-error">User Email</InputLabel>
                <TextField
                  error={invalidList.includes('email')}
                  id="email"
                  value={userEmail}
                  onChange={(email) => { setUserEmail(email.target.value) }}
                  aria-describedby="component-error-text"
                  helperText={!invalidList.includes('email') ? '' : "Email Address is invalid"}
                  variant="standard"
                  className={classes.input}
                />
              </Container>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item style={{ width: '50%' }}>
              <FormControl error={true} variant="standard">
                <Container className={classes.inputContainer}>
                  <InputLabel required htmlFor="component-error">Address Line 1</InputLabel>
                  <TextField
                    error={invalidList.includes('addrLine1')}
                    id="addressLine1"
                    value={addrLine1}
                    onChange={(addrLine1) => { setAddrLine1(addrLine1.target.value) }}
                    aria-describedby="component-error-text"
                    helperText={!invalidList.includes('addrLine1') ? '' : "Address is invalid"}
                    variant="standard"
                    className={classes.input}
                  />
                </Container>
                <Container className={classes.inputContainer}>
                  <InputLabel required htmlFor="component-error">City</InputLabel>
                  <TextField
                    error={invalidList.includes('city')}
                    id="city"
                    value={city}
                    onChange={(city) => { setCity(city.target.value) }}
                    aria-describedby="component-error-text"
                    helperText={!invalidList.includes('city') ? '' : "City is invalid"}
                    variant="standard"
                    className={classes.input}
                  />
                </Container>
                <Container className={classes.inputContainer}>
                <InputLabel required htmlFor="component-error">State</InputLabel>
                  <Autocomplete
                    sx={{ width: 305, bottom: 5, position: 'relative', marginTop: '8px' }}
                    options={stateDetails || []}
                    autoHighlight
                    value={stateDetails.find(st => st.state_name === state) || ''}
                    getOptionLabel={(option) => option.state_name || ''}
                    id="state"
                    onChange={(event, value) => { setState(value.state_name) }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        required
                        helperText={!invalidList.includes('state') ? '' : "Invalid state value"}
                        error={invalidList.includes('state')}
                        onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'state')) }}
                        fullWidth
                        id={`state`}
                      //placeholder="State"
                      />
                    )}
                  />
                </Container>
                <Container className={classes.inputContainer}>
                <InputLabel required htmlFor="component-error">Country</InputLabel>
                  <Autocomplete
                    sx={{ width: 305, bottom: 5, position: 'relative', marginTop: '10px' }}
                    options={countryDetails}
                    autoHighlight
                    ListboxProps={{ style: { maxHeight: 270 } }}
                    value={countryDetails?.find(ctry => ctry.country_name === country) || {}}
                    getOptionLabel={(option) => option.country_name || ''}
                    id="country"
                    onChange={(event, value) => {
                      setState('')
                      setCountry(value.country_name)
                    }}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0, margin: 5 } }} {...props}>
                        {/* <img
                          loading="lazy"
                          width="20"
                          src={`https://flagcdn.com/w20/${option.iso2.toLowerCase()}.png`}
                          srcSet={`https://flagcdn.com/w40/${option.iso2.toLowerCase()}.png 2x`}
                          alt=""
                        /> */}
                        {option.country_name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        required
                        helperText={!invalidList.includes('country') ? '' : "Country is required"}
                        error={invalidList.includes('country')}
                        onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'country')) }}
                        fullWidth
                        id={`event-type`}
                      //placeholder="Country"
                      />
                    )}
                  />
                </Container>
              </FormControl>
            </Grid>
            <Grid>
              <Container className={classes.inputContainer}>
                <InputLabel htmlFor="component-error">Address Line 2</InputLabel>
                <TextField
                  error={invalidList.includes('addrLine2')}
                  id="addressLine2"
                  value={addrLine2}
                  onChange={(addrLine2) => { setAddrLine2(addrLine2.target.value) }}
                  aria-describedby="component-error-text"
                  helperText={!invalidList.includes('addrLine2') ? '' : "Address is invalid"}
                  variant="standard"
                  className={classes.input}
                />
              </Container>
              <Container className={classes.inputContainer}>
                <InputLabel required htmlFor="component-error">District</InputLabel>
                <TextField
                  error={invalidList.includes('district')}
                  id="district"
                  value={district}
                  onChange={(district) => { setDistrict(district.target.value) }}
                  aria-describedby="component-error-text"
                  helperText={!invalidList.includes('district') ? '' : "District is invalid"}
                  variant="standard"
                  className={classes.input}
                />
              </Container>
              <Container className={classes.inputContainer}>
                <InputLabel required htmlFor="component-error">PIN Code</InputLabel>
                <TextField
                  error={invalidList.includes('pinCode')}
                  id="zipCode"
                  value={pinCode}
                  onChange={(pinCode) => { setPincode(pinCode.target.value) }}
                  aria-describedby="component-error-text"
                  helperText={!invalidList.includes('pinCode') ? '' : "PIN Code is invalid"}
                  variant="standard"
                  className={classes.input}
                />
              </Container>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions style={{ margin: "5px auto", alignItems: "center", justifyContent: "center" }}>
          <Button variant='contained' size="medium" onClick={() => { validate(0) }}>Previous</Button>
          <Button variant='contained' disabled={props.duplicateInstitution} size="medium" onClick={() => { validate(2) }}>Next</Button>
        </CardActions>
      </Card>
      <Toaster/>
    </Box>
  );
                    }
}

export default UserReg;
