import './App.css';
import fallbackBackground from './background.jpeg'
import { useState, useRef, createContext, useContext, useEffect } from 'react';
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
import CalendarComponent from './Calendar';
import { YouTube } from '@mui/icons-material';
import YoutubePlayerComponent from './YoutubePlayer';

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
        document.body.style.backgroundImage = `url('${photo.urls.full}')`;
        document.body.style.backgroundRepeat = `no-repeat`;
        document.body.style.backgroundSize = `cover`;
        setLastBackgroundURL(photo.urls.full);
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

const CollapsingToDoList = ({mapVisibility}) => {
  const [isCollapsed, setCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

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
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: "50px",
                  opacity: isHovered ? 1 : 0.3,
                  transition: "opacity 0.3s ease",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <iframe
                  title="World Map"
                  width="300px"
                  height="180px"
                  frameborder="0"
                  style={{ borderRadius: "30px 60px", display: `${mapVisibility || mapVisibility === "true" ? "block" : "none"}`}}
                  allowfullscreen="true"
                  allow="geolocation"
                  src="//umap.openstreetmap.fr/en/map/prodosphere_946169?scaleControl=false&miniMap=false&scrollWheelZoom=true&zoomControl=null&allowEdit=false&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=false&datalayersControl=false&onLoadPanel=undefined&captionBar=false&captionMenus=true"
                ></iframe>
              </div>
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
          width: 'calc(100px + 15vmax)',
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderTopLeftRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ height: '45px', backgroundColor: "rgba(0, 0, 0, 0)" }}
          animate={{
            height: isCollapsed ? '45px' : '480px',
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
    clipPath: `circle(${height * 2 + 250}px at 40px calc(100% - 40px))`,
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

function GetLocation({ weatherVisibility }) {
  return (
    <>
      { weatherVisibility || weatherVisibility === "true" ? 
      <Geolocation
        once={true} 
        render={({ position: { coords: { latitude, longitude } = {} } = {} }) => (
          latitude !== undefined && longitude !== undefined ? (
            <WeatherComponent lat={latitude} lon={parseFloat(longitude)} />
          ) : (
            <div style={{ fontSize: "18px", opacity: 0.3}}>Allow location access to display weather information</div>
          )
        )}
      /> : <></>}
    </>
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
  const [value, onChange] = useState(new Date());
  const [text, setText] = useState("");
  const [selectRangeState, setSelectRangeState] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [colorPicker, setColorPicker] = useState(0);
  const calendarContextValue = { value, onChange, text, setText , selectRangeState, setSelectRangeState, calendarEvents, setCalendarEvents, colorPicker, setColorPicker };

  const [documentTitle, setDocumentTitle] = useState("");
  const durations = [1500, 300, 1500, 300, 1500, 300, 1500, 900];
  const [durationIndex, setDurationIndex] = useState(0);

  const storedMapVisibility = localStorage.getItem('mapVisibility');
  const [mapVisibility, setMapVisibility] = useState(
    storedMapVisibility === null ? true : storedMapVisibility === "true"
  );

  const storedWeatherVisibility = localStorage.getItem('weatherVisibility');
  const [weatherVisibility, setWeatherVisibility] = useState(
    storedWeatherVisibility === null ? true : storedWeatherVisibility === "true"
  );

  const storedVideoVisibility = localStorage.getItem('videoVisibility');
  const [videoVisibility, setVideoVisibility] = useState(
    storedVideoVisibility === null ? false : storedVideoVisibility === "true"
  );

  const [loadVideo, setLoadVideo] = useState(false);

  const [defaultBackground, setDefaultBackground] = useState(() => {
    const storedBackground = localStorage.getItem('defaultBackground');
    return storedBackground !== null ? storedBackground : null;
  });

  const [secondaryTimezone, setSecondaryTimezone] = useState(() => {
    const storedSecondaryTimezone = localStorage.getItem('secondaryTimezone');
    return storedSecondaryTimezone !== null ? storedSecondaryTimezone : "";
  });

  
  useEffect(() => {
    const titleUpdateHandler = () => {
      setDocumentTitle(document.title);
    };

    document.addEventListener("DOMSubtreeModified", titleUpdateHandler);

    return () => {
      document.removeEventListener("DOMSubtreeModified", titleUpdateHandler);
    };
  }, []);


  useEffect(() => {
    if (defaultBackground !== null && localStorage.getItem('defaultBackground') !== "null") {
      document.body.style.backgroundImage = `url(${defaultBackground})`;
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundSize = 'cover';
    } else {
      const background = getLastBackgroundURL();
      document.body.style.backgroundImage = `url(${background})`;
      document.body.style.backgroundRepeat = `no-repeat`;
      document.body.style.backgroundSize = `cover`;
    }
  }, [defaultBackground]); 


  return (
    <calendarContext.Provider value={calendarContextValue}>
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
            {user !== "" && (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    <p
      style={{
        textShadow: "0px 1px 5px rgba(0, 0, 0, 0.5)",
        fontSize: "calc(40px + 3vmin)",
        marginBottom: "0",
        marginTop: "0",
        padding: "0 40px 0 40px",
        borderBottom: "1px solid white",
        boxShadow: "0 4px 2px -2px grey",
        width: "700px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {weatherState !== null && (weatherVisibility || weatherVisibility === true) && <WeatherStatus />}
      {user !== "" && <TimeNow setUser={setUser} />}
      <p style={{ display: "inline", fontSize: "calc(20px + 1vmin)", marginTop: "calc(10px + 0.75vmin)", color: "#c8c8c8" }}>
        &nbsp;{user !== "" && secondaryTimezone !== "" && <>| <Moment tz={secondaryTimezone} interval={1000} format='h:mm A' /></>}
      </p>
    </p>
  </div>
)}

            <div style={{position: "absolute", top: "5px", left: "5px", zIndex: "901358"}}>
              { user !== "" && <CalendarComponent displayCalendarOnly={true}/> }
            </div>

            <p style={{fontSize: "calc(20px + 1vmin)", textShadow: "0px 1px 5px rgba(0, 0, 0, 0.9)", marginTop: "0", marginBottom: 0, paddingTop: "0"}}>
              {user === "" ? "Please enter your name" : 
                (weatherState !== null && (weatherVisibility || weatherVisibility === true) && weatherState.weather && weatherState.weather.length > 0 ? 
                (new Date().getHours() >= 12 && `${weatherState.weather[0].icon.charAt(2)}` !== "n" ? `Good afternoon, ${user}!` :
                (`${weatherState.weather[0].icon.charAt(2)}` === "n" ? `Good evening, ${user}!` : 
                (`${weatherState.weather[0].icon.charAt(2)}` === "d" ? `Good morning, ${user}!` : `Hello, ${user}!`))) : `Hello, ${user}!`)}
            </p>

            {/* Greeting */}
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "calc(12px + 1vmin)", textShadow: "0px 1px 5px rgba(0, 0, 0, 0.9)", marginTop: "0", marginBottom: 0, paddingTop: "0"}}>
              {user !== "" && document.title.length > 12 ? 
                (durations[durationIndex] === 1500 ? 
                  "(Pomodoro) " : 
                  (durations[durationIndex] === 300 ? 
                    "(Short Break) " : 
                    "(Long Break) "
                  )
                ) : ""}
              {user !== "" && document.title.length > 12 ? `${documentTitle.split('|')[0]}` : ""}
            </p>

            {/* Top right date and weather info */}
            <div style={{position: "absolute", textShadow: "0px 1px 5px rgba(0, 0, 0, 0.5)", top: "0px", right: "10px", textAlign: "right", fontSize: "30px", marginBottom: "-30px"}}>
              { user !== "" && <TodayDate setUser={setUser}/> }
              { user !== "" && <GetLocation weatherVisibility={weatherVisibility}/> }
            </div>

            { user !== "" && <CollapsingToDoList mapVisibility={mapVisibility}/> }
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
        </header>
      
         <motion.nav
          initial={false}
          animate={isOpen ? "open" : "closed"}
          custom={height}
          ref={containerRef}
        >
          {user !== "" && <motion.div className="background" variants={sidebar} />}
          {user !== "" && <Navigation durations={durations} durationIndex={durationIndex} setDurationIndex={setDurationIndex} setUser={setUser} mapVisibility={mapVisibility} setMapVisibility={setMapVisibility} weatherVisibility={weatherVisibility} setWeatherVisibility={setWeatherVisibility} videoVisibility={videoVisibility} setVideoVisibility={setVideoVisibility} loadVideo={loadVideo} setLoadVideo={setLoadVideo} defaultBackground={defaultBackground} setDefaultBackground={setDefaultBackground} secondaryTimezone={secondaryTimezone} setSecondaryTimezone={setSecondaryTimezone}/>}
          {user !== "" && <MenuToggle toggle={() => toggleOpen()} />}
        </motion.nav> 
    </div>
    </weatherContext.Provider>
    </menuContext.Provider>
    </clickContext.Provider>
    </calendarContext.Provider>
  );
}

export const weatherContext = createContext();
export const menuContext = createContext();
export const clickContext = createContext();
export const calendarContext = createContext();

export default App;
