import styled from "styled-components";
import { colorList } from "consts/color";

interface IInputProps {
  valid: boolean;
}

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StyledWrapper = styled(StyledContainer)`
  justify-content: space-between;
`;

export const StyledTextArea = styled.textarea<IInputProps>`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  box-sizing: border-box;
  border-radius: 5px;
  margin: 0.5rem 0;
  outline: none;
  resize: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem 1rem 1.5rem;
  width: 100%;
  color: ${colorList.grey2};
  background: ${colorList.white1};
  border: ${({ valid }) =>
    valid ? `1px solid ${colorList.variant2}` : `1px solid ${colorList.red1}`}};
`;
