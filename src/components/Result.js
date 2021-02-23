import {Fragment, useEffect}  from "react";
import { Button } from "@material-ui/core"
import { withRouter } from "react-router-dom";
import isNull from "../Helper/Helper";

const Result = (props) => {

  useEffect(() => {
    if(isNull(props.userToken)){
      props.history.push("/");
    }
  }, [props.userToken]);

  function renderLog(line){
    if(line.indexOf("///end///") > 0){
      const linkAr = line.split("///end///");
      const link = linkAr[1];
      const textAr = linkAr[0].split("///startTitle///");
      const text = textAr[0]
      const linkText = textAr[1];
      return <p>{text} <a href={link}>{linkText}</a> </p>
    }
    return <p>{line}</p>;
  }

  function backToHome(){
    props.history.push("/Home");
  }

  return (
    <div className="result-view">
      <div className="log">
        {props.log.map(line => <Fragment key={Math.random()}>{renderLog(line)}</Fragment>)}
      </div>
      <div className="back-button">
        <Button variant="contained" color="default" onClick={backToHome}>Back</Button>
      </div>
    </div>
  );
};

export default withRouter(Result);