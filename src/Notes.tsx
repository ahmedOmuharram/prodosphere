import React, { useState, useEffect } from 'react';
import { grey, lightGreen, red } from '@mui/material/colors';
import { ArrowBackIos, Delete, NoteAdd } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import './Notes.css';

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
    // Handle page index changing
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

  /*const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };*/

  useEffect(() => {
    const savedPages = localStorage.getItem('notePages');
    if (savedPages) {
      setPages(JSON.parse(savedPages))
    }
  }, []);


  return (
    <>
      <p style={{ marginTop: "12px", fontSize: "30px", color: "white" }}>Notes</p>
      {/* Note */}
      {currentPageIndex >= 0 &&<> 
        <button style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          border: "none",
          padding: 0,
          marginBottom: 0,
          background: "none"
        }} onClick={() => setCurrentPageIndex(-1)}><ArrowBackIos style={{ padding: 0, marginBottom: 0 }}sx={{color: grey[50]}} /></button>
        {/* Title Section */}
        <textarea className="note-area" placeholder="Title..." style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginTop: 0,
          paddingTop: 0,
          overflowY: "auto",
          width: "90%",
          backgroundColor: "rgba(0,0,0,0)",
          color: "white",
          outline: "none",
          border: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
          marginBottom: "10px",
          height: "35px",
          resize: "none"}} value={pages[currentPageIndex].title} onChange={event => {
          const newPages = [...pages];
          newPages[currentPageIndex].title = event.target.value;
          localStorage.setItem('notePages', JSON.stringify(newPages));
          setPages(newPages);
          }}/>
          {/* Note Content Section */}
          <textarea className="note-area" placeholder="Write your thoughts here..." style={{
          fontSize: "15px",
          width: "90%",
          backgroundColor: "rgba(0,0,0,0)",
          color: "white",
          outline: "none",
          border: "none",
          overflowY: "auto",
          marginBottom: "10px",
          height: "370px",
          resize: "none"}} value={pages[currentPageIndex].notes} onChange={event => {
          const newPages = [...pages];
          newPages[currentPageIndex].notes = event.target.value;
          localStorage.setItem('notePages', JSON.stringify(newPages));
          setPages(newPages);
          }} autoFocus/></>}

          {/* Notes list */}

          {currentPageIndex < 0 &&
            <>
      <div>
        <Button variant="outlined" color="success" onClick={() => {
          addPage();
          setCurrentPageIndex(0);
          }}
          style={{
            position: "absolute",
            top: "0px",
            right: "0px",
            background: "none",
            borderTopRightRadius: "20px",
            borderBottomLeftRadius: "20px"
          }}><NoteAdd sx={{ color: lightGreen[400] }} style={{
            width: "28px",
            height: "28px"
          }}/></Button>
      </div>
      <div className="note-area" style={{height: "82%", marginLeft: "18px", marginRight: "18px", overflowX: "hidden"}}>
        {/*<button onClick={handlePrevPage} disabled={currentPageIndex === 0}>{"<"}</button>*/}
        <ul style={{position: "relative", bottom: 0, left: 0, padding: 0, margin: 0, overflowX: "hidden", overflowY: "auto"}}>
        {pages.map((_, index) => {
          return (
            <li style={{width: "100%", margin: 0, marginBottom: "10px", padding: "5px", borderRadius: "10px", overflowX: "hidden", backgroundColor: "rgba(0, 0, 0, 0.3)"}}>
              <button style={{background: "none", width: "80%", maxWidth: "80%", backgroundColor: "none", border: "none"}} key={index} onClick={() => handleChangePage(index)}>
                <p style={{textAlign: "left", color: "white", margin: 0, fontSize: "16px", maxWidth: "90%", overflowX: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", fontWeight: "bold"}}>{_.title !== "" ? _.title : "Untitled"}</p>
                <p style={{textAlign: "left", color: "grey", margin: 0, overflowX: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "90%", fontSize: "12px"}}>{_.notes.split('\n')[0]}</p>
              </button>
              <IconButton key={index} style={{marginLeft: "auto"}} color="error" onClick={() => deletePage(index)}><Delete sx={{color: red[800]}}/></IconButton>
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
