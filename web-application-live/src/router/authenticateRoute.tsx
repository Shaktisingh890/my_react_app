import { publicPaths } from "consts/paths";
import React from "react";
import { Route, Redirect } from "react-router-dom";

const AuthenticateRoute = ({ component: Comp, children, aliases, ...rest }: any) => {
  if (children && children.length) {
  }
  return (
    <Route
      {...rest}
      render={(props) => {
        const accessToken: any = localStorage.getItem("accessToken");
        if (accessToken) {
          return <Comp children={children} {...props} />;
        } else {
          localStorage.clear();
          return (
            <Redirect
              to={{
                pathname: `${publicPaths.login}`,
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    >
    </Route>
  );
};
export default AuthenticateRoute;
