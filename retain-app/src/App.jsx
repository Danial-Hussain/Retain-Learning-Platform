import HomePage from "./pages/Home";
import DashboardPage from "./pages/Dashboard";
import NotFoundPage from "./pages/404";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/recommendations" component={DashboardPage} />
        <Route component={NotFoundPage} />
        <Redirect to="/404" />
      </Switch>
    </Router>
  );
}

export default App;