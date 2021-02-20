import React, {useEffect, useState}  from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import ImportFromList from "./ImportFromList";
import ImportToTrakt from "./ImportToTrakt";
import Login from "./Login";
import Result from "./Result";
import {getToken, getUserInfo} from "../Helper/TraktAPI";
import isNull from "../Helper/Helper";

const Gateway = (props) => {
  const [titles, setTitles] = useState(new Map());
  const [log, setLog] = useState([]);
  const [user, setUser] = useState();
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));


  useEffect(() => {
    localStorage.setItem("userToken", userToken);
  }, [userToken]);

  useEffect(() => {
    console.log(userToken);
    if(isNull(userToken)){
      let params = new URLSearchParams(window.location.search);
      let code = params.get("code");
      console.log(code);
      if(!isNull(code)){
        console.log("asd");
        getToken(code).then((data) => {
          console.log("token" + data.access_token);
          setUserToken(data.access_token);

          getUserInfo(data.access_token).then((data) => {
            setUser(data);
          });
        });
      }
    }
  }, []);

  function populateTitles(input){
    setTitles(input);
    console.log(input);
  }

  function updateTitle(id, newTitle){
    var tempTitles = titles;
    tempTitles.set(id, newTitle);
    setTitles(tempTitles);
  }

  function handleSelectedChange(id, title){
    var tempTitle = titles.get(id);
    tempTitle.selected = title;
    updateTitle(id, tempTitle);
  }

  function handleImportCheckBox(id){
    var tempTitle = titles.get(id);
    tempTitle.import = !tempTitle.import;
    updateTitle(id, tempTitle);
  }

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path="/"> 
          {!isNull(userToken) ? <Redirect to="Home"/> : <Login/>}
        </Route>
        <Route exact path="/Home">
          <ImportFromList populateTitles={(input) => populateTitles(input)}/>
        </Route>
        <Route exact path="/Home" render={() => (
          <ImportFromList />
        )}/>
        <Route exact path="/Import-Trakt" render={() => (
          <ImportToTrakt />
        )}/>
        <Route exact path="/Result" render={() => (
          <Result />
        )}/>
      </Switch>
    </BrowserRouter>
  );
};

export default Gateway;