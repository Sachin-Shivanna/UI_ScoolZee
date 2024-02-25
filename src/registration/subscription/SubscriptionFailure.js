import { Box, Button, Card, CardContent, Container, Typography } from '@material-ui/core'
import React from 'react'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useHistory } from 'react-router-dom';
import { useStyles } from './SubscriptionStyle';
import { CardActions } from '@mui/material';

const SubscriptionFailure = () => {
  const history = useHistory();
    const classes = useStyles();
    return (
        <React.Fragment>
            <Box className={classes.centerScreen}>
                <Card className={classes.successBox} style={{ width: '30%', height: '50vh' }}>
                    <CancelOutlinedIcon style={{ color: 'red', height: '168px', width: 'auto' }} />
                    <Typography style={{ fontSize: '2rem', fontWeight: '500px', lineHeight: 1.2, color: 'inherit' }}>
                        Failed
                    </Typography>
                    <CardContent>
                        <Container style={{ margin: '10px' }}>
                            <Typography style={{color: 'red'}}>
                                Your subscription activation failed.
                            </Typography>
                        </Container>
                        <Container style={{ margin: '10px' }}>
                            <Typography>
                                However, <span style={{color: 'green'}}>an account is created</span>. Please set the password through the email sent to the user's mail address.
                            </Typography>
                        </Container>
                        <CardActions style={{justifyContent:'center'}}>
                            <Button variant='contained' color='primary' size="medium" onClick={() => { history.push("/login"); }}>Go To Login</Button>
                        </CardActions>
                    </CardContent>
                </Card>
            </Box>
        </React.Fragment>
    )
}

export default SubscriptionFailure