import styled from "styled-components";
import { OrientationType } from ".";
import { images } from "assets/images";
import { colorList } from "consts/color";

interface IRadioStyleProps {
  showBorder: boolean;
  selectedOption: boolean;
  radioType: OrientationType;
  backgroundColor: string;
}

interface IContainerStyle {
  radioType: OrientationType;
}

interface IButtonStyle {
  selectedOption: boolean;
}

const handleBorderSelection = (
  showBorder: boolean,
  selectedOption: boolean,
  backgroundColor: string
) => {
  if (showBorder) {
    if (selectedOption)
      return `background: linear-gradient(${backgroundColor},${backgroundColor}) padding-box,
    linear-gradient(to bottom, ${colorList.pink1}, ${colorList.blue1}) border-box; 
    border: 2px solid ${colorList.variant1};`;
    else return `border: 2px solid ${colorList.variant1};`;
  } else return "none";
};

export const StyledRadioLabel = styled.label`
  margin-left: 0.75rem;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;

export const StyledButtonContainer = styled.div<IRadioStyleProps>`
  ${({ showBorder, selectedOption, backgroundColor }) =>
    handleBorderSelection(showBorder, selectedOption, backgroundColor)};
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border-radius: 100px;
  padding: ${({ showBorder }) => (showBorder ? "0.75rem 1rem" : "0.25rem")};
  min-width: 12.5rem;
  width: 100%;
  cursor: pointer;
  margin-right: ${({ showBorder }) => (showBorder ? "0.5rem" : "0")};
  margin-bottom: ${({ radioType }) =>
    radioType === OrientationType.Horizontal ? "0" : "0.5rem"};
`;

export const StyledRadioContainer = styled.div<IContainerStyle>`
  display: flex;
  justify-content: space-between;
  flex-direction: ${({ radioType }) =>
    radioType === OrientationType.Horizontal ? "row" : "column"};
`;

export const StyledRadioButton = styled.div<IButtonStyle>`
  width: 1.25rem;
  height: 1.25rem;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: ${({ selectedOption }) =>
    selectedOption
      ? `url(${images.radiochecked})`
      : `url(${images.radioUnchecked})`};
`;
