import React, {Fragment}  from "react";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import isNull from "../Helper/Helper";
import trakt_logo from "../Resources/trakt_logo.png"
import github_logo from "../Resources/github_logo.png"

const TopBar = (props) => {

  return (
    <div className="top-bar">
        <div className="user-info">
            <div className="left-content"> 
                <div className="logo">
                    <a href="https://trakt.tv/"><img id="trakt" src={trakt_logo}/></a>
                </div>
                <div className="app-title">
                    <p>Trakt Importer</p>
                </div>
                <div className="logo">
                    <a href="https://github.com/Shengz94"><img id="github" src={github_logo}/></a>
                </div>
            </div>
            {isNull(props.user) ?
                <Fragment></Fragment>
                :
                <div className="right-content"> 
                    <div className="logout">
                        <ExitToAppIcon size="small" onClick={props.logout}/>
                    </div>
                    <div className="user-avatar">
                        <a href={"https://trakt.tv/users/" + props.user.slug}>
                            <img src={props.user.image}/>
                        </a>
                    </div>
                    <div className="user-name">
                        <a href={"https://trakt.tv/users/" + props.user.slug}>
                            <span>{props.user.name}</span>
                        </a>
                    </div>
                </div>
            }
        </div>
    </div>
  );
};

export default TopBar;