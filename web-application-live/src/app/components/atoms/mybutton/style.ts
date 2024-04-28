import { colorList } from "consts/color";
import styled from "styled-components";
interface IButtonProps {
  text?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  color?: string;
  borderColor?: string;
  value?: string;
  type?: string;
  disable?: boolean;
  paddingHorizontal?: any;
  paddingVertical?: any;
  fontSize?: any;
  borderRadius?: any;
  padding?: string;
}

const handleDisable = (disable: boolean = false) => {
  if (disable) {
    return "opacity: 0.8; cursor: default; pointer-events: none;";
  } else {
    return `opacity: 1; cursor: pointer`;
  }
};

export const StyledButton = styled.button<IButtonProps>`
  padding: ${(props) => (props.padding ? props.padding : "0.75rem 1rem")};
  padding-left: ${(props) => props.paddingHorizontal || "1rem"};
  padding-right: ${(props) => props.paddingHorizontal || "1rem"};
  padding-top: ${(props) => props.paddingVertical || "none"};
  padding-bottom: ${(props) => props.paddingVertical || "none"};

  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : "0.2rem"};
  background-color: ${(props) =>
    props.color ? props.color : `${colorList.blue1}`};
  ${({ borderColor }) =>
    (borderColor &&
      `
  border: 2px solid ${borderColor};
`) ||
    "none"}
  ${({ disable }) => handleDisable(disable)}
`;
