import React, { ReactElement } from "react";
import RoutesMap from "./routesMap";
import DashboardRoutes from "app/modules/dashboard/router";
import ProfileRoutes from "app/modules/profile/router";
import ProjectBriefingRoutes from "app/modules/projectBriefing/router";

export default function PrivateRouter(): ReactElement {
  const allPrivateRoutes = [
    ...DashboardRoutes(),
    ...ProfileRoutes(),
    ...ProjectBriefingRoutes(),
  ];
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <RoutesMap isPrivate={true} routes={allPrivateRoutes} />
    </div>
  );
}
