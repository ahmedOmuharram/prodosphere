import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';
import Moment from 'react-moment';
import './Navigation.css'
import { Button } from '@mui/material';
import { calendarContext } from "./App"
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { grey, lightGreen } from '@mui/material/colors';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventNoteIcon from '@mui/icons-material/EventNote';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type CalendarStateType = {
    value: Value;
    onChange: (newState: Value) => void;
    text: string;
    setText: (newState: string) => void;
    selectRangeState: boolean;
    setSelectRangeState: (newState: boolean) => void;
    calendarEvents: Array<{event: string, range: Value[], color: string}>;
    setCalendarEvents: (newState: Array<{event: string, range: Value[], color: string}>) => void;
    colorPicker: number;
    setColorPicker: (newState: number) => void;
};

const colors = ["2f96d0", "B92FD0", "D0692F", "46D02F"]

function CalendarComponent({displayCalendarOnly}) {

  const { value, onChange,
          text, setText ,
          selectRangeState, setSelectRangeState,
          calendarEvents, setCalendarEvents,
          colorPicker, setColorPicker } = useContext<CalendarStateType>(calendarContext);

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
    const events = [];
    for (let i = 0; i < calendarEvents.length; i++) {
        if (date >= calendarEvents[i].range[0] && date <= calendarEvents[i].range[1]) {
            events.push(calendarEvents[i].event);
        }
    }
    return events;
}
function colorCheck(date) {
    const eventColors = [];
    for (let i = 0; i < calendarEvents.length; i++) {
        if (date >= calendarEvents[i].range[0] && date <= calendarEvents[i].range[1]) {
            eventColors.push("event-color-" + calendarEvents[i].color);
        }
    }
    return eventColors;
}

  return (
    <>
    {displayCalendarOnly &&
              <>
                    <div><Calendar allowPartialRange={true} selectRange={selectRangeState} onChange={onChange} value={value}
                        tileClassName={({ activeStartDate, date, view }) => {
                            if (view === 'month' && rangeCheck(date)) {
                                return colorCheck(date);
                            }
                            return null;
                        }}
                        tileContent={({ activeStartDate, date, view }) =>
                            view === 'month' && rangeCheck(date) ? <><div className='container-hover-check'><div className='event-name'>{nameCheck(date)}</div></div></> : null} /></div>
                    <p style={{ color: "white", fontSize: "14px" }}>
                        {value.constructor === Array && value[0] && value[1] ? <>Selected from <Moment format='L'>{value[0].toString()}</Moment> to <Moment format='L'>{value[1].toString()}</Moment></> : <>Selected <Moment format='L'>{value.toString()}</Moment></>}
                    </p>
              </>}
    {!displayCalendarOnly && <>
        <p className="mt-5" style={{ fontSize: "30px", color: "white", marginBottom: "15px" }}>Calendar Events</p>
    <div className="events" style={{maxHeight: "300px", overflowY: "scroll"}}>{calendarEvents.map((event, index) => 
        <>
            <div style={{display: "flex", flexDirection: "column", textAlign: "left", height: "fit-content", padding: 0}}>
                <span style={{color: "white", marginBottom: 0, maxWidth: "250px" }}>
                    {event.event}<br/>
                </span>
                <span style={{color: "rgba(255, 255, 255, 0.6)"}}>
                    {event.range[0].toString() === event.range[1].toString() ? 
                        <Moment format='L'>{event.range[0].toString()}</Moment> : 
                        <><Moment format='L'>{event.range[0].toString()}</Moment> - <Moment format='L'>{event.range[1].toString()}</Moment></>
                    }
                </span>
                <Button color='error' variant="outlined" style={{border: "none", padding: 0, width: "fit-content", marginLeft: "auto", position: "relative", top: "-40px", height: "fit-content"}} onClick={() => {
                    const newCalendarEvents = [...calendarEvents]
                    newCalendarEvents.splice((index) ,1);
                    setCalendarEvents(newCalendarEvents);
                    localStorage.setItem('calendarEvents', JSON.stringify(newCalendarEvents));
                }}>            
                    <EventBusyIcon />
                </Button>
            </div>
        </>
    )} </div>
    {!selectRangeState 
    ?
    <>
        <Button color='success' style={{ position: "absolute", bottom: "0px", right: "0px"}} variant="outlined" onClick={() => setSelectRangeState(true)}> <EventNoteIcon /></Button>
    </>
    :
    <>
        <p style={{fontSize: "10px", color: "white", marginTop: "15px"}}>Choose a date range from the calendar</p>
        <div style={{display: "flex"}}>
            <input type='text' onChange={e => setText(e.target.value)} placeholder='Event name'
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
        <Button
            color='success'
            onClick={() => {
                if (value[1] && text !== "") {
                    const newCalendarEvents = [...calendarEvents, {event: text, range: [value[0], value[1]], color: colors[colorPicker % 4]}]
                    setCalendarEvents(newCalendarEvents);
                    localStorage.setItem('calendarEvents', JSON.stringify(newCalendarEvents));
                    setSelectRangeState(false);
                    setColorPicker(colorPicker + 1);
                    setText("")
                }
                else if (text !== "") {
                    const newCalendarEvents = [...calendarEvents, {event: text, range: [value, value], color: colors[colorPicker % 4]}]
                    setCalendarEvents(newCalendarEvents);
                    localStorage.setItem('calendarEvents', JSON.stringify(newCalendarEvents));
                    setSelectRangeState(false);
                    setColorPicker(colorPicker + 1);
                    setText("")
                } else {
                    return;
                }
            }}
            disabled={text === ""}
            sx={{ color: text === "" ? grey[50] : lightGreen[400] }}
        >
            <EditCalendarIcon />
        </Button>
        </div>
    </>}</>}
    </>
  );
  
}


export default CalendarComponent