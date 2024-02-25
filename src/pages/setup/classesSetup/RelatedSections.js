import React, { useState, useEffect } from 'react';
import { Typography, Link } from '@material-ui/core';
import { Paper } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useStyles, StyledCourseTableCell, StyledStudentTableCell } from './ClassesSetupStyle';
import { useHistory } from 'react-router-dom';

import { columns } from '../../../constants/ClassInfoTableHeaders';

const RelatedSections = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const [classDetails, setClassDetails] = useState({});

  useEffect(() => {
    setClassDetails(props.classInfo);
  }, []);

  const handleUpdateSection = (div) => {
    history.push(`/section/search?class=${classDetails._id}&division=${div._id}`)
    props.updateDetails({},'1');
  }

  return (
    <React.Fragment>
      <Typography className={classes.header}>
        Related Divisions :
      </Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '10px' }}>
        <TableContainer sx={{ maxHeight: '100vh' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  (column.id === 'totalStudents'
                    || column.id === 'section'
                    || column.id === 'leadInstructor') && <StyledStudentTableCell
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
                classDetails?.divisions?.map((div) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={div?._id}>
                      {columns.map((column) => {
                        return (
                          (column.id === 'totalStudents'
                          || column.id === 'section'
                          || column.id === 'leadInstructor') &&
                         <TableCell key={column.id} align={column.align}>
                          {column.id === 'totalStudents' ? `${div.students?.length}`
                            : column.id === 'section' ?
                            <Link onClick={ () => {handleUpdateSection(div)} }  size="small" style={{cursor:'pointer', color:'inherit', marginLeft: 5}}  underline="always">Section - {div?.section}</Link>
                            : column.id === 'leadInstructor' ? 
                            <Link onClick={() => { history.push(`/users/user-details/${div.leadInstructor?._id}`) }} style={{cursor:'pointer', color:'inherit', marginLeft: 5}} underline="always" >{div.leadInstructor?.name}</Link> : ''
                            }
                            </TableCell>
                        )
                      })}
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </React.Fragment>
  )
}

export default RelatedSections