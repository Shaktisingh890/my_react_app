import { colorList } from "consts/color";
import styled from "styled-components";

interface IText {
  backGroundColor?: string;
}

export const StyledTag = styled.div<IText>`
  padding: 0.5rem 0.7rem;
  border-radius: 5px;
  margin-right: 4px;
  background-color: ${(props) => {
   
    return props.backGroundColor ? props.backGroundColor : `${colorList.grey4}`;
  }};
`;

export const AlignedTag = styled.div`
  display: flex;
  flex-direction: row;
`;
