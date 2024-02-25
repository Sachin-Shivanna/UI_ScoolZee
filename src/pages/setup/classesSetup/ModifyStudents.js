import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useHistory } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import SearchIcon from '@mui/icons-material/Search';
import LinearProgress from '@mui/material/LinearProgress';

import { useStyles } from './ClassesSetupStyle';
import { Box, TextField, Typography } from '@material-ui/core';
import { InputAdornment } from '@mui/material';
import Loading from '../../../components/loading/Loading';

const ModifyStudents = (props) => {

    const classes = useStyles();
    const history = useHistory();

    let unmounted = false;

    const [allStudents, setAllStudents] = useState([]);
    const [fliteredAllStudents, setFilteredAllStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [fliteredSelectedStudents, setFilteredSelectedStudents] = useState([]);
    const [checkedStudentList, setCheckedStudentList] = useState([]);
    const [errorList, setErrorList] = useState([]);
    const [isPageLoading, setisPageLoading] = React.useState(false);
    const [pageLoading, setPageLoading] = useState(false);

    useEffect(() => {
        setFilteredAllStudents([...allStudents]);
        setFilteredSelectedStudents([...selectedStudents]);
    }, [allStudents, selectedStudents]);


    useEffect(() => {
        console.log(props.classDetails)
        getAllStudents()
    }, [])

    useEffect(() => {
        console.log(props.classId);
        console.log(props.divisionId);
    }, [])

    const getAllStudents = async () => {
        setAllStudents([]);
        setSelectedStudents([]);
        setErrorList([])
        setPageLoading(true);
        await axios.get(`${process.env.REACT_APP_SERVER}/all-students/user`)
            .then((response) => {
                console.log(response)
                getAssociatedStudents(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
            });
    }
    const getAssociatedStudents = async (allAvailStudents) => {
        await axios.get(`${process.env.REACT_APP_SERVER}/class-info-by-id/class/${props.classId}/${props.divisionId}`)
            .then((response) => {
                console.log(response.data?.divisions.find(div => div._id === props.divisionId)?.students?.map(stud => { return stud._id }))
                setSelectedStudents([...response.data?.divisions.find(div => div._id === props.divisionId)?.students]);
                setAllStudents(allAvailStudents.filter(allStud => !(response.data?.divisions.find(div => div._id === props.divisionId)?.students?.map(stud => { return stud._id })?.includes(allStud._id))))
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setPageLoading(false);
            });
    }

    const handleUpdateCheckBox = (studentId) => {
        if (checkedStudentList.includes(studentId)) {
            setCheckedStudentList([...checkedStudentList?.filter(studId => studId !== studentId)])
        }
        else {
            setCheckedStudentList([...checkedStudentList, studentId])
        }
    }

    const handleAddToSelected = () => {
        let tempSelectedStudets = []
        allStudents?.filter(student => checkedStudentList.includes(student._id)).forEach(student => {
            student.section = '';
            tempSelectedStudets = [...tempSelectedStudets, student];
        });
        setSelectedStudents([...selectedStudents, ...tempSelectedStudets])
        setAllStudents([...allStudents?.filter(student => !checkedStudentList.includes(student._id))]);
    }

    const handleRemoveFromSelected = () => {
        setAllStudents([...allStudents, ...selectedStudents?.filter(student => checkedStudentList.includes(student._id))])
        setSelectedStudents([...selectedStudents?.filter(student => !checkedStudentList.includes(student._id))]);
    }

    const handleMultipleSelection = (title) => {
        if (title === 'All Students') {
            let checkedAllStudents = allStudents?.filter(student => checkedStudentList.includes(student._id));
            if (checkedAllStudents.length > 0) {
                setCheckedStudentList([...checkedStudentList?.filter(studentId => checkedAllStudents.map((student) => { return student._id }) === studentId)]);
            }
            else {
                setCheckedStudentList([...allStudents.map((student) => { return student._id })]);
            }
        }
        else if (title === 'Associated Students') {
            let checkedSelectedStudents = selectedStudents?.filter(student => checkedStudentList.includes(student._id));
            if (checkedSelectedStudents.length > 0) {
                setCheckedStudentList([...checkedStudentList?.filter(studentId => checkedSelectedStudents.map((student) => { return student._id }) === studentId)]);
            }
            else {
                setCheckedStudentList([...selectedStudents.map((student) => { return student._id })]);
            }
        }
    }

    const handleFilter = (title, searchKey) => {
        if (title === 'All Students') {
            searchKey === ''
                ? setFilteredAllStudents([...allStudents])
                : setFilteredAllStudents([...allStudents?.filter(student => student.name?.startsWith(searchKey))]);
        }
        else if (title === 'Associated Students') {
            searchKey === ''
                ? setFilteredSelectedStudents([...selectedStudents])
                : setFilteredSelectedStudents([...selectedStudents?.filter(student => student.name?.startsWith(searchKey))]);
        }
    }

    const handleSave = async () => {
        setisPageLoading(true)
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.patch(`${process.env.REACT_APP_SERVER}/update-students/class`, {
            studentIdList: selectedStudents?.map(selStud => { return selStud._id }),
            sectionId: props.divisionId
        })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    return props.handleCancel(true)
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
                        toast.error("Failed to update students")
                    }
                }
            })
            .finally(() => {
                setisPageLoading(false)
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
    }

    const customList = (title, items) => (
        <Card>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                style={{ backgroundColor: '#101f3226' }}
                avatar={
                    <Checkbox
                        id=''
                        onClick={() => { handleMultipleSelection(title) }}
                        checked={(title === 'All Students' && allStudents?.filter(student => checkedStudentList.includes(student._id)).length > 0)
                            || (title === 'Associated Students' && selectedStudents?.filter(student => checkedStudentList.includes(student._id)).length > 0)}
                        indeterminate={false}
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-labelledby': 'labelid',
                        }}
                    />
                }
                title={title}
            />
            <Divider />
            <TextField
                style={{ margin: 10, width: '97%', color: '#101f3226' }}
                size='small'
                variant="outlined"
                className={classes.rootDesign}
                onChange={(event) => { handleFilter(title, event.target.value) }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    )
                }} />
            <List
                sx={{
                    width: '100%',
                    height: 350,
                    overflow: 'auto',
                    padding: 0,
                    margin: 0
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                    const labelid = `transfer-list-all-item-${value._id}-label`;
                    return (
                        <Box key={value._id} sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={title === 'Associated Students' ? 8 : 12}>
                                    <ListItem
                                        key={value._id}
                                        role="listitem"
                                        style={{ width: '100%' }}
                                        button
                                        onClick={() => { handleUpdateCheckBox(value._id) }}
                                    >
                                        <ListItemIcon>
                                            <Checkbox
                                                checked={checkedStudentList.includes(value._id) === true}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{
                                                    'aria-labelledby': labelid,
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={labelid} primary={value.name} />
                                    </ListItem>
                                </Grid>
                            </Grid>
                        </Box>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <React.Fragment>
            {isPageLoading && <Box style={{ paddingTop: '50%', backgroundColor: 'white' }}>
                <Loading isPageLoading={isPageLoading} />
            </Box>}
            {!isPageLoading && <Box style={{ margin: 0, height: 100 }}>
                <Grid container spacing={1} className={classes.header}>
                    <Grid item xs={5} md={5} justifyContent='flex-start' style={{ paddingLeft: 4 }} className={classes.gridElement}>
                        <Typography >
                            Add/Remove Students :
                        </Typography>
                    </Grid>
                    <Grid item xs={7} md={7} justifyContent='flex-start' style={{ paddingRight: 4 }} className={classes.gridElement}>
                        <Typography>
                            {props.classDetails?.name} {props.classDetails?.divisions?.find(div => div._id === props.divisionId)?.section}
                        </Typography>
                    </Grid>
                </Grid>
                <Box sx={{ marginBottom: 25 }}>
                    {
                        pageLoading && <LinearProgress color="inherit" />
                    }
                </Box>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={5}>{customList('All Students', fliteredAllStudents)}</Grid>
                    <Grid item>
                        <Grid item container xs={2} direction="column" alignItems="center">
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleAddToSelected}
                                disabled={fliteredAllStudents.length === 0}
                                aria-label="move selected right"
                            >
                                &gt;
                            </Button>
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleRemoveFromSelected}
                                disabled={fliteredSelectedStudents.length === 0}
                                aria-label="move selected left"
                            >
                                &lt;
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={5}>{customList('Associated Students', fliteredSelectedStudents)}</Grid>
                </Grid>
                <Grid container spacing={1} style={{ margin: 10 }}>
                    <Grid item xs={6} md={6} justifyContent='flex-end' style={{ paddingRight: 4 }} className={classes.gridElement}>
                        <Button variant='contained' color='inherit' size="medium" onClick={() => {props.handleCancel(false)}}>Cancel</Button>
                    </Grid>
                    <Grid item xs={6} md={6} justifyContent='flex-start' style={{ paddingLeft: 4 }} className={classes.gridElement}>
                        <Button variant='contained' color='inherit' size="medium" onClick={handleSave}>Save</Button>
                    </Grid>
                </Grid>
            </Box>}
            <Toaster />
        </React.Fragment>
    )
}

export default ModifyStudents