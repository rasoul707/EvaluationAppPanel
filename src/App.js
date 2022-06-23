import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Authentication from "./scenes/authentication";
import Panel from "./scenes/panel";
import * as api from "./api";
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, CircularProgress } from '@mui/material';


import './App.css';


function App() {

  const [loadMain, setLoadMain] = useState(false)



  const dispatch = useDispatch();
  const appLoader = (payload) => dispatch({ type: 'BACKDROP', payload })
  const backdrop = useSelector(state => state.app.backdrop)




  const checkTokenValid = async () => {
    if (localStorage.getItem('token')) {
      try {
        const response = await api.getMe();
        dispatch({
          type: 'USER_INFO',
          payload: response.data
        })
      } catch (error) { }
    }
    setLoadMain(true)
    appLoader(false)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { checkTokenValid() }, [])


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
      </Router>
    }


  </>;
}
export default App;