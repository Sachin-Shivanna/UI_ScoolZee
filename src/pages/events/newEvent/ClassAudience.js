import React, { useEffect } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

import { useStyles, StyledTableCell } from '../EventsStyles';
import { classAudienceHeader } from '../../../constants/ClassInfoTableHeaders';

const ClassAudience = (props) => {
    const history = useHistory();
    const classes = useStyles();

    let unmounted = false;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [allClasses, setAllClasses] = React.useState([]);
    const [allSections, setAllSections] = React.useState([]);
    const [selectedSections, setSelectedSections] = React.useState([]);
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const [sectionCaregiverIncludes, setSectionCaregiverIncludes] = React.useState([]);

    useEffect(() => {
        console.log(props.includeCaregivers)
        getAllClasses();
    }, [])

    useEffect(() => {
        props.selectedUsers(selectedUsers)
    }, [selectedUsers])


    const getAllClasses = async () => {
        unmounted = false;
        //props.pageLoading = true;
        let allSectionsTemp = [];
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/classes-info/class`)
            .then((response) => {
                if (response.status === 200) {
                   // console.log(response.data)
                    //props.pageLoading = false;
                    setAllClasses(response.data?.classDetails);
                    response.data?.classDetails?.forEach(classRec => {
                        allSectionsTemp.push(...classRec.divisions)
                    });
                    setAllSections(allSectionsTemp);
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
                }
            })
            .finally(() => {
                return function () {
                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSelection = (sectionId) => {
        console.log(selectedSections.includes(sectionId))
        if (selectedSections.includes(sectionId)) {
            setSectionCaregiverIncludes([...sectionCaregiverIncludes.filter(id => id !== sectionId)])
            setSelectedSections([...selectedSections.filter(id => id !== sectionId)])
            setSelectedUsers([...selectedUsers?.filter(user => (!allSections.find(sec => sec._id === sectionId)?.students?.map(student => { return student._id })?.includes(user.userId) && !allSections.find(sec => sec._id === sectionId)?.students?.map(student => { return student?.caregiver?._id })?.includes(user.userId)))]);

        }
        else {
            setSelectedSections([...selectedSections, sectionId])
            setSelectedUsers([...selectedUsers.concat(allSections.find(sec => sec._id === sectionId)?.students?.map(student => { return { userId: student._id, userEmail: student.email, userPhone: student.phone1, userProfile: student.profile, userName: student.name } }))])
        }
    };

    const handleAllSelection = () => {

        if (allSections?.length === selectedSections?.length) {
            setSelectedSections([]);
            setSelectedUsers([])
        }
        else {
            let tempList = []
            setSelectedSections([...allSections?.map(div => { return div._id })])
            tempList.push([...allSections.map(sec => { return (sec.students?.map(student => { return { userId: student._id, userEmail: student.email, userPhone: student.phone1 } })) })])
            let finalUsersList = [].concat.apply([], ...tempList);
            setSelectedUsers(finalUsersList)
        }
    }

    const handleSectionCaregiverInclude = (sectionId) => {
        let careGiversList = [...allSections.find(sec => sec._id === sectionId)?.students?.map(student => { return student.caregiver })]
        if (sectionCaregiverIncludes.includes(sectionId)) {
            setSectionCaregiverIncludes([...sectionCaregiverIncludes.filter(id => id !== sectionId)])
            setSelectedUsers([...selectedUsers.filter(user => !careGiversList?.map(caregvr => { return caregvr._id })?.includes(user.userId))])
        }
        else {
            setSectionCaregiverIncludes([...sectionCaregiverIncludes, sectionId])
            setSelectedUsers([...selectedUsers, ...careGiversList.map(caregvr => { return { userId: caregvr._id, userEmail: caregvr.email, userPhone: caregvr.phone1, userProfile: caregvr.profile, userName: caregvr.name } })])
        }
    }

    return (
        <React.Fragment>
            <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '10px' }}>
                <TableContainer sx={{ maxHeight: '100vh' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead >
                            <TableRow>
                                {classAudienceHeader.map((column) => (
                                    column.id !== 'select' && <StyledTableCell
                                        key={column.id}
                                        align='center'
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </StyledTableCell>
                                ))}
                                <StyledTableCell
                                    key={'select'}
                                    align='center'
                                    style={{ minWidth: 100 }}
                                >
                                    <Checkbox style={{ backgroundColor: 'white' }} checked={(allSections.length === selectedSections?.length) ? true : false} onChange={handleAllSelection} />
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allClasses
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((classRec) => {
                                    return (
                                        <TableRow role="checkbox" tabIndex={-1} key={classRec._id}>
                                            {classAudienceHeader.map((column) => {
                                                return (
                                                    <TableCell key={column.id} align='center' style={{ textAlign: '-webkit-center' }}>
                                                        {
                                                            column.id === 'class'
                                                                ? classRec['name'] :
                                                                column.id !== 'class'
                                                                    ? classRec.divisions.map((div) => {
                                                                        return (
                                                                            <TableRow role="checkbox" tabIndex={-1} key={div._id} >
                                                                                <TableCell key={div._id} className={classes.border} style={{ minWidth: column.minWidth, borderBottom: 'none', padding: column?.type === 'boolean' ? '10px' : '16px' }} align='center'>
                                                                                    {
                                                                                        column.id === 'section'
                                                                                            ? div['section'] :
                                                                                            column.id === 'leadInstructor'
                                                                                                ? div['leadInstructor']?.name :
                                                                                                column.id === 'totalStudents'
                                                                                                    ? div['students']?.length :
                                                                                                    column.id === 'select'
                                                                                                        ? <Checkbox style={{ padding: 3 }} checked={selectedSections?.includes(div._id) ? true : false} onChange={() => { handleSelection(div._id) }} /> :
                                                                                                        column.id === 'includeCaregiver'
                                                                                                            ? <Checkbox style={{ padding: 3 }} disabled={selectedSections?.includes(div._id) ? false : true} checked={sectionCaregiverIncludes.includes(div._id) ? true : false} onChange={() => { handleSectionCaregiverInclude(div._id) }} /> : ''
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
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={allClasses.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </React.Fragment>
    )
}

export default React.memo(ClassAudience)