import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import UsersList from "./components/UsersList";
import AddEditUser from "./components/AddEditUser";
import LoginRegisterForm from "./components/LoginRegisterForm";
import GuardedRoute from "./components/GuardedRoute";

function App() {
  const [token, setToken] = useState("");

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {!sessionStorage.getItem("accessToken") ? (
            <Redirect to="/login" />
          ) : (
            <Redirect to="/users" />
          )}
        </Route>

        <Route exact path="/login">
          {!sessionStorage.getItem("accessToken") ? (
            <LoginRegisterForm setToken={setToken}></LoginRegisterForm>
          ) : (
            <Redirect to="/users" />
          )}
        </Route>

        <GuardedRoute
          path="/users"
          component={UsersList}
          auth={sessionStorage.getItem("accessToken")}
          handleLogout={setToken}
        />

        <GuardedRoute
          path="/edit/:id"
          component={AddEditUser}
          auth={sessionStorage.getItem("accessToken")}
        />
        <GuardedRoute
          path="/addUser"
          component={AddEditUser}
          auth={sessionStorage.getItem("accessToken")}
        />
      </Switch>
    </Router>
  );
}

export default App;
