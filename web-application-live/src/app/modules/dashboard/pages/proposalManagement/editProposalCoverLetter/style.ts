import styled from "styled-components";
import { colorList } from "consts/color";

export const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const StyledContainer = styled.div`
  padding: 1rem 2rem;
  overflow: auto;
  max-height: 98vh;
`;

export const Divider = styled.div`
  margin-top: 0.7rem;
`;

export const FileContent = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  align-items: center;
  display: flex;
  justify-content: space-between;

`;

export const BrowseFileButton = styled.button`
  background-color: ${colorList.white1};
  outline: none;
  border: 1.5px solid ${colorList.blue1};
  cursor: pointer;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  margin-right: 2rem;
  margin-top: 0.3rem;
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

