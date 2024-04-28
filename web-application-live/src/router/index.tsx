import React, { ReactElement } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import PublicRouter from "./publicRouter";

const Routes = (): ReactElement => {
  return (
    <Router>
        <PublicRouter />
    </Router>
  );
};
export default Routes;
