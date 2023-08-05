import { Button, Checkbox, IconButton } from '@mui/material';
import { grey, lightGreen } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import "./Settings.css";
import CheckIcon from '@mui/icons-material/Check';
import { light } from '@mui/material/styles/createPalette';

function UsernameInput({ username, handleInputChange, handleSubmit }) {
  return (
    <>
      <input
        type="text"
        placeholder="New username"
        value={username}
        onChange={handleInputChange}
        style={{
          fontSize: "15px",
          marginLeft: "0%",
          marginTop: 0,
          width: "60%",
          backgroundColor: "rgba(0,0,0,0)",
          color: "white",
          outline: "none",
          border: "none",
          borderBottom: "2px solid rgba(255, 255, 255, 1)",
        }}
      />
        <IconButton style={{marginLeft: "20px", backgroundColor: "rgba(0, 0, 0, 0.2)"}} onClick={handleSubmit}>
          <CheckIcon sx={{color: lightGreen[400]}}/>
        </IconButton>
    </>
  );
}

function Settings({ setUser, mapVisibility, setMapVisibility, weatherVisibility, setWeatherVisibility, videoVisibility, setVideoVisibility }) {
  const [showInput, setShowInput] = useState(false);
  const [username, setUsername] = useState('');

  const handleButtonClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = () => {
    if (username !== "") {
      setUser(username);
      setShowInput(false);
    }
  };

  const handleMapVisibilityChange = () => {
    setMapVisibility((prevVisibility) => !prevVisibility);
  };

  useEffect(() => {
    localStorage.setItem('mapVisibility', mapVisibility);
  }, [mapVisibility]);

  const handleWeatherVisibilityChange = () => {
    setWeatherVisibility((prevVisibility) => !prevVisibility);
  };

  useEffect(() => {
    localStorage.setItem('weatherVisibility', weatherVisibility);
  }, [weatherVisibility]);

  const handleVideoVisibility = () => {
    setVideoVisibility((prevVisibility) => !prevVisibility);
  };

  useEffect(() => {
    localStorage.setItem('videoVisibility', videoVisibility);
  }, [videoVisibility]);

  return (
    <>
      <p className="mt-2" style={{ fontSize: "18px", color: "white" }}>
        Settings
      </p> 
      {showInput ? (
        <UsernameInput
          username={username}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      ) : (
        <button style={{color: grey[50], background: "rgba(0, 0, 0, 0.3)", border: "none", borderRadius: "20px", padding: "10px", width: "90%"}} onClick={handleButtonClick}>
          Change username
        </button>
      )}
      <div className="mt-4" style={{display: "flex", alignItems: "center"}}>
        <p style={{color: "white", textAlign: "left", marginLeft: "10px"}}>World map on by default?</p> 
        <Checkbox 
          defaultChecked={mapVisibility}
          style={{color: lightGreen[300], marginLeft: "auto", marginBottom: "16px"}}
          onClick={handleMapVisibilityChange}
          />
      </div>
      <div style={{display: "flex", alignItems: "center"}}>
        <p style={{color: "white", textAlign: "left", marginLeft: "10px"}}>Weather on by default?</p> 
        <Checkbox 
          defaultChecked={weatherVisibility}
          style={{color: lightGreen[300], marginLeft: "auto", marginBottom: "16px"}}
          onClick={handleWeatherVisibilityChange}
          />     
      </div>
      <div style={{display: "flex", alignItems: "center"}}>
        <p style={{color: "white", textAlign: "left", marginLeft: "10px"}}>Youtube plays on start?</p> 
        <Checkbox 
          defaultChecked={videoVisibility}
          style={{color: lightGreen[300], marginLeft: "auto", marginBottom: "16px"}}
          onClick={handleVideoVisibility}
        />
      </div>
    </>
  );
}

export default Settings;
