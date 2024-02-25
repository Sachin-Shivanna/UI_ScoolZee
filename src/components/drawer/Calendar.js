import React, { useEffect, useState } from "react";
import axios from 'axios';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import styled from "@emotion/styled";
import { useHistory } from 'react-router-dom';

import CancelSharpIcon from '@mui/icons-material/CancelSharp';

const Calendar = (props) => {

    const history = useHistory();

    let unmounted = false;

    const [allEvents, setAllEvents] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);

    useEffect(() => {
        getRelatedEvents();
    }, []);

    useEffect(() => {
        setCalendarData();
    }, [allEvents])

    const getRelatedEvents = async () => {
        const source = axios.CancelToken.source();
        await axios.get(`${process.env.REACT_APP_SERVER}/get-all-events/event`)
            .then((response) => {
                console.log(response.data);
                setAllEvents(response.data)
            })
            .catch((error) => {
                if (!unmounted) {
                    if (error.request.status === 403) {
                        localStorage.removeItem('userDetail');
                        localStorage.removeItem('userToken');
                        localStorage.removeItem('activeSubscription');
                        history.push("/")
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

    const setCalendarData = () => {
        let tempEvents = [];
        tempEvents.push(...allEvents.map((event) => { return { id: event._id, title: event.title, start: event.startDateTime?.replace('Z', ''), end: event.endDateTime?.replace('Z', ''), color: event.type === 'acadamics' ? '#6FEDD6' : event.type === 'sports' ? '#C98474' : event.type === 'cultural' ? '#42855B' : event.type === 'others' ? '#80558C' : '' } }));
        console.log(tempEvents);
        setCalendarEvents(tempEvents)
    }

    const handleEventClick = (evt) => {
        console.log(evt.event?._def?.publicId)
        const win = window.open(`/events/event-detail/${evt.event?._def?.publicId}`, "_blank");
        win.focus();
    }

    const StyleWrapper = styled.div`
    .fc-h-event {
        cursor: pointer;
  }`

    return (
        <React.Fragment>
            <div style={{ position: 'absolute', top: 5, left: '97%', }}><CancelSharpIcon style={{ cursor: 'pointer' }} onClick={props.onClose} /></div>
            <span style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
                <StyleWrapper>
                    <FullCalendar
                        defaultView="dayGridMonth"
                        themeSystem="Simplex"
                        contentHeight='70vh'

                        plugins={[dayGridPlugin, timeGridPlugin]}
                        events={calendarEvents}
                        displayEventEnd="true"
                        eventClick={(event) => { handleEventClick(event) }}
                    />
                </StyleWrapper>
            </span>
        </React.Fragment>
    )
}

export default Calendar