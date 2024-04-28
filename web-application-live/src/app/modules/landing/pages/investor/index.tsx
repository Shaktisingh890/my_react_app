import { publicPaths } from "consts/paths";
import React, { ReactElement } from "react";
import { Link } from "react-router-dom";

export default function Investor(): ReactElement {
  return (
    <>
      This is Investor Page
      <div>
        <Link to={publicPaths.home}>Go to Home</Link>
      </div>
      <div>
        <Link to={publicPaths.about}>Go to About</Link>
      </div>
      <div>
        <Link to={publicPaths.platform}>Go to Platform</Link>
      </div>
    </>
  );
}
