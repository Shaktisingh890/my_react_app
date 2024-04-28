import NotFoundPage from "app/components/organisms/notFoundPage";
import React from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import AuthenticateRoute from "./authenticateRoute";

interface IProps {
  routes: any;
  rootPath?: string;
  isPrivate?: boolean;
}

export interface IRoute {
  path: string;
  component: any;
  isExact: boolean;
  isPublic: boolean;
  children: Array<IRoute>;
  aliases?: Array<string>
}

export default function RoutesMap({
  routes,
  rootPath = "",
  isPrivate = false,
  ...props
}: IProps): React.ReactElement {

  return (
    <>
      <Switch>
        {routes &&
          routes.map((route: IRoute, index: number) => {
            const {
              path,
              component: Component,
              isExact,
              children = [],
              isPublic,
              aliases,
              ...rest
            } = route;


            if(!isPublic){
              return <AuthenticateRoute
              key={`${rootPath}-${path}-${index}`}
              component={Component}
              exact={isExact}
              children={children}
              aliases={aliases}
              path={rootPath !== "" ? `${rootPath}${path}` : path}
              />
            }

            return (
              <Route
                key={`${rootPath}-${path}-${index}`}
                exact={isExact}
                path={rootPath !== "" ? `${rootPath}${path}` : path}
                {...rest}
              >
                <Component children={children} {...props} />
              </Route>
            );
          })}
          <Route exact={true} path="/dashboard">
            <Redirect to="/dashboard/profile" />
          </Route>
          <Route  exact={true} path="/">
            <Redirect to="/dashboard/profile" />
          </Route>
           <Route path="*">
             <NotFoundPage></NotFoundPage>
           </Route>

      </Switch>
    </>
  );
}
