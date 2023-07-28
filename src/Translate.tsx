import React from 'react';
import { useState, useEffect } from 'react';
import TranslateIcon from '@mui/icons-material/Translate';
import { IconButton } from "@mui/material";
import axios from 'axios';

function Translate() {
  const [languagesList, setLanguagesList] = useState([])
  const [translateState, setTranslateState] = useState("");
  const [selectedLanguageFromKey, setLanguageFromKey] = useState("")
  const [selectedLanguageKey, setLanguageKey] = useState("")
  const [resultText, setResultText] = useState("");

  useEffect(() => {
    axios.get(`https://libretranslate.de/languages`)
      .then((response) => {
        setLanguagesList(response.data)
      })
  }, [])

  /*const getLanguageSource = () => {
    axios.post(`https://libretranslate.de/detect`, {
      q: translateState
    })
    .then((response) => {
      setLanguageFromKey(response.data[0].language)
    })
  }*/

  const languageFromKey = (selectedLanguage) => {
    setLanguageFromKey(selectedLanguage.target.value);
  }
  const languageKey = (selectedLanguage) => {
    setLanguageKey(selectedLanguage.target.value)
  }

  const translateText = () => {
    let data = {
      q: translateState,
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
      <p className="mt-5" style={{ fontSize: "30px", color: "white" }}>Translate</p>
      <div style={{ display: "flex", marginBottom: "30px" }}>
        <select className="form-select" style={{ marginLeft: "5%", width: "40%", marginRight: "10%" }} onChange={languageFromKey}>
          <option value={""}>From</option>
          {languagesList.map((language) => {
            return (
              <option value={language.code}>
                {language.name}
              </option>
            )
          })}
        </select>
        <select className="form-select" style={{ width: "45%", marginRight: "5%" }} onChange={languageKey}>
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
          marginLeft: "0%",
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
            background: "none",
            border: "none",
            width: "30px",
            marginLeft: "5%",
            height: "30px"
          }}
          color="info"
          onClick={translateText}
        >
          <TranslateIcon /></IconButton>}
      {(selectedLanguageFromKey === "" || selectedLanguageKey === "" || translateState === "") &&
        <IconButton
          disabled
          size="large"
          style={{
            background: "none",
            border: "none",
            width: "30px",
            marginLeft: "5%",
            height: "30px"
          }}
          color="info"
          onClick={translateText}
        >
          <TranslateIcon /></IconButton>}
      <br /><br /><br />
      <p style={{ fontSize: "20px", color: "white", borderTop: "1px solid rgba(255, 255, 255, 0.3)", paddingTop: "20px" }}>Output</p>
      <div className="translated-text" style={{ overflowY: "auto", maxHeight: "170px" }}>
        <span style={{ color: "white", wordWrap: "break-word" }}>{resultText}</span>
      </div>
    </>
  )
}

export default Translate;
