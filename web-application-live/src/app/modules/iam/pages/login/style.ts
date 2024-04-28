import styled from "styled-components";
import { colorList } from "consts/color";
import { Text } from "app/components/atoms/text";
import { Link } from "react-router-dom";

const blueGradient = colorList.blue2;

export const StyledContainer = styled.div`
  display: flex;
  height: 100%;
`;

export const StyledChildLeft = styled.div`
  width: 40%;
  background-color: ${blueGradient};
`;

export const StyledChildRight = styled.div`
  width: 60%;
  overflow-y: scroll;
  height: 90%;
`;

export const StyledChildRightTop = styled.div`
  padding-left: 6rem;
`;

export const StyledForm = styled.form`
  margin-top: 3rem;
  width: 86%;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledText = styled(Text)`
  margin: 1rem 0 3rem;
`;

export const InputContainer = styled.div`
  margin: 2rem 0 2rem 0;
`;
export const StyledChildRightBottom = styled.div`
  position: absolute;
  bottom: 0;
  width: 60%;
  height: 10%;
  padding: 1.125rem 1.5rem;
  border-top: 1px solid ${colorList.grey4};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: white;
`;

export const StyledLink = styled(Link)`
  margin: 1rem 0 3rem;
  text-decoration: none;
`;

export const StyledSpan1 = styled.span`
  margin-left: 10px;
`;
export const StyledSpan2 = styled.span`
  margin-left: 10px;
  color: ${colorList.blue1};
`;
export const StyledFont = styled(Text)`
  float: left;
  margin-right: 1rem;
`;
export const StyledRadioButtons = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const StyledWidth = styled.div`
  width: 57%;
  margin-top: 1.2rem;
  margin-bottom: 1.2rem;
`;
