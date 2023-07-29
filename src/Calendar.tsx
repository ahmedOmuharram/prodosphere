import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Moment from 'react-moment';
import './Navigation.css'

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


function CalendarComponent() {
  const [value, onChange] = useState<Value>(new Date());
  const [text, setText] = useState("");
  const [selectRangeState, setSelectRangeState] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);

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
      tileClassName={({ activeStartDate, date, view }) => 
      view === 'month' && rangeCheck(date) ? 'calendar-item-event-color' : null}
      tileContent={({ activeStartDate, date, view }) => 
      view === 'month' && rangeCheck(date) ? <><div className='container-hover-check'><div className='event-name'>{nameCheck(date)}</div></div></> : null} />
    </div>
    {value.constructor === Array && value[0] && value[1] ? <><Moment format='L'>{value[0].toString()}</Moment>-<Moment format='L'>{value[1].toString()}</Moment></> : <Moment format='L'>{value.toString()}</Moment>}
    {!selectRangeState 
    ?
    <>
        <button onClick={() => setSelectRangeState(true)}>Add Event</button>
    </>
    :
    <>
        <input type='text' onChange={e => setText(e.target.value)}/>
        <button onClick={() => {
            if (value[1] && text !== ""){
            const newCalendarEvents = [...calendarEvents, {event: text, range: [value[0], value[1]]}]
            setCalendarEvents(newCalendarEvents);
            localStorage.setItem('calendarEvents', JSON.stringify(newCalendarEvents));
            setSelectRangeState(false)
            }
            }}>Submit Event</button>
    </>}
    {calendarEvents.map((event, index) => 
        <>
            <span style={{backgroundColor: "white", margin: "2px"}}>
                {event.event}<Moment format='L'>{event.range[0].toString()}</Moment>-<Moment format='L'>{event.range[1].toString()}</Moment>
            </span>
            <button onClick={() => {
                const newCalendarEvents = [...calendarEvents]
                newCalendarEvents.splice((index) ,1);
                setCalendarEvents(newCalendarEvents);
                localStorage.setItem('calendarEvents', JSON.stringify(newCalendarEvents));
            }}>Delete Event</button>
        </>
    )}
    </>
  );
}

export default CalendarComponent