import React, { useEffect } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Box } from '@material-ui/core';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { StyledTableCell } from './EnrolmentsStyle';

import Loading from '../../../components/loading/Loading';
import { paymentHistoryHeader } from '../../../constants/PaymentHistoryHeader';

const EnrolmentHistory = (props) => {
    const history = useHistory();

    let unmounted = false;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isPageLoading, setisPageLoading] = React.useState(false);
    const [historydata, sethistoryData] = React.useState([])

    useEffect(() => {
        console.log(props)
        getPaymentDetailsById();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getPaymentDetailsById = async () => {
        unmounted = false;
        setisPageLoading(true);
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/get-payment-history/enrolment/${props.paymentId}/`)
            .then((response) => {
                if (response.status === 200) {
                    setisPageLoading(false)
                    console.log(response.data)
                    sethistoryData(response.data);
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
                }
            })
            .finally(() => {
                return function () {

                    unmounted = true;
                    source.cancel("Cancelling in cleanup");
                };
            });
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
                <Box style={{ width: 900 }}>
                    <Paper sx={{ width: '100%' }}>
                        <TableContainer sx={{ maxHeight: '100vh' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead >
                                    <TableRow >
                                        {paymentHistoryHeader.map((column) => (
                                            <StyledTableCell
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
                                    {historydata
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                                                    {paymentHistoryHeader.map((column) => {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {
                                                                    (column.id === 'paymentLnkId') ?
                                                                        row.paymentLinkID : (column.id === 'modifiedBy') ?
                                                                            row.user?.name : (column.id === 'date') ?
                                                                                new Date(row.date)?.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : (column.id === 'updstatus') ?
                                                                                    row.status : ''
                                                                }
                                                            </TableCell>
                                                        )
                                                    })}
                                                </TableRow>)
                                        })}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={historydata.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </Paper>
                </Box>
            </React.Fragment>
        )
    }
}

export default EnrolmentHistory