import { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { Delete } from '@mui/icons-material';
import { lightGreen } from '@mui/material/colors';
import ConfettiExplosion from 'react-confetti-explosion';

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
  const [checkedItems, setCheckedItems] = useState([]);
  const [explodingIndex, setExplodingIndex] = useState(-1);

  const inputRef = useRef(null);

  useEffect(() => {
    if (editingIndex !== -1 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

  useEffect(() => {
    const savedSarray = localStorage.getItem('todoItems');
    const savedCheckedItems = localStorage.getItem('checkedItems');
    if (savedSarray) {
      setSarray(JSON.parse(savedSarray))
      setUpdater((prevUpdater) => !prevUpdater);
    }
    if (savedCheckedItems) {
      setCheckedItems(JSON.parse(savedCheckedItems));
      setUpdater((prevUpdater) => !prevUpdater);
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
    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = [...prevCheckedItems];
      updatedCheckedItems.splice(index, 1);
      localStorage.setItem('checkedItems', JSON.stringify(updatedCheckedItems));
      return updatedCheckedItems;
    });
    updateIndices(updatedArray);
    localStorage.setItem('todoItems', JSON.stringify(updatedArray));
  };

  const handleCheck = (index) => {
    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = [...prevCheckedItems];
      updatedCheckedItems[index] = !updatedCheckedItems[index];
      const updatedArray = [...sarray];
      if (updatedCheckedItems[index]) {
        updatedArray.splice(index, 1);
        updatedCheckedItems.splice(index, 1);
        updatedArray.push(sarray[index]);
        updatedCheckedItems[sarray.length-1] = true;
        if (explodingIndex === index) {
          setExplodingIndex(-1);
          setTimeout(() => setExplodingIndex(index), 1)
        } else {
          setExplodingIndex(index);
        }
      }
      else if (!updatedCheckedItems[index]) {
        updatedArray.splice(index, 1);
        updatedCheckedItems.splice(index, 1);
        let i = 0;
        for (i = 0; i < updatedCheckedItems.length; i++) {
          if (updatedCheckedItems[i]) {
            break;
          }
        }
        updatedArray.splice(i, 0, sarray[index]);
        updatedCheckedItems.splice(i, 0, false)
        setExplodingIndex(-1);
      }
      setSarray(updatedArray);
      localStorage.setItem('todoItems', JSON.stringify(updatedArray));
      localStorage.setItem('checkedItems', JSON.stringify(updatedCheckedItems));
      return updatedCheckedItems;
    });
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
                      const updatedCheckedItems = [...checkedItems];
                      updatedArray.splice(index, 1);
                      updatedCheckedItems.splice(index, 1);
                      setSarray(updatedArray);
                      setCheckedItems(updatedCheckedItems);
                      setEditingIndex(-1);
                      updateIndices(updatedArray);
                      localStorage.setItem('checkedItems', JSON.stringify(updatedCheckedItems));
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
                    const updatedCheckedItems = [...checkedItems];
                    updatedArray.splice(index, 1);
                    updatedCheckedItems.splice(index, 1);
                    setSarray(updatedArray);
                    setCheckedItems(updatedCheckedItems);
                    setEditingIndex(-1);
                    updateIndices(updatedArray);
                    localStorage.setItem('checkedItems', JSON.stringify(updatedCheckedItems));
                    localStorage.setItem('todoItems', JSON.stringify(updatedArray));
                  } else {
                    setEditingIndex(-1);
                  }
                }}
              />
            ) : (
              <label style={{ display: "flex", alignItems: "center" }}>
              <Checkbox 
                sx={{
                  color: lightGreen[800],
                  '&.Mui-checked': {
                    color: lightGreen[600],
                  },
                }}
                checked={checkedItems[index] != null && checkedItems[index] != false}
                onChange={() => {
                  handleCheck(index);
                }}/>
                { explodingIndex === index ? <ConfettiExplosion force={0.4} particleCount={30} width={400}/> : <div/>}
              <p
                style={{
                  position: "relative",
                  fontSize: "15px",
                  left: "2px",
                  top: "7px",
                  wordWrap: "anywhere",
                  textDecoration: checkedItems[index] ? "line-through" : "none",
                  color: checkedItems[index] ? "grey" : "white",
                }}
                onClick={() => handleEdit(index)}
              >
                {item}
              </p>
            </label>
            )}
            <IconButton               
              className='item-delete-button'
              onClick={() => {
                handleDelete(index);
              }}              
              color="error">
                <Delete />
            </IconButton>
          </li>
        ))}
      </ul>

      {sarray.length < 30 && (
          <p style={{ position: "absolute", margin:"0", bottom: "40px", width: "100%"}}>
            <button
              className='item-create-button'
              onClick={() => {
                const updatedSarray = [...sarray];
                const updatedCheckedItems = [...checkedItems];
                let i = 0;
                for (i = 0; i < updatedSarray.length; i++) {
                  if (checkedItems[i]) {
                    break;
                  }
                }
                updatedSarray.splice(i, 0, "");
                updatedCheckedItems.splice(i, 0, false);
                setCheckedItems(updatedCheckedItems);
                setSarray(updatedSarray);
                setExplodingIndex(-1);
                setEditingIndex(Math.min(updatedSarray.length-1, i));
                setUpdater(!updater);
                localStorage.setItem('checkedItems', JSON.stringify(updatedCheckedItems));
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

