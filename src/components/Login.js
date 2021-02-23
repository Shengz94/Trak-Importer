import {getAuthenticationURI} from "../Helper/TraktAPI";
import { Button } from "@material-ui/core";
import { withRouter} from "react-router-dom";
import isNull from "../Helper/Helper";

const Login = (props) => {

    const uri = getAuthenticationURI();
    
    function goToAutheticationPage(){
        window.location.href = uri;
    }

    if(!isNull(props.userToken)){
        props.history.push("/Home");
    }


    return (
        <div className="login-view">
            <Button size="large" variant="contained" onClick={goToAutheticationPage}>Log in</Button>
        </div>
    );
};

export default withRouter(Login);