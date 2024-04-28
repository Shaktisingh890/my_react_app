import React, { ReactElement } from "react";
import Home from "./pages/home";

interface IProps {
  children: Array<{}>;
}

export default function Landing(props: IProps): ReactElement {
  return <Home />;
}
