/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Box, Button, Typography, Link } from '@material-ui/core';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useStyles, StyledTableCell } from './AssessmentStyle';
import { useHistory } from 'react-router-dom';
import { AccessDefinition } from '../../constants/AccessDefinition/AccessDefinition';
import Loading from '../../components/loading/Loading';
import { formateTime } from '../../components/commonController/commonController';
import Custom_Button from '../../components/reusableElements/Custom_Button';

const Assessments = () => {

  const classes = useStyles();
  const history = useHistory();

  let unmounted = false;
  const currentUserProfile = JSON.parse(localStorage.getItem('userDetail'))?.profile?.name;
  const accessDfn = AccessDefinition.find(definition => definition.route === window.location.pathname);

  const [isPageLoading, setisPageLoading] = useState(false);
  const [isPageLoadingFailed, setisPageLoadingFailed] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState(new Date(new Date().getFullYear(), 0, 1));
  const [filterEndDate, setFilterEndDate] = useState(new Date(new Date().getFullYear(), 11, 31));
  const [assessmentDetails, setAssessmentDetails] = useState([]);
  const [assessmentObjPermission, setAssessmentObjPermission] = React.useState({});

  useEffect(() => {
    getAllAssessmentByDate()
  }, [filterStartDate, filterEndDate])

  const getAllAssessmentByDate = async () => {
    setisPageLoading(true);
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/assessment-info/assessment/${filterStartDate}/${filterEndDate}`)
      .then((response) => {
        console.log(response.data?.accessDefination);
        setAssessmentObjPermission(response.data?.accessDefination);
        let assessmentData = [];
        response.data?.assessmentList.forEach(assessment => {
          let examDateTime = [];
          examDateTime.push(...assessment.exams.map(exm => { return exm.details.map(detail => { return Number(new Date(detail.dateTime)) }) }));
          let flatedExamDateTimes = examDateTime.flat(1)
          var assessmentEndDateTime = new Date(Math.max.apply(null, flatedExamDateTimes));
          var assessmentStartDateTime = new Date(Math.min.apply(null, flatedExamDateTimes));
          assessmentData.push({ id: assessment._id, owner: assessment.owner, title: assessment.title, assessmentStartDateTime, assessmentEndDateTime })
        });
        setAssessmentDetails(assessmentData);
      })
      .catch((error) => {
        if (!unmounted) {
          if (error.request.status === 403) {
            localStorage.removeItem('userDetail');
            localStorage.removeItem('userToken');
            localStorage.removeItem('activeSubscription');
            history.replace('/login');
            history.go(0);
          }
        }
      })
      .finally(() => {
        setisPageLoading(false);
        return function () {
          unmounted = true;
          source.cancel("Cancelling in cleanup");
        };
      });
  }

  if (isPageLoadingFailed) {
    return (
      <Box style={{ paddingTop: '50%', backgroundColor: 'white' }}>
        <Loading isPageLoading={isPageLoading} />
      </Box>
    )
  }
  else if (isPageLoading) {
    return (
      <Box style={{ top: '50%' }}>
        <Loading isPageLoading={isPageLoading} />
      </Box>
    )
  }
  else {
    return (
      <React.Fragment>
        <Box component="span">
          <Grid container >
            <Grid item xs={6} justifyContent='flex-end' className={[classes.gridElement, classes.hideButtons]}>
              <Custom_Button variant='contained' size="medium" onClick={() => { history.push(`/assessments/add-assessment`, { assessmentObjPermission }) }} label={'Add Assessment'} accessGranted={assessmentObjPermission.create} />
            </Grid>
            <Grid item xs={6} style={{ justifyContent: 'space-around' }} className={classes.gridElement}>
              <LocalizationProvider style={{ margin: 0, marginRight: 10 }} dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DesktopDatePicker
                    label='Start Date'
                    value={filterStartDate}
                    inputFormat="MM/dd/yyyy"
                    onChange={(date) => { setFilterStartDate(date) }}
                    renderInput={(params) => <TextField variant='standard' style={{ width: 150, padding: 0 }} {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
              <LocalizationProvider style={{ margin: 0, marginLeft: 10 }} dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DesktopDatePicker
                    label='End Date'
                    value={filterEndDate}
                    inputFormat="MM/dd/yyyy"
                    onChange={(date) => { setFilterEndDate(date) }}
                    renderInput={(params) => <TextField variant='standard' style={{ width: 150, padding: 0 }} {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Grid container rowSpacing={1} columnSpacing={1}>
            {
              assessmentDetails?.length > 0 && assessmentDetails?.map((assessment) => {
                return (<Grid key={assessment.id} item style={{ width: 'auto' }}>
                  <Card style={{ width: 'auto', margin: '20px 0px 20px 0px' }}>
                    <CardContent style={{ paddingBottom: 17 }}>
                      <Typography gutterBottom variant="h5" component="div" style={{ color: 'grey', textAlign: 'center' }}>
                        {assessment.title}
                      </Typography>
                      <Typography style={{ padding: 10 }}>
                        <span className={classes.label}>Owner : </span> {assessment.owner?.name}
                      </Typography>
                      <Typography style={{ padding: 10 }}>
                        <span className={classes.label}>Start Date/Time : </span> {assessment.assessmentStartDateTime.toDateString() + ', ' + formateTime(assessment.assessmentStartDateTime)?.strTime}
                      </Typography>
                      <Typography style={{ padding: 10 }}>
                        <span className={classes.label}>End Date/Time : </span> {assessment.assessmentEndDateTime.toDateString() + ', ' + formateTime(assessment.assessmentEndDateTime)?.strTime}
                      </Typography>
                      <CardActions style={{ position: 'relative' }}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                          <Grid item xs={6}>
                            <Button onClick={() => { }} variant='outlined' size="small" style={{ cursor: 'pointer' }}>Results</Button>
                          </Grid>
                          <Grid item xs={6}>
                            <Button onClick={() => { history.push(`/assessments/assessment-detail/${assessment.id}`, { startDateTime: assessment.assessmentStartDateTime, endDateTime: assessment.assessmentEndDateTime }) }} variant='outlined' size="small" style={{ position: 'absolute', right: 8, cursor: 'pointer' }}>Details <ArrowForwardIosIcon style={{ fontSize: 9, cursor: 'pointer' }} /></Button>
                          </Grid>
                        </Grid>
                      </CardActions>
                    </CardContent>
                  </Card>
                </Grid>)
              })
            }
            {
              assessmentDetails?.length === 0 &&
              <Box>
                <Typography sty>No assessments created!</Typography>
              </Box>
            }
          </Grid>
        </Box>
      </React.Fragment>
    )
  }
}

export default Assessments