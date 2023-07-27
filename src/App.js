import './App.css';
import fallbackBackground from './background.jpeg'
import { useState, useRef, createContext, useContext } from 'react';
import { createApi } from 'unsplash-js';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { motion, useCycle } from "framer-motion";
import { useDimensions } from "./use-dimensions.ts";
import { MenuToggle } from "./MenuToggle.tsx";
import { Navigation } from "./Navigation.tsx";
import Geolocation from "react-geolocation";
import WeatherComponent from "./Weather";
import ToDoComponent from "./ToDoComponent"
import LinkGroupComponent from './LinkGroup';
import Moment from 'react-moment';
import { useTimer } from 'react-timer-hook';

const unsplash = createApi({
  accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY
})

const getLastBackgroundTimestamp = () => {
  const lastBackgroundTimestamp = localStorage.getItem("lastBackgroundTimestamp");
  return lastBackgroundTimestamp ? parseInt(lastBackgroundTimestamp) : 0;
};

const setLastBackgroundTimestamp = () => {
  const currentTimestamp = Date.now();
  localStorage.setItem("lastBackgroundTimestamp", currentTimestamp.toString());
};

const getLastBackgroundURL = () => {
  return localStorage.getItem("lastBackgroundURL") || fallbackBackground;
};

const setLastBackgroundURL = (url) => {
  localStorage.setItem("lastBackgroundURL", url);
};

const oneHourInMilliseconds = 60 * 60 * 1000;

const shouldFetchBackground = () => {
  const lastBackgroundTimestamp = getLastBackgroundTimestamp();
  getLastBackgroundURL();
  const currentTimestamp = Date.now();
  return currentTimestamp - lastBackgroundTimestamp > oneHourInMilliseconds;
};

const hours = new Date().getHours()
const queryInput = hours <= 6 || hours >= 19 ? "night forest" : "flowers morning"

if (shouldFetchBackground()) {
  unsplash.photos.getRandom({ query: queryInput, orientation: "landscape" })
    .then(result => {
      if (result.errors) {
        const background = getLastBackgroundURL();
        document.body.style.backgroundImage = `url(${background})`;
        document.body.style.backgroundRepeat = `no-repeat`;
        document.body.style.backgroundSize = `cover`;
      } else {
        const photo = result.response;
        document.body.style.backgroundImage = `url('${photo.urls.raw}')`;
        document.body.style.backgroundRepeat = `no-repeat`;
        document.body.style.backgroundSize = `cover`;
        setLastBackgroundURL(photo.urls.raw);
        setLastBackgroundTimestamp();
      }
    })
    .catch(error => {
      const background = getLastBackgroundURL();
      document.body.style.backgroundImage = `url(${background})`;
      document.body.style.backgroundRepeat = `no-repeat`;
      document.body.style.backgroundSize = `cover`;
    });
} else {
  const background = getLastBackgroundURL();
  document.body.style.backgroundImage = `url(${background})`;
  document.body.style.backgroundRepeat = `no-repeat`;
  document.body.style.backgroundSize = `cover`;
}

const CollapsingToDoList = () => {
  const [isCollapsed, setCollapsed] = useState(false);

  const handleCollapseToggle = () => {
    setCollapsed(!isCollapsed);
  };

  return (
    <div>
      <motion.div
        initial={{ position: "absolute", right: 0, bottom: 0, height: "fit-content", width: "fit-content", zIndex: "999"}}
        animate={{
          bottom: isCollapsed ? '5px' : `480px`,
        }}
        transition={{ duration: 0.5 }}
      >
       <button onClick={handleCollapseToggle} 
        style={{
          background: "none",
          border: "none",
          color: "white",
          textAlign: "center",
          fontSize: "20px",
          textShadow: "0px 1px 5px rgba(0, 0, 0, 0.8)",
        }}>
            { isCollapsed ? "Open to-do list" : "Close to-do list" } &nbsp;
            <svg
            style={{ color: 'white' }}
            width="24"
            height="24"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.0207 5.82839L15.8491 2.99996L20.7988 7.94971L17.9704 10.7781M13.0207 5.82839L3.41405 15.435C3.22652 15.6225 3.12116 15.8769 3.12116 16.1421V20.6776H7.65669C7.92191 20.6776 8.17626 20.5723 8.3638 20.3847L17.9704 10.7781M13.0207 5.82839L17.9704 10.7781"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="white"
            ></path>
          </svg> 
        </button>
      </motion.div>
      <div
        style={{
          position: 'absolute',
          bottom: '0px',
          right: '0px',
          textAlign: 'left',
          fontSize: '20px',
          marginBottom: '-30px',
          width: 'calc(100px + 15vmax)',
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderTopLeftRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ height: '500px', backgroundColor: "rgba(0, 0, 0, 0)" }}
          animate={{
            height: isCollapsed ? '75px' : '500px',
            opacity: isCollapsed ? 0 : 1,
            backgroundColor: isCollapsed ? "rgba(0, 0, 0, 0)" : "rgba(0, 0, 0, 0.3)",
          }}
          transition={{ duration: 0.5 }}
        >
          <div style={{position:"relative", top: 0, width: "calc(100px + 15vmax)", backgroundColor: "black", height: "0px", boxShadow: "0 3px 20px 10px rgba(0,0,0,0.6)", zIndex: 99}}></div>
          <ToDoComponent/>
        </motion.div>
      </div>
    </div>
  );
};

const sidebar = {
  open: (height = 135) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px calc(100% - 40px))`,
    transition: {
      type: "spring",
      stiffness: 30,
      restDelta: 3
    }
  }),
  closed: {
    clipPath: "circle(30px at 40px calc(100% - 40px))",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
};

function WeatherStatus() {
  const { weatherState } = useContext(weatherContext);

  return (
    <>
     {weatherState !== null && weatherState.weather && weatherState.weather.length > 0 ?     
      <img
        src={`https://openweathermap.org/img/wn/${weatherState.weather[0].icon}@2x.png`}
        style={{ width: "125px", height: "125px", marginRight: "-10px", marginBottom: "5px", paddingRight: "0px", marginLeft: "-40px" }}
        alt={weatherState.weather[0].main}
      /> : <></>
     }
    </>
  )
}

function GetLocation() {
  return (
    <Geolocation
      once={true} 
      render={({ position: { coords: { latitude, longitude } = {} } = {} }) => (
        latitude !== undefined && longitude !== undefined ? (
          <WeatherComponent lat={latitude} lon={parseFloat(longitude)} />
        ) : (
          <div style={{ fontSize: "18px", opacity: 0.3}}>Allow location access to display weather information</div>
        )
      )}
    />
  );
}


function UserForm({ setUser }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userInput = formData.get('userInput');
    setUser(userInput);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Control 
          size="lg" 
          type="text" 
          placeholder="Username" 
          name="userInput" 
        />
      </Form.Group>
      <Button className="btn btn-success" type="submit">Submit</Button>
    </Form>
  );
}

function TimerComponent({ expiryTimestamp }) {
  const {
    seconds,
    minutes,
    isRunning,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

  return (
    <>
      <div>
      <svg className="mb-1" fill="#ffffff" height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 455 455" xmlSpace="preserve" stroke="#ffffff">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M332.229,90.04l14.238-27.159l-26.57-13.93L305.67,76.087c-19.618-8.465-40.875-13.849-63.17-15.523V30h48.269V0H164.231v30 H212.5v30.563c-22.295,1.674-43.553,7.059-63.171,15.523L135.103,48.95l-26.57,13.93l14.239,27.16 C67.055,124.958,30,186.897,30,257.5C30,366.576,118.424,455,227.5,455S425,366.576,425,257.5 C425,186.896,387.944,124.958,332.229,90.04z M355,272.5H212.5V130h30v112.5H355V272.5z"></path>
        </g>
      </svg>&nbsp;&nbsp;
        <Moment format='mm:ss'>{new Date().setMinutes(minutes, seconds)}</Moment>
        <button style={{
          background: "none",
          color: "green",
          border: "none",
          position: "relative",
          top: "-15px",
          left: "-5px"
        }} 
        onClick={() => {
          const time = new Date();
          time.setMinutes(time.getMinutes() + minutes + 1, time.getSeconds() + seconds);
          restart(time);
          if (!isRunning) {
            pause();
          }
        }}>+</button>
                <button style={{
          background: "none",
          color: "red",
          border: "none",
          position: "relative",
          bottom: "-15px",
          height: "fit-content",
          left: "-28px",
          padding: 0
        }} 
        onClick={() => {
          const time = new Date();
          time.setMinutes(time.getMinutes() + minutes - 1, time.getSeconds() + seconds);
          restart(time);
          if (!isRunning) {
            pause();
          }
        }}>-</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {isRunning ? <button style={{
          background: "none",
          color: "white",
          border: "none",
        }}  
        onClick={pause}>Pause</button> 
        : <button style={{
          background: "none",
          color: "white",
          border: "none"
        }}  
        onClick={resume}>Resume</button>}
      </div>
    </>
  );
}


function TodayDate() {
  return (
    <>
    <Moment format="DD MMM, YYYY" interval={1000} />
    </>
  );
}

function TimeNow() {
  return (
    <>
      <Moment format="h:mm A" interval={1000} />
    </>
  )
}

function App() {
  const state = localStorage.getItem("name") ? localStorage.getItem("name") : "";
  const [user, setUser] = useState(state);
  localStorage.setItem("name", user);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  const [weatherState, setWeatherState] = useState(null);
  const weatherValue = { weatherState, setWeatherState };

  const [menuState, setMenuState] = useState(-1);
  const menuValue = { menuState, setMenuState };

  const [clickState, setClickState] = useState(false);
  const clickValue = { clickState, setClickState };

  return (
    <clickContext.Provider value={clickValue}>
    <menuContext.Provider value={menuValue}>
    <weatherContext.Provider value={weatherValue}>
    <div className="App">
        <header className="App-header">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >

            {/* Time */}
            {user !== "" && 
            <div style={{ display: "flex", justifyContent: "center" }}>
              <p style={{ textShadow: "0px 1px 5px rgba(0, 0, 0, 0.5)", fontSize: "calc(40px + 3vmin)", marginBottom: "0", marginTop: "0", padding: "0 40px 0 40px", borderBottom: "1px solid white", boxShadow: "0 4px 2px -2px grey", width: "500px"}}>
                { weatherState !== null && <WeatherStatus/> }
                { user !== "" && <TimeNow setUser={setUser}/> }
              </p>
            </div>}

            {/* Greeting */}
            <p style={{fontSize: "calc(20px + 1vmin)", textShadow: "0px 1px 5px rgba(0, 0, 0, 0.9)", marginTop: "0", paddingTop: "0"}}>
              {user === "" ? "Please enter your name" : 
                (weatherState !== null && weatherState.weather && weatherState.weather.length > 0 ? 
                (new Date().getHours() >= 12 && `${weatherState.weather[0].icon.charAt(2)}` !== "n" ? `Good afternoon, ${user}!` :
                (`${weatherState.weather[0].icon.charAt(2)}` === "n" ? `Good evening, ${user}!` : 
                (`${weatherState.weather[0].icon.charAt(2)}` === "d" ? `Good morning, ${user}!` : `Hello, ${user}!`))) : `Hello, ${user}!`)}
            </p>

            {/* Top right date and weather info */}
            <div style={{position: "absolute", textShadow: "0px 1px 5px rgba(0, 0, 0, 0.5)", top: "0px", right: "10px", textAlign: "right", fontSize: "30px", marginBottom: "-30px"}}>
              { user !== "" && <TodayDate setUser={setUser}/> }
              { user !== "" && <GetLocation /> }
            </div>
            { user !== "" && <CollapsingToDoList/> }
            <br />

            {user !== "" && <form action="https://www.google.com/search" method="get" name="searchform" target="_blank">
            <div style={{display: "flex", justifyContent: "center"}}>
              <div className="input-group mb-3" style={{position: "relative", right: "-20px", width:"500px"}}>
                <input name="sitesearch" type="hidden"/>
                <input style={{borderRadius: "25px"}} autoComplete="on" className="form-control" name="q" placeholder="Google search..." required="required"  type="text" />
                <div className="input-group-append" style={{position: "relative", left: "-45px", marginBottom: "8px"}}>
                  <button className="btn btn-light" type="submit" style={{border: "none", background: "none", zIndex: "99"}}>
                  <svg fill="#000000" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 451 451" xmlSpace="preserve">
                    <g>
                      <path d="M447.05,428l-109.6-109.6c29.4-33.8,47.2-77.9,47.2-126.1C384.65,86.2,298.35,0,192.35,0C86.25,0,0.05,86.3,0.05,192.3
                        s86.3,192.3,192.3,192.3c48.2,0,92.3-17.8,126.1-47.2L428.05,447c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4
                        C452.25,441.8,452.25,433.2,447.05,428z M26.95,192.3c0-91.2,74.2-165.3,165.3-165.3c91.2,0,165.3,74.2,165.3,165.3
                        s-74.1,165.4-165.3,165.4C101.15,357.7,26.95,283.5,26.95,192.3z"/>
                    </g>
                  </svg>
                  </button>
                </div>
              </div>
            </div>
            </form> }


            { user !== "" && <LinkGroupComponent /> }

            {/* First time form */}
            { user === "" && <UserForm setUser={setUser}/> } 
          </motion.div>
          <div style={{
              position: "absolute",
              bottom: "0px",
              padding: "5px 20px 0 10px",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px"
            }}>
                { user !== "" && <TimerComponent expiryTimestamp={new Date()} /> }
          </div>
        </header>
      
         <motion.nav
          initial={false}
          animate={isOpen ? "open" : "closed"}
          custom={height}
          ref={containerRef}
        >
          {user !== "" && <motion.div className="background" variants={sidebar} />}
          {user !== "" && <Navigation />}
          {user !== "" && <MenuToggle toggle={() => toggleOpen()} />}
        </motion.nav> 
        
    </div>
    </weatherContext.Provider>
    </menuContext.Provider>
    </clickContext.Provider>
  );
}

export const weatherContext = createContext();
export const menuContext = createContext();
export const clickContext = createContext();

export default App;
