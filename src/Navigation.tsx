import './Navigation.css';
import { useState, useContext, useEffect } from "react";
import React from "react";
import Select from 'react-select'
import { motion } from "framer-motion";
import TranslateIcon from '@mui/icons-material/Translate';
import { IconButton } from "@mui/material";
import { menuContext, clickContext } from "./App"
import { MenuItem } from "./MenuItem.tsx";
import axios from 'axios';
import YouTube from 'react-youtube';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';

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
countryZones.sort(function (a, b) { return b.offset - a.offset });



type MenuContextType = {
  menuState: number;
  setMenuState: (newState: number) => void;
};

type ClickStateType = {
  clickState: boolean;
  setClickState: (newState: boolean) => void;
};

const variants = {
  open: {
    transition: { staggerChildren: -0.07, delayChildren: 0.5 }
  },
  closed: {
    transition: { staggerChildren: -0.07, delayChildren: 0.5, staggerDirection: -1 },
  }
};

const menuVariants = {
  open: {
    width: "300px",
    opacity: 1,
    transition: {
      width: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    width: "0px",
    opacity: 0,
    transition: {
      width: { stiffness: 1000 }
    }
  }
};
const menuClickedVariants = {
  open: {
    width: "0px",
    opacity: 0,
    transition: {
      width: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    width: "0px",
    opacity: 0,
    transition: {
      width: { stiffness: 1000, velocity: -100 }
    }
  }
};

export const Navigation = () => {
  const { menuState } = useContext<MenuContextType>(menuContext);
  const { clickState, setClickState } = useContext<ClickStateType>(clickContext);
  const [languagesList, setLanguagesList] = useState([])
  const [translateState, setTranslateState] = useState("");
  const [selectedLanguageFromKey, setLanguageFromKey] = useState("")
  const [selectedLanguageKey, setLanguageKey] = useState("")
  const [resultText, setResultText] = useState("");
  const [videoState, setVideoState] = useState("");
  const [loadVideo, setLoadVideo] = useState(false);
  const [timeZoneState1, setTimeZoneState1] = useState("");
  const [timeZoneState2, setTimeZoneState2] = useState("");

  const [hourOption1, setHourOption1] = useState(-1);
  const [hourOption2, setHourOption2] = useState(-1);
  const [hourOptionSelector, setHourOptionSelector] = useState(-1);



  useEffect(() => {
    axios.get(`https://libretranslate.de/languages`)
      .then((response) => {
        setLanguagesList(response.data)
      })
  }, [])
  /*const getLanguageSource = () => {
    axios.post(`https://libretranslate.de/detect`, {
      q: translateState
    })
    .then((response) => {
      setLanguageFromKey(response.data[0].language)
    })
  }*/
  const languageFromKey = (selectedLanguage) => {
    setLanguageFromKey(selectedLanguage.target.value);
  }
  const languageKey = (selectedLanguage) => {
    setLanguageKey(selectedLanguage.target.value)
  }

  const extractVideoId = (url) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : '';
  };

  const handleYoutubeInputChange = (event) => {
    const inputLink = event.target.value;
    const videoId = extractVideoId(inputLink);
    setVideoState(videoId);
  };

  const translateText = () => {
    let data = {
      q: translateState,
      source: selectedLanguageFromKey,
      target: selectedLanguageKey
    }
    axios.post(`https://libretranslate.de/translate`, data)
      .then((response) => {
        setResultText(response.data.translatedText)
      })
  }

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
      <motion.ul variants={variants}>
        {itemIds.map(i => (
          <MenuItem i={i} key={i} />
        ))}
      </motion.ul>
      <motion.div
        onAnimationComplete={() => {
          if (clickState) {
            setClickState(false);
          }
        }}
        variants={!clickState && menuState !== -1 ? menuVariants : menuClickedVariants}
        initial={!clickState || menuState === -1 ? { width: "0px", opacity: "0" } : { width: "300px", opacity: "1" }}
        animate={menuState !== -1 ? "open" : "closed"}
        style={{
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          top: "calc(100% - 500px)", left: "80px",
          width: "300px",
          borderTopRightRadius: "20px",
          height: "500px"
        }}
      >
        {menuState === 0 &&
          <>
            <p className="mt-5" style={{ fontSize: "30px", color: "white" }}>Timezone Converter</p>
            {hourOption1 === -1 ? 
              <Moment style={{ color: "white", fontSize: "20px" }} interval={1000} tz={timeZoneState1} format='ddd hh:mm:ss A'/> :
              (hourOptionSelector === 2 
              ? <Moment style={{ color: "white", fontSize: "20px" }} interval={1000} tz={timeZoneState1} format='ddd hh:mm A'>{new Date().setHours(hourOption2, 0, 0)}</Moment>
              : <Moment style={{ color: "white", fontSize: "20px" }} interval={1000} tz={""} format='ddd hh:mm A'>{new Date().setHours(hourOption1, 0, 0)}</Moment> 
              )
            }
            { console.log(hourOptionSelector)}
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
              ? <Moment style={{ color: "white", fontSize: "20px" }} interval={1000} tz={timeZoneState2} format='ddd hh:mm A'>{new Date().setHours(hourOption1, 0, 0)}</Moment> 
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
                  }
                }}                
                value={hourOption2 !== null ? selectHourOptions.find((option) => option.value === hourOption2) : null}
              />
            </div>
          </>}
        {menuState === 1 && <p style={{ color: "white" }}>1</p>}
        {menuState === 2 && <p style={{ color: "white" }}>2</p>}
        {menuState === 3 && loadVideo === false ? <>{setLoadVideo(true)}</> : <></>}
        {loadVideo &&
          <>
            {menuState === 3 && <p className="mt-5" style={{ fontSize: "30px", color: "white" }}>YouTube Player</p>}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ display: (menuState !== 3 ? "none" : "block") }}>
                <div style={{ marginLeft: "5%", width: "90%", borderRadius: "20px", overflow: "hidden", padding: 0, height: "169px" }}>
                  <YouTube videoId={videoState !== "" ? videoState : "jfKfPfyJRdk"}
                    opts={{
                      height: '169',
                      width: '100%',
                      playerVars: {
                        autoplay: 1,
                      }
                    }} />
                </div>
                <input
                  type="text"
                  className="mt-5"
                  placeholder="Enter a youtube link"
                  onChange={handleYoutubeInputChange}
                  style={{
                    fontSize: "15px",
                    marginLeft: "0%",
                    width: "70%",
                    backgroundColor: "rgba(0,0,0,0)",
                    color: "white",
                    outline: "none",
                    border: "none",
                    borderBottom: "2px solid rgba(255, 255, 255, 1)",
                  }} />
              </div>
            </div>
          </>}
        {menuState === 4 &&
          <>
            <p className="mt-5" style={{ fontSize: "30px", color: "white" }}>Translate</p>
            <div style={{ display: "flex", marginBottom: "30px" }}>
              <select className="form-select" style={{ marginLeft: "5%", width: "40%", marginRight: "10%" }} onChange={languageFromKey}>
                <option value={""}>From</option>
                {languagesList.map((language) => {
                  return (
                    <option value={language.code}>
                      {language.name}
                    </option>
                  )
                })}
              </select>
              <select className="form-select" style={{ width: "45%", marginRight: "5%" }} onChange={languageKey}>
                <option value={""}>To</option>
                {languagesList.map((language) => {
                  return (
                    <option value={language.code}>
                      {language.name}
                    </option>
                  )
                })}
              </select>
            </div>
            <input
              type="text"
              placeholder='Input text'
              style={{
                fontSize: "15px",
                marginLeft: "0%",
                width: "70%",
                backgroundColor: "rgba(0,0,0,0)",
                color: "white",
                outline: "none",
                border: "none",
                borderBottom: "2px solid rgba(255, 255, 255, 1)",
              }}
              onChange={(e) => {
                setTranslateState(e.target.value.replace("?", ""));
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  if (selectedLanguageFromKey !== "" && selectedLanguageKey !== "" && translateState !== "") {
                    translateText();
                  }
                }
              }}
            />
            {(selectedLanguageFromKey !== "" && selectedLanguageKey !== "" && translateState !== "") &&
              <IconButton
                size="large"
                style={{
                  background: "none",
                  border: "none",
                  width: "30px",
                  marginLeft: "5%",
                  height: "30px"
                }}
                color="info"
                onClick={translateText}
              >
                <TranslateIcon /></IconButton>}
            {(selectedLanguageFromKey === "" || selectedLanguageKey === "" || translateState === "") &&
              <IconButton
                disabled
                size="large"
                style={{
                  background: "none",
                  border: "none",
                  width: "30px",
                  marginLeft: "5%",
                  height: "30px"
                }}
                color="info"
                onClick={translateText}
              >
                <TranslateIcon /></IconButton>}
            <br /><br /><br />
            <p style={{ fontSize: "20px", color: "white", borderTop: "1px solid rgba(255, 255, 255, 0.3)", paddingTop: "20px" }}>Output</p>
            <div className="translated-text" style={{ overflowY: "auto", maxHeight: "170px" }}>
              <span style={{ color: "white", wordWrap: "break-word" }}>{resultText}</span>
            </div>
          </>
        }
        {menuState === 5 && <p style={{ color: "white" }}>5</p>}
        {menuState === 6 && <p style={{ color: "white" }}>6</p>}
        {menuState === 1}
      </motion.div>
    </>
  )
};

const itemIds = [0, 1, 2, 3, 4, 5, 6];
const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]