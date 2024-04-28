import React, { ReactElement } from "react";
import RoutesMap from "router/routesMap";
import { routesNames } from "router/routeNames";

interface IProps {
  children: Array<{}>;
}

export default function IAM(props: IProps): ReactElement {
  return (
    <>
      <RoutesMap routes={[...props.children]} rootPath={routesNames.IAM.root} />
    </>
  );
}
