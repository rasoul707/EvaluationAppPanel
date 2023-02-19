/* eslint-disable react-hooks/exhaustive-deps */
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import AppBar from "../../components/AppBar"
import { Box } from "@mui/material"

import { useEffect, useState } from 'react'
import { useSelector } from "react-redux";

import NewSoftware from "./NewSoftware"
import DefineEvaluation from "./DefineEvaluation"
import Softwares from "./MySoftwares"
import Evaluate from "./Evaluate"

import Profile from "./Profile"
import Settings from "./Settings"
import Home from "./Home"
import Evaluations from "./Evaluations"
import Result from "./Result"
import Shop from "./Shop"
import Users from "./Users"


import VerifyDialog from "../../components/VerifyDialog"



const Panel = () => {

    const [openVerifyDig, setOpenVerifyDig] = useState(false)

    const history = useHistory()
    const user = useSelector(state => state.auth.user)
    useEffect(() => {
        if (!user) history.replace("/auth/signin")
        else checkUser()
    }, [])


    const checkUser = async () => {
        if (!user.is_verified_phone) {
            setOpenVerifyDig(true)
        }
    }


    if (!user) return null;
    return <Box>
        <AppBar />
        <Box component="main" sx={{ p: 3 }} >
            <Switch>
                {
                    user.user_level === 'level1' &&
                    []
                }
                {
                    user.user_level === 'level2' &&
                    [
                        <Route path="/evaluate/:softID" exact component={Evaluate} />,
                        <Route path="/evaluations" exact component={Evaluations} />,
                    ]
                }
                {
                    user.user_level === 'level3' &&
                    [
                        <Route path="/evaluate/:softID" exact component={Evaluate} />,
                        <Route path="/evaluations" exact component={Evaluations} />,
                        <Route path="/softwares/:softID" exact component={NewSoftware} />,
                        <Route path="/softwares" exact component={Softwares} />,
                        <Route path="/softwares/:softID/evaluation" exact component={DefineEvaluation} />,
                        <Route path="/softwares/:softID/result" exact component={Result} />,
                        <Route path="/users" exact component={Users} />,
                    ]
                }
                <Route path="/settings" exact component={Settings} />
                <Route path="/shop" exact component={Shop} />
                <Route path="/profile" exact component={Profile} />
                <Route path="/" exact component={Home} />
                <Redirect to="/" />
            </Switch>
        </Box>

        <VerifyDialog
            open={openVerifyDig}
            handleClose={() => setOpenVerifyDig(false)}
            phone={user.phone_number}
        />


    </Box>


}
export default Panel;