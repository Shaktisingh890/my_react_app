import React from "react";
import RoutesMap from "./routesMap";
import LandingRoutes from "app/modules/landing/router";
import IAMRoutes from "app/modules/iam/router";
import DashboardRoutes from "app/modules/dashboard/router";
import ProfileRoutes from "app/modules/profile/router";
import ProjectBriefingRoutes from "app/modules/projectBriefing/router";

function isPathMatched(path1, path2) {
  if (path1 === path2) {
    return true;
  }
  let path1Components = path1.split('/');
  let path2Components = path2.split('/');
  if (path1Components.length !== path2Components.length) {
    return false;
  }

  const bools: boolean[] = path1Components.map((pc, i) => {
    if (pc[0] === ':') {
      return true;
    }
    return path1Components[i] === path2Components[i]
  });

  return bools.every(p => p === true)

}

function isAnyPathMatched(pathArr: string[], path) {
  return pathArr.some(p => isPathMatched(p, path));
}

export default function PublicRouter(): React.ReactElement {
  const allPublicRoutes = [
    ...LandingRoutes(),
    ...IAMRoutes(),
    ...DashboardRoutes(),
    ...ProfileRoutes(),
    ...ProjectBriefingRoutes(),
  ];

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <RoutesMap routes={allPublicRoutes} />
    </div>
  );
}
