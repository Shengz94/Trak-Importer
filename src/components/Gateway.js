import React, {Fragment, useEffect, useState}  from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import ImportFromList from "./ImportFromList";
import ImportToTrakt from "./ImportToTrakt";
import Login from "./Login";
import Result from "./Result";
import {getToken, getUserInfo} from "../Helper/TraktAPI";
import isNull from "../Helper/Helper";
import TopBar from "./TopBar";

const Gateway = (props) => {
  const [titles, setTitles] = useState(new Map());
  const [log, setLog] = useState([]);
  const [user, setUser] = useState();
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));


  useEffect(() => {
    localStorage.setItem("userToken", userToken);
  }, [userToken]);

  useEffect(() => {
    console.log("User Token: " + userToken);
    if(isNull(userToken)){
      let params = new URLSearchParams(window.location.search);
      let code = params.get("code");
      console.log("User code: " + code);
      if(!isNull(code)){
        getToken(code).then((data) => {
          setUserToken(data.access_token);

          getUserInfo(data.access_token).then((data) => {
            setUser(data);
          });
        });
      }
    }
    else{
      getUserInfo(userToken).then((data) => {
        setUser(data);
      });
    }
  }, []);

  function logout(){
    localStorage.removeItem("userToken");
    setUser(undefined);
  }

  function populateTitles(input){
    setTitles(input);
  }

  function updateTitle(id, newTitle){
    var tempTitles = new Map(titles);
    tempTitles.set(id, newTitle);
    setTitles(tempTitles);
  }

  function updateTitles(data){
    var tempTitles = new Map(titles);
    let idx = 0;
    tempTitles.forEach(element => {
      element.traktTitle = data[idx].value;
      if(!isNull(data[idx])){
        element.selected = data[idx].value[0];
      }
      idx++;
    });
    setTitles(tempTitles)
  }

  function handleSelectedChange(id, title){
    var tempTitle = titles.get(id);
    tempTitle.selected = JSON.parse(title);
    updateTitle(id, tempTitle);
  }

  function handleImportCheckBox(id){
    var tempTitle = titles.get(id);
    tempTitle.import = !tempTitle.import;
    updateTitle(id, tempTitle);
  }

  function fillLog(data){
    let idx = 0;
    var tempLog = [];
    titles.forEach( title => {
      let result = "-";
      if(title.import){
        if(!isNull(title.selected)){
          console.log(data)
          if(!isNull(data[idx]) && data[idx].status === "fulfilled" && (
          (title.selected.type === "movie" && data[idx].value.added.movies > 0)
          || (title.selected.type === "show" && data[idx].value.added.episodes > 0))){
            result = title.sourceTitle + " imported to Trakt as ///startTitle///" + title.selected.title 
            + " - " + title.selected.year + "(" + title.selected.type 
            + ") (ID:" + title.selected.id + "). ///end///https://trakt.tv/" + title.selected.type + "s/" + title.selected.slug;
          }
          else{
            result = "There were a problem importing " + title.sourceTitle + " to Trakt. ";
          }
        }
        else{
          result = title.sourceTitle + " NOT found in Trakt. "; 
        }
      }
      else{
        result = title.sourceTitle + " NOT imported to Trakt. "
      }
      idx++;
      tempLog.push(result);
    });
    setLog(tempLog);
  }

  return (
    <Fragment>
      <TopBar user={user} logout={logout}/>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/"> 
            {!isNull(userToken) ? <Redirect to="Home"/> : <Login/>}
          </Route>
          <Route exact path="/Home">
            <ImportFromList populateTitles={(input) => populateTitles(input)}/>
          </Route>
          <Route exact path="/Import-Trakt" render={() => (
            <ImportToTrakt titles={titles} userToken={userToken} log={log}
              updateTitles={updateTitles} fillLog={fillLog}
              handleSelectedChange={handleSelectedChange}
              handleImportCheckBox={handleImportCheckBox}
            />
          )}/>
          <Route exact path="/Result" render={() => (
            <Result log={log} />
          )}/>
        </Switch>
      </BrowserRouter>
    </Fragment>
  );
};

export default Gateway;