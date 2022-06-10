import { Container } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Auth from "./scenes/auth";
import Dashboard from "./scenes/dashboard";
// import "./static/css/bootstrap-grid.min.css";
// import "./static/css/bootstrap-reboot.min.css";
// import "./static/css/bootstrap-utilities.min.css";
import "./static/css/bootstrap.min.css";
import './App.css';
 
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/auth/" component={Auth} />
          <Route path="/" component={Dashboard} />
        </Switch>
      </Router>
     </div>
  );
}
export default App;