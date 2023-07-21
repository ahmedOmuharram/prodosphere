import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

function LinkGroupComponent() {
  const [toolbars, setToolbars] = useState([[]]);
  const maxButtonsPerToolbar = 10;
  const maxButtonNumber = 30;
  const [lastButtonNumber, setLastButtonNumber] = useState(0);

  const handleAddButton = () => {
    if (lastButtonNumber >= maxButtonNumber) {
      return; // Don't add more buttons if the limit is reached
    }

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
              <Button
                className="btn btn-secondary"
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
                {buttonNumber}
              </Button>
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
