import { useSelector } from "react-redux"
import { Redirect, Route, Switch } from "react-router-dom"
import styled from "styled-components"
import Card from "../../components/card"
import { Page } from "../../components/layout"
import Login from "./login"
import Register from "./register"
import Signup from "./signup"

const Styles = styled.div`
    min-height: 100vh;
    padding: 25px 0;
    background-color: #eee;
    display: flex;
    align-items: center;
    .auth__container {
        flex: 1;
        max-width: 700px;
        margin: 0 auto;
    }
`
const Auth = () => {

    const token = useSelector(state => state.auth.token);

    if (token) {
        return <Redirect to="/" />
    }

    return (
        <Styles>
            <div className="auth__container">
                <Switch>
                    <Route path="/auth/login/" exact component={Login} />
                    <Route path="/auth/Signup/" exact component={Signup} />
                    <Route path="/auth/register/" exact component={Register} />
                </Switch>
            </div>
        </Styles>
    )
}

export default Auth;