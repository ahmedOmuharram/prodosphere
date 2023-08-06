import { Checkbox, IconButton } from '@mui/material';
import { grey, lightGreen } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import "./Settings.css";
import CheckIcon from '@mui/icons-material/Check';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import moment from 'moment';
import 'moment-timezone';

// Change username

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

// Get country names for secondary timezone

const getTimezoneLabel = (timezone) => {
  const abbr = moment.tz(timezone).zoneAbbr().charAt(0) === "+" || moment.tz(timezone).zoneAbbr().charAt(0) === "-"
    ? "GMT"
    : moment.tz(timezone).zoneAbbr();
  return `${timezone.replace(/\//g, ', ').replace(/_/g, ' ')}`;
};
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
const secondaryTimezoneOptions = [
  { value: "", label: "Secondary Timezone" },
  ...countryZones.map((timezone) => ({
    value: timezone.name,
    label: getTimezoneLabel(timezone.name),
  })),
];

// Settings Component

function Settings({ setUser, mapVisibility, setMapVisibility, weatherVisibility, setWeatherVisibility, videoVisibility, setVideoVisibility, defaultBackground, setDefaultBackground, secondaryTimezone, setSecondaryTimezone }) {
  const [showInput, setShowInput] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

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

  // Handle settings states and storing them in storage

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
  

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file !== null) {
      setSelectedFile(file);
      document.body.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
      document.body.style.backgroundRepeat = `no-repeat`;
      document.body.style.backgroundSize = `cover`;
    }
  };

  const handleDefaultBackground = () => {
    if (selectedFile !== null) {
      const fileURL = URL.createObjectURL(selectedFile);
      setDefaultBackground(fileURL);
      localStorage.setItem('defaultBackground', fileURL);
    }
  };

  const handleResetBackground = () => {
    setDefaultBackground(null);
    localStorage.setItem('defaultBackground', null);
  };
  

  useEffect(() => {
    localStorage.setItem('defaultBackground', defaultBackground);
  }, [defaultBackground]);

  useEffect(() => {
    localStorage.setItem('secondaryTimezone', secondaryTimezone);
  }, [secondaryTimezone]);
  return (
    <>
      <p className="mt-2" style={{ fontSize: "18px", color: "white" }}>
        Settings
      </p> 
      <div className="main" style={{height: "430px", overflowY: "scroll"}}>

        {/* Change username */}

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

        {/* Map On or Off */}

      <div className="mt-4" style={{display: "flex", alignItems: "center"}}>
        <p style={{color: "white", textAlign: "left", marginLeft: "10px"}}>World map on by default?</p> 
        <Checkbox 
          defaultChecked={mapVisibility}
          style={{color: lightGreen[300], marginLeft: "auto", marginBottom: "16px"}}
          onClick={handleMapVisibilityChange}
          />
      </div>

      {/* Weather On or Off */}

      <div style={{display: "flex", alignItems: "center"}}>
        <p style={{color: "white", textAlign: "left", marginLeft: "10px"}}>Weather on by default?</p> 
        <Checkbox 
          defaultChecked={weatherVisibility}
          style={{color: lightGreen[300], marginLeft: "auto", marginBottom: "16px"}}
          onClick={handleWeatherVisibilityChange}
          />     
      </div>

        {/* Youtube Video on Startup On or Off */}

      <div style={{display: "flex", alignItems: "center"}}>
        <p style={{color: "white", textAlign: "left", marginLeft: "10px"}}>Youtube plays on start?</p> 
        <Checkbox 
          defaultChecked={videoVisibility}
          style={{color: lightGreen[300], marginLeft: "auto", marginBottom: "16px"}}
          onClick={handleVideoVisibility}
        />
      </div>

      {/* Change background */}

      <Form.Group style={{width: "90%", marginLeft: "5%"}} controlId="formFile" className="mb-3" data-bs-theme="dark">
        <Form.Label style={{color: "white"}}>Upload a custom background</Form.Label>
        <Form.Control type="file" accept="image/*" onChange={handleFileChange}/>
      </Form.Group>
      {selectedFile !== null && 
            <div style={{display: "flex", alignItems: "center"}}>
            <p style={{color: "white", textAlign: "left", marginLeft: "10px"}}>Set as default background?</p> 
            <Checkbox 
              style={{color: lightGreen[300], marginLeft: "auto", marginBottom: "16px"}}
              onClick={handleDefaultBackground}
            />
          </div>
      }
        <button style={{color: grey[50], background: "rgba(0, 0, 0, 0.3)", border: "none", borderRadius: "20px", padding: "10px", width: "90%"}} onClick={handleResetBackground}>
          Reset background
        </button>

      {/* Select secondary timezone */}

        <Select
            menuPlacement="auto"
            options={secondaryTimezoneOptions}
            value={secondaryTimezoneOptions.find((option) => option.value === secondaryTimezone)}
            onChange={(selectedOption) => {
              setSecondaryTimezone(selectedOption.value)
            }}
          />

          {/* Info */}
          
        <p className="mt-2" style={{textAlign: "left",  marginLeft:"5%", color: "#c8c8c8", background: "rgba(0, 0, 0, 0.3)", border: "none", borderRadius: "20px", padding: "10px", width: "90%", fontSize: "12px"}} onClick={handleResetBackground}>
          <p style={{fontSize: "12px", textAlign: "center", color: "white"}}>Developed by Ahmed Muharram & Youssef Saleh</p>
          <p>Ahmed Muharram: <a href="https://muharram.dev" target="_blank">Portfolio</a> | <a href="https://www.linkedin.com/in/ahmed-muharram/" target="_blank">LinkedIn</a> | <a href="https://github.com/ahmedOmuharram" target="_blank">GitHub</a> | <a href="mailto:ahmed.o.muharram@gmail.com" target="_blank">ahmed.o.muharram@gmail.com</a></p>
          <p>Youssef Saleh: <a href="https://github.com/youssefsaleh61" target="_blank">GitHub</a> | <a href="mailto:youssefsaleh690@gmail.com" target="_blank">youssefsaleh690@gmail.com</a></p>        </p>
     </div>
    </>
  );
}

export default Settings;
