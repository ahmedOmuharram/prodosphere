import logo from './logo.svg';
import './App.css';
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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {user == "" ? "Please enter a username" : `Hello, ${user}!`}
        </p>
        <Component1 setUser={setUser}/>
      </header>
    </div>
  );
}

export default App;
