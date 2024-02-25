import React, { useState, useEffect } from 'react'
import { eventAudienceCategory } from '../../../constants/EventAudienceCategory';
import { Box, Button, Container, Typography, TextField } from '@material-ui/core';
import { Autocomplete } from '@mui/material';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import { useStyles } from '../EventsStyles';
import UserAudience from '../newEvent/UserAudience';
import ClassAudience from '../newEvent/ClassAudience';
import ProfileAudience from '../newEvent/ProfileAudience';

const AddAudience = (params) => {

  const classes = useStyles();

  const [selectedCatogery, setSelectedCategory] = useState('users');
  const [includeCaregivers, setIncludeCareGivers] = React.useState(false);
  const [allActiveUsers, setAllActiveUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = React.useState([]);

  useEffect(() => {
    setAllActiveUsers([...params.allActiveUsers])
  },[])

  useEffect(() => {
    setSelectedUsers([]);
    if (selectedCatogery === 'institution') {
        handleSelectedUsers(allActiveUsers);
    }
}, [selectedCatogery])

const handleSelectedUsers = (allActiveUsers) => {
  let tempSelectedList = []
  allActiveUsers.forEach(user => {
      if ((includeCaregivers && user.profile?.name === 'Caregiver') || (user.profile?.name !== 'Caregiver')) {
          tempSelectedList.push({ userId: user._id, userEmail: user.email, userPhone: user.phone1,userProfile: user.profile,userName: user.name });
      }
  });

  setSelectedUsers([...tempSelectedList])
}

  return (
    <React.Fragment>
      <Box style={{ marginBottom: 20 }}>
        <Typography style={{ paddingTop: 10, paddingRight: 10 }} className={classes.label}>Audience Category :</Typography>
        <Autocomplete
          style={{ minWidth: 250 }}
          disabled={false}
          options={eventAudienceCategory || []}
          getOptionLabel={(option) => option.label || ''}
          value={eventAudienceCategory.find(category => category.value === selectedCatogery)}
          isOptionEqualToValue={(option, value) => option?.value === value}
          onChange={(event) => { setSelectedCategory(eventAudienceCategory[event.target?.dataset?.optionIndex]?.value) }}
          id="disable-close-on-select"
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              required
              fullWidth
              id={`event-type`}
              placeholder="audience"
            />)}
        />
        {(selectedCatogery === 'institution') && <Box>
          <Typography><Checkbox checked={includeCaregivers} onChange={() => { setIncludeCareGivers(!includeCaregivers) }} /><span>Include Caregivers</span></Typography>
        </Box>}
      </Box>
      {
        selectedCatogery !== '' &&
        selectedCatogery !== 'institution' &&
        <React.Fragment>
          <Typography style={{ marginTop: 0 }} className={classes.header}>
            Audience Detail :
          </Typography>
          {
            selectedCatogery === 'users' &&
            <UserAudience selectedUsers={(userIdEmailList) => { setSelectedUsers([...userIdEmailList]) }} />

          }
          {
            selectedCatogery === 'classes' &&
            <ClassAudience selectedUsers={(userIdEmailList) => { setSelectedUsers([...userIdEmailList]) }} />
          }
          {
            selectedCatogery === 'profile' &&
            <ProfileAudience selectedUsers={(userIdEmailList) => { setSelectedUsers([...userIdEmailList]) }} />
          }
        </React.Fragment>
      }
      <Grid container spacing={5} style={{position: 'relative'}}>
        <Grid xs={6} md={6} justifyContent='flex-end' style={{ maxWidth: '46%' }} className={classes.gridElement}>
          <Button variant='contained' size="medium" disabled={selectedUsers?.length === 0} style={{ marginRight: 3, position: 'relative', top: '80%' }} onClick={() => { params.onAddAudience(selectedUsers) }}>Add</Button>
        </Grid>
        <Grid xs={6} md={6} justifyContent='flex-start' style={{ maxWidth: '46%' }} className={classes.gridElement}>
          <Button variant='contained' size="medium" style={{ marginLeft: 3, position: 'relative', top: '80%'  }} onClick={() => {params.onCancel() }}>Cancel</Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default AddAudience