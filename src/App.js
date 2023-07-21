import './App.css';
import { motion } from "framer-motion";
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
          placeholder="Large text" 
          name="userInput" 
        />
      </Form.Group>
      <Button class="btn btn-primary" type="submit">Submit</Button>
    </Form>
  );
}


function App() {
  const [user, setUser] = useState("");

  return (
    <div className="App">
      <header className="App-header">
        <motion.div
          initial={{ opacity: 0}}
          animate={{ opacity: 1}}
          transition={{ duration: 0.5 }}
        >
          <p>
            {user == "" ? "Please enter a username" : `Hello, ${user}!`}
          </p>
          <Component1 setUser={setUser}/>
        </motion.div>
      </header>
    </div>
  );
}

export default App;
