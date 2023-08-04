import React, { useEffect, useContext, useState } from 'react';
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
    const [currentDay, setCurrentDay] = useState<Value>(new Date());

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
function colorCheck(date) {
    const eventColors = [];
    for (let i = 0; i < calendarEvents.length; i++) {
        if (date >= calendarEvents[i].range[0] && date <= calendarEvents[i].range[1]) {
            eventColors.push("#" + calendarEvents[i].color);
        }
    }
    return eventColors;
}

  return (
    <>
    {displayCalendarOnly &&
              <>
                    <div><Calendar allowPartialRange={true} selectRange={selectRangeState} onChange={onChange} value={value}
                        tileContent={({ activeStartDate, date, view }) =>
                            view === 'month' && rangeCheck(date) ? <>{colorCheck(date).map((color) => {
                                return(<div className='event-color' style={{backgroundColor: color}}></div>)
                            })}</> : null}
                            onClickDay={(value) => {
                                setCurrentDay(value);
                            }} /></div>
                    <p style={{ color: "white", fontSize: "14px" }}>
                        {value.constructor === Array && value[0] && value[1] ? <>Selected from <Moment format='L'>{value[0].toString()}</Moment> to <Moment format='L'>{value[1].toString()}</Moment></> : <></>}
                    </p>
                    <div className="calendar-events-app" style={{position: 'absolute', top: 0, left: "300px", height: "188px", padding: "10px", paddingRight: "50px", backgroundColor: "rgba(113, 113, 113, 0.4)", overflowY: "auto", borderTopRightRadius: "20px", borderBottomRightRadius: "20px"}}>
                        <div style={{fontSize: "20px", width: "fit-content", textAlign: "left"}}>{<Moment format='L'>{currentDay.toString()}</Moment>}</div>
                        {calendarEvents.map(({ event, range }) => {
                            if (currentDay >= range[0] && currentDay <= range[1]) {
                                return (               
                                    <div style={{color: "rgba(255, 255, 255, 0.7)", marginBottom: "0", fontSize: "16px", width: "fit-content", textAlign: "left"}}>{event}</div>
                                )
                            }
                        })}
                    </div>
              </>}
    {!displayCalendarOnly && <>
        <p className="mt-2" style={{ fontSize: "18px", color: "white" }}>Calendar Events</p>
    <div className="events" style={{maxHeight: "350px", overflowY: "auto"}}>{calendarEvents.map((event, index) =>
        <>
            <div style={{display: "flex", flexDirection: "column", marginLeft: "20px", textAlign: "left", height: "fit-content", padding: 0}}>
                <span style={{color: "white", marginBottom: 0, maxWidth: "250px", wordBreak: "break-word"}}>
                    {event.event}<br/>
                </span>
                <span style={{color: "rgba(255, 255, 255, 0.6)"}}>
                    {new Date(event.range[0].toString()).getDay() === new Date(event.range[1].toString()).getDay() ? 
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
        <Button sx={{color: lightGreen[400]}} color="success" style={{ position: "absolute", bottom: "0px", right: "0px"}} variant="outlined" onClick={() => setSelectRangeState(true)}> <EventNoteIcon /></Button>
    </>
    :
    <>
        <p style={{fontSize: "10px", color: "white", marginTop: "15px"}}>Choose a date range from the calendar</p>
        <div style={{display: "flex"}}>
            <input type='text' onChange={e => setText(e.target.value)} placeholder='Event name'
                style={{
                    fontSize: "15px",
                    width: "90%",
                    marginLeft: "20px",
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
                    const newCalendarEvents = [...calendarEvents, {event: text, range: [value[0], value[1]], color: colors[colorPicker % 4]}];
                    setCalendarEvents(newCalendarEvents);
                    localStorage.setItem('calendarEvents', JSON.stringify(newCalendarEvents));
                    setSelectRangeState(false);
                    setColorPicker(colorPicker + 1);
                    setText("")
                }
                else if (text !== "") {
                    const newCalendarEvents = [...calendarEvents, {event: text, range: (value.constructor === Array ? [value[0], value[0]] : [value, value]), color: colors[colorPicker % 4]}]
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