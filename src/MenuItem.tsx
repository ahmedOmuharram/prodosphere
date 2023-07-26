import { useContext } from "react";
import { menuContext, clickContext } from "./App"
import { motion } from "framer-motion";

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

const colors = ["#FFF", "#FFF", "#FFF", "#FFF", "#FFF", "#FFF", "#FFF"];

export const MenuItem = ({ i }) => {
  const style = { border: `2px solid ${colors[i]}` };
  const { menuState, setMenuState } = useContext(menuContext);
  const { clickState, setClickState } = useContext(clickContext);
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
        }}></div>
    </motion.li>
  );
};
