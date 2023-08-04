import React, { useState, useEffect } from 'react';

function Notes() {
  const [pages, setPages] = useState([{title: "", notes: ""}]); 
  const [currentPageIndex, setCurrentPageIndex] = useState(-1);

  const addPage = () => {
    setPages([{title: "", notes: ""} ,...pages]);
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
      {currentPageIndex >= 0 &&<> 
        <button className='btn btn-danger' onClick={() => setCurrentPageIndex(-1)}></button><br></br>
      <textarea style={{
          fontSize: "15px",
          width: "90%",
          backgroundColor: "rgba(0,0,0,0)",
          color: "white",
          outline: "none",
          border: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
          marginBottom: "10px",
          height: "30px",
          resize: "none"}} value={pages[currentPageIndex].title} onChange={event => {
          const newPages = [...pages];
          newPages[currentPageIndex].title = event.target.value;
          localStorage.setItem('notePages', JSON.stringify(newPages));
          setPages(newPages);
          }}/>
<textarea style={{
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
          }} autoFocus/></>}
          {currentPageIndex < 0 &&
            <>
      <div>
        <button onClick={() => {
          addPage();
          setCurrentPageIndex(0);
          }}>Add Page</button>
      </div>
      <div>
        {/*<button onClick={handlePrevPage} disabled={currentPageIndex === 0}>{"<"}</button>*/}
        <ul style={{width: "100%"}}>
        {pages.map((_, index) => {
          return (
            <li style={{width: "100%"}}>
              <button key={index} onClick={() => handleChangePage(index)}>{_.title !== "" ? _.title : "Untitled"}</button>
              <p>{_.notes.split('\n')[0]}</p>
              <button key={index} style={{marginLeft: "auto"}}  className='btn btn-danger' onClick={() => deletePage(index)}></button>
            </li>
          )
        })}
        </ul>
        {/*<button onClick={handleNextPage} disabled={currentPageIndex === pages.length - 1}>{">"}</button>*/}
      </div>
      </>
      }
    </>
  );
}

export default Notes;
