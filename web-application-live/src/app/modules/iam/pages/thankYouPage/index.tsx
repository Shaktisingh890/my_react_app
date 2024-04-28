import React, { ReactElement, useState } from "react";
import { colorList } from "consts/color";
import { FontFamily, FontSize, FontWeight, Text } from "app/components/atoms/text";
import { Button } from "app/components/atoms/mybutton";
import ThankYouSrc from "assets/images/thankYouPageImage.svg"
import { useHistory } from "react-router-dom";
import { publicPaths } from "consts/paths";


import {
  StyledContainer,
  StyledChildRight,
  ButtonWrapper,
  StyledMessage,
  StyledContent,
  StyledImage,
  StyledLink,


} from "./style";

import OnBoardingLeftSection from "../../organisms/onBoardingLeftSection";



export default function ThankYouPage(): ReactElement {

  const history = useHistory();

  const handleLoginButton = () => {
    history.push(publicPaths.login);
  };

  return (

    <StyledContainer>
      <OnBoardingLeftSection />

      <StyledChildRight>

        <StyledImage>
          <img src={ThankYouSrc} />
        </StyledImage>

        <StyledContent>

          <Text size={FontSize.Large} weight={FontWeight.Light} family={FontFamily.Inter}>Thank you!</Text>
          <StyledMessage >
            <Text size={FontSize.Mini} color={colorList.grey2} family={FontFamily.Inter}>Your password changed. Try logging in to access Expanter.</Text>
          </StyledMessage>


          <ButtonWrapper>
            <StyledLink to={publicPaths.serviceAccount}>
              <Text
                size={FontSize.ExtraSmall}
                weight={FontWeight.SemiBold}
                family={FontFamily.Inter}
                color={colorList.blue1}>
                Visit Home!
              </Text>
            </StyledLink>

            <Button
              textColor={colorList.white1}
              color={colorList.blue1}
              borderColor={colorList.blue1}
              text={'Log in now!'}
              onClick={handleLoginButton}></Button>
          </ButtonWrapper>

        </StyledContent>



      </StyledChildRight>
    </StyledContainer>

  );
}



