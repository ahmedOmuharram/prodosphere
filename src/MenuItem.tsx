import { useContext } from "react";
import React from "react";
import { menuContext, clickContext } from "./App"
import { motion } from "framer-motion";
import TranslateIcon from '@mui/icons-material/Translate';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerIcon from '@mui/icons-material/Timer';
import BookIcon from '@mui/icons-material/Book';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

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
    y: 50,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    },
    display: "block"
  },
  closed: {
    y: 100,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    },
    transitionEnd: {
      display: "none"
    }
  }
};

export const MenuItem = ({ i }) => {
  const style = { border: `2px solid #FFF` };
  const { menuState, setMenuState } = useContext<MenuContextType>(menuContext);
  const { setClickState } = useContext<ClickStateType>(clickContext);
  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="icon-placeholder" style={style} onClick={() => {
        if (menuState!==i) {
          setTimeout(() => setMenuState(i), 200)
          setClickState(true);
        } else {
          setTimeout(() => setMenuState(-1))
        }
        }}> 
        {i === 0 && <AccessTimeIcon style={{position: "relative", height: "20px", width: "20px", top: "4px"}}/>}
        {i === 1 && <CurrencyExchangeIcon style={{position: "relative", height: "20px", width: "20px", top: "4px"}}/>}
        {i === 2 && <TimerIcon style={{position: "relative", height: "20px", width: "20px", top: "4px"}}/>}
        {i === 3 && <YouTubeIcon style={{position: "relative", height: "20px", width: "20px", top: "4px"}}/>}
        {i === 4 && <TranslateIcon style={{position: "relative", height: "20px", width: "20px", top: "4px"}}/>}
        {i === 5 && <CalendarMonthIcon style={{position: "relative", height: "20px", width: "20px", top: "4px"}}/>}
        {i === 6 && <BookIcon style={{position: "relative", height: "20px", width: "20px", top: "4px"}}/>}
        {i === 7 && <SettingsIcon style={{position: "relative", height: "20px", width: "20px", top: "4px"}}/>}
      </div>
    </motion.li>
  );
};
