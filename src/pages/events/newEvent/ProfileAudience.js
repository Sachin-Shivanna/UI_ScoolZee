import React, { useEffect } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

import { useStyles } from '../EventsStyles';
import { Button, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';

const ProfileAudience = (props) => {
    const history = useHistory();
    const classes = useStyles();

    let unmounted = false;

    const [checkedAllProfiles, setCheckedAllProfiles] = React.useState([]);
    const [checkedSelectedProfiles, setCheckedSelectedProfiles] = React.useState([]);
    const [allProfilesList, setAllProfilesList] = React.useState([]);
    const [allActiveUsers, setAllActiveUsers] = React.useState([]);
    const [selectedProfiles, setSelectedProfiles] = React.useState([]);
    const [allProfiles, setAllProfiles] = React.useState([]);
    const [selectedUsers, setSelectedUsers] = React.useState([]);

    useEffect(() => {
        getAllAvailProfiles();
        getAllActiveUsers();
    }, []);

    useEffect(() => {
        props.selectedUsers(selectedUsers)
    }, [selectedUsers])

    useEffect(() => {
        handleUsersToNotify();
    }, [selectedProfiles])


    const getAllActiveUsers = async () => {
        unmounted = false;
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/active-users-info/user`)
            .then((response) => {
                console.log(response.data);

                setAllActiveUsers(response.data)
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

    const getAllAvailProfiles = async () => {
        unmounted = false;
        // props.pageLoading = true;
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/all-avail-profiles/profile`)
            .then((response) => {
                console.log(response.data);
                // props.pageLoading = false;
                setAllProfilesList(response.data);
                setAllProfiles(response.data)
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

    const handleUsersToNotify = () => {
        let usersList = allActiveUsers.filter(user => selectedProfiles.map(profile => { return profile._id }).includes(user.profile._id));
        setSelectedUsers([...usersList.map(user => { return { userId: user._id, userEmail: user.email, userPhone: user.phone1, userProfile: user.profile, userName: user.name } })]);
    }

    const handleOnProfileChecked = (subjectId) => {
        if (checkedAllProfiles.includes(subjectId)) {
            setCheckedAllProfiles(checkedAllProfiles.filter(subId => subId !== subjectId));
        }
        else if (checkedSelectedProfiles.includes(subjectId)) {
            setCheckedSelectedProfiles(checkedSelectedProfiles.filter(subId => subId !== subjectId));
        }
        else if (allProfilesList.findIndex(subject => subject._id === subjectId) !== -1) {
            setCheckedAllProfiles([...checkedAllProfiles, subjectId]);
        }
        else if (selectedProfiles.findIndex(subject => subject._id === subjectId) !== -1) {
            setCheckedSelectedProfiles([...checkedSelectedProfiles, subjectId]);
        }
    }

    const handleSelectAllProfiles = () => {
        setSelectedProfiles(allProfilesList);
        setCheckedSelectedProfiles([...checkedSelectedProfiles, checkedAllProfiles]);
        setAllProfilesList([]);
        setCheckedAllProfiles([]);
    }

    const handleDeselectAllProfiles = () => {
        setSelectedProfiles([]);
        setAllProfilesList(allProfiles);
        setCheckedSelectedProfiles([])
    }

    const handleSelectChecked = () => {
        setSelectedProfiles([...selectedProfiles, ...filterListSelect(checkedAllProfiles)]);
    }

    const handleDeselectChecked = () => {
        setAllProfilesList([...allProfilesList, ...filterListDeselect(checkedSelectedProfiles)]);
    }

    const filterListSelect = (toBeSelected) => {
        setAllProfilesList(allProfilesList.filter(subject => !toBeSelected.includes(subject._id)));
        return allProfilesList.filter(subject => toBeSelected.includes(subject._id));
    }

    const filterListDeselect = (toBeDeselected) => {
        setSelectedProfiles(selectedProfiles.filter(subject => !toBeDeselected.includes(subject._id)));
        return selectedProfiles.filter(subject => toBeDeselected.includes(subject._id));
    }

    const customList = (items) => {
        return (
            <Paper style={{ minHeight: 305, maxHeight: 305, overflow: 'auto' }}>
                <List dense component="div" role="list">
                    {items.map((profile) => {
                        const labelId = `transfer-list-item-${profile?._id}-label`;

                        return (
                            <ListItem
                                key={profile?._id}
                                role="listitem"
                                button
                                onClick={() => { handleOnProfileChecked(profile?._id) }}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={checkedAllProfiles.includes(profile?._id) || checkedSelectedProfiles.includes(profile?._id)}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{
                                            'aria-labelledby': labelId,
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`${profile?.name}`} />
                            </ListItem>
                        );
                    })}
                    <ListItem />
                </List>
            </Paper>)
    }

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item xs={5} style={{ paddingTop: 10 }}>
                    <Typography style={{ backgroundColor: '#e9e9e9', color: 'black' }} className={classes.header}>
                        All Profiles :
                    </Typography>
                    {customList(allProfilesList)}
                </Grid>
                <Grid item xs={2} style={{ paddingTop: 50 }}>
                    <Grid container direction="column" alignItems="center" style={{ paddingTop: '75px' }}>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleSelectAllProfiles}
                            disabled={allProfilesList.length === 0}
                            aria-label="move all right"
                        >
                            ≫
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleSelectChecked}
                            disabled={checkedAllProfiles.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleDeselectChecked}
                            disabled={checkedSelectedProfiles.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleDeselectAllProfiles}
                            disabled={selectedProfiles.length === 0}
                            aria-label="move all left"
                        >
                            ≪
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={5} style={{ paddingTop: 10 }}>
                    <Typography style={{ backgroundColor: '#e9e9e9', color: 'black' }} className={classes.header}>
                        Selected Profiles :
                    </Typography>
                    {customList(selectedProfiles)}
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default React.memo(ProfileAudience)