import React, { Fragment, useEffect, useState } from "react";
import isNull from "../Helper/Helper";
import {searchForTitle} from "../Helper/TraktAPI"

const TitleImport = (props) => {
  const [ready, setReady] = useState(false);
  const [numCards, setNumCards] = useState();
  const [currentNumCards, setCurrentNumCards] = useState(0);

  useEffect(() => {
    populateTrakTitle();
  }, []);

  useEffect(() => {
    if(numCards === currentNumCards){
      setReady(true);
    }
  }, [currentNumCards]);

  function populateTrakTitle(){
    setNumCards(props.titles.size());
    props.titles.forEach(element => {
      var tempElement = element;
      searchForTitle(tempElement.sourceTitle).then(data => {
        tempElement.traktTitle = data;
        if(!isNull(data)){
          tempElement.selected = data[0];
        }
        props.updateTitle(tempElement.id, tempElement);
        setCurrentNumCards(currentNumCards + 1);
      });
    });
  }

  return (
    <div className="title-import-card">
      {ready ?
        <Fragment>
          <div className="checkbox-import">
            <input type="checkbox" checked={props.title.import} onChange={() => props.handleImportCheckBox(props.title.id)} />
          </div>
          <div className="source-name">
            <span>Input title: {props.title.source}</span>
          </div>
          <div className="trakt-title">
            <label>
              Trakt title:
              <select disabled={isNull(props.title.selected)} value={props.title.selected.title} onChange={(e) => props.handleSelectedChange(props.title.id, e.target.value)}>
                {props.title.traktTitle.maps((title) => {
                  <option value={title}>{title.title}</option>
                })}
              </select>
            </label>
          </div>
        </Fragment>
        :
        <Fragment/>
      }
    </div>    
  );
};

export default TitleImport;