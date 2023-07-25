import { useState, useContext, createContext } from "react";
import { animateValue, motion } from "framer-motion";
import { menuContext, clickContext } from "./App"
import { MenuItem } from "./MenuItem.tsx";

const variants = {
  open: {
    transition: { staggerChildren: -0.07, delayChildren: 0.5 }
  },
  closed: {
    transition: { staggerChildren: -0.07, delayChildren: 0.5, staggerDirection: -1 }
  }
};

const menuVariants = {
  open: {
    width: "500px",
    opacity: 1,
    transition: {
      width: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    width: "0px",
    opacity: 0,
    transition: {
      width: { stiffness: 1000 }
    }
  }
};
const menuClickedVariants = {
  open: {
    width: "0px",
    opacity: 0,
    transition: {
      width: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    width: "0px",
    opacity: 0,
    transition: {
      width: { stiffness: 1000, velocity: -100 }
    }
  }
};


export const Navigation = () => {
  const { menuState, setMenuState } = useContext(menuContext);
  const { clickState, setClickState } = useContext(clickContext);
  return (
  <>
  <motion.ul variants={variants}>
    {itemIds.map(i => (
      <MenuItem i={i} key={i} />
    ))}
  </motion.ul>
  <motion.div id="killme" key={clickState} 
  onAnimationComplete={() => {
    if (clickState) {
      setClickState(false);
    }
    }} variants={!clickState ? menuVariants : menuClickedVariants} initial={!clickState ? {width: "0px", opacity: "0"} : {width: "500px", opacity: "1"}} style={{position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.4)", top: "calc(100% - 500px)", left: "80px", width: "500px", height: "500px"}}>
    {menuState === 0 && <p style={{color :"white"}}>0 GONNA</p>}
    {menuState === 1 && <p style={{color :"white"}}>1 GIVE</p>}
    {menuState === 2 && <p style={{color :"white"}}>2 YOU</p>}
    {menuState === 3 && <p style={{color :"white"}}>3 UP</p>}
    {menuState === 4 && <p style={{color :"white"}}>4 GONNA</p>}
    {menuState === 5 && <p style={{color :"white"}}>5 SAY</p>}
    {menuState === 6 && <p style={{color :"white"}}>6 GOODBYE</p>}
  </motion.div>
  </>
  )
};

const itemIds = [0, 1, 2, 3, 4, 5, 6];
