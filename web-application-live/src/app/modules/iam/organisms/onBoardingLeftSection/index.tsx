import React from 'react'
import LogoImageSrc from "assets/images/logoImage.svg";
import { publicPaths } from "consts/paths";
import {
  StyledChildLeft,

  StyledLogoImage,
  StyledRectangle1,
  StyledRectangle2,
  StyledRectangle3,
  StyledImageWrapper,
} from "./style";
import { useHistory } from 'react-router-dom';


interface IBackgroundColor {
  color?: string
}

export default function OnBoardingLeftSection(props: IBackgroundColor) {
  const { color } = props

const history = useHistory();
  const handleBackClick = () => {
    history.push(publicPaths.home);
  };

  return (

    <StyledChildLeft  >
      <StyledLogoImage onClick={handleBackClick}>
        <img src={LogoImageSrc} />
      </StyledLogoImage>
      <StyledRectangle1 />

      <StyledImageWrapper />

      <StyledRectangle2 />
      <StyledRectangle3 />

    </StyledChildLeft>

  )
}

