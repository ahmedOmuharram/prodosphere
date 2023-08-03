import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { lightGreen } from '@mui/material/colors';

const DeletePath = props => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="rgb(255, 0, 0)"
    strokeLinecap="round"
    {...props}
  />
);



function LinkGroupComponent() {
  const [toolbars, setToolbars] = useState([[]]);
  const [links, setLinks] = useState([""]);
  const [editorIndex, setEditorIndex] = useState(0);
  const maxButtonsPerToolbar = 7;
  const maxButtonNumber = 21;
  const [lastButtonNumber, setLastButtonNumber] = useState(0);
  // const [updater, setUpdater] = useState(true);

  useEffect(() => {
    const savedLastButtonNumber = parseInt(localStorage.getItem("lastButtonNumber"))
    const savedLinks = localStorage.getItem('linkItems');
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks))
    }
    if (savedLastButtonNumber) {
      setLastButtonNumber(parseInt(savedLastButtonNumber));
    }

    const newToolbars = [[]];
    for (let i = 1; i < (savedLastButtonNumber) + 1; i++) {
    if (newToolbars.length === 0 || newToolbars[newToolbars.length - 1].length >= maxButtonsPerToolbar) {
      newToolbars.push([]);
    }
    newToolbars[newToolbars.length - 1].push(i);
    }
    setToolbars(newToolbars);
    
  }, []);


  const handleAddButton = () => {
    if (lastButtonNumber >= maxButtonNumber) {
      return; // Don't add more buttons if the limit is reached
    }
    setLinks((links) => [...links, ""])
    localStorage.setItem('linkItems', JSON.stringify([...links, ""]));
    if (toolbars.length === 0 || toolbars[toolbars.length - 1].length >= maxButtonsPerToolbar) {
      setToolbars((prevToolbars) => [...prevToolbars, []]);
    }

    setLastButtonNumber((prevNumber) => Math.min(prevNumber + 1, maxButtonNumber));
    localStorage.setItem('lastButtonNumber', Math.min(lastButtonNumber + 1, maxButtonNumber))

    setToolbars((prevToolbars) => {
      const newToolbars = [...prevToolbars];
      newToolbars[newToolbars.length - 1] = [
        ...newToolbars[newToolbars.length - 1],
        Math.min(lastButtonNumber + 1, maxButtonNumber)
      ];
      return newToolbars;
    });
  };

  const renderButtonGroups = () => {
    return toolbars.map((toolbar, index) => (
      <div className="d-flex justify-content-center mt-4" key={index}>
        <ButtonToolbar className="mt-4">
          <ButtonGroup className="me-2">
            {toolbar.map((buttonNumber) => (
              <div>
              <a href={links[buttonNumber].substring(0, 4) === "" ? "javascript:void(0)" : ((links[buttonNumber].substring(0, 4) === "http" ? "" : "//") + links[buttonNumber])}>
              <Button
                className="btn btn-light"
                style={{
                  marginRight: "25px",
                  border: "2px solid #555",
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px",
                  position: "relative",
                  left: "35px"
                }}
                key={buttonNumber}
              >
                <img height="32" width="32" alt="favicon" src={links[buttonNumber] !== "" ? "https://www.google.com/s2/favicons?sz=64&domain_url=" + (links[buttonNumber].substring(0, 4) === "http" ? links[buttonNumber].split("://")[1] : links[buttonNumber].substring(links[buttonNumber].indexOf(":") + 1))  : "https://upload.wikimedia.org/wikipedia/commons/5/56/Chain_link_icon_slanted.png"} />
              </Button>
              </a>
              <Button
              onClick={() => {
                const newLinks = [...links];
                const newToolbars = [...toolbars];
                

                newToolbars[Math.floor((buttonNumber-1)/7)].splice((buttonNumber-1) - 7 * Math.floor((buttonNumber-1)/7), 1);
                if (newToolbars[Math.floor((buttonNumber-1)/7)].length === 0) {
                  newToolbars.pop();
                }
                for (let i = 0; i < newToolbars.length; i++) {
                  for (let j = 0; j < newToolbars[i].length; j++) {
                    if (newToolbars[i][j] > buttonNumber) {
                      newToolbars[i][j]--;
                      if (newToolbars[i][j] === (i)*7) {
                        newToolbars[i-1].push((i)*7);
                        newToolbars[i].shift();
                        j--;
                        if (newToolbars[i].length === 0) {
                          newToolbars.pop();
                          break;
                        }
                      }
                    }
                  }
                }
                
                setToolbars(newToolbars);
                newLinks.splice((buttonNumber), 1);
                setLinks(newLinks);
                localStorage.setItem('linkItems', JSON.stringify(newLinks));
                setLastButtonNumber(lastButtonNumber-1)
                localStorage.setItem('lastButtonNumber', lastButtonNumber - 1)
              }}
              className="btn btn-light"
              style={{
                backgroundColor: "#ffc6c4",
                borderRadius: "50%",
                width: "20px",
                padding: "0px",
                textAlign: "center",
                height: "20px",
                top: "-20px",
                position: "relative",
                left: "-50px",
              }}
            > 
              <svg width="16" height="16" viewBox="1 1 20 24" style={{paddingBottom: "5px"}}>
                <DeletePath d="M 3 16.5 L 17 2.5" />
                <DeletePath d="M 3 2.5 L 17 16.346" />
              </svg>
             </Button>
              {editorIndex !== buttonNumber ? 
              <Button
              onClick={() => {
                setEditorIndex(buttonNumber);
              }}
              className="btn btn-light"
              style={{
                fontSize: "10px",
                paddingBottom: "5px",
                backgroundColor: "#c6c4ff",
                borderRadius: "50%",
                width: "20px",
                padding: "0px",
                textAlign: "center",
                height: "20px",
                top: "20px",
                position: "relative",
                left: "-29px",
              }}
              key={buttonNumber}
              
            >
              <svg
                style={{ color: 'white' }}
                width="15"
                height="15"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.0207 5.82839L15.8491 2.99996L20.7988 7.94971L17.9704 10.7781M13.0207 5.82839L3.41405 15.435C3.22652 15.6225 3.12116 15.8769 3.12116 16.1421V20.6776H7.65669C7.92191 20.6776 8.17626 20.5723 8.3638 20.3847L17.9704 10.7781M13.0207 5.82839L17.9704 10.7781"
                  stroke="lightblue"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="blue"
                ></path>
              </svg> 
            </Button>:
              <input
                value={links[buttonNumber]}
                onChange={(event) => {
                  const newLinks = [...links];
                  newLinks[buttonNumber] = event.currentTarget.value;
                  setLinks(newLinks);
                  localStorage.setItem('linkItems', JSON.stringify(newLinks));
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                  const newLinks = [...links];
                  newLinks[buttonNumber] = event.currentTarget.value;
                  setEditorIndex(0);
                  setLinks(newLinks);
                  localStorage.setItem('linkItems', JSON.stringify(newLinks));
                  }
                }}
                style={{
                  fontSize: "15px",
                  width: "90%",
                  position: "relative",
                  top: "10px",
                  left: "10px",
                  backgroundColor: "rgba(0,0,0,0)",
                  color: "white",
                  outline: "none",
                  border: "none",
                  borderBottom: "2px solid rgba(255, 255, 255, 1)",
                }}
                onBlur={(event) => {
                  const newLinks = [...links];
                  newLinks[buttonNumber] = event.currentTarget.value;
                  setEditorIndex(0);
                  setLinks(newLinks);
                  localStorage.setItem('linkItems', JSON.stringify(newLinks));
                }}
                autoFocus
              />
            }
            </div>
            ))}
          </ButtonGroup>
        </ButtonToolbar>
      </div>
    ));
  };

  return (
    <>
      {renderButtonGroups()}
      {lastButtonNumber < maxButtonNumber && (
        <div className="d-flex justify-content-center mt-4">
          <ButtonToolbar>
            <Button
              onClick={handleAddButton}
              style={{
                border: "none",
                background: "none",
                borderRadius: "50%",
                padding: 0
              }}
              aria-label="Add Button"
            >
              <AddCircleIcon sx={{ color: lightGreen[400] }} style={{
                width: "50px",
                height: "50px"
              }}/>
            </Button>
          </ButtonToolbar>
        </div>
      )}
    </>
  );
}

export default LinkGroupComponent;
