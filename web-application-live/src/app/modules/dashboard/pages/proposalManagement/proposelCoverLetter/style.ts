import styled from "styled-components";
import { colorList } from "consts/color";
import { Button } from "app/components/atoms/mybutton";
import { Text } from "app/components/atoms/text";

export const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const StyledContainer = styled.div`
  padding: 1rem 2rem;
`;

export const Divider = styled.div`
  margin-top: 0.7rem;
`;

export const FileContent = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${colorList.variant12};
  padding: 0.5rem 0rem;
`;

export const StyledDivider = styled.div`
  background: ${colorList.variant7};
  height: 1px;
  width: 100%;
  margin: 1rem 0;
`;

export const FooterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
`;
export const FooterButtons = styled.div`
  padding: 1rem 0rem;
  display: flex;
  justify-content: flex-end;
  & > *:not(:last-child) {
      margin-right: 1rem;
    }
`;
