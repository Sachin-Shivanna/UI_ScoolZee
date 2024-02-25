/* eslint-disable react/jsx-pascal-case */
import { Box, Button, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect } from 'react'
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from '@material-ui/core';
import { useHistory } from 'react-router-dom'
import { Input, Modal } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { StyledStudentTableCell, StyledTableCell, useStyles } from './NewClassStyle';
import Loading from '../../../../components/loading/Loading';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { columns } from '../../../../constants/ClassInfoTableHeaders';
import { studentsColumns } from '../../../../constants/ClassStudentsTable';
import { Autocomplete } from '@mui/material';
import AddStudents from './AddStudents';
import Custom_Button from '../../../../components/reusableElements/Custom_Button';
import { breadcrumbsContext } from '../../../../components/context/Context';
import NewFeeStructure from '../../feesStructures/newFeeStructure/NewFeeStructure';

const NewClass = (params) => {
  const classes = useStyles();
  const history = useHistory();

  let unmounted = false;
  const classObjPermission = params?.location?.state?.classObjPermission;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isPageLoading, setisPageLoading] = React.useState(false);
  const [isPageLoadingFailed, setisPageLoadingFailed] = React.useState(false);
  const [invalidList, setInvalidList] = React.useState([]);
  const [allSubjects, setAllSubjects] = React.useState([]);
  const [allSubjectsList, setAllSubjectsList] = React.useState([]);
  const [checkedAllSubjects, setCheckedAllSubjects] = React.useState([]);
  const [checkedSelectedSubjects, setCheckedSelectedSubjects] = React.useState([]);
  const [selectedSubjects, setSelectedSubjects] = React.useState([]);
  const [sections, setSections] = React.useState(1)
  const [addNewSubject, setaddNewSubject] = React.useState(false);
  const [allFacultyList, setAllFacultyList] = React.useState([]);
  const [subjectUpdated, setSubjectUpdated] = React.useState(false);
  const [leadUpdated, setLeadUpdated] = React.useState(true);
  const [addStudentsEnable, setAddStudentsEnable] = React.useState(false);
  const [newSubjectName, setNewSubjectName] = React.useState('');
  const [allStudents, setAllStudents] = React.useState([]);
  const [editSubjects, setEditSubjects] = React.useState(false);
  const [disableSubjectUpdate, setDisableSubjectUpdate] = React.useState(false);
  const [subjectsToUpdateList, setSubjectsToUpdateList] = React.useState([]);
  const [subjInstructorDetails, setSubjInstructorDetails] = React.useState([]);
  const [subjSessionsPerWeek, setSubjSessionsPerWeek] = React.useState([]);
  const [leadInstructor, setLeadInstructor] = React.useState([]);
  const [feeStructureList, setFeeStructureList] = React.useState([]);
  const [feeStructureObjPermission, setFeeStructureObjPermission] = React.useState({});
  const [openFeeModal, setOpenFeeModal] = React.useState(false)
  const [breadcrumbsList, setBreadcrumbsList] = React.useContext(breadcrumbsContext);
  const [newClassDetails, setNewClassDetails] = React.useState({
    name: '',
    sections: ['A'],
    year: '',
    leadInstructor: [],
    subjects: [],
    students: []
  });

  useEffect(() => {
    if (JSON.stringify({}) !== JSON.stringify(window.location.pathname)) {
      setBreadcrumbsList([
        breadcrumbsList,
        <Link
          underline="hover"
          style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}
          color="inherit"
          href="#"
        >
          New Class
        </Link>,
      ])
    }
  }, [window.location.pathname])

  useEffect(() => {
    getAllSubjects();
    getFacultyList();
    getAllFeeStructurs();
    getAllFeeStructureAccess()
  }, []);

  useEffect(() => {
    let tempClassDetails = newClassDetails;
    tempClassDetails.subjects = selectedSubjects;
    setNewClassDetails(tempClassDetails);
    setSubjectUpdated(false);
    setTimeout(() => {
      setSubjectUpdated(true);
    }, 0);
  }, [selectedSubjects]);

  useEffect(() => {
    let tempClassDetails = newClassDetails;
    tempClassDetails.leadInstructor = leadInstructor;
    setNewClassDetails(tempClassDetails);
    setLeadUpdated(false)
    setTimeout(() => {
      setLeadUpdated(true);
    }, 0);
  }, [leadInstructor])

  const getAllFeeStructureAccess = async () => {
    unmounted = false;
    setisPageLoading(true);
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/fees-structure-info/fee-structure`)
      .then((response) => {
        console.log(response.data?.feeStructureList);
        setFeeStructureObjPermission(response.data?.accessDefination)

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

  const getAllFeeStructurs = async () => {
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/fees-structure-info/fee-structure`)
      .then((response) => {
        setFeeStructureList([...response.data.feeStructureList])
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
        return function () {
          unmounted = true;
          source.cancel("Cancelling in cleanup");
        };
      });
  }

  const getAllSubjects = async () => {
    setisPageLoading(true);
    setAllSubjects([]);
    setAllSubjectsList([]);
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/subject-info/subject`)
      .then((response) => {
        setAllSubjects([...response.data]);
        setAllSubjectsList([...response.data]);
        setaddNewSubject(false);
        setNewClassDetails({ ...newClassDetails, year: getFinancialYear() })
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
        setisPageLoadingFailed(true);
      })
      .finally(() => {
        setisPageLoading(false);
        return function () {
          unmounted = true;
          source.cancel("Cancelling in cleanup");
        };
      });
  }

  const getFacultyList = async () => {
    setAllFacultyList([])
    setisPageLoading(true);
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.get(`${process.env.REACT_APP_SERVER}/faculty-info/user`)
      .then((response) => {
        console.log(allFacultyList)
        setAllFacultyList(response.data)
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
        setisPageLoadingFailed(true);
      })
      .finally(() => {
        setisPageLoading(false);
        return function () {
          unmounted = true;
          source.cancel("Cancelling in cleanup");
        };
      });
  }

  const getFinancialYear = () => {
    var fiscalyear = "";
    var today = new Date();
    if ((today.getMonth() + 1) <= 3) {
      fiscalyear = (today.getFullYear() - 1) + "-" + today.getFullYear()
    } else {
      fiscalyear = today.getFullYear() + "-" + (today.getFullYear() + 1)
    }
    return fiscalyear
  }

  const handleAddNewSubject = async () => {
    if (newSubjectName === '') {
      toast.error('Subject name is required.');
    }
    else {
      setisPageLoading(true);
      unmounted = false;
      const source = axios.CancelToken.source();
      await axios.post(`${process.env.REACT_APP_SERVER}/add-subject/subject`, {
        newSubjectName
      })
        .then((response) => {
          if (response.status === 200) {
            setNewSubjectName('');
            toast.success('Saved');
            getAllSubjects();
          }
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
            else {
              setNewSubjectName('');
              toast.error(error.response.data);
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
  }

  const handleSelectAllSubjects = () => {
    setSelectedSubjects(allSubjectsList);
    setCheckedSelectedSubjects([...checkedSelectedSubjects, checkedAllSubjects]);
    setAllSubjectsList([]);
    setCheckedAllSubjects([]);
  }

  const handleDeselectAllSubjects = () => {
    setSelectedSubjects([]);
    setAllSubjectsList(allSubjects);
    setCheckedSelectedSubjects([])
  }

  const handleSelectChecked = () => {
    setSelectedSubjects([...selectedSubjects, ...filterListSelect(checkedAllSubjects)]);
  }

  const filterListSelect = (toBeSelected) => {
    setAllSubjectsList(allSubjectsList.filter(subject => !toBeSelected.includes(subject._id)));
    return allSubjectsList.filter(subject => toBeSelected.includes(subject._id));
  }

  const handleDeselectChecked = () => {
    setAllSubjectsList([...allSubjectsList, ...filterListDeselect(checkedSelectedSubjects)]);
  }

  const filterListDeselect = (toBeDeselected) => {
    setSelectedSubjects(selectedSubjects.filter(subject => !toBeDeselected.includes(subject._id)));
    return selectedSubjects.filter(subject => toBeDeselected.includes(subject._id));
  }

  const handleOnSubjectChecked = (subjectId) => {
    if (checkedAllSubjects.includes(subjectId)) {
      setCheckedAllSubjects(checkedAllSubjects.filter(subId => subId !== subjectId));
    }
    else if (checkedSelectedSubjects.includes(subjectId)) {
      setCheckedSelectedSubjects(checkedSelectedSubjects.filter(subId => subId !== subjectId));
    }
    else if (allSubjectsList.findIndex(subject => subject._id === subjectId) !== -1) {
      setCheckedAllSubjects([...checkedAllSubjects, subjectId]);
    }
    else if (selectedSubjects.findIndex(subject => subject._id === subjectId) !== -1) {
      setCheckedSelectedSubjects([...checkedSelectedSubjects, subjectId]);
    }
  }

  const handleIncrementSection = () => {
    if (newClassDetails.sections.length < 5) {
      let sections = ['A'];
      for (let i = 1; i < newClassDetails.sections.length + 1; i++) {
        sections = [...sections, String.fromCharCode(sections[i - 1].charCodeAt(0) + 1)]
      }
      const tempClassData = { ...newClassDetails };
      tempClassData.sections = sections;
      setNewClassDetails(tempClassData);
    }
  }
  const handleDecrementSection = () => {
    let sections = ['A'];
    for (let i = 1; i < newClassDetails.sections.length - 1; i++) {
      sections = [...sections, String.fromCharCode(sections[i - 1].charCodeAt(0) + 1)]
    }
    const tempClassData = { ...newClassDetails };
    tempClassData.sections = sections;
    setNewClassDetails(tempClassData);
  }


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditSubjects = async (newName, subjectId) => {
    setDisableSubjectUpdate(newName?.trim() === '');
    setDisableSubjectUpdate(subjectsToUpdateList.find(subject => subject.name?.trim() === '')?.length > 0);
    let tempSubject = allSubjectsList.find(subject => subject._id === subjectId)
    tempSubject.name = newName;
    setSubjectsToUpdateList([...subjectsToUpdateList.filter((subject) => subject._id !== subjectId), tempSubject])
    setAllSubjectsList([...allSubjectsList.filter(subject => subject._id !== subjectId), tempSubject]);

  }

  const handleSubjectEditCancel = () => {
    setSubjectsToUpdateList([])
    setAllSubjectsList([...allSubjects])
    setEditSubjects(false)
  }

  const handleUpdateSubjects = async () => {
    let finalSubjectUpdateList = [...subjectsToUpdateList.filter((subject) => subject.name.trim() !== undefined)];
    if (finalSubjectUpdateList.length === 0) {
      toast.error('No Subjects to update');
      return;
    }
    setisPageLoading(true);
    unmounted = false;
    const source = axios.CancelToken.source();
    await axios.patch(`${process.env.REACT_APP_SERVER}/update-subject/subject`, {
      subjectDetails: finalSubjectUpdateList
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success('Subject updated!');
          setEditSubjects(false);
          setSubjectsToUpdateList([])

        }
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
          else {
            toast.error('Something went wrong!');
          }
        }
        setisPageLoadingFailed(true);
      })
      .finally(() => {
        setisPageLoading(false);
        return function () {
          unmounted = true;
          source.cancel("Cancelling in cleanup");
        };
      });
  }

  const handleSelectedStudents = (students) => {
    setAllStudents(students)
    let tempClass = newClassDetails;
    tempClass.students = students;
    setNewClassDetails(tempClass)
  }

  const handleInstructor = (subjectId, section, instructorIndex) => {
    setSubjInstructorDetails([...subjInstructorDetails, { subjectId, section, instructorId: allFacultyList[instructorIndex]?._id }]);
  }

  const handleLeadInstructor = (section, leadInstructorIndex) => {
    console.log(allFacultyList, leadInstructorIndex);
    let tempLeadInstructor = leadInstructor;
    tempLeadInstructor = tempLeadInstructor.filter(currSection => currSection.section !== section);
    tempLeadInstructor.push({ section, Id: allFacultyList[leadInstructorIndex]?._id || '' })
    setLeadInstructor(tempLeadInstructor)
  }

  const handleSubSessions = (subjectId, section, session) => {
    let tempSubjSessionsPerWeek = subjSessionsPerWeek.filter(instr => `${instr.subjectId}_${instr.section}` !== `${subjectId}_${section}`) ?
      subjSessionsPerWeek.filter(instr => `${instr.subjectId}_${instr.section}` !== `${subjectId}_${section}`) : [];
    setSubjSessionsPerWeek([...tempSubjSessionsPerWeek, { subjectId, section, sessionsPerWeek: session }]);
    //{ subjectId, section, sessionsPerWeek: session }
  }

  const handleSaveClass = async (addNew) => {
    if (validate()) {
      let finalClassDetails = newClassDetails;
      finalClassDetails.subjSessionsPerWeek = subjSessionsPerWeek;
      finalClassDetails.subjInstructorDetails = subjInstructorDetails;
      setisPageLoading(true);
      unmounted = false;
      const source = axios.CancelToken.source();
      await axios.post(`${process.env.REACT_APP_SERVER}/add-new-class/class`, {
        classDetails: finalClassDetails
      })
        .then((response) => {
          if (response.status === 200) {
            toast.success('Class Saved!');
            if (addNew) {
              window.location.reload();
            }
            else {
              history.goBack();
            }
          }
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
            else {
              toast.error(error.response.data)
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
  }

  const validate = () => {
    let isValid = false;
    if (newClassDetails.name?.trim() === '') {
      toast.error('Class name is required');
      return isValid
    }
    if (newClassDetails.feeStructure?.trim() === '') {
      toast.error('Fees amount is required');
      return isValid
    }
    if (newClassDetails.leadInstructor?.length !== newClassDetails.sections.length) {
      toast.error(`Lead instructor is required for all sections`);
      return isValid
    }
    // newClassDetails.sections.forEach(section => {
    //   if (newClassDetails.students.filter(student => student.section === section)?.length === 0) {
    //     toast.error(`Students are not added to ${section} section`);
    //     return isValid
    //   }
    // });

    if (selectedSubjects.length === 0) {
      toast.error(`Subjects are required for a class`);
      return isValid
    }

    if (subjInstructorDetails?.length !== newClassDetails.sections?.length * newClassDetails.subjects?.length) {
      toast.error(`Instructor is required for all the subjects`);
      return isValid
    }

    if (subjInstructorDetails?.length !== subjSessionsPerWeek?.length) {
      toast.error(`All subjects should have atleast 1 session`);
      return isValid
    }

    isValid = true;

    return isValid
  }


  const customList = (items) => {
    if (allSubjects.length === 0) {
      return (
        <Paper style={{ minHeight: 264 }}>
          <Typography className={classes.label} style={{ textAlign: 'center', paddingTop: '30%' }}> Please add subjects. </Typography>
        </Paper>
      )
    }
    return (
      <React.Fragment>
        <Paper style={{ minHeight: 305, maxHeight: 305, overflow: 'auto' }}>
          <List dense component="div" role="list">
            {items.map((subject) => {
              const labelId = `transfer-list-item-${subject?._id}-label`;

              return (
                <ListItem
                  key={subject?._id}
                  role="listitem"
                  button
                  onClick={() => { handleOnSubjectChecked(subject?._id) }}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={checkedAllSubjects.includes(subject?._id) || checkedSelectedSubjects.includes(subject?._id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={`${subject?.name}`} />
                </ListItem>
              );
            })}
            <ListItem />
          </List>
        </Paper>
      </React.Fragment>)
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

        <Stack spacing={2}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" style={{ marginBottom: 5 }} />}
            aria-label="breadcrumb"
          >
            {breadcrumbsList}
          </Breadcrumbs>
        </Stack>

        {JSON.parse(localStorage.getItem('userDetail'))?.profile?.name === 'Admin' ?
          (<Box component="span" className={classes.hideButtons}>
            <Grid container spacing={1}>
              <Grid item xs={6} md={6} justifyContent='flex-end' style={{ paddingRight: 4 }} className={classes.gridElement}>
                <Custom_Button variant='contained' size="medium" onClick={() => { handleSaveClass(false) }} label={'Save'} accessGranted={classObjPermission?.create} />
              </Grid>
              <Grid item xs={6} md={6} justifyContent='space-between' style={{ paddingLeft: 4 }} className={classes.gridElement}>
                <Custom_Button variant='contained' size="medium" onClick={() => { handleSaveClass(true) }} label={'Save and New'} accessGranted={classObjPermission?.create} />
                <Button variant='outlined' size="small" style={{ right: '18px' }} onClick={() => { setAddStudentsEnable(true) }}>Add Students</Button>
              </Grid>
            </Grid>
          </Box>) : <span></span>
        }
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography className={classes.header}>
                Details :
              </Typography>
              <Container style={{ paddingTop: 10 }}>
                <Box container spacing={5} className={classes.grid}>
                  <Box xs={12} md={6} className={classes.gridElement}>
                    <Typography className={classes.label}>Name :</Typography>
                    <TextField
                      style={{ flex: 1 }}
                      inputProps={{
                        className: classes.inputDesign
                      }}
                      placeholder={`Class Name`}
                      helperText={!invalidList.includes('name') ? '' : "Name is required"}
                      error={invalidList.includes('name')}
                      onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'name')) }}
                      value={newClassDetails.name}
                      id="name"
                      onChange={(name) => { setNewClassDetails({ ...newClassDetails, name: name.target.value }) }}
                      variant="standard"
                    />
                  </Box>
                  <Box xs={12} md={6} className={classes.gridElement}>
                    <Typography className={classes.label}>Fees :</Typography>
                    {<Autocomplete
                      style={{ width: 350 }}
                      options={feeStructureList || []}
                      disableClearable
                      getOptionLabel={(option) => option.name}
                      value={feeStructureList.find(fee => fee._id === newClassDetails.feeStructure) || null}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      onChange={(event) => { setNewClassDetails({ ...newClassDetails, feeStructure: feeStructureList[event.target.value]?._id }) }}
                      id="disable-close-on-select"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          required
                          id={`feeStructure`}
                          style={{ paddingLeft: 4 }}
                          placeholder="Fee Structure"
                        />)}
                    />}
                    <Box style={{ marginLeft: 20 }}>
                      <Button onClick={() => { setOpenFeeModal(true)/*history.push(`/setup/add-fee`, { feeStructureObjPermission })*/ }} style={{ backgroundColor: '#101F33', color: 'white' }}>Add Fee</Button>
                    </Box>
                  </Box>
                  <Box xs={12} md={6} className={classes.gridElement}>
                    <Typography className={classes.label}>Year :</Typography>
                    <Typography
                      style={{ flex: 1, paddingLeft: 5 }}
                    >{newClassDetails.year}</Typography>
                  </Box>
                  <Box xs={12} md={6} className={classes.gridElement}>
                    <Typography style={{ left: '5px' }} className={classes.label}>Number of sections :</Typography>
                    <Box style={{ flex: 1 }}>
                      <Button onClick={handleDecrementSection} style={{ fontSize: 50, position: 'relative', bottom: '12px', left: '16px', backgroundColor: '#101F33', color: 'white', height: '1em', width: '1em', borderRadius: 25 }}>
                        <RemoveOutlinedIcon onClick={() => { sections > 1 ? setSections(sections - 1) : setSections(sections) }} />
                      </Button>
                    </Box>
                    <Box style={{ flex: 1, height: '1em', width: '1em' }}>
                      <Typography className={classes.label} style={{ fontSize: 50, position: 'relative', bottom: '22px' }}>{newClassDetails.sections?.length}</Typography>
                    </Box>
                    <Box style={{ flex: 1 }}>
                      <Button onClick={handleIncrementSection} style={{ fontSize: 50, position: 'relative', bottom: '12px', right: '45px', backgroundColor: '#101F33', color: 'white', height: '1em', width: '1em', borderRadius: 25 }}>
                        <AddOutlinedIcon onClick={() => { sections < 5 ? setSections(sections + 1) : setSections(sections) }} />
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Container>
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <Box style={{ padding: 5 }}>
                    <Button variant='outlined' style={{ width: '45%' }} color='inherit' size="small" onClick={() => { setaddNewSubject(true) }}><AddCircleOutlineIcon style={{ paddingRight: 3 }} />Add</Button>
                    <Button variant='outlined' style={{ width: '45%', float: 'right' }} color='inherit' size="small" onClick={() => { setEditSubjects(true) }}><EditIcon style={{ paddingRight: 3 }} />Edit</Button>
                  </Box>
                  {customList(allSubjectsList)}
                </Grid>
                <Grid item xs={2} style={{ paddingTop: 47 }}>
                  <Grid container direction="column" alignItems="center" style={{ paddingTop: '75px' }}>
                    <Button
                      sx={{ my: 0.5 }}
                      variant="outlined"
                      size="small"
                      onClick={handleSelectAllSubjects}
                      disabled={allSubjectsList.length === 0}
                      aria-label="move all right"
                    >
                      ≫
                    </Button>
                    <Button
                      sx={{ my: 0.5 }}
                      variant="outlined"
                      size="small"
                      onClick={handleSelectChecked}
                      disabled={checkedAllSubjects.length === 0}
                      aria-label="move selected right"
                    >
                      &gt;
                    </Button>
                    <Button
                      sx={{ my: 0.5 }}
                      variant="outlined"
                      size="small"
                      onClick={handleDeselectChecked}
                      disabled={checkedSelectedSubjects.length === 0}
                      aria-label="move selected left"
                    >
                      &lt;
                    </Button>
                    <Button
                      sx={{ my: 0.5 }}
                      variant="outlined"
                      size="small"
                      onClick={handleDeselectAllSubjects}
                      disabled={selectedSubjects.length === 0}
                      aria-label="move all left"
                    >
                      ≪
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={5} style={{ paddingTop: 47 }}>
                  {customList(selectedSubjects)}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} >
              <Typography className={classes.header}>
                Students :
              </Typography>
              <Box style={{ maxHeight: 605, overflow: 'auto' }}>
                {
                  newClassDetails?.sections.map((section) => (
                    <Box key={section} style={{ marginTop: 10 }}>
                      <Typography style={{ textAlign: 'center' }}>
                        Section - {section}
                      </Typography>
                      <Paper style={{ minHeight: 400, height: 605 / newClassDetails?.sections?.length }}>
                        {
                          allStudents.filter(student => student.section === section).length > 0 ?
                            <Box style={{ minHeight: 400, height: 605 / newClassDetails?.sections?.length, position: 'relative' }}>
                              <TableContainer sx={{ maxHeight: '100vh' }}>
                                <Table stickyHeader aria-label="sticky table">
                                  <TableHead>
                                    <TableRow>
                                      {studentsColumns.map((column) => (
                                        <StyledStudentTableCell
                                          key={column.id}
                                          align={column.align}
                                          style={{ minWidth: column.minWidth }}
                                        >
                                          {column.label}
                                        </StyledStudentTableCell>
                                      ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {
                                      allStudents.filter(student => student.section === section)
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((studentFiltered) => {
                                          return (
                                            <TableRow role="checkbox" tabIndex={-1} key={studentFiltered._id}>
                                              {
                                                studentsColumns.map((column) => {
                                                  return (
                                                    <TableCell key={column.id} align={column.align} style={{ padding: 0 }}>
                                                      {
                                                        column.id === 'name'
                                                          ? studentFiltered.name
                                                          : column.id === 'phone'
                                                            ? studentFiltered.phone1
                                                            : column.id === 'active'
                                                              ? <Checkbox
                                                                disabled
                                                                checked={studentFiltered.active} />
                                                              : <span />
                                                      }
                                                    </TableCell>
                                                  )
                                                })
                                              }
                                            </TableRow>
                                          )
                                        })
                                    }
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              <TablePagination
                                className={[classes.pagination, classes.paginationPosition]}
                                rowsPerPageOptions={[5, 10]}
                                component="div"
                                count={allStudents.filter(student => student.section === section)?.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                              />
                            </Box>
                            :
                            <Typography style={{ textAlign: 'center', verticalAlign: 'middle', lineHeight: '400px' }}>
                              No students added to this section.
                            </Typography>
                        }
                      </Paper>
                    </Box>
                  ))
                }
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Toaster />
        <Dialog open={addNewSubject} onClose={() => {
          setNewSubjectName('')
          setaddNewSubject(false)
        }}>
          <DialogTitle>New Subject</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the Subject name.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Subject :"
              type="string"
              fullWidth
              value={newSubjectName}
              onChange={(name) => {
                setNewSubjectName(name.target.value)
              }}
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setNewSubjectName('')
                setaddNewSubject(false)
              }}>Cancel</Button>
            <Button
              variant='contained'
              style={{ backgroundColor: '#101F33', color: 'white' }}
              onClick={() => {
                handleAddNewSubject()
              }}>
              Add Subject
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editSubjects} onClose={() => { handleSubjectEditCancel() }}>
          <DialogTitle>Edit Subject</DialogTitle>
          <DialogContent>
            {
              checkedAllSubjects.length === 0 &&
              <Typography>
                Please select the subjects to edit.
              </Typography>
            }
            {
              checkedAllSubjects.length > 0 && checkedAllSubjects.map((subjectId) => {
                return (
                  <TextField
                    key={subjectId}
                    margin="dense"
                    id="name"
                    type="string"
                    fullWidth
                    value={allSubjectsList.find(subject => subject._id === subjectId)?.name}
                    onChange={(name) => { handleEditSubjects(name.target.value, subjectId) }}
                    variant="standard"
                  />
                )
              })
            }

          </DialogContent>
          <DialogActions>
            <Button onClick={() => { handleSubjectEditCancel() }}>Cancel</Button>
            {
              (checkedAllSubjects.length > 0) &&
              <Box>
                <Button variant='contained' disabled={disableSubjectUpdate} style={{ backgroundColor: '#101F33', color: 'white' }} onClick={() => { handleUpdateSubjects() }}>Save</Button>
              </Box>
            }
          </DialogActions>

        </Dialog>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: '100vh', marginTop: '15px' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    column.id !== 'totalStudents' && <StyledTableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  newClassDetails.sections?.map((section) => {
                    return (
                      <TableRow role="checkbox" tabIndex={-1} key={section}>
                        {columns.map((column) => {
                          return (
                            column.id !== 'totalStudents' && <TableCell key={column.id} align={column.align} style={column.style}>
                              {
                                column.id === 'class'
                                  ? newClassDetails.name
                                  : column.id === 'section'
                                    ? section
                                    : column.id === 'leadInstructor' && leadUpdated
                                      ? <Autocomplete
                                        style={{ width: 200 }}
                                        options={allFacultyList || []}
                                        disableClearable
                                        getOptionLabel={(option) => option.name}
                                        value={allFacultyList.find(faculty => faculty._id === newClassDetails.leadInstructor?.find(instr => instr.section === section)?.Id) ?
                                          allFacultyList.find(faculty => faculty._id === newClassDetails.leadInstructor?.find(instr => instr.section === section)?.Id) : null}
                                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                        onChange={(event) => { handleLeadInstructor(section, event.target.dataset?.optionIndex) }}
                                        id="disable-close-on-select"
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            variant="outlined"
                                            required
                                            id={`leadInstructor-${section}`}
                                            label={column.label}
                                            placeholder="Name"
                                          />)}
                                      /> : column.id === 'subject' || column.id === 'instructor' || column.id === 'sessionsPerWeek'
                                        ? newClassDetails.subjects?.map((subject) => {
                                          return (subjectUpdated &&
                                            <TableRow role="checkbox" tabIndex={-1} key={subject._id}>
                                              <TableCell key={subject.id} align={column.align} style={column.style}>

                                                {
                                                  column.id === 'subject'
                                                    ? subject.name
                                                    : column.id === 'instructor'
                                                      ? <Autocomplete
                                                        style={{ width: 200 }}
                                                        options={allFacultyList || []}
                                                        disableClearable
                                                        getOptionLabel={(option) => option.name}
                                                        value={allFacultyList.find(faculty => faculty._id === subjInstructorDetails.find(instr => instr.section === section && instr.subjectId === subject._id)?.instructorId) ?
                                                          allFacultyList.find(faculty => faculty._id === subjInstructorDetails.find(instr => instr.section === section && instr.subjectId === subject._id)?.instructorId) : null}
                                                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                                        onChange={(event) => { handleInstructor(subject._id, section, event.target.dataset?.optionIndex) }}
                                                        id="disable-close-on-select"
                                                        renderInput={(params) => (
                                                          <TextField
                                                            {...params}
                                                            variant="outlined"
                                                            required
                                                            id={`instructor-${subject.name}`}
                                                            label={column.label}
                                                            placeholder="Name"
                                                          />)}
                                                      /> : column.id === 'sessionsPerWeek'
                                                        ? <TextField
                                                          style={{ width: 100 }}
                                                          variant="outlined"
                                                          id="outlined-number"
                                                          label={subject.name}
                                                          value={subjSessionsPerWeek.find(session => `${session.subjectId}_${session.section}` === `${subject._id}_${section}`)?.sessionsPerWeek || ''}
                                                          type="number"
                                                          onChange={(event) => { handleSubSessions(subject._id, section, event.target.value) }}
                                                          InputLabelProps={{
                                                            shrink: true,
                                                          }}
                                                        /> : ''
                                                }
                                              </TableCell>
                                            </TableRow>
                                          )
                                        }) : ''
                              }
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Modal
          open={addStudentsEnable}
          onClose={() => { setAddStudentsEnable(false) }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box style={{ backgroundColor: 'white', height: '80vh' }} className={classes.modalDesign}>
            <AddStudents
              classDetails={newClassDetails}
              handleCancel={() => { setAddStudentsEnable(false) }}
              handalSelectedStudents={handleSelectedStudents}
              associatedStudents={allStudents} />
          </Box>
        </Modal>
        <Modal
          open={openFeeModal}
          onClose={() => { setOpenFeeModal(false) }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box style={{ backgroundColor: 'white' }} className={classes.modalDesign}>
            <NewFeeStructure feeStructureObjPermission={feeStructureObjPermission} />
          </Box>
        </Modal>
      </React.Fragment>
    )
  }
}

export default NewClass