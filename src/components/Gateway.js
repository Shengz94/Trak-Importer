import React, {Fragment, useEffect, useState}  from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ImportFromList from "./ImportFromList";
import ImportToTrakt from "./ImportToTrakt";
import Login from "./Login";
import Result from "./Result";
import {getToken, getUserInfo, revokeToken} from "../Helper/TraktAPI";
import isNull from "../Helper/Helper";
import TopBar from "./TopBar";

const Gateway = () => {
  const [titles, setTitles] = useState(new Map());
  const [log, setLog] = useState([]);
  const [user, setUser] = useState();
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));


  useEffect(() => {
    localStorage.setItem("userToken", userToken);
    if(!isNull(userToken)){
      getUserInfo(userToken).then((data) => {
        setUser(data);
      });
    }
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
    revokeToken(userToken);
    setUserToken(undefined);
    setUser(undefined);
  }

  function populateTitles(input){
    setTitles(input);
  }

  function updateTitle(id, newTitle){
    let tempTitles = new Map(titles);
    tempTitles.set(id, newTitle);
    setTitles(tempTitles);
  }

  function updateTitles(data){
    let tempTitles = new Map(titles);
    let idx = 0;
    tempTitles.forEach(element => {
      element.traktTitle = data[idx].value;
      element.selected = data[idx].value[0];
      if(isNull(data[idx].value[0])){
        element.import = false;
      }
      idx++;
    });
    setTitles(tempTitles)
  }

  function handleSelectedChange(id, title){
    let tempTitle = titles.get(id);
    tempTitle.selected = JSON.parse(title);
    updateTitle(id, tempTitle);
  }

  function handleImportCheckBox(id){
    let tempTitle = titles.get(id);
    tempTitle.import = !tempTitle.import;
    updateTitle(id, tempTitle);
  }

  function generateNotImportedSet(data){
    let notImportedSet = new Set();
    data.movies.forEach( element => {
      notImportedSet.add(element.ids.trakt);
    });
    data.shows.forEach( element => {
      notImportedSet.add(element.ids.trakt);
    });
    return notImportedSet;
  }

  function fillLog(data){
    let notImportedSet = generateNotImportedSet(data.notFound);
    let tempLog = [];
    titles.forEach( title => {
      let result = "-";
      if(title.import){
        if(!isNull(title.selected)){
          if(!isNull(data) && (!notImportedSet.has(title.selected.id))){
              result = title.sourceTitle + " imported to Trakt as ///startTitle///" 
                + title.selected.title + " - " + title.selected.year + "(" + title.selected.type 
                + ") (ID:" + title.selected.id + "). ///end///https://trakt.tv/" 
                + title.selected.type + "s/" + title.selected.slug;
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
            {/*!isNull(userToken) ? <Redirect to="Home"/> : <Login/>*/}
            <Login userToken={userToken}/>
          </Route>
          <Route exact path="/Home">
            <ImportFromList userToken={userToken} populateTitles={(input) => populateTitles(input)}/>
          </Route>
          <Route exact path="/Import-Trakt" render={() => (
            <ImportToTrakt titles={titles} userToken={userToken} log={log}
              updateTitles={updateTitles} fillLog={fillLog}
              handleSelectedChange={handleSelectedChange}
              handleImportCheckBox={handleImportCheckBox}
            />
          )}/>
          <Route exact path="/Result" render={() => (
            <Result userToken={userToken} log={log} />
          )}/>
        </Switch>
      </BrowserRouter>
    </Fragment>
  );
};

export default Gateway;