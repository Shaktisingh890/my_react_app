import React, { ReactElement } from "react";
import RoutesMap from "router/routesMap";
import { routesNames } from "router/routeNames";
import AppHeader from "app/components/organisms/appHeader";
import AppSidebar from "app/components/organisms/appSidebar";
import { StyledContainer, StyledChildRight, StyledChildLeft } from "./style";

interface IProps {
  children: Array<{}>;
}

export default function Dashboard(props: IProps): ReactElement {
  return (
    <>
      <AppHeader />
      <StyledContainer>
        <StyledChildLeft>
          <AppSidebar />
        </StyledChildLeft>
        <StyledChildRight>
          <RoutesMap
            routes={[...props.children]}
            rootPath={routesNames.DASHBOARD.root}
          />
        </StyledChildRight>
      </StyledContainer>
    </>
  );
}
