import React from "react";
import { StyledButton } from "./style";
import { FontSize, FontWeight, Text } from "../text";
import { RotatingLines } from "react-loader-spinner";
import { colorList } from "consts/color";

export interface IButtonProps {
  text?: string;
  textColor?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  color?: string;
  borderColor?: string;
  type?: string;
  disabled?: boolean;
  children?: any;
  paddingHorizontal?: any;
  paddingVertical?: any;
  loading?: boolean;
  width?: any;
  fontSize?: any;
  borderRadius?: any;
  loaderColor?: string;
  rendorRightIcon?: Function;
  padding?: string;
}

export const Button = (props: IButtonProps) => {
  const {
    onClick,
    text,
    textColor,
    color,
    borderColor,
    type = "button",
    disabled = false,
    children,
    loading = false,
    paddingHorizontal,
    paddingVertical,
    fontSize,
    borderRadius,
    loaderColor = colorList.white1,
    rendorRightIcon,
    padding
  } = props;

  return (
    <StyledButton
      borderColor={borderColor}
      onClick={onClick}
      color={color}
      disable={disabled || loading}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      borderRadius={borderRadius}
      padding={padding}
    >
      <Text
        size={fontSize || FontSize.ExtraSmall}
        weight={FontWeight.Bold}
        color={textColor}
      >
        {text}
        {loading && (
          <RotatingLines
            width="20"
            strokeColor={loaderColor}
            strokeWidth="3"
            animationDuration="3"
          />
        )}

        {children}

        {
          !!rendorRightIcon && rendorRightIcon()
        }

      </Text>
    </StyledButton>
  );
};
