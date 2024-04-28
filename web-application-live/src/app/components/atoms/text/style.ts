import styled from "styled-components";
import { FontFamily, FontSize, FontWeight, ITextProps } from ".";
import { colorList } from "../../../../consts/color";

const handleFontSize = (size: FontSize) => {
  switch (size) {
    case FontSize.ExtraLarge:
      return "font-size: 60px; line-height: 60px;";
    case FontSize.Large:
      return "font-size: 48px; line-height: 52.8px;";
    case FontSize.ExtraRegular:
      return "font-size: 24px; line-height: 29px;";
    case FontSize.Small:
      return "font-size: 16px; line-height: 19.6px;";
    case FontSize.ExtraSmall:
      return "font-size: 14px; line-height: 17px;";
    case FontSize.Mini:
      return "font-size: 12px; line-height: 15px;";
    case FontSize.Regular:
    default:
      return "font-size: 18px; line-height: 21.6px;";
  }
};

const handleFontWeight = (weight: FontWeight) => {
  switch (weight) {
    case FontWeight.Light:
      return "300";
    case FontWeight.Medium:
      return "500";
    case FontWeight.SemiBold:
      return "600";
    case FontWeight.Bold:
      return "700";
    case FontWeight.Black:
      return "900";
    case FontWeight.Regular:
    default:
      return "400";
  }
};

export const StyledText = styled.div<ITextProps>`
  font-weight: ${({ weight }) =>
    handleFontWeight(weight || FontWeight.Regular)};
  font-family: ${({ family }) => family || FontFamily.Roboto};
  color: ${(props) => props.color || colorList.black1};
  ${({ size }) => handleFontSize(size || FontSize.Regular)};
  ${({ styles }) => styles}
`;
