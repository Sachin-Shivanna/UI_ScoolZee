/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useMemo, useRef } from 'react';
import { Box, Card, Typography, TextField, Paper, List, ListItem, ListItemIcon, Checkbox, ListItemText, Modal } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Autocomplete } from '@mui/material';
import Grid from '@mui/material/Grid';
import { DataGrid, GridCellEditStopReasons, gridClasses } from '@mui/x-data-grid';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import { useStyles } from './AssessmentDetailStyle';
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios';
import { OBJECT } from '../../../constants/ObjectNames/documentObjNames';
import Loading from '../../../components/loading/Loading';
import Custom_Button from '../../../components/reusableElements/Custom_Button';
import { formateTime } from '../../../components/commonController/commonController';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { dateParser, discardPastDateTime } from './AssessmentTable';
import AssessmentDetailsAction from './AssessmentDetailsAction';
import { grey } from '@mui/material/colors';
import { scoringSystem } from '../../../constants/ScoriingSystemList';
import AssessmentResult from '../assessmentResults/AssessmentResult';

function AssessmentDetails(params) {
    const history = useHistory();
    const classes = useStyles();

    let unmounted = false;
    const [isPageLoading, setisPageLoading] = React.useState(false);
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [assessmentObjPermission, setAssessmentObjPermission] = React.useState({});
    const [assessmentDetails, setAssessmentDetails] = React.useState({});
    const [tempAssessmentDetails, setTempAssessmentDetails] = React.useState({});
    const [invalidList, setInvalidList] = React.useState([]);
    const [expanded, setExpanded] = React.useState('');
    const [allFacultyList, setAllFacultyList] = React.useState([]);
    const [pageSize, setPageSize] = React.useState(5);
    const [rowId, setRowId] = React.useState(null);
    const [allScoringSystemList, setAllScoringSystemList] = React.useState([]);
    const [unselectedScoringSystem, setUnselectedScoringSystem] = React.useState([]);
    const [selectedScoringSystem, setSelectedScoringSystem] = React.useState([]);
    const [checkedUnselectedScoringSystem, setCheckedUnselectedScoringSystem] = React.useState([]);
    const [checkedSelectedScoringSystem, setCheckedSelectedScoringSystem] = React.useState([]);
    const [openAddResults, setOpenAddResults] = React.useState({isOpen: false, params : {}});



    const actionButtons = (params) => {
        return <AssessmentDetailsAction {...{ params, rowId, setRowId }} />
    }

    const resultsButton = (params) => {
        return <Button size="small" disabled={!params.row?.resultEditors?.includes(JSON.parse(localStorage.getItem('userDetail'))?._id)}
            onClick={() => {
                setOpenAddResults({isOpen: true, params : params.row})
                console.log(JSON.parse(localStorage.getItem('userDetail')))
                console.log(params.row)
            }} variant="outlined">Add Results</Button>
    }

    const assessmentColumns = [
        { field: 'subject', headerName: 'Subject', width: 370, editable: false },
        { field: 'dateTime', type: 'dateTime', width: 270, headerName: 'Date/Time', editable: true, valueParser: dateParser, preProcessEditCellProps: discardPastDateTime },
        { field: 'action', type: 'actions', headerName: 'Action', width: 150, renderCell: actionButtons },
        { field: 'results', type: 'button', headerName: 'Results', width: 340, editable: false, renderCell: resultsButton },
    ];

    useEffect(() => {
        getFacultyList()
        getAssessmentDetail(params.match.params.id)
    }, [])

    useEffect(() => {
        setAssessmentDetails({ ...assessmentDetails, scoringSystem: selectedScoringSystem })
    }, [selectedScoringSystem])

    useEffect(() => {
        setCheckedSelectedScoringSystem([]);
        setCheckedUnselectedScoringSystem([]);
    }, [selectedScoringSystem, unselectedScoringSystem])



    const getAssessmentDetail = async (assessmentId) => {
        console.log('get assessment details')
        setisPageLoading(true)
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/get-assessment-by-id/${OBJECT.ASSESSMENT}/${params.match.params.id}`)
            .then((response) => {
                console.log(response.data)
                setAssessmentDetails(response.data.assessment)
                setSelectedScoringSystem(scoringSystem.filter(scoreSys => response.data.assessment?.scoringSystem?.map(score => { return score.value })?.includes(scoreSys.value)))
                setUnselectedScoringSystem(scoringSystem.filter(scoreSys => !response.data.assessment?.scoringSystem?.map(score => { return score.value })?.includes(scoreSys.value)));
                setAllScoringSystemList(scoringSystem);
                setAssessmentObjPermission(response.data.accessDefination)
                setTempAssessmentDetails(response.data.assessment)
                setExpanded(response.data.assessment?.exams[0]?.class?._id)
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
                setisPageLoading(false)
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            })
    }

    const getFacultyList = async () => {
        setAllFacultyList([])
        setisPageLoading(true);
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/faculty-info/${OBJECT.USER}`)
            .then((response) => {
                console.log(response.data);
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
            })
            .finally(() => {
                setisPageLoading(false);
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
    }

    function formatTime(timeInput) {
        let intValidNum = timeInput.target.value;
        console.log(intValidNum)
        if (intValidNum < 24 && intValidNum.length === 2) {
            timeInput.target.value = timeInput.target.value + ":";
            return false;
        }
        if (intValidNum === 24 && intValidNum.length === 2) {
            timeInput.target.value = timeInput.target.value.length - 2 + "0:";
            return false;
        }
        if (intValidNum > 24 && intValidNum.length === 2) {
            timeInput.target.value = "";
            return false;
        }
        if (intValidNum.length > 5) {
            timeInput.target.value = timeInput.target.value?.slice(0, -1)
        }
        setAssessmentDetails({ ...assessmentDetails, duration: intValidNum })

    }

    const handleResultEditorsList = (classId, subjectId) => {
        let editorsList = [];
        let requestedClassSections = assessmentDetails.exams?.find(exam => exam.class?._id?.toString() === classId?.toString())?.class?.divisions
        let leadInstructorsList = requestedClassSections?.map(section => { return section.leadInstructor })
        editorsList.push([...leadInstructorsList])
        let instructorList = requestedClassSections?.map(section => { return section?.courses?.find(course => course.subject === subjectId)?.instructor })
        editorsList.push([...instructorList])
        return editorsList?.flat();
    }

    const handleSave = async () => {
        //assessmentDetails
        if (!isEditMode) {
            setIsEditMode(true)
        }
        else {
            unmounted = false;
            setisPageLoading(true)
            const source = axios.CancelToken.source();
            await axios.patch(`${process.env.REACT_APP_SERVER}/update-assessment-deatils/${OBJECT.ASSESSMENT}`, {
                updatedAssessmentDetails: assessmentDetails
            })
                .then((response) => {
                    console.log(response)
                    if (response.status === 200) {
                        toast.success("Record Saved.")
                        setIsEditMode(false);
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
                            toast.success("woops!! Failed to save the record.")
                            console.log(error.request)
                            //toast.error(error.request.error)
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

    const handleSelectAllScoringSys = () => {
        setSelectedScoringSystem(allScoringSystemList);
        setCheckedSelectedScoringSystem([...checkedSelectedScoringSystem, checkedUnselectedScoringSystem]);
        setUnselectedScoringSystem([]);
        setCheckedUnselectedScoringSystem([]);
    }

    const handleSelectChecked = () => {
        console.log(checkedUnselectedScoringSystem)
        var tempUnselected = [...unselectedScoringSystem];
        setSelectedScoringSystem([...selectedScoringSystem, ...checkedUnselectedScoringSystem]);
        checkedUnselectedScoringSystem.forEach(checkedUnselected => {
            tempUnselected.splice(tempUnselected.findIndex(scoreSys => scoreSys.value === checkedUnselected.value), 1);
        });
        setUnselectedScoringSystem(tempUnselected);
    }

    const handleDeselectChecked = () => {
        console.log(checkedSelectedScoringSystem)
        var tempUnselected = [...selectedScoringSystem];
        setUnselectedScoringSystem([...unselectedScoringSystem, ...checkedSelectedScoringSystem]);
        checkedSelectedScoringSystem.forEach(checkedSelected => {
            tempUnselected.splice(tempUnselected.findIndex(scoreSys => scoreSys.value === checkedSelected.value), 1);
        });
        setSelectedScoringSystem(tempUnselected);
    }

    const handleDeselectScoringSys = () => {
        setSelectedScoringSystem([]);
        setUnselectedScoringSystem(allScoringSystemList);
        setCheckedSelectedScoringSystem([])
    }

    const handleOnScoringSysChecked = (scoringSystem) => {
        if (unselectedScoringSystem.findIndex(scoringSys => scoringSys.value === scoringSystem.value) > -1) {
            if (checkedUnselectedScoringSystem.findIndex(scoringSys => scoringSys.value === scoringSystem.value) > -1) {
                setCheckedUnselectedScoringSystem(checkedUnselectedScoringSystem.splice(checkedUnselectedScoringSystem.findIndex(scoringSys => scoringSys.value === scoringSystem.value), 1));
            }
            else {
                setCheckedUnselectedScoringSystem([...checkedUnselectedScoringSystem, scoringSystem])
            }
        }
        else {
            console.log(checkedSelectedScoringSystem.findIndex(scoringSys => scoringSys.value === scoringSystem.value) > -1)
            if (checkedSelectedScoringSystem.findIndex(scoringSys => scoringSys.value === scoringSystem.value) > -1) {
                setCheckedSelectedScoringSystem(checkedSelectedScoringSystem.splice(checkedSelectedScoringSystem.findIndex(scoringSys => scoringSys.value === scoringSystem.value), 1));
            }
            else {
                setCheckedSelectedScoringSystem([...checkedSelectedScoringSystem, scoringSystem])
            }
        }
    }

    const customList = (items) => {
        return (
            <Paper style={{ minHeight: 175, maxHeight: 175, overflow: 'auto' }}>
                <List dense component="div" role="list">
                    {items.map((scoreSys) => {
                        const labelId = `transfer-list-item-${scoreSys?.value}-label`;

                        return (
                            <ListItem
                                key={scoreSys?.value}
                                role="listitem"
                                button
                            //disabled={!isEditMode}
                            //onClick={() => { !isEditMode && handleOnScoringSysChecked(scoreSys) }}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={checkedSelectedScoringSystem.findIndex(scoringSys => scoringSys.value === scoreSys.value) > -1 || checkedUnselectedScoringSystem.findIndex(scoringSys => scoringSys.value === scoreSys.value) > -1}
                                        tabIndex={-1}
                                        disabled={!isEditMode}
                                        disableRipple
                                        onChange={() => { handleOnScoringSysChecked(scoreSys) }}
                                        inputProps={{
                                            'aria-labelledby': labelId,
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`${scoreSys?.label}`} />
                            </ListItem>
                        );
                    })}
                    <ListItem />
                </List>
            </Paper>)
    }

    if (isPageLoading) {
        return (
            <Box style={{ top: '50%' }}>
                <Loading isPageLoading={isPageLoading} />
            </Box>
        )
    }
    else {
        return (
            <React.Fragment>
                <Box component="span" className={classes.hideButtons}>
                    <Grid container spacing={5}>
                        <Grid xs={6} md={6} justifyContent='flex-end' style={{ maxWidth: '46%', paddingTop: 10, marginBottom: '1.5%' }} className={classes.gridElement}>
                            <Custom_Button variant='contained' size="medium" style={{ marginRight: 3 }} color='inherit' onClick={() => { handleSave() }} label={isEditMode ? 'Save' : 'Edit'} accessGranted={assessmentObjPermission.edit} />
                            <Custom_Button variant='contained' size="medium" style={{ marginLeft: 3 }} color='inherit' disabled={!isEditMode} onClick={() => {
                                setIsEditMode(false)
                                setAssessmentDetails(tempAssessmentDetails)
                            }} label={'Cancel'} accessGranted={assessmentObjPermission?.edit} />
                        </Grid>
                        <Grid xs={6} md={6} justifyContent='flex-start' style={{ maxWidth: '46%', paddingTop: 10, marginBottom: '1.5%' }} className={classes.gridElement}>
                            <Custom_Button variant='outlined' size="medium" color='error' style={{ marginRight: 3 }} onClick={() => { }} label={'Delete'} accessGranted={assessmentObjPermission.delete} />
                            <Button variant='contained' size="medium" color="success" disabled={isEditMode} style={{ marginLeft: 3 }} onClick={() => { }}>Send Remainder</Button>
                        </Grid>
                    </Grid>
                </Box>
                <Typography className={classes.header}>
                    Details :
                </Typography>
                <Grid container style={{ padding: 5, width: '100%', margin: 0, justifyContent: 'space-between' }} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Card style={{ padding: 8 }}>
                        <Grid item xs={6}>
                            <Box style={{ margin: 5 }}>
                                <Typography className={classes.label}>Title :</Typography>
                                <TextField
                                    className={classes.inputDesign}
                                    style={{ flex: 1, width: 520 }}
                                    fullWidth
                                    InputProps={{
                                        readOnly: !isEditMode,
                                        disableUnderline: !isEditMode,
                                    }}
                                    value={assessmentDetails.title}
                                    type="text" placeholder="Assessment Title"
                                    helperText={!invalidList.includes('title') ? '' : "Title is required"}
                                    error={invalidList.includes('title')}
                                    onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'title')) }}
                                    id="title"
                                    onChange={(title) => { setAssessmentDetails({ ...assessmentDetails, title: title.target.value }) }}
                                    variant={isEditMode ? "outlined" : "standard"}
                                />
                            </Box>
                            <Box style={{ marginBottom: 20 }}>
                                <Typography className={classes.label}>Instructions :</Typography>
                                <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={3}
                                    readOnly={!isEditMode}
                                    InputProps={{
                                        readOnly: !isEditMode,
                                        disableUnderline: !isEditMode,
                                    }}
                                    placeholder="Instructions"
                                    onChange={(inst) => { setAssessmentDetails({ ...assessmentDetails, instruction: inst.target.value }) }}
                                    style={{ minWidth: 'auto', width: '531px', maxWidth: '531px', minHeight: 225, height: 225, border: !isEditMode ? 'none' : '', outline: '1px solid grey', fontFamily: 'sans-serif', marginTop: 5 }}
                                    value={assessmentDetails.instruction || ''}

                                />
                            </Box>
                            <Box style={{ marginBottom: 20, width: 550 }}>
                                <Typography className={classes.label}>Scoring System :</Typography>
                                {invalidList.includes('scoringSystem') && <Typography color='#d32f2f' style={{ color: '#d32f2f', fontFamily: 'Roboto,Helvetica,Arial,sans-serif', fontWeight: 400, fontSize: '0.75rem' }}>Please select at least 1 scoring system</Typography>}
                                <Grid container spacing={2}>
                                    <Grid item xs={5} style={{ paddingTop: 10 }}>
                                        <Typography style={{ backgroundColor: '#e9e9e9', color: 'black' }} className={classes.header}>
                                            All Scorings Systems :
                                        </Typography>
                                        {customList(unselectedScoringSystem)}
                                    </Grid>
                                    <Grid item xs={2} style={{ paddingTop: 50 }}>
                                        <Grid container direction="column" alignItems="center" style={{ paddingTop: '30px' }}>
                                            <Button
                                                sx={{ my: 0.5 }}
                                                variant="outlined"
                                                size="small"
                                                onClick={handleSelectAllScoringSys}
                                                disabled={unselectedScoringSystem.length === 0 || !isEditMode}
                                                aria-label="move all right"
                                            >
                                                ≫
                                            </Button>
                                            <Button
                                                sx={{ my: 0.5 }}
                                                variant="outlined"
                                                size="small"
                                                onClick={handleSelectChecked}
                                                disabled={checkedUnselectedScoringSystem.length === 0 || !isEditMode}
                                                aria-label="move selected right"
                                            >
                                                &gt;
                                            </Button>
                                            <Button
                                                sx={{ my: 0.5 }}
                                                variant="outlined"
                                                size="small"
                                                onClick={handleDeselectChecked}
                                                disabled={checkedSelectedScoringSystem.length === 0 || !isEditMode}
                                                aria-label="move selected left"
                                            >
                                                &lt;
                                            </Button>
                                            <Button
                                                sx={{ my: 0.5 }}
                                                variant="outlined"
                                                size="small"
                                                onClick={handleDeselectScoringSys}
                                                disabled={selectedScoringSystem.length === 0 || !isEditMode}
                                                aria-label="move all left"
                                            >
                                                ≪
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={5} style={{ paddingTop: 10 }}>
                                        <Typography style={{ backgroundColor: '#e9e9e9', color: 'black' }} className={classes.header}>
                                            Selected Scoring Systems :
                                        </Typography>
                                        {customList(selectedScoringSystem)}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Card>
                    <Card style={{ width: '49%', padding: 8 }}>
                        <Grid item xs={6}>
                            <Box style={{ margin: 5, marginBottom: 30 }}>
                                <Typography className={classes.label}>Owner :</Typography>
                                {!isEditMode && <TextField
                                    className={classes.inputDesign}
                                    style={{ flex: 1, width: 520 }}
                                    fullWidth
                                    InputProps={{
                                        readOnly: !isEditMode,
                                        disableUnderline: !isEditMode,
                                    }}
                                    value={assessmentDetails.owner?.name}
                                    type="text" placeholder="Assessment Owner"
                                    helperText={!invalidList.includes('owner') ? '' : "Owner is required"}
                                    error={invalidList.includes('owner')}
                                    onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'owner')) }}
                                    id="title"
                                    variant={isEditMode ? "outlined" : "standard"}
                                />}
                                {isEditMode && <Autocomplete
                                    style={{ flex: 1, width: 520 }}
                                    disabled={false}
                                    fullWidth
                                    options={allFacultyList || []}
                                    getOptionLabel={(option) => option.name || ''}
                                    value={assessmentDetails.owner}
                                    isOptionEqualToValue={(option, value) => option?._id === value}
                                    onChange={(event) => { setAssessmentDetails({ ...assessmentDetails, owner: allFacultyList[event.target?.dataset?.optionIndex] }) }}
                                    id="disable-close-on-select"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            required
                                            helperText={!invalidList.includes('owner') ? '' : "Owner is required"}
                                            error={invalidList.includes('owner')}
                                            onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'owner')) }}
                                            fullWidth
                                            id={`event-type`}
                                            placeholder="Owner"
                                        />)}
                                />}
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box style={{ margin: 5, marginBottom: 30 }}>
                                <Typography className={classes.label}>Start Date/Time :</Typography>
                                <TextField
                                    className={classes.inputDesign}
                                    style={{ flex: 1, width: 520 }}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    value={params.location?.state?.startDateTime.toDateString() + ', ' + formateTime(params.location?.state?.startDateTime)?.strTime}
                                    type="text" placeholder="Assessment Start Date/Time"
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                    id="startDateTime"
                                    variant={"standard"}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box style={{ margin: 5, marginBottom: 30 }}>
                                <Typography className={classes.label}>End Date/Time :</Typography>
                                <TextField
                                    className={classes.inputDesign}
                                    style={{ flex: 1, width: 520 }}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    value={params.location?.state?.endDateTime.toDateString() + ', ' + formateTime(params.location?.state?.endDateTime)?.strTime}
                                    type="text" placeholder="Assessment End Date/Time"
                                    id="endDateTime"
                                    variant={"standard"}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box style={{ margin: 5, marginBottom: 30 }}>
                                <Typography className={classes.label}>Duration :</Typography>
                                <TextField
                                    className={classes.inputDesign}
                                    style={{ flex: 1, width: 520 }}
                                    fullWidth
                                    InputProps={{
                                        readOnly: !isEditMode,
                                        disableUnderline: !isEditMode,
                                    }}
                                    onChange={(duration) => { formatTime(duration) }}
                                    value={assessmentDetails.duration}
                                    type="text" placeholder="HH:MM" MaxLength="8"
                                    helperText={!invalidList.includes('duration') ? '' : "Invalid duration"}
                                    error={invalidList.includes('duration')}
                                    onFocus={() => { setInvalidList(invalidList.filter(value => value !== 'duration')) }}
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                    id="title"
                                    variant={isEditMode ? "outlined" : "standard"}
                                />
                            </Box>
                        </Grid>
                    </Card>
                </Grid>
                <Typography className={classes.header}>
                    Classes :
                </Typography>
                {assessmentDetails.exams?.length > 0 && assessmentDetails.exams?.map((exam) => {
                    return (
                        <React.Fragment >
                            <Card style={{ height: 44, padding: 10, margin: '5px 5px 0px 5px', backgroundColor: '#e0e0e0', fontWeight: 900 }}>
                                {exam.class.name}
                                <span style={{ float: 'right' }}>
                                    {expanded !== exam.class._id && <ArrowDropDownIcon style={{ cursor: 'pointer' }} onClick={() => { setExpanded(exam.class._id) }} />}
                                    {expanded === exam.class._id && <ArrowDropUpIcon style={{ cursor: 'pointer' }} />}
                                </span>
                            </Card>
                            <Card style={{ height: 'auto', margin: '0px 5px 5px 5px', display: expanded !== exam.class._id ? 'none' : '' }}>
                                <div style={{ height: 300, width: '100%', overflow: 'hidden' }}
                                    className={classes.tableHead}>
                                    <DataGrid
                                        rows={exam.details?.map(detail => { return { id: detail.subject?._id, subject: detail.subject?.name, dateTime: new Date(detail.dateTime)?.toDateString() + ', ' + formateTime(new Date(detail.dateTime))?.strTime, results: 'results', classId: exam.class._id, assessmentId: assessmentDetails._id, examId: exam._id, detailsId: detail._id, subjectId: detail.subject?._id, resultEditors: handleResultEditorsList(exam.class._id, detail.subject?._id) } })}
                                        columns={assessmentColumns}
                                        getupdatedRow={row => row.id}
                                        rowsPerPageOptions={[5, 10, 15]}
                                        pageSize={pageSize}
                                        onPageSizeChange={(newPageSize) => { setPageSize(newPageSize) }}
                                        getRowSpacing={params => ({
                                            top: params.isFirstVisible ? 0 : 5,
                                            bottom: params.isLastVisible ? 0 : 5
                                        })}
                                        sx={{
                                            '& .MuiDataGrid-cell:focus': {
                                                outline: 'none'
                                            },
                                            [`& .${gridClasses.row}`]: {
                                                bgcolor: grey[100]
                                            }
                                        }}
                                        isCellEditable={(params) => {
                                            return (params.row?.resultEditors?.includes(JSON.parse(localStorage.getItem('userDetail'))?._id) || assessmentDetails.owner?._id?.toString() === JSON.parse(localStorage.getItem('userDetail'))?._id?.toString()) ? true : false
                                        }}
                                        onCellEditCommit={params => setRowId(params.id)}
                                    />
                                </div>
                            </Card>
                        </React.Fragment>
                    )
                })

                }
                <Modal
                    open={openAddResults.isOpen}
                    onClose={() => { setOpenAddResults({isOpen : false, params : {}}) }}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        bgcolor: 'background.paper',
                        p: 4,
                    }}>
                        <AssessmentResult examData={openAddResults.params}/>
                    </Box>
                </Modal>
                <Toaster />
            </React.Fragment>
        )
    }
}

export default AssessmentDetails