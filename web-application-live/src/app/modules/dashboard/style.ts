import styled from "styled-components";
import { colorList } from "consts/color";

export const StyledContainer = styled.div`
  display: flex;
  height: calc(100% - 4rem);
  width: 100%;
  overflow: auto;
`;

export const StyledChildLeft = styled.div`
  flex: 16%;
`;

export const StyledChildRight = styled.div`
  flex: 84%;
  overflow: auto;
  background-color: ${colorList.white6};
`;
