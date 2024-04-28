import { colorList } from "consts/color";
import styled from "styled-components";

interface IColor {
  bgColor?: string;
}

export const StyledTag = styled.div<IColor>`
  padding: 0.8rem 0.8rem;
  border-radius: 5px;
  margin: 4px;
  background-color: ${({ bgColor }) =>
    bgColor ? bgColor : `${colorList.grey4}`};
`;
