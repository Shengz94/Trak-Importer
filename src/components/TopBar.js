import React, {Fragment}  from "react";
import { Button } from "@material-ui/core"
import isNull from "../Helper/Helper";

const TopBar = (props) => {

  return (
    <div className="top-bar">
        {isNull(props.user) ?
            <Fragment></Fragment>
            :
            <div className="user-info">
                <div className="user-avatar">
                    <img src={props.user.image}/>
                </div>
                <div className="user-name">
                    <span>{props.user.username}</span>
                </div>
                <div className="logout">
                    <Button onClick={props.logout}>Log out</Button>
                </div>
            </div>
        }
    </div>
  );
};

export default TopBar;