import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

function LinkGroupComponent() {
  const [toolbars, setToolbars] = useState([[]]);
  const [links, setLinks] = useState([""]);
  const [editorIndex, setEditorIndex] = useState(0);
  const maxButtonsPerToolbar = 10;
  const maxButtonNumber = 30;
  const [lastButtonNumber, setLastButtonNumber] = useState(0);


  const handleAddButton = () => {
    if (lastButtonNumber >= maxButtonNumber) {
      return; // Don't add more buttons if the limit is reached
    }
    setLinks((links) => [...links, ""])
    if (toolbars.length === 0 || toolbars[toolbars.length - 1].length >= maxButtonsPerToolbar) {
      setToolbars((prevToolbars) => [...prevToolbars, []]);
    }

    setLastButtonNumber((prevNumber) => Math.min(prevNumber + 1, maxButtonNumber));

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
        <ButtonToolbar>
          <ButtonGroup className="me-2">
            {toolbar.map((buttonNumber) => (
              <div>
              <a href={(links[buttonNumber].substring(0, 4) == "http" ? "" : "//") + links[buttonNumber]}>
              <Button
                className="btn btn-light"
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  border: "2px solid #555",
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px"
                }}
                key={buttonNumber}
              >
                <img height="32" width="32" src={links[buttonNumber] !== "" ? "https://icon.horse/icon/" + links[buttonNumber].substring(links[buttonNumber].indexOf(":") + 1) : "https://upload.wikimedia.org/wikipedia/commons/5/56/Chain_link_icon_slanted.png"} />
              </Button>
              </a>
              {editorIndex !== buttonNumber ? 
              <Button
              onClick={() => {
                setEditorIndex(buttonNumber);
              }}
              className="btn btn-light"
              style={{
                border: "2px solid #555",
                width: "5px",
                height: "5px",
                top: "18px",
                position: "relative"
              }}
              key={buttonNumber}
              
            > </Button>:
              <input
                value={links[buttonNumber]}
                onChange={(event) => {
                  const newLinks = [...links];
                  newLinks[buttonNumber] = event.currentTarget.value;
                  setLinks(newLinks);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                  const newLinks = [...links];
                  newLinks[buttonNumber] = event.currentTarget.value;
                  setEditorIndex(0);
                  setLinks(newLinks);
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
                onBlur={(event) => {
                  const newLinks = [...links];
                  newLinks[buttonNumber] = event.currentTarget.value;
                  setEditorIndex(0);
                  setLinks(newLinks);
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
                marginRight: "10px",
                border: "2px solid #060",
                borderRadius: "50%",
                width: "50px",
                height: "50px"
              }}
              className="me-2 btn btn-success"
              aria-label="Add Button"
            >
              +
            </Button>
          </ButtonToolbar>
        </div>
      )}
    </>
  );
}

export default LinkGroupComponent;