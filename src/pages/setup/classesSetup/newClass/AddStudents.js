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
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import LinearProgress from '@mui/material/LinearProgress';

import { useStyles } from './NewClassStyle';
import { Box, TextField, Typography } from '@material-ui/core';
import { InputAdornment } from '@mui/material';

const AddStudents = (props) => {

    const classes = useStyles();

    const [allStudents, setAllStudents] = useState([]);
    const [fliteredAllStudents, setFilteredAllStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([...props.associatedStudents]);
    const [fliteredSelectedStudents, setFilteredSelectedStudents] = useState([]);
    const [checkedStudentList, setCheckedStudentList] = useState([]);
    const [errorList, setErrorList] = useState([]);
    const [pageLoading, setPageLoading] = useState(false);

    useEffect(() => {
        setFilteredAllStudents([...allStudents]);
        setFilteredSelectedStudents([...selectedStudents]);
    }, [allStudents, selectedStudents]);

    useEffect(() => {
        getAllStudents();
    }, [])

    const getAllStudents = async () => {
        setAllStudents([]);
        setErrorList([])
        setSelectedStudents([]);
        setPageLoading(true);
        await axios.get(`${process.env.REACT_APP_SERVER}/all-students/user`)
            .then((response) => {
                let tempAllStudents = response.data.filter(student => !props.associatedStudents.map(stud => { return stud._id }).includes(student._id));
                setAllStudents(tempAllStudents);
                setSelectedStudents([...props.associatedStudents])
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
            setCheckedStudentList([...checkedStudentList.filter(studId => studId !== studentId)])
        }
        else {
            setCheckedStudentList([...checkedStudentList, studentId])
        }
    }

    const handleAddToSelected = () => {
        let tempSelectedStudets = []
        allStudents.filter(student => checkedStudentList.includes(student._id)).forEach(student => {
            student.section = '';
            tempSelectedStudets = [...tempSelectedStudets, student];
        });
        setSelectedStudents([...selectedStudents, ...tempSelectedStudets])
        setAllStudents([...allStudents.filter(student => !checkedStudentList.includes(student._id))]);
    }

    const handleRemoveFromSelected = () => {
        setAllStudents([...allStudents, ...selectedStudents.filter(student => checkedStudentList.includes(student._id))])
        setSelectedStudents([...selectedStudents.filter(student => !checkedStudentList.includes(student._id))]);
    }

    const handleUpdateSection = (section, studentId) => {
        let tepmStudent = selectedStudents.find(student => student._id === studentId);
        tepmStudent.section = section;
        setSelectedStudents([...selectedStudents.filter(student => student._id !== studentId), tepmStudent]);
    }

    const handleMultipleSelection = (title) => {
        if (title === 'All Students') {
            let checkedAllStudents = allStudents.filter(student => checkedStudentList.includes(student._id));
            if (checkedAllStudents.length > 0) {
                setCheckedStudentList([...checkedStudentList.filter(studentId => checkedAllStudents.map((student) => { return student._id }) === studentId)]);
            }
            else {
                setCheckedStudentList([...allStudents.map((student) => { return student._id })]);
            }
        }
        else if (title === 'Selected Students') {
            let checkedSelectedStudents = selectedStudents.filter(student => checkedStudentList.includes(student._id));
            if (checkedSelectedStudents.length > 0) {
                setCheckedStudentList([...checkedStudentList.filter(studentId => checkedSelectedStudents.map((student) => { return student._id }) === studentId)]);
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
                : setFilteredAllStudents([...allStudents.filter(student => student.name?.startsWith(searchKey))]);
        }
        else if (title === 'Selected Students') {
            searchKey === ''
                ? setFilteredSelectedStudents([...selectedStudents])
                : setFilteredSelectedStudents([...selectedStudents.filter(student => student.name?.startsWith(searchKey))]);
        }
    }

    const handleSave = () => {
        let unAsociatedStudent = selectedStudents.filter(student => student.section === '');
        if (unAsociatedStudent.length > 0) {
            return setErrorList(unAsociatedStudent.map(student => { return student._id }))
        }
        props.handalSelectedStudents(selectedStudents)
        props.handleCancel()
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
                        checked={(title === 'All Students' && allStudents.filter(student => checkedStudentList.includes(student._id)).length > 0)
                            || (title === 'Selected Students' && selectedStudents.filter(student => checkedStudentList.includes(student._id)).length > 0)}
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
                                <Grid item xs={title === 'Selected Students' ? 8 : 12}>
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

                                {
                                    title === 'Selected Students'
                                        ?
                                        <Grid item xs={4}>
                                            <TextField
                                                select
                                                labelid="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={value.section}
                                                label="Section"
                                                className={classes.error}
                                                placeholder='Section'
                                                size='small'
                                                onFocus={() => { setErrorList(errorList.filter(id => id !== value._id)) }}
                                                helperText={!errorList.includes(value._id) ? '' : 'Required'}
                                                error={errorList.includes(value._id)}
                                                variant='outlined'
                                                style={{ width: '100%', margin: 6, right: 4 }}
                                                onChange={(event) => { handleUpdateSection(event.target.value, value._id) }}
                                            >
                                                {
                                                    props.classDetails?.sections.map((section) => (
                                                        <MenuItem key={value._id} value={section}>{section}</MenuItem>
                                                    ))

                                                }
                                            </TextField>
                                        </Grid>
                                        : <span />
                                }

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
            <Box style={{ margin: 30 }}>
                <Typography style={{ margin: '30px 30px 0px 30px', paddingLeft: 20 }} className={classes.header}>
                    Add Students {props.classDetails?.name ? ` to ${props.classDetails?.name}` : ''} :
                </Typography>
                <Box sx={{width: '96.8%',paddingLeft: '30px', marginBottom: 25}}>
                    {
                        pageLoading && <LinearProgress  color="inherit"/>
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
                    <Grid item xs={5}>{customList('Selected Students', fliteredSelectedStudents)}</Grid>
                </Grid>
                <Grid container spacing={1} style={{ margin: 10 }}>
                    <Grid item xs={6} md={6} justifyContent='flex-end' style={{ paddingRight: 4 }} className={classes.gridElement}>
                        <Button variant='contained' color='inherit' size="medium" onClick={props.handleCancel}>Cancel</Button>
                    </Grid>
                    <Grid item xs={6} md={6} justifyContent='flex-start' style={{ paddingLeft: 4 }} className={classes.gridElement}>
                        <Button variant='contained' color='inherit' size="medium" onClick={handleSave}>Save</Button>
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    )
}

export default AddStudents