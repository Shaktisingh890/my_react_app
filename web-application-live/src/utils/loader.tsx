import React from "react";
import { RotatingLines } from "react-loader-spinner";
import { colorList } from "consts/color";

export default function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <RotatingLines
        width="100"
        strokeColor={colorList.black1}
        strokeWidth="1"
        animationDuration="3"
      />
    </div>
  );
}
