import * as React from 'react';
import Slider from '@mui/material/Slider';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { VolumeDown } from '@mui/icons-material';
import ReactAudioPlayer from 'react-audio-player';
import { grey } from '@mui/material/colors';
import { useState } from 'react';

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

  const handleSliderChange = (event: Event, newValue: number) => {
    setValue(newValue);
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
        <ReactAudioPlayer autoPlay loop volume={value / 100}>
          <source src={file} type="audio/mp4" />
          <source src={file.replace('.mp4', '.ogg')} type="audio/ogg" />
        </ReactAudioPlayer>
      </>
    )
}

export default SoundMixer;
