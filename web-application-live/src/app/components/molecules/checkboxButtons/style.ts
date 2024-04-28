import styled from "styled-components";

import { images } from "assets/images";
import { OrientationType } from "../radioButtons";

interface IContainerStyle {
  checkType: OrientationType;
}

interface IButtonStyle {
  selectedOption: boolean;
}

export const StyledCheckLabel = styled.label`
  margin-left: 0.75rem;
`;

export const StyledButtonContainer = styled.div<IContainerStyle>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.25rem;
  margin-bottom: ${({ checkType }) =>
    checkType === OrientationType.Horizontal ? "0" : "0.5rem"};
`;

export const StyledCheckContainer = styled.div<IContainerStyle>`
  display: flex;
  flex-direction: ${({ checkType }) =>
    checkType === OrientationType.Horizontal ? "row" : "column"};
`;

export const StyledCheckButton = styled.div<IButtonStyle>`
  width: 2rem;
  height: 2rem;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
  background-image: ${({ selectedOption }) => {
    return selectedOption
      ? `url(${images.checked})`
      : `url(${images.unchecked})`;
  }};
`;

export const Divider = styled.div`
  margin-top: 0.5rem;
`;
