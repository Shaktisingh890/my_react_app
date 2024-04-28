import { images } from "assets/images";
import { colorList } from "consts/color";
import styled from "styled-components";

interface IContainerprops {
  valid: boolean;
}

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.5rem 0;

  & > div {
    margin-right: 0.2rem;
  }
`;

export const StyledSelect = styled.select<IContainerprops>`
  border: ${({ valid }) =>
    valid ? `1px solid ${colorList.variant2}` : `1px solid ${colorList.red1}`};
  box-sizing: border-box;
  border-radius: 0.3rem;
  outline: none;
  width: 100%;
  padding: 1rem;
  background-image: url(${images.downArrow});
  background-position: right 1rem center;
  background-repeat: no-repeat;
  -webkit-appearance: none;
  pointer-events: ${({ disabled }) => disabled && "none"};
`;
