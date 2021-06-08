import React from "react";
import { Route, Redirect } from "react-router-dom";

const GuardedRoute = ({ component: Component, handleLogout, auth, ...rest }) => {

  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? <Component {...props} handleLogout={handleLogout}/> : <Redirect to="/" />
      }
    />
  );
};

export default GuardedRoute;
