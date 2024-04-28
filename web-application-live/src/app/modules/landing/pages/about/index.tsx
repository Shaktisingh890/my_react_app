import { publicPaths } from "consts/paths";
import React, { ReactElement } from "react";
import { Link } from "react-router-dom";

export default function About(): ReactElement {
  return (
    <>
      This is About Page
      <div>
        <Link to={publicPaths.home}>Go to Home</Link>
      </div>
      <div>
        <Link to={publicPaths.investor}>Go to Investor</Link>
      </div>
      <div>
        <Link to={publicPaths.platform}>Go to Platform</Link>
      </div>
    </>
  );
}
