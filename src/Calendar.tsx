import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';
import Moment from 'react-moment';
import './Navigation.css'
import { Button } from '@mui/material';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const colors = ["2f96d0", "B92FD0", "D0692F", "46D02F"]

function CalendarComponent() {
  const [value, onChange] = useState<Value>(new Date());
  const [text, setText] = useState("");
  const [selectRangeState, setSelectRangeState] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [colorPicker, setColorPicker] = useState(0);

useEffect(() => {
    const newCalendarEvents = JSON.parse(localStorage.getItem("calendarEvents"));
    if (newCalendarEvents) {
        for (let i = 0; i < newCalendarEvents.length; i++) {
            newCalendarEvents[i].range[0] = new Date(newCalendarEvents[i].range[0])
            newCalendarEvents[i].range[1] = new Date(newCalendarEvents[i].range[1])
        }
        setCalendarEvents(newCalendarEvents);
    }
}, []);
function rangeCheck(date) {
    for (let i = 0; i < calendarEvents.length; i++) {
        if (date >= calendarEvents[i].range[0] && date <= calendarEvents[i].range[1]) {
            return true;
        }
    }
    return false;
}
function nameCheck(date) {
    for (let i = 0; i < calendarEvents.length; i++) {
        if (date >= calendarEvents[i].range[0] && date <= calendarEvents[i].range[1]) {
            return calendarEvents[i].event;
        }
    }
    return null;
}

  return (
    <>
    <div>
      <Calendar allowPartialRange={selectRangeState} selectRange={selectRangeState} onChange={onChange} value={value}
        tileClassName={({ activeStartDate, date, view }) => {
            if (view === 'month' && rangeCheck(date)) {
                const randomColor = colors[colorPicker % 4];
                return `event-color-${randomColor}`;
            }
            return null;
        }}
      tileContent={({ activeStartDate, date, view }) => 
      view === 'month' && rangeCheck(date) ? <><div className='container-hover-check'><div className='event-name'>{nameCheck(date)}</div></div></> : null} />
    </div>
    <p style={{color: "white"}}>
      {value.constructor === Array && value[0] && value[1] ? <>From <Moment format='L'>{value[0].toString()}</Moment> to <Moment format='L'>{value[1].toString()}</Moment></> : <Moment format='L'>{value.toString()}</Moment>}
    </p>
    {!selectRangeState 
    ?
    <>
        <Button color='success' variant="contained" onClick={() => setSelectRangeState(true)}>Add Event</Button>
    </>
    :
    <>
        <input type='text' onChange={e => setText(e.target.value)}
            style={{
                fontSize: "15px",
                width: "90%",
                backgroundColor: "rgba(0,0,0,0)",
                color: "white",
                outline: "none",
                border: "none",
                borderBottom: "2px solid rgba(255, 255, 255, 1)",
                }}
        />
        <Button color='success' variant="contained" onClick={() => {
            if (value[1] && text !== "") {
                const newCalendarEvents = [...calendarEvents, {event: text, range: [value[0], value[1]]}]
                setCalendarEvents(newCalendarEvents);
                localStorage.setItem('calendarEvents', JSON.stringify(newCalendarEvents));
                setSelectRangeState(false);
                setColorPicker(colorPicker + 1);
                setText("")
            }
            }}>Submit Event</Button>
    </>}
    {calendarEvents.map((event, index) => 
        <>
            <br/>
            <span style={{backgroundColor: "white", margin: "2px"}}>
                {event.event}<Moment format='L'>{event.range[0].toString()}</Moment> - <Moment format='L'>{event.range[1].toString()}</Moment>
            </span>
            <Button color='error' variant="contained" onClick={() => {
                const newCalendarEvents = [...calendarEvents]
                newCalendarEvents.splice((index) ,1);
                setCalendarEvents(newCalendarEvents);
                localStorage.setItem('calendarEvents', JSON.stringify(newCalendarEvents));
            }}>Delete Event</Button>
        </>
    )}
    </>
  );
}

export default CalendarComponent