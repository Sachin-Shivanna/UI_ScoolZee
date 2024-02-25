import React from 'react'
import { Container, TextField, Typography, Box } from '@material-ui/core';
import Grid from '@mui/material/Grid';

import { useStyles } from './AuditFieldsStyle';

const AuditFields = (props) => {

    const classes = useStyles();

    const formateTime = (date) => {
        var day = date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = day + '/' + month + '/' + year + ',' + hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    return (
        <React.Fragment>
            <Typography className={classes.header}>
                Audit Info :
            </Typography>
            <Container style={{ paddingTop: 30, backgroundColor: 'white' }}>
                <Grid container spacing={4}>
                    <Grid item xs={6} style={{paddingTop:0}}>
                        <Box style={{ marginBottom: 20 }}>
                            <Typography className={classes.label}>Created By :</Typography>
                            <TextField
                                style={{ flex: 1 }}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                    disableUnderline: true,
                                }}
                                value={`${props?.record?.createdBy?.name} ${formateTime(new Date(props.record.createdAt))}` || ''}
                                id="last-modified-by"
                                variant="standard"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6} style={{paddingTop:0}}>
                        <Box style={{ marginBottom: 20 }}>
                            <Typography className={classes.label}>Last Modified By :</Typography>
                            <TextField
                                style={{ flex: 1 }}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                    disableUnderline: true,
                                }}
                                value={`${props?.record?.modifiedBy?.name} ${formateTime(new Date(props.record.updatedAt))}` || ''}
                                id="last-modified-by"
                                variant="standard"
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    )
}

export default AuditFields