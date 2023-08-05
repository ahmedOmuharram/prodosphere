import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Helmet } from 'react-helmet';
import Button from '@mui/material/Button';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { grey } from "@mui/material/colors";
import { useTimer } from 'react-timer-hook';
import Moment from 'react-moment';

function TimerComponent({ durations, durationIndex, setDurationIndex, expiryTimestamp }) {
  const [visibilityOnTimeEnd, setVisibilityOnTimeEnd] = useState(false);

  const {
    seconds,
    minutes,
    isRunning,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => {
    setIsPlaying(false);
    handleNextDuration();
    if (document.visibilityState === "hidden") {
      setVisibilityOnTimeEnd(true);
    }
  }});

  
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      setVisibilityOnTimeEnd(false);
    }
  });


  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [remainingTimeTitle, setRemainingTimeTitle] = useState(0);

  const remainingMinutes = Math.floor(remainingTimeTitle / 60);
  const remainingSeconds = remainingTimeTitle % 60;

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      setIsPlaying(false);
      handleNextDuration();
      if (document.visibilityState === "hidden") {
        setVisibilityOnTimeEnd(true);
      }
      return null;
    }

    setRemainingTimeTitle(remainingTime);

    if (minutes * 60 + seconds > remainingTime) {
      const time = new Date();
      time.setMinutes(new Date().getMinutes() + Math.floor(remainingTime/60), new Date().getSeconds() + remainingTime % 60);
      restart(time);
    }

    return (
      <div>
        <div> 
        {!isPlaying ? 
        (durations[durationIndex] === 1500 ? "Pomodoro" : (durations[durationIndex] === 300 ? "Short break" : "Long break")) : 
        durations[durationIndex] === 1500 ? "Focus time!" : (durations[durationIndex] === 300 ? "Time for a short break!" : "Time for a long break!")}</div>
        <div>{`${remainingMinutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`}</div>
      </div>
    );
  };
  
  const handleDurationChange = (newDurationIndex) => {
    setKey((prevKey) => prevKey + 1);
    setDurationIndex(newDurationIndex);
    const time = new Date();
    time.setMinutes(new Date().getMinutes() + Math.floor(durations[newDurationIndex]/60), new Date().getSeconds() + durations[newDurationIndex]%60);
    restart(time, false);
    setIsPlaying(false);
  };

  const handleNextDuration = () => {
    const nextIndex = (durationIndex + 1) % durations.length;
    handleDurationChange(nextIndex);
    if (durationIndex % 2 === 0) {
        new Audio(require("./time.mp3")).play()
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying) (
        new Audio(require("./ping.mp3")).play()
    )
    if (!isRunning) {
      resume();
    }
    else {
      pause();
    }
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
};


  useEffect(() => {
    handleDurationChange(0); 
  }, []);

  return (
    <>
        <Helmet defer={false}>
        {isRunning ? (
          <title>
            {`${minutes}:${seconds < 10 ? "0" : ""}${seconds} | Prodosphere`}
          </title>
        ) : (
          (!visibilityOnTimeEnd ? <title>Prodosphere</title> : <title>TIME'S UP!</title>)
        )}
      </Helmet>
      <p className="mt-2" style={{ fontSize: "18px", color: "white" }}>Pomodoro Timer</p>
      <div style={{ color: "white", marginLeft: "25px" }}>
        <CountdownCircleTimer colors="url(#your-unique-id)"
          key={key}
          isPlaying={isPlaying}
          duration={durations[durationIndex]}
          strokeWidth={8}
          trailColor="rgba(255, 255, 255, 0.4)"
          size={250}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
      <div>
        <button onClick={handlePlayPause} style={{border: "none", background: "none", position: "absolute", top: "210px", left: "128px"}}>
            {isPlaying ? <PauseIcon fontSize="large" sx={{ color: grey[50]}}/> : <PlayArrowIcon fontSize="large" style={{ border: "none", background: "none" }} sx={{color: grey[50]}}/>}
        </button>
        <Button color='error' className="mt-4" fullWidth variant="contained" onClick={() => handleDurationChange(0)}>Pomodoro</Button>
        <Button color='primary' className="mt-4" variant="contained" onClick={() => handleDurationChange(1)}>Short Break</Button>
        <Button color='success' className="mt-4" style={{marginLeft: "25px"}} variant="contained" onClick={() => handleDurationChange(7)}>Long Break</Button>
      </div>
      <svg>
        <defs>
            <linearGradient id="your-unique-id" x1="1" y1="0" x2="0" y2="0">
            <stop offset="5%" stopColor={durations[durationIndex] === 1500 ? "#DF537A" : (durations[durationIndex] === 300 ? "#724FE3" : "#59EF2A")} />
            <stop offset="95%" stopColor={durations[durationIndex] === 1500 ? "#D72859" : (durations[durationIndex] === 300 ? "#4E24DB" : "#40D510")} />
            </linearGradient>
        </defs>
      </svg>
    </>
  );
}

export default TimerComponent;
