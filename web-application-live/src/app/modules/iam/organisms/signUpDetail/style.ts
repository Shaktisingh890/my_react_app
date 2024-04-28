import { colorList } from "consts/color";
import styled from "styled-components";
import { Text } from "app/components/atoms/text";

interface IChildProps {
  isFirstChild: boolean;
}

export const StyledContainer = styled.div<IChildProps>`
  display: flex;
  flex-direction: column;
  z-index: 4;
  margin-top: 5rem;
  position: relative;
  width: 100%;
  height: 100vh;
  background: ${({ isFirstChild }) =>
    isFirstChild
      ? `linear-gradient(180deg, ${colorList.blue2} 0%, ${colorList.blue5} 100%)`
      : `linear-gradient(180deg, ${colorList.white3} 0%, ${colorList.blue4} 100%)`};
`;

export const StyledContent = styled.div<IChildProps>`
  display: flex;
  flex-direction: column;
  text-align: ${({ isFirstChild }) => (isFirstChild ? `right` : `left`)};
  margin: 4rem 4em;
`;

export const StyledDivider = styled.div`
  background: ${colorList.blue3};
  height: 1px;
  width: 3.125rem;
  margin: 3rem 0;
`;

export const StyledHeight = styled.div`
  min-height: 20rem;
`;

export const StyledHeader = styled.div<IChildProps>`
  display: flex;
  justify-content: ${({ isFirstChild }) =>
    isFirstChild ? "flex-end" : "none"};
`;

export const ButtonContainer = styled.div<IChildProps>`
  display: flex;
  margin-top: 1rem;
  justify-content: ${({ isFirstChild }) =>
    isFirstChild ? "flex-end" : "flex-start"};
  & > button {
    margin-left: 1.5rem;
    &:first-child {
      margin-left: 0;
    }
  }
`;

export const StyledText = styled(Text)`
  max-width: 70%;
`;
