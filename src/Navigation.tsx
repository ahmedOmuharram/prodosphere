import { useState, useContext, createContext, useEffect } from "react";
import { animateValue, motion } from "framer-motion";
import TranslateIcon from '@mui/icons-material/Translate';
import { IconButton } from "@mui/material";
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
        <p className="mt-5" style={{fontSize: "40px", color: "white"}}>Translate</p>
        <div style={{display: "flex", marginBottom: "60px"}}>
        <select className="form-select" style={{marginLeft: "5%", width: "40%", marginRight: "10%"}} onChange={languageFromKey}>
          <option value={""}>From</option>
          {languagesList.map((language) => {
            return (
              <option value={language.code}>
                {language.name}
              </option>
            )
          })}
        </select>
        <select className="form-select" style={{width: "45%", marginRight: "5%"}} onChange={languageKey}>
          <option value={""}>To</option>
          {languagesList.map((language) => {
            return (
              <option value={language.code}>
                {language.name}
              </option>
            )
          })}
        </select>
        </div>
        <input
          type="text"
          placeholder='Input text'
          style={{
            fontSize: "15px",
            marginLeft: "5%",
            width: "70%",
            backgroundColor: "rgba(0,0,0,0)",
            color: "white",
            outline: "none",
            border: "none",
            borderBottom: "2px solid rgba(255, 255, 255, 1)",
          }}
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
        {(selectedLanguageFromKey !== "" && selectedLanguageKey !== "" && translateState !== "") && 
        <IconButton
          size="large"
          style={{
            backgroundColor: "white",
            border: "none",
            width: "10%",
            marginLeft: "5%",
            height: "10%"
          }}
          color="info"
          onClick={translateText}
        >
          <TranslateIcon/></IconButton>}
        {(selectedLanguageFromKey === "" || selectedLanguageKey === "" || translateState === "") && 
        <IconButton
          disabled
          size="large"
          style={{
            backgroundColor: "white",
            border: "none",
            width: "10%",
            marginLeft: "5%",
            height: "10%"
          }}
          color="info"
          onClick={translateText}
        >
          <TranslateIcon/></IconButton>}
        <br/><br/><br/>
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
