import React, { useState } from 'react';
import SoundMixerObject from './SoundMixerObject';
import { motion } from 'framer-motion';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { grey } from '@mui/material/colors';
import './App.css';

function SoundMixer () {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
    return (
      <>
        <button onClick={toggleCollapse} style={{ background: "none", border: "none" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: isCollapsed ? "absolute" : "relative", bottom: isCollapsed ? "10px" : "0", width: "100%", right: "0px"}}>
            <p className="mt-2" style={{ fontSize: "18px", color: "white" }}>Ambient Sounds</p>
            {isCollapsed ? <KeyboardArrowUpIcon sx={{ color: grey[50], marginBottom: "6px" }} /> : <KeyboardArrowDownIcon sx={{ color: grey[50], marginBottom: "6px" }} />}
          </div>
        </button>
        <motion.div
          initial={{ opacity: isCollapsed ? 0 : 1, display: isCollapsed ? "none" : "block" }}
          animate={{ opacity: isCollapsed ? 0 : 1, display: isCollapsed ? "none" : "block" }}
        >
          <SoundMixerObject text="Rain" file="https://st2.asoftmurmur.com/assets/p/content/rain/main-rain.mp4"/>
          <SoundMixerObject text="Thunder" file="https://st2.asoftmurmur.com/assets/p/content/thunder/main-thunder.mp4"/>
          <SoundMixerObject text="Waves" file="https://st3.asoftmurmur.com/assets/p/content/waves/main-waves.mp4"/>
          <SoundMixerObject text="Wind" file="https://st2.asoftmurmur.com/assets/p/content/wind/main-wind.mp4"/>
          <SoundMixerObject text="Fire" file="https://st2.asoftmurmur.com/assets/p/content/fire/main-fire.mp4"/>
          <SoundMixerObject text="Birds" file="https://st3.asoftmurmur.com/assets/p/content/birds/main-birds.mp4"/>
          <SoundMixerObject text="Crickets" file="https://st3.asoftmurmur.com/assets/p/content/crickets/main-crickets.mp4"/>
          <SoundMixerObject text="Coffee shop" file="https://st3.asoftmurmur.com/assets/p/content/people/main-people.mp4"/>
          <SoundMixerObject text="Singing bowl" file="https://st1.asoftmurmur.com/assets/p/content/sbowl/main-sbowl.mp4"/>
          <SoundMixerObject text="White noise" file="https://st3.asoftmurmur.com/assets/p/content/whitenoise/main-whitenoise.mp4"/>
          <div className="mt-3"/>
          <p style={{color: "white", fontSize: "10px"}}>Sounds from <a style={{color: "white", textDecoration: "none"}}href="https://asoftmurmur.com" target="_blank">asoftmurmur.com</a></p>
        </motion.div>
      </>
    )
}

export default SoundMixer;
