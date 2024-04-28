import styled from "styled-components";
import { colorList } from "consts/color";

export const Container = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 1rem;
  background: ${colorList.white1};
  border: 1px solid ${colorList.variant2};
  margin: 0 0.5rem;
  margin-top: 1rem;

  .cursor {
    cursor: pointer;
  }
`;
