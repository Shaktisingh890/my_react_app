import styled from "styled-components"
import { colorList } from "consts/color";
import { Text } from "app/components/atoms/text";

const blueGradient =colorList.blue2

export const StyledContainer = styled.div`
display:flex;
height:100%;
`;

export const StyledChildLeft = styled.div`
width: 40%;
background-color:${blueGradient}
`;


export const StyledChildRight = styled.div`
position:relative;
height:100%;
width: 60%; 


`;

export const StyledForm  =  styled.form`
width:70%;
padding:6rem;
`;

export const ButtonWrapper =  styled.div`
display: flex;
justify-content: flex-end;
`
export const StyledLogoImage =styled.div`
width: 14.25rem;
height: 2rem;
margin: 2.7rem 3rem;

`;

export const StyledImageWrapper =styled.div`
display: 'flex', 
justify-content: 'flex-end', 
align-items: 'center', 
height: '100vh'
`;


export const InputContainer =styled.div`
margin: 2rem 0;
`;

export const StyledFooter = styled.div`
display: flex;
position:absolute;
bottom:0;
left:0;
right:0;
background-color:white;
border-top: 1px solid ${colorList.blue1};
`;

export const BottomText =  styled(Text)`
margin-bottom: 1rem;
`;