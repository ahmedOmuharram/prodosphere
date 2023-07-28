import './Navigation.css';
import { useState, useContext } from "react";
import React from "react";
import TimezoneConverter from './TimezoneConverter.tsx';
import { motion } from "framer-motion";
import { menuContext, clickContext } from "./App"
import { MenuItem } from "./MenuItem.tsx";
import CurrencyConverter from './CurrencyConverter.tsx';
import SoundMixer from './SoundMixer.tsx';
import Notes from './Notes.tsx';
import Translate from './Translate.tsx';
import Settings from './Settings.tsx';
import YoutubePlayerComponent from './YoutubePlayer.tsx';

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
    transformOrigin: "left center",
    transform: "rotate3D(0, 0, 0, 90deg)",
    opacity: 1,
    transition: {
      transform: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    transformOrigin: "left center",
    transform: "rotate3D(0, 1, 0, 90deg)",
    opacity: 0,
    transition: {
      transform: { stiffness: 1000 }
    }
  }
};
const menuClickedVariants = {
  open: {
    transformOrigin: "left center",
    transform: "rotate3D(0, 1, 0, 90deg)",
    opacity: 0,
    transition: {
      transform: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    transformOrigin: "left center",
    transform: "rotate3D(0, 1, 0, 90deg)",
    opacity: 0,
    transition: {
      transform: { stiffness: 1000, velocity: -100 }
    }
  }
};

export const Navigation = () => {
  const { menuState } = useContext<MenuContextType>(menuContext);
  const { clickState, setClickState } = useContext<ClickStateType>(clickContext);
  const [loadVideo, setLoadVideo] = useState(false);

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
        initial={!clickState || menuState === -1 ? { transform: "rotate3D(0, 1, 0, 90deg)", opacity: "0" } : { transform: "rotate3D(0, 0, 0, 90deg)", opacity: "1" }}
        animate={menuState !== -1 ? "open" : "closed"}
        style={{
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          top: "calc(100% - 500px)", 
          transform: "rotate3D(0, 0, 0, 90deg)",
          left: "80px",
          width: "300px",
          borderTopRightRadius: "20px",
          height: "500px"
        }}
      >
        {menuState === 0 && <TimezoneConverter/>}
        {menuState === 1 && <CurrencyConverter/> }
        {menuState === 2 && <SoundMixer/> }
        {menuState === 3 && loadVideo === false ? <>{setLoadVideo(true)}</> : <></>}
        {loadVideo && <YoutubePlayerComponent/>}
        {menuState === 4 && <Translate/> }
        {menuState === 5 && <Notes/> }
        {menuState === 6 && <Settings/>}
      </motion.div>
    </>
  )
};

const itemIds = [0, 1, 2, 3, 4, 5, 6];
