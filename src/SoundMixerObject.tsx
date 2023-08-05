import React, { useState, useRef } from 'react';
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
    setValue(newValue);
    if (audioRef.current) {
      audioRef.current.volume = newValue / 100;
    }
  };
  
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
      {value !== 0 && 
      <>
        <audio ref={audioRef} autoPlay loop preload="none">
          <source src={file} type="audio/mp4" />
          <source src={file.replace('.mp4', '.ogg')} type="audio/ogg" />
        </audio>
        <audio ref={audioRef} autoPlay loop preload="auto">
          <source src={file.replace('main', 'glue')} type="audio/mp4" />
          <source src={file.replace('main', 'glue').replace('.mp4', '.ogg')} type="audio/ogg" />
        </audio>
      </>}
    </>
  )
}

export default SoundMixer;
