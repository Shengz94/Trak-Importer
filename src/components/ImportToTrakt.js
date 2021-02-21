import React, { Fragment, useEffect, useState } from "react";
import { Button } from "@material-ui/core"
import { withRouter } from "react-router-dom";
import TitleImportCard from "./TitleImportCard";
import isNull from "../Helper/Helper";
import {addToHistory, searchForTitle} from "../Helper/TraktAPI"

const ImportToTrakt = (props) => {
  const [ready, setReady] = useState(false);
  const [titleArray, setTitleArray] = useState();

  useEffect(() => {
    populateTrakTitle();
  }, []);

  useEffect(() => {
    setTitleArray([...props.titles.values()])
  }, [props.titles]);

  useEffect(() => {
    if(!isNull(titleArray) && titleArray.length >= 0){
      setReady(true);
    }
  }, [titleArray])

  async function populateTrakTitle(){
    var requests = []
    props.titles.forEach(element => {
      var tempElement = element;
      requests.push(searchForTitle(tempElement.sourceTitle));
    });
    await Promise.allSettled(requests).then(data =>{
      props.updateTitles(data);
    });
  }

  async function importTitles(){
    if(!isNull(props.titles)){
      var requests =[];
      var tempLog;

      //props.titles.forEach(async element => 
      for(const element of props.titles.values()){
        if(element.import && !isNull(element.selected) && !isNull(element.selected.id)){                     
          requests.push(addToHistory(element.selected.id, element.selected.type, props.userToken));
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      };
      await Promise.allSettled(requests).then(data =>{
        if(!isNull(data)){
          tempLog = data;
        }
      });
      console.log(tempLog)
      props.fillLog(tempLog);
      props.history.push("/Result");
    }
  }

  if(isNull(props.titles) || props.titles.size <= 0){
    props.history.push("home");
  }

  return (
    <div className="title-list">
      {ready  && !isNull(props.titles)?
        <Fragment>
          {titleArray.map(title =>  
            <TitleImportCard key={title.id} 
              title={title} updateTitle={props.updateTitle} 
              handleImportCheckBox={props.handleImportCheckBox} 
              handleSelectedChange={props.handleSelectedChange}
            />
          )}
          <Button onClick={importTitles}>Import titles</Button>
        </Fragment>
        :
        <Fragment/>
      }   
    </div>
  );
};

export default withRouter(ImportToTrakt);