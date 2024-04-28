import styled from "styled-components";
import { colorList } from "consts/color";
import { Link } from "react-router-dom";
import { Text } from "app/components/atoms/text";

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
  padding: 6rem;
`;

export const StyledForm = styled.form`
  width: 70%;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
export const StyledLogoImage = styled.div`
  width: 14.25rem;
  height: 2rem;
  margin: 2.7rem 3rem;
`;

export const StyledImageWrapper = styled.div`
display: 'flex', 
justify-content: 'flex-end', 
align-items: 'center', 
height: '100vh'
`;

export const InputContainer = styled.div`
  margin: 2rem 0 2rem 0;
`;
export const StyledLink = styled(Link)`
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    color: ${colorList.blue2};
  }
`;

export const StyledText = styled(Text)`
  padding-top: 3rem;
  padding-bottom: 2rem;
`;
