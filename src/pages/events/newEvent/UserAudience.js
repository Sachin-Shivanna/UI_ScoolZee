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

import { columns } from '../../../constants/UsersTableHeaders';

import { useStyles, StyledTableCell } from '../EventsStyles';

const UserAudience = (props) => {
    const history = useHistory();

    let unmounted = false;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [allActiveUsers, setAllActiveUsers] = React.useState([]);
    const [selectedUsers, setSelectedUsers] = React.useState([]);

    useEffect(() => {
        getAllActiveUsers();
    }, [])

    useEffect(() => {
        props.selectedUsers(selectedUsers)
    }, [selectedUsers])

    const getAllActiveUsers = async () => {
        unmounted = false;
        //props.pageLoading = true;
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/active-users-info/user`)
            .then((response) => {
                console.log(response.data);

                setAllActiveUsers(response.data)
                //props.pageLoading = false;
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSelectedUsers = (userId, userEmail, userPhone, userProfile, userName) => {
        let tempUserList = []
        if (selectedUsers?.findIndex(user => user.userId === userId) >= 0) {
            tempUserList = selectedUsers?.filter(user => user.userId !== userId)
        }
        else {
            tempUserList = [...selectedUsers, { userId, userEmail, userPhone, userProfile, userName }]
        }
        setSelectedUsers([...tempUserList]);
    }

    const handleAllUsersSelect = () => {
        if (allActiveUsers?.length === selectedUsers?.length) {
            setSelectedUsers([])
        }
        else {
            setSelectedUsers([...allActiveUsers.map(user => { return ({ userId: user._id, userEmail: user.email, userPhone: user.phone1, userProfile: user.profile, userName: user.name }) })])
        }
    }

    return (
        <React.Fragment>
            <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '10px' }}>
                <TableContainer sx={{ maxHeight: '100vh' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead >
                            <TableRow>
                                <StyledTableCell
                                    key={'select'}
                                    align='center'
                                    style={{ minWidth: 100 }}
                                >
                                    <Checkbox style={{ backgroundColor: 'white' }} checked={(allActiveUsers?.length === selectedUsers?.length) ? true : false} onChange={handleAllUsersSelect} />
                                </StyledTableCell>
                                {columns.map((column) => (
                                    column.id !== 'status' &&
                                    column.id !== 'reset' &&
                                    <StyledTableCell
                                        key={column.id}
                                        align='center'
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allActiveUsers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow role="checkbox" tabIndex={-1} key={row._id}>
                                            <TableCell
                                                key={row._id}
                                                align='center'
                                                style={{ minWidth: 100 }}>
                                                <Checkbox style={{ backgroundColor: 'white' }} checked={(selectedUsers?.findIndex(user => user.userId === row._id) >= 0) ? true : false} onChange={() => { handleSelectedUsers(row._id, row.email, row.phone1, row.profile, row.name) }} />
                                            </TableCell>
                                            {columns.map((column) => {
                                                return (
                                                    column.id !== 'status' &&
                                                    column.id !== 'reset' &&
                                                    <TableCell key={column.id} align='center'>
                                                        {
                                                            column.id === 'phone'
                                                                ? column.format(row['phone1']) :
                                                                column.id === 'email'
                                                                    ? column.format(row['email']) :
                                                                    column.id === 'name'
                                                                        ? row['name'] :
                                                                        column.id === 'profile'
                                                                            ? row['profile']?.name : ''
                                                        }
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={allActiveUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </React.Fragment>
    )
}

export default React.memo(UserAudience)