import React, {useState, useEffect} from "react";
import { Button } from "@material-ui/core";
import isNull from "../Helper/Helper";
import { withRouter } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const ImportFromList = (props) => {
  const [file, setFile] = useState();

  function browseFile (e) {
    e.preventDefault();
    setFile(e.target.files[0]);
  }  
  function processFile(){
    const reader = new FileReader();
    reader.onload = (e) => { 
      const source = e.target.result.split("\n");
      var titles = new Map();
      source.forEach(element => {
        if(!isNull(element)){
          var title = {
            id: uuidv4(),
            sourceTitle: element,
            traktTitle: [],
            selected: {},
            import: true
          }
          titles.set(title.id, title);
        }
      });
      props.populateTitles(titles)
      props.history.push("Import-Trakt");
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <input type="file" onChange={(e) => browseFile(e)} />
      <Button disabled={isNull(file)} onClick={processFile}>Process titles</Button>
    </div>
  );
};

export default withRouter(ImportFromList);