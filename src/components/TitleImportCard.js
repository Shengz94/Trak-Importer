import React, {Fragment}  from "react";
import isNull from "../Helper/Helper";

const TitleImport = (props) => {
  
  return (
    <div className="title-import-card">
      <div className="checkbox-import">
        <input type="checkbox" checked={props.title.import} onChange={() => props.handleImportCheckBox(props.title.id)} />
      </div>
      <div className="source-name">
        <span>Input title: {props.title.sourceTitle}</span>
      </div>
      <div className="trakt-title">
        {!isNull(props.title.selected) ?
          <label>
            Trakt title:
            <select 
              value={!isNull(props.title.selected) ? JSON.stringify(props.title.selected) : ""} 
              onChange={(e) => props.handleSelectedChange(props.title.id, e.target.value)}>
                {props.title.traktTitle.map((element) => {
                  return <option key={element.id} value={JSON.stringify(element)}>
                      {"Trakt ID " + element.id + ": " + element.title + " - " + element.year 
                      + " (" + element.type + ")"}
                    </option>
                })}
            </select>
          </label>
          :
          <span>No title found on Trakt</span>
        }
      </div>
    </div>    
  );
};

export default TitleImport;