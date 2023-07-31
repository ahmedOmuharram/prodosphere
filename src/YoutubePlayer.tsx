import React from 'react';
import { useState, useContext } from "react";
import { menuContext } from "./App"
import YouTube from 'react-youtube';

type MenuContextType = {
  menuState: number;
  setMenuState: (newState: number) => void;
};

function YoutubePlayerComponent() {
  const { menuState } = useContext<MenuContextType>(menuContext);
  const [videoState, setVideoState] = useState("");

  const extractVideoId = (url) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : '';
  };

  const handleYoutubeInputChange = (event) => {
    const inputLink = event.target.value;
    const videoId = extractVideoId(inputLink);
    setVideoState(videoId);
  };

  return (
    <>
      {menuState === 3 && <p className="mt-2" style={{ fontSize: "18px", color: "white" }}>YouTube Player</p>}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: (menuState !== 3 ? "none" : "block") }}>
          <div style={{ marginLeft: "5%", width: "90%", borderRadius: "20px", overflow: "hidden", padding: 0, height: "169px" }}>
            <YouTube videoId={videoState !== "" ? videoState : "jfKfPfyJRdk"}
              opts={{
                height: '169',
                width: '100%',
                playerVars: {
                  autoplay: 1,
                }
              }} />
          </div>
          <input
            type="text"
            className="mt-5"
            placeholder="Enter a youtube link"
            onChange={handleYoutubeInputChange}
            style={{
              fontSize: "15px",
              marginLeft: "0%",
              width: "70%",
              backgroundColor: "rgba(0,0,0,0)",
              color: "white",
              outline: "none",
              border: "none",
              borderBottom: "2px solid rgba(255, 255, 255, 1)",
            }} />
        </div>
      </div>
    </>
  )
}

export default YoutubePlayerComponent;
