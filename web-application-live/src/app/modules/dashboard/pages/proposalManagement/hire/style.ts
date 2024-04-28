import styled from "styled-components";
import { colorList } from "consts/color";
import { Text } from "app/components/atoms/text";

export const StyledContainer1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledHeading = styled(Text)`
  display: flex;
  align-items: center;
  margin: 2rem 12rem 0 12rem;
`;

export const StyledIcon1 = styled.div`
  width: 28%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: center;
`;


export const StyledText1 = styled.div`
  text-align: center;
  font-family: Inter;
`;

export const StyledDivider = styled.div`
  background: ${colorList.blue10};
  height: 1px;
  width: 5rem;
  margin: 2rem 0;
`;
export const Divider = styled.div`
  margin: 1rem 0;
`;
export const ViewButton = styled.button`
  outline: none;

  cursor: pointer;

  border-radius: 5px;
  border: none;
  background-color: ${colorList.green1};
  padding: 0.8rem 6.2rem;
`;

export const StyledCancel = styled(Text)`
  cursor: pointer;
`;
