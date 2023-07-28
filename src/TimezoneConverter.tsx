import React, { useState } from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import Select from 'react-select';
import 'moment-timezone';

const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const countryCodes = moment.tz.countries();
const countryZones = [];
countryCodes.forEach(countryCode => {
  const names = moment.tz.zonesForCountry(countryCode, true);
  names.forEach(name => {
    let i = 0;
    for (i = 0; i < countryZones.length; i++) {
      if (name.name === countryZones[i].name) {
        break;
      }
    }
    if (i === countryZones.length) {
      countryZones.push(name);
    }
  });
});

const getOffsetFromCountryZone = (countryZoneName) => {
  return moment.tz(countryZoneName).format("Z");
};

countryZones.sort(function (a, b) { return b.offset - a.offset });

function TimezoneConverter () {
    const [timeZoneState1, setTimeZoneState1] = useState("");
    const [timeZoneState2, setTimeZoneState2] = useState("");
  
    const [hourOption1, setHourOption1] = useState(-1);
    const [hourOption2, setHourOption2] = useState(-1);
    const [hourOptionSelector, setHourOptionSelector] = useState(-1);

    const getTimezoneLabel = (timezone) => {
    const abbr = moment.tz(timezone).zoneAbbr().charAt(0) === "+" || moment.tz(timezone).zoneAbbr().charAt(0) === "-"
      ? "GMT"
      : moment.tz(timezone).zoneAbbr();
    return `(${abbr}${moment.tz(timezone).format("Z")}) ${timezone.replace(/\//g, ', ').replace(/_/g, ' ')}`;
  };

  const fromTimeZoneOptions = [
    { value: "", label: "Current timezone" },
    ...countryZones.map((timezone) => ({
      value: timezone.name,
      label: getTimezoneLabel(timezone.name),
    })),
  ];

  const toTimeZoneOptions = [
    { value: "", label: "Timezone 2" },
    ...countryZones.map((timezone) => ({
      value: timezone.name,
      label: getTimezoneLabel(timezone.name),
    })),
  ];


  const formatTime = (hour) => {
    if (hour === 12) {
      return `${hour}:00 PM`;
    } else if (hour === 0) {
      return `12:00 AM`;
    } else if (hour > 12) {
      return `${hour - 12}:00 PM`;
    } else {
      return `${hour}:00 AM`;
    }
  };

  const selectHourOptions = [
    { value: -1, label: 'Local time' },
    { value: 0, label: '12:00 AM' },
    ...hours.map((hour) => ({
      value: hour,
      label: formatTime(hour),
    })),
    { value: 12, label: '12:00 PM' },
    ...hours.map((hour) => ({
      value: hour + 12,
      label: formatTime(hour + 12),
    })),
  ];

    return (
        <>
        <p className="mt-5" style={{ fontSize: "30px", color: "white" }}>Timezone Converter</p>
        {hourOption1 === -1 ? 
          <Moment style={{ color: "white", fontSize: "20px" }} interval={1000} tz={timeZoneState1} format='ddd hh:mm:ss A'/> :
          (hourOptionSelector === 2 
          ? <Moment style={{ color: "white", fontSize: "20px" }} interval={1000} tz={""} format='ddd hh:mm A'>{moment().seconds(0).minutes(0).hours(hourOption2 + (((moment().tz(timeZoneState1))._offset) - ((moment().tz(timeZoneState2))._offset))/60)}</Moment>
          : <Moment style={{ color: "white", fontSize: "20px" }} interval={1000} tz={""} format='ddd hh:mm A'>{new Date().setHours(hourOption1, 0, 0)}</Moment> 
          )
        }
        <div style={{ marginLeft: "5%", width: "90%", marginRight: "5%" }}>
          <Select
            options={fromTimeZoneOptions}
            value={fromTimeZoneOptions.find((option) => option.value === timeZoneState1)}
            onChange={(selectedOption) => setTimeZoneState1(selectedOption.value)}
          />
        </div>
        <div style={{ marginLeft: "5%", width: "90%", marginRight: "5%" }}>
          <Select
            options={selectHourOptions}
            onChange={(selectedOption) => {
              if (selectedOption.value === -1) {
                setHourOption1(-1);
                setHourOption2(-1);
              } else {
                setHourOptionSelector(1);
                setHourOption1(selectedOption ? selectedOption.value : -1);
              }
            }}                
            value={hourOption1 !== null ? selectHourOptions.find((option) => option.value === hourOption1) : null}
          />
        </div>
        <div className="mt-5" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.3)", paddingTop: "20px" }}/>
        {hourOption2 === -1 ? 
          <Moment style={{ color: "white", fontSize: "20px" }} interval={1000} tz={timeZoneState2} format='ddd hh:mm:ss A'/> :
          (hourOptionSelector === 1  
          ? <Moment style={{ color: "white", fontSize: "20px" }} interval={1000} tz={""} format='ddd hh:mm A'>{moment().seconds(0).minutes(0).hours(hourOption1 + (((moment().tz(timeZoneState2))._offset) - ((moment().tz(timeZoneState1))._offset))/60)}</Moment> 
          : <Moment style={{ color: "white", fontSize: "20px" }} interval={1000} tz={""} format='ddd hh:mm A'>{new Date().setHours(hourOption2, 0, 0)}</Moment>
          )
        }
        <div className="mt-3" style={{ marginLeft: "5%", width: "90%", marginRight: "5%" }}>
          <Select
            menuPlacement="auto"
            options={toTimeZoneOptions}
            value={toTimeZoneOptions.find((option) => option.value === timeZoneState2)}
            onChange={(selectedOption) => setTimeZoneState2(selectedOption.value)}
          />
        </div>
        <div style={{ marginLeft: "5%", width: "90%", marginRight: "5%" }}>
          <Select
            menuPlacement="auto"
            options={selectHourOptions}
            onChange={(selectedOption) => {
              if (selectedOption.value === -1) {
                setHourOption1(-1);
                setHourOption2(-1);
              } else {
                setHourOptionSelector(2);
                setHourOption2(selectedOption ? selectedOption.value : -1);
            }}}                
            value={hourOption2 !== null ? selectHourOptions.find((option) => option.value === hourOption2) : null}
          />
        </div>
      </>
    )
}

export default TimezoneConverter;
