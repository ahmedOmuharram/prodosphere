import './App.css';
import { useState, useRef, createContext, useContext, useEffect } from 'react';
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

//useEffect(() => {
//}, [])

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
            stroke-width="1.5"
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
  const { weatherState, setWeatherState } = useContext(weatherContext);

  return (
    <img
      src={`https://openweathermap.org/img/wn/${weatherState.weather[0].icon}@2x.png`}
      style={{ width: "125px", height: "125px", marginRight: "-10px", marginBottom: "5px", paddingRight: "0px" }}
      alt={weatherState.weather[0].main}
    />
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
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });


  return (
    <div style={{textAlign: 'center'}}>
      <h1>react-timer-hook </h1>
      <p>Timer Demo</p>
      <div style={{fontSize: '100px'}}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>
      <button onClick={() => {
        // Restarts to 5 minutes timer
        const time = new Date();
        time.setSeconds(time.getSeconds() + 301968);
        restart(time)
      }}>Restart</button>
    </div>
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

  return (
    <weatherContext.Provider value={weatherValue}>
    <div className="App">
        <header className="App-header">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >

            {/* Time */}
            {user !== "" && <p style={{ textShadow: "0px 1px 5px rgba(0, 0, 0, 0.5)", fontSize: "calc(80px + 3vmin)", marginBottom: "0", padding: "0 40px 0 40px", borderBottom: "1px solid white", boxShadow: "0 4px 2px -2px grey",}}>
              {weatherState !== null && <WeatherStatus />}
              { user !== "" && <TimeNow setUser={setUser}/> }
            </p>}

            {/* Greeting */}
            <p style={{fontSize: "calc(30px + 1vmin)", textShadow: "0px 1px 5px rgba(0, 0, 0, 0.9)", marginTop: "0", paddingTop: "0"}}>
              {user === "" ? "Please enter your name" : 
                (weatherState !== null && `${weatherState.weather[0].icon.charAt(2)}` === "n" ? `Good evening, ${user}!` : 
                (weatherState !== null && `${weatherState.weather[0].icon.charAt(2)}` === "d" ? `Good morning, ${user}!` : `Hello, ${user}!`))}
            </p>

            {/* Top right date and weather info */}
            <p style={{position: "absolute", textShadow: "0px 1px 5px rgba(0, 0, 0, 0.5)", top: "0px", right: "10px", textAlign: "right", fontSize: "40px", marginBottom: "-30px"}}>
              { user !== "" && <TodayDate setUser={setUser}/> }
              { user !== "" && <GetLocation /> }
            </p>
            <div>
              <TimerComponent expiryTimestamp={new Date()} />
            </div>
            { user !== "" && <CollapsingToDoList/> }
            <br />

            <form action="https://www.google.com/search" method="get" name="searchform" target="_blank">
            <div class="input-group mb-3" style={{position: "relative", right: "-20px"}}>
              <input name="sitesearch" type="hidden"/>
              <input style={{borderRadius: "25px"}} autocomplete="on" className="form-control" name="q" placeholder="Google search..." required="required"  type="text" />
              <div class="input-group-append" style={{position: "relative", left: "-45px", marginBottom: "8px"}}>
                <button class="btn btn-light" type="submit" style={{border: "none", background: "none", zIndex: "99"}}>
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
            </form>


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
          {user !== "" && <Navigation />}
          {user !== "" && <MenuToggle toggle={() => toggleOpen()} />}
        </motion.nav> 
    </div>
    </weatherContext.Provider>
  );
}

export const weatherContext = createContext();

export default App;
