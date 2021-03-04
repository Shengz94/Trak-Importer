import { Fragment, useEffect, useState } from "react";
import { Button } from "@material-ui/core"
import { withRouter } from "react-router-dom";
import Loader from "react-loader-spinner";
import TitleImportCard from "./TitleImportCard";
import isNull from "../Helper/Helper";
import {addToHistory, searchForTitle} from "../Helper/TraktAPI"

const ImportToTrakt = (props) => {
  const [ready, setReady] = useState(false);
  const [titleArray, setTitleArray] = useState();
  const [loading, setLoading] = useState(false);

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
  }, [titleArray]);

  useEffect(() => {
    if(isNull(props.userToken)){
      props.history.push("/");
    }
  }, [props.userToken]);

  async function populateTrakTitle(){
    let requests = [];

    setLoading(true);
    props.titles.forEach(element => {
      let tempElement = element;
      requests.push(searchForTitle(tempElement.sourceTitle));
    });
    await Promise.allSettled(requests).then(data =>{
      props.updateTitles(data);
    });

    setLoading(false);
  }

  async function importTitles(){
    if(!isNull(props.titles)){
      let movies= [];
      let shows = [];
      let tempLog;

      setLoading(true);
      for(const element of props.titles.values()){
        if(element.import && !isNull(element.selected) && !isNull(element.selected.id)){ 
          let current = {
            "ids": {
              "trakt": element.selected.id
            }
          }
          if(element.selected.type === "movie"){
            movies.push(current);
          }
          else if(element.selected.type === "show"){
            shows.push(current);
          }
        }
      }
      await addToHistory(movies, shows, props.userToken).then((data) => {
        if(!isNull(data)){
          tempLog = data;
        }
      });
      setLoading(false);
      props.fillLog(tempLog);
      props.history.push("/Result");
    }
  }

  if(isNull(props.titles) || props.titles.size <= 0){
    props.history.push("/Home");
  }

  return (
    <div className="import-trakt-view">
      {loading ?
        <div className="loading-screen">
          <Loader type="ThreeDots" color="#00BFFF" height={100} width={100}/>
        </div>
        :
        <Fragment></Fragment>
      }
      {ready  && !isNull(props.titles)?
        <Fragment>
          <div className="title-list">
            {titleArray.map(title =>  
              <TitleImportCard key={title.id} 
                title={title} updateTitle={props.updateTitle} 
                handleImportCheckBox={props.handleImportCheckBox} 
                handleSelectedChange={props.handleSelectedChange}
              />
              )
            }
          </div>
          <div className="import-button">
            <Button variant="contained" color="default" onClick={importTitles}>Import titles</Button>
          </div>
        </Fragment>
        :
        <Fragment/>
      }   
    </div>
  );
};

export default withRouter(ImportToTrakt);