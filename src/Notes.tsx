import React, { useState, useEffect } from 'react';

function Notes() {
  const [pages, setPages] = useState([{title: "", notes: ""}]); 
  const [currentPageIndex, setCurrentPageIndex] = useState(-1);

  const addPage = () => {
    setPages([...pages, {title: "", notes: ""}]);
  };
  const deletePage = (index) => {
    const newPages = [...pages];
    newPages.splice(index, 1);
    setPages(newPages);
    if (currentPageIndex >= index && currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex-1);
    }
    if (newPages.length === 0) {
      setCurrentPageIndex(-1);
    } 
    setPages(newPages);
    localStorage.setItem('notePages', JSON.stringify(newPages));
  };

  const handleChangePage = (pageIndex) => {
    if (pageIndex !== currentPageIndex) {
      setCurrentPageIndex(pageIndex);
    } else {
      setCurrentPageIndex(-1);
    }
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
  useEffect(() => {
    const savedPages = localStorage.getItem('notePages');
    if (savedPages) {
      setPages(JSON.parse(savedPages))
    }
  }, []);


  return (
    <>
      <p className="mt-2" style={{ fontSize: "18px", color: "white" }}>Notes</p>
      {currentPageIndex >= 0 && <textarea style={{
          fontSize: "15px",
          width: "90%",
          backgroundColor: "rgba(0,0,0,0)",
          color: "white",
          outline: "none",
          border: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
          marginBottom: "10px",
          height: "20px",
          resize: "none"}} value={pages[currentPageIndex].title} onChange={event => {
          const newPages = [...pages];
          newPages[currentPageIndex].title = event.target.value;
          localStorage.setItem('notePages', JSON.stringify(newPages));
          setPages(newPages);
          }}/>}
        {currentPageIndex >= 0 && <textarea style={{
          fontSize: "15px",
          width: "90%",
          backgroundColor: "rgba(0,0,0,0)",
          color: "white",
          outline: "none",
          border: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
          marginBottom: "10px",
          height: "250px",
          resize: "none"}} value={pages[currentPageIndex].notes} onChange={event => {
          const newPages = [...pages];
          newPages[currentPageIndex].notes = event.target.value;
          localStorage.setItem('notePages', JSON.stringify(newPages));
          setPages(newPages);
          }}/>}
      <div>
        <button onClick={() => {
          addPage();
          setCurrentPageIndex(pages.length);
          }}>Add Page</button>
      </div>
      <div>
        {/*<button onClick={handlePrevPage} disabled={currentPageIndex === 0}>{"<"}</button>*/}
        {pages.map((_, index) => {
          return (
          <>
            <button key={index} onClick={() => handleChangePage(index)}>{_.title}</button>
            <button key={index} className='btn-success' onClick={() => deletePage(index)}></button>
          </>
          )
        })}
        {/*<button onClick={handleNextPage} disabled={currentPageIndex === pages.length - 1}>{">"}</button>*/}
      </div>
      <p>Current Page: {currentPageIndex + 1}</p>
    </>
  );
}

export default Notes;
