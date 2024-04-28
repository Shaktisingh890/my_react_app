import { ServerConstantKeys, useServerLabels } from "apiCalls/dashboard";
import React from "react";
import { Interpolation } from "styled-components";
import { StyledText } from "./style";

export enum FontFamily {
  Roboto = "Roboto",
  Inter = "Inter",
}

export enum FontWeight {
  Light = "light", // 300
  Regular = "normal", // 400
  Medium = "medium", // 500
  SemiBold = "semi-bold", // 600
  Bold = "bold", // 700
  Black = "black", // 900
}

export enum FontSize {
  ExtraLarge = "extraLarge", // size - 60, LH - 60
  Large = "large", // size - 48, LH - 52.8
  ExtraRegular = "extraRegular", // size - 24, LH - 29
  Regular = "regular", // size - 18, LH - 21.6
  Small = "small", // size - 16, LH - 19.6
  ExtraSmall = "extraSmall", // size - 14, LH - 17
  Mini = "mini", // size - 12, LH - 15
}

export interface ITextProps {
  size?: FontSize;
  weight?: FontWeight;
  family?: FontFamily;
  color?: string;
  children?: any;
  styles?: Interpolation<React.CSSProperties>;
  useServerLabel?: ServerConstantKeys;
  value?: any;
}

export const Text = (props: ITextProps) => {
  const {
    children,
    size,
    weight,
    family,
    color,
    styles,
    useServerLabel = null,
    value = null,
  } = props;

  const serverLabel = useServerLabels(useServerLabel, value);

  return (
    <StyledText 
      {...props}
      size={size}
      weight={weight}
      family={family}
      color={color}
      styles={styles}
    >
      {children || serverLabel || value}
    </StyledText>
  );
};
