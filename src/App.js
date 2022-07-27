/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter as Router, Switch, Route, Redirect, } from "react-router-dom";
import Authentication from "./scenes/authentication";
import Panel from "./scenes/panel";
import * as API from "./api";
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, CircularProgress, } from '@mui/material';



import './App.css';


function App() {

  const [loadMain, setLoadMain] = useState(false)

  const dispatch = useDispatch()


  const appLoader = (payload) => dispatch({ type: 'BACKDROP', payload: { backdrop: payload } })
  const backdrop = useSelector(state => state.app.backdrop)

  const access_token = localStorage.getItem('access_token')
  const refresh_token = localStorage.getItem('refresh_token')

  const verifyToken = async () => {
    if (access_token && refresh_token) {
      try {
        await API.POST(false)('auth/token/verify/', { token: access_token })
        await getUserInfo()
        setInterval(async () => { await refreshToken() }, 60000)
      } catch (error) {
        await refreshToken()
        await getUserInfo()
        setInterval(async () => { await refreshToken() }, 60000)
      }
    }
    else {
      setLoadMain(true)
      appLoader(false)
    }
  }


  const refreshToken = async () => {
    try {
      const response = await API.POST(false)('auth/token/refresh/', { refresh: refresh_token })
      localStorage.setItem("access_token", response.data.access);
    } catch (error) {
      if (error !== undefined) {
        localStorage.clear()
        window.location.reload()
      }
    }
  }

  const getUserInfo = async () => {
    try {
      const response = await API.GET(true)('auth/user/')
      dispatch({ type: 'USER_INFO', payload: { user: response.data } })
      localStorage.setItem('user_data', JSON.stringify(response.data));
    } catch (error) {
      if (error === undefined) {
        const userLocal = localStorage.getItem('user_data')
        if (userLocal) {
          dispatch({ type: 'USER_INFO', payload: { user: JSON.parse(userLocal) } })
        }
      }
      else {
        localStorage.clear()
        window.location.reload()
      }
    }

    setLoadMain(true)
    appLoader(false)
  }



  useEffect(() => {
    verifyToken()
  }, [])





  return <>
    <Backdrop
      open={backdrop}
      transitionDuration={{ appear: 0, enter: 0, exit: 1000 }}
      style={{ zIndex: 9999, backgroundColor: "#dddddd" }}
      children={<CircularProgress />}
    />





    {loadMain &&
      <Router>
        <Switch>
          <Route path="/auth/" component={Authentication} />
          <Route path="/" component={Panel} />
          <Redirect to="/" />
        </Switch>
      </Router >
    }


  </>;
}
export default App;