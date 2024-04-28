import styled from "styled-components"
import { colorList } from "consts/color";
import { images } from "assets/images";
import { Link } from "react-router-dom";

const blueGradient =colorList.blue2

export const StyledContainer = styled.div`
display:flex;
height:100%;
`;

export const StyledContent  =  styled.div`
width:50%;

`;
export const InputContainer =styled.div`
margin: 2rem 0 2rem 0;
`;

export const StyledChildRight = styled.div`
width: 60%; 
padding: 6rem;
`;


export const ButtonWrapper =  styled.div`
display: flex;
justify-content: space-between;
align-items:center;

`;

export const StyledImage =styled.div`
margin-bottom:3rem;
`;

export const StyledMessage = styled.p`
 padding-top: 2rem; 
 padding-bottom: 1rem; 
`;

export const StyledLink =  styled(Link)`

 text-decoration: none;
 
  &:hover {
    text-decoration: underline;
    color: ${colorList.blue2}
  }
  `;