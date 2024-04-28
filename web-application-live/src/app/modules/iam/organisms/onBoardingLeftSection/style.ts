import styled from "styled-components";

import { colorList } from "consts/color";
import {images} from "assets/images"

interface IBackgroundColor{
    color?:string
  }
const blue2 =colorList.blue2

export const StyledContainer = styled.div`
display:flex;
height: 100%;
`;

export const StyledChildLeft = styled.div<IBackgroundColor>`
width: 40%;
position: relative;
 height: 100vh; 
`;


export const StyledLogoImage =styled.div`
width: 14.25rem;
height: 2rem;
margin: 2.7rem 3rem;
position:fixed;
top:40;
left:40;
z-index:4;

`;

export const StyledImageWrapper =styled.div`
position: absolute;
z-index: 3;
right: 0;
top: calc(100% - ((100% / 2) + 19rem));
background-position: right;
width: 38rem;
height: 38rem;
background-repeat: no-repeat;
mix-blend-mode: screen;
background-image: url(${images.semiSphere});

`;
export const StyledRectangle1 =styled.div`
height: 100%;
 position: absolute;
  width:100%;
 bottom: 0;
background: linear-gradient(168.28deg;
   rgba(81, 98, 119, 0.6) -9.28%, rgba(71, 105, 249, 0) 64.5%);
transform: matrix(1, 0, 0, -1, 0, 0)

`;
export const StyledRectangle2 =styled.div`
z-index: 2;
height: 100%; 
position: absolute; 
width:100%;
bottom: 0 ;
background: linear-gradient(156.03deg, rgba(255, 174, 203, 0.6) 0%, rgba(127, 121, 249, 0) 61.53%);

`;
export const StyledRectangle3 =styled.div`
z-index: 1;
height: 100%; 
position: absolute; 
width:100%;
bottom: 0 ;
background: linear-gradient(165deg, #7F79F9 0%, #4769F9 100%);

`;


