import * as React from "react";
import { GlobalStyle } from "styles/global-styles";
import Routes from "../router";
import { ReactNotifications } from "react-notifications-component";
import { Provider } from "jotai";

export function App() {
  return (
    <Provider>
      <ReactNotifications />
      <React.Suspense fallback="Loading...">
        <Routes />
        <GlobalStyle />
      </React.Suspense>
    </Provider>
  );
}

