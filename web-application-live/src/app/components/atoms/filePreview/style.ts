import styled from "styled-components";
import { colorList } from "consts/color";
import { Text } from "../text";

interface IColorProps {
  bgColor?: string;
}

export const StyledTag = styled.div<IColorProps>`
  padding: 0.5rem;
  border-radius: 5px;
  margin-right: 4px;
  background-color: ${(props) => props.bgColor || colorList.grey4};
  cursor: pointer;
`;

export const AlignedTag = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  & > div {
    margin: 0.2rem;
  }
`;
export const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledText = styled(Text)`
  margin-right: 0.5rem;
  margin-top: 0.2rem;
`;
