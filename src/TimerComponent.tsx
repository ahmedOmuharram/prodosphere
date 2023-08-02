import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

function TimerComponent() {
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationIndex, setDurationIndex] = useState(0);
  const durations = [1500, 300, 1500, 300, 1500, 300, 1500, 900];

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      setIsPlaying(false);
      handleNextDuration(); 
      return null; 
    }

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
      <div>
        <div> 
        {!isPlaying ? 
        (durations[durationIndex] === 1500 ? "Pomodoro" : (durations[durationIndex] === 300 ? "Short break" : "Long break")) : 
        durations[durationIndex] === 1500 ? "Focus time!" : (durations[durationIndex] === 300 ? "Time for a short break!" : "Time for a long break!")}</div>
        <div>{`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}</div>
      </div>
    );
  };

  const handleDurationChange = (newDurationIndex) => {
    setKey((prevKey) => prevKey + 1);
    setDurationIndex(newDurationIndex);
    setIsPlaying(false);
  };

  const handleNextDuration = () => {
    const nextIndex = (durationIndex + 1) % durations.length;
    handleDurationChange(nextIndex);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  useEffect(() => {
    handleDurationChange(0); 
  }, []);

  return (
    <>
      <p className="mt-2" style={{ fontSize: "18px", color: "white" }}>Settings</p>
      <div style={{ color: "white", marginLeft: "25px" }}>
        <CountdownCircleTimer colors="url(#your-unique-id)"
          key={key}
          isPlaying={isPlaying}
          duration={durations[durationIndex]}
          isGrowing={true}
          strokeWidth={2}
          trailColor="rgba(0, 0, 0, 0)"
          size={250}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
      <div className="button-wrapper">
        <button onClick={() => handleDurationChange(0)}>Reset to 25 minutes</button>
        <button onClick={() => handleDurationChange(1)}>Take a short break</button>
        <button onClick={() => handleDurationChange(7)}>Take a long break</button>
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <svg>
        <defs>
            <linearGradient id="your-unique-id" x1="1" y1="1" x2="0" y2="0">
            <stop offset="5%" stopColor="#ccc" />
            <stop offset="95%" stopColor="#fff" />
            </linearGradient>
        </defs>
    </svg>
    </>
  );
}

export default TimerComponent;
