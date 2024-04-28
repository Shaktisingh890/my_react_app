import { publicPaths } from "consts/paths";
import React, { ReactElement } from "react";
import { Link } from "react-router-dom";

export default function Platform(): ReactElement {
  return (
    <>
      This is Platform Page
      <div>
        <Link to={publicPaths.home}>Go to Home</Link>
      </div>
      <div>
        <Link to={publicPaths.investor}>Go to Investor</Link>
      </div>
      <div>
        <Link to={publicPaths.about}>Go to About</Link>
      </div>
    </>
  );
}
