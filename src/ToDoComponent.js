import { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";

const DeletePath = props => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="rgb(255, 0, 0)"
    strokeLinecap="round"
    {...props}
  />
);

const AddPath = props => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="white"
    strokeLinecap="round"
    {...props}
  />
);

function ToDoComponent() {
  const [sarray, setSarray] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [updater, setUpdater] = useState(true);

  const inputRef = useRef(null);

  useEffect(() => {
    if (editingIndex !== -1 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

  useEffect(() => {
    const savedSarray = localStorage.getItem('todoItems');
    if (savedSarray) {
      setSarray(JSON.parse(savedSarray))
      setUpdater((prevUpdater) => !prevUpdater);
      console.log(savedSarray)
    }
  }, []);

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedArray = [...sarray];
    updatedArray.splice(index, 1);
    setSarray(updatedArray);
    setEditingIndex(-1);
    updateIndices(updatedArray);
    localStorage.setItem('todoItems', JSON.stringify(updatedArray));
  };

  const updateIndices = (updatedArray) => {
    setSarray(
      updatedArray.map((item) => {
        return item;
      })
    );
  };

  return (
    <>
      <ul className='todo-list'
        style={{
          position: "relative",
          bottom: "100px",
          height: "400px"
        }}>
        <div className="mt-3"></div>
        {sarray.map((item, index) => (
          <li style={{ marginBottom: "0px", width: "100%" }} key={index}>
            {editingIndex === index ? (
              <input
                ref={inputRef}
                value={item}
                onChange={(event) => {
                  const updatedArray = [...sarray];
                  updatedArray[index] = event.target.value;
                  setSarray(updatedArray);
                  localStorage.setItem('todoItems', JSON.stringify(updatedArray));
                  console.log(localStorage.getItem('todoItems'))
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    if (item.trim() === "") {
                      const updatedArray = [...sarray];
                      updatedArray.splice(index, 1);
                      setSarray(updatedArray);
                      setEditingIndex(-1);
                      updateIndices(updatedArray);
                      localStorage.setItem('todoItems', JSON.stringify(updatedArray));
                    } else {
                      setEditingIndex(-1);
                    }
                  }
                }}
                style={{
                  fontSize: "15px",
                  width: "90%",
                  backgroundColor: "rgba(0,0,0,0)",
                  color: "white",
                  outline: "none",
                  border: "none",
                  borderBottom: "2px solid rgba(255, 255, 255, 1)",
                }}
                onBlur={() => {
                  if (item.trim() === "") {
                    const updatedArray = [...sarray];
                    updatedArray.splice(index, 1);
                    setSarray(updatedArray);
                    setEditingIndex(-1);
                    updateIndices(updatedArray);
                    localStorage.setItem('todoItems', JSON.stringify(updatedArray));
                  } else {
                    setEditingIndex(-1);
                  }
                }}
              />
            ) : (
              <p style={{ position: "relative", fontSize: "15px", left: "2px", top: "5px", wordWrap: "anywhere"}} onClick={() => handleEdit(index)}>{index + 1}.&nbsp;{item}</p>
            )}
            <button
              className='item-delete-button'
              onClick={() => handleDelete(index)}
            >
              <svg width="23" height="23" viewBox="0 0 23 23">
                <DeletePath d="M 3 16.5 L 17 2.5" />
                <DeletePath d="M 3 2.5 L 17 16.346" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {sarray.length < 30 && (
          <p style={{ position: "absolute", margin:"0", bottom: "40px", width: "100%"}}>
            <button
              className='item-create-button'
              onClick={() => {
                setSarray([...sarray, ""]);
                setEditingIndex(sarray.length);
                setUpdater(!updater);
                localStorage.setItem('todoItems', JSON.stringify(sarray));
              }}
              style={{
                position: "relative", 
                bottom: "10px", 
                width: "100%", 
                paddingBottom: "6px", 
                transition: 'color 0.3s',
                color: "white",
                zIndex: "99", }}
              onMouseEnter={() => {
                document.querySelector('.item-create-button').style.color = "lightgreen";
                document.querySelectorAll('.add-svg-path').forEach(element => element.style.stroke = "lightgreen");
              }}
              onMouseLeave={() => {
                document.querySelector('.item-create-button').style.color = "white";
                document.querySelectorAll('.add-svg-path').forEach(element => element.style.stroke = "white");
              }}
            >
              <svg width="23" height="23" viewBox="0 0 23 23">
                <AddPath className="add-svg-path" style={{ stroke: "white", transition: 'stroke 0.3s' }} d="M 11.5 0 L 11.5 23" />
                <AddPath className="add-svg-path" style={{ stroke: "white", transition: 'stroke 0.3s' }} d="M 0 11.5 L 23 11.5" />
              </svg> &nbsp;  &nbsp;Add a to-do entry
            </button>
          </p>
        ) || <p style={{
                color: "#ffffff", 
                opacity: "0.7",
                fontSize: "15px",                
                position: "absolute", 
                bottom: "30px",
                textAlign: "center"}}>Max entries reached! Delete some entries to continue adding</p>}
    </>
  );
}

export default ToDoComponent;