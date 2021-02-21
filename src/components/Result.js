import React, {Fragment, useEffect, useState}  from "react";
import isNull from "../Helper/Helper";

const Result = (props) => {
  const [ready, setReady] = useState(false);

  useEffect(() =>{
      if(!isNull(props.log) && props.log.length > 0){
        setReady(true);
      }
  }, [props.log])

  function renderLog(line){
    if(line.indexOf("///end///") > 0){
      const linkAr = line.split("///end///");
      const link = linkAr[1];
      const textAr = linkAr[0].split("///startTitle///");
      const text = textAr[0]
      const linkText = textAr[1];
      return <p key={Math.random()}>{text} <a href={link}>{linkText}</a> </p>
    }
    return line;
  }

  return (
    <div className="result-view">
      <div className="log">
        {props.log.map(line => renderLog(line))}
      </div>
    </div>
  );
};

export default Result;