import './App.css';
import { useState, useRef, createContext, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { motion, useCycle } from "framer-motion";
import { useDimensions } from "./use-dimensions.ts";
import { MenuToggle } from "./MenuToggle.tsx";
import { Navigation } from "./Navigation.tsx";
import Geolocation from "react-geolocation";
import WeatherComponent from "./Weather"
import Moment from 'react-moment';

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

function TestComponent() {
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

function Greeting() {
  return (
    <Geolocation
      once={true} 
      render={({ position: { coords: { latitude, longitude } = {} } = {} }) => (
        latitude !== undefined && longitude !== undefined ? (
          <WeatherComponent lat={latitude} lon={parseFloat(longitude)} />
        ) : (
          <div>Hello, </div>
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

            <p style={{ fontSize: "calc(80px + 3vmin)", marginBottom: "0", padding: "0 40px 0 40px", borderBottom: "1px solid white"}}>
              {weatherState !== null && <TestComponent />}
              { user !== "" && <TimeNow setUser={setUser}/> }
            </p>

            <p style={{fontSize: "calc(30px + 1vmin)", marginTop: "0", paddingTop: "0"}}>
              {user === "" ? "Please enter your name" : `Hello, ${user}!`}
            </p>

            <p style={{position: "absolute", top: "0px", right: "10px", textAlign: "right", fontSize: "40px", marginBottom: "-30px"}}>
              { user !== "" && <TodayDate setUser={setUser}/> }
              { user !== "" && GetLocation() }
            </p>
            { user === "" && <UserForm setUser={setUser}/> } 
          </motion.div>
        </header>
      
      <motion.nav
          initial={false}
          animate={isOpen ? "open" : "closed"}
          custom={height}
          ref={containerRef}
        >
          <motion.div className="background" variants={sidebar} />
          <Navigation />
          <MenuToggle toggle={() => toggleOpen()} />
        </motion.nav>
    </div>
    </weatherContext.Provider>
  );
}

export const weatherContext = createContext();

export default App;
