import { useState, useContext, createContext, useEffect } from "react";
import { animateValue, motion } from "framer-motion";
import { menuContext, clickContext } from "./App"
import { MenuItem } from "./MenuItem.tsx";
import axios from 'axios';



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
  const [ languagesList, setLanguagesList ] = useState([])
  const [ translateState, setTranslateState ] = useState("");
  const [ selectedLanguageFromKey, setLanguageFromKey ] = useState("")
  const [ selectedLanguageKey, setLanguageKey ] = useState("")
  const [resultText, setResultText] = useState("");
  useEffect(() => {
    axios.get(`https://libretranslate.de/languages`)
    .then((response) => {
      setLanguagesList(response.data)
    })
  }, [])
  const getLanguageSource = () => {
    axios.post(`https://libretranslate.de/detect`, {
      q: translateState
    })
    .then((response) => {
      setLanguageFromKey(response.data[0].language)
    })
  }
  const languageFromKey =  (selectedLanguage) => {
    setLanguageFromKey(selectedLanguage.target.value);
  }
  const languageKey =  (selectedLanguage) => {
    setLanguageKey(selectedLanguage.target.value)
  } 
  const translateText = () => {
    let data = {
      q : translateState,
      source: selectedLanguageFromKey,
      target: selectedLanguageKey
    }
    axios.post(`https://libretranslate.de/translate`, data)
    .then((response) => {
      setResultText(response.data.translatedText)
    })
  } 
  return (
  <>
  <motion.ul variants={variants}>
    {itemIds.map(i => (
      <MenuItem i={i} key={i} />
    ))}
  </motion.ul>
  <motion.div
    key={clickState} 
    onAnimationComplete={() => {
      if (clickState) {
        setClickState(false);
      }
    }} 
    variants={!clickState && menuState !== -1 ? menuVariants : menuClickedVariants} 
    initial={!clickState || menuState === -1 ? {width: "0px", opacity: "0"} : {width: "500px", opacity: "1"}} 
    animate={menuState !== -1 ? "open" : "closed"} 
    style={{
      position: "absolute", 
      backgroundColor: "rgba(0, 0, 0, 0.4)", 
      top: "calc(100% - 500px)", left: "80px", 
      width: "500px", 
      height: "500px"
    }}
  >
    {menuState === 0 && <p style={{color :"white"}}>0</p>}
    {menuState === 1 && <p style={{color :"white"}}>1</p>}
    {menuState === 2 && <p style={{color :"white"}}>2</p>}
    {menuState === 3 && <p style={{color :"white"}}>3</p>}
    {menuState === 4 &&
    <>
    <select className="language-select" onChange={languageFromKey}>
      <option value={""}>Please select from language...</option>
      {languagesList.map((language) => {
        return (
          <option value={language.code}>
            {language.name}
          </option>
        )
      })}
    </select>
    <select className="language-select" onChange={languageKey}>
      <option value={""}>Please Select to Language...</option>
      {languagesList.map((language) => {
        return (
          <option value={language.code}>
            {language.name}
          </option>
        )
      })}
    </select>
    <input
      type="text"
      placeholder='Type Text to Translate..'
      onChange={(e) => {
        setTranslateState(e.target.value.replace("?", ""));
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          if (selectedLanguageFromKey !== "" && selectedLanguageKey !== "" && translateState !== "") {
            translateText();
          }
        }
      }}
    />
    {(selectedLanguageFromKey !== "" && selectedLanguageKey !== "" && translateState !== "") && <button
      color="orange"
      size="large"
      onClick={translateText}
    >
      Translate</button>}
    <span style={{color: "white"}}>{resultText}</span>
    </>
    }
    {menuState === 5 && <p style={{color :"white"}}>5</p>}
    {menuState === 6 && <p style={{color :"white"}}>6</p>}
    {menuState === 1}
  </motion.div>
  </>
  )
};

const itemIds = [0, 1, 2, 3, 4, 5, 6];
