import React from "react";
import {getAuthenticationURI} from "../Helper/TraktAPI";
import { Button } from "@material-ui/core";
import { withRouter} from "react-router-dom";

const Login = (props) => {

    const uri = getAuthenticationURI();
    
    function goToAutheticationPage(){
        window.location.href = uri;
    }


    return (
        <div>
            <Button size="small" variant="contained" onClick={goToAutheticationPage}>Log in</Button>
        </div>
    );
};

export default withRouter(Login);