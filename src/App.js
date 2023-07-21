import './App.css';
import { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { motion, useCycle } from "framer-motion";
import { useDimensions } from "./use-dimensions.ts";
import { MenuToggle } from "./MenuToggle.tsx";
import { Navigation } from "./Navigation.tsx";
import { func } from 'prop-types';
import Moment from 'react-moment';

const date = new Date();

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

function Component1({ setUser }) {
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

function Component2() {
  
  return (
    <>
    <Moment format="YYYY/MM/DD" interval={1000}>
      {date}
    </Moment>
    <Moment interval={1000} add={{ hours: 12 }}>{date}</Moment>
    </>
  );
}

function App() {
  const state = localStorage.getItem("name") ? localStorage.getItem("name") : "";
  const [user, setUser] = useState(state);
  localStorage.setItem("name", user);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  return (
    <div className="App">
      <header className="App-header">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p>
            {user === "" ? "Please enter your name" : `Hello, ${user}!`}
          </p>
          { user === "" && <Component1 setUser={setUser}/> } 
          { user !== "" && <Component2 setUser={setUser}/> }       
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
  );
}

export default App;
