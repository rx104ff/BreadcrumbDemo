import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [pathState, setPathState] = useState(['home']);
  const [contentState, setContentState] = useState([]);
  const [contentTypeState, setContentTypeState] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let path = "home";
    fetchRequest(path);
  }, []);

  function onClickBreadcrumbItem(index) {
    let path = pathState.slice(0, index + 1).join('+');
    let newPathState = pathState.slice(0, index + 1);

    fetchRequest(path);

    setPathState(newPathState);
  }

  function onClickContent(index) {
    let path = pathState.join('+') + `+${contentState[index]}`;
    let newPathState = pathState;
    newPathState.push(contentState[index]);
    
    fetchRequest(path);

    setPathState(newPathState);
  }

  function fetchRequest(path) {
    setIsLoading(true);
    fetch(`http://localhost:3003/path/${path}`)
    .then( res => res.json() )
    .then( res => {
      if (res["type"] === "file") {
        setContentState(res["content"]);
        setContentTypeState("file");
        setIsLoading(false);
      } 
      if (res["type"] === "dir") {
        setContentState(res["children"]);
        setContentTypeState("dir");
        setIsLoading(false);
      }
    }).catch(err => {
      const errStatus = err.response ? err.response.status : 500;
      if (errStatus === 404){
        alert("Not found");
      } else {
        alert(err)
      }
    });
  }

  function renderContent() {
    if (contentTypeState === "file") {
      return <p>{contentState}</p>;
    } 
    if (contentTypeState === "dir") {
      return <tbody>
        {contentState.map((con, index) =>  <button  key={index} onClick={() => onClickContent(index)}>{con}</button>)}
        <br/>
      </tbody>
    }
  } 
  
  return (
    <div className='index'>
      <div className="breadcrumbContainer">
        {pathState.map((path, index) => {
          return <> / <a className='breadcrumb' key={index} onClick={() => onClickBreadcrumbItem(index)}>{path}</a></>
        })}
      </div>
      {isLoading ? 
        null
        :
        <div className="content">
          {renderContent()}
        </div>
      }
    </div>
  );
}

export default App;
