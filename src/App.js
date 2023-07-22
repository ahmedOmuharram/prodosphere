import './App.css';
import { useState, useRef, createContext, useContext } from 'react';
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
          textAlign: 'right',
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

            { user !== "" && <CollapsingToDoList/> }
            <br />

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
