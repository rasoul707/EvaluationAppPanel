import { Redirect, Route, Switch, useHistory, } from "react-router-dom"
import SignIn from "./signin"
import SignUp from "./signup"
import Verify from "./verify"
import ForgetPassword from "./forget_password"
import ResetPassword from "./reset_password"
import { useEffect } from 'react'
import { useSelector } from "react-redux"


const Authentication = () => {

    const history = useHistory()
    const user = useSelector(state => state.auth.user)
    useEffect(() => {
        if (user) history.replace("/")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    return (
        <div className="auth-container">
            <Switch>
                <Route path="/auth/signin/" exact component={SignIn} />
                <Route path="/auth/signup/" exact component={SignUp} />
                <Route path="/auth/verify/" exact component={Verify} />
                <Route path="/auth/forget_password/" exact component={ForgetPassword} />
                <Route path="/auth/reset_password/:uid/:token" exact component={ResetPassword} />
                <Redirect to="/auth/signin/" />
            </Switch>
        </div>
    );

}

export default Authentication; 