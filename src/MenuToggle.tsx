import * as React from "react";
import { useContext } from "react";
import { menuContext } from "./App"
import { motion } from "framer-motion";

type MenuContextType = {
  menuState: number; 
  setMenuState: (newState: number) => void; 
};

const Path = props => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 100%, 100%)"
    strokeLinecap="round"
    {...props}
  />
);

export const MenuToggle = ({ toggle }) => {
  const { setMenuState } = useContext<MenuContextType>(menuContext);

  return (
    <button className="dropdown" onClick={() => {
      // Switch animation variants of menu component between open and closed
        toggle();
        setMenuState(-1);
      }}>
      <svg width="23" height="23" viewBox="0 0 23 23">
        <Path
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" }
          }}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 }
          }}
          transition={{ duration: 0.1 }}
        />
        <Path
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" }
          }}
        />
      </svg>
    </button>
  );
};
