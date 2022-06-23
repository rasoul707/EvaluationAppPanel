import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import AppBar from "../../components/_AppBar"
import { Box } from "@mui/material"

import { useEffect } from 'react'
import { useSelector } from "react-redux";

import NewSoftware from "./NewSoftware"
import Softwares from "./Softwares"
import Evaluations from "./Evaluations"

import Profile from "./Profile"
import Settings from "./Settings"


const Panel = () => {

    const history = useHistory()
    const user = useSelector(state => state.auth.user)
    useEffect(() => {
        if (!user) history.replace("/auth/signin")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    if (!user) return null;
    return <Box>
        <AppBar />
        <Box component="main" sx={{ p: 3 }} >
            <Switch>
                {/* new or soft id */}
                <Route path="/softwares/:softID" exact component={NewSoftware} />
                {/* <Route path="/softwares/:softID/result" exact component={Result} /> */}
                <Route path="/softwares" exact component={Softwares} />

                <Route path="/evaluations" exact component={Evaluations} />

                <Route path="/settings" exact component={Settings} />
                <Route path="/profile" exact component={Profile} />

                <Redirect to="/" />
            </Switch>
        </Box>


    </Box>


}
export default Panel;