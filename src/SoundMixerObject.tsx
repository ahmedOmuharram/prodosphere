import React, { useState, useRef, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { VolumeDown } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

const SliderObject = styled(Slider)({
  color: '#fff',
  height: 5,
  "& .MuiSlider-track": {
    border: 'none',
  },
  "& .MuiSlider-thumb": {
    height: 15,
    width: 15,
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
})

function SoundMixer ({ text, file }) {
  const [value, setValue] = useState(0)
  const audioRef = useRef(null);

  const handleSliderChange = (event, newValue) => {
    if (value === 0) {
      audioRef.current.currentTime = 0;
    }
    setValue(newValue);
    if (audioRef.current) {
      audioRef.current.volume = newValue / 100;
    }
  };
  
  useEffect(() => {
    audioRef.current.volume = 0;
  }, [audioRef]);

  useEffect(() => {
    let intervalId;
  
    const checkDurationAndSetInterval = () => {
      console.log(audioRef)
      if (audioRef && audioRef.current) {
        intervalId = setInterval(() => {
          console.log(audioRef.current.duration - audioRef.current.currentTime);
          if (audioRef.current.duration - audioRef.current.currentTime <= 5) {
            console.log("working");
            audioRef.current.currentTime = 5;
          }
        }, 1000);
      }
    };
  
    checkDurationAndSetInterval();
  
    // Cleanup function to clear the interval when the component unmounts or when the audioRef changes.
    return () => clearInterval(intervalId);
  
  }, [audioRef]);
  
  
  return (
    <>
      <div style={{display: "flex"}}>
        <p style={{color: '#ffffff', fontSize: "15px", marginTop: "3px", marginLeft: "5%", padding: 0}}>  
          {text}
        </p>
        <div style={{display: "flex", width: "60%", marginLeft: "auto", marginRight: "5%"}}>
          <Box sx={{ width: "95%", ml: "auto" }}>
            <Stack spacing={2} direction="row" alignItems="center">
              <VolumeDown sx={{ color: grey[50] }}/>
                <SliderObject
                    style={{width: "60%"}}
                    defaultValue={0}
                    onChange={handleSliderChange}
                  />
              <VolumeUp sx={{ color: grey[50] }}/>
            </Stack>
          </Box>
        </div>
      </div>
      <>
        <audio ref={audioRef} autoPlay loop>
          <source src={file} type="audio/mp4" />
          <source src={file.replace('.mp4', '.ogg')} type="audio/ogg" />
        </audio>
      </>
    </>
  )
}

export default SoundMixer;
