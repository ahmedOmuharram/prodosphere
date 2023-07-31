import React, { useState } from 'react';

function Notes() {
  const [pages, setPages] = useState([[]]); 
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const addPage = () => {
    setPages([...pages, []]);
  };

  const handleChangePage = (pageIndex) => {
    setCurrentPageIndex(pageIndex);
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const inputStyles = {
    fontSize: "15px",
    width: "90%",
    backgroundColor: "rgba(0,0,0,0)",
    color: "white",
    outline: "none",
    border: "none",
    borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
    marginBottom: "10px",
  };

  return (
    <>
      <p className="mt-2" style={{ fontSize: "18px", color: "white" }}>Notes</p>
      {[...Array(10)].map((_, index) => (
        <input key={index} style={inputStyles} />
      ))}
      <div>
        <button onClick={addPage}>Add Page</button>
      </div>
      <div>
        <button onClick={handlePrevPage} disabled={currentPageIndex === 0}>{"<"}</button>
        {pages.map((_, index) => (
          <button key={index} onClick={() => handleChangePage(index)}>{index + 1}</button>
        ))}
        <button onClick={handleNextPage} disabled={currentPageIndex === pages.length - 1}>{">"}</button>
      </div>
      <p>Current Page: {currentPageIndex + 1}</p>
    </>
  );
}

export default Notes;
