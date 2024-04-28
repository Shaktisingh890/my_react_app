import React, { ReactElement } from "react";
import RoutesMap from "router/routesMap";
import { routesNames } from "router/routeNames";

interface IProps {
  children: Array<{}>;
}

export default function Profile(props: IProps): ReactElement {
  return (
    <>
      <RoutesMap
        routes={[...props.children]}
        rootPath={routesNames.PROFILE.root}
      />
    </>
  );
}
