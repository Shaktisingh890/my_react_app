import { privatePaths, publicPaths } from "consts/paths";
import React, { ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SignUpDetail, { IList } from "../../organisms/signUpDetail";
import {
  StyledChild,
  StyledContainer,
  StyledImage,
  StyledLink,
  StyledLogo,
  StyledWrapper,
} from "./style";
import { Text, FontFamily, FontSize } from "app/components/atoms/text";
import { colorList } from "consts/color";
import { translations } from "locales/translations";


export default function Signup(): ReactElement {
  const history = useHistory();
  const { t } = useTranslation();


  const brandData = t('APP_HOME.BRAND.SUB_HEADINGS', { returnObjects: true }) as IList[];
  const providerData = t('APP_HOME.PROVIDER.SUB_HEADINGS', { returnObjects: true }) as IList[];

  useEffect(() => {
    const accessToken: any = localStorage.getItem("accessToken");
    if(accessToken){
      history.push(privatePaths.dashboardProfile);
    }
  },[])

  const handleBackClick = () => {
    history.push(publicPaths.home);
  };

  return (
    <StyledContainer>
      <StyledChild isFirstChild>
        <StyledImage isFirstChild />
        <SignUpDetail
          headerText={t(translations.APP_HOME.BRAND.HEADING)}
          listContent={brandData}
          isFirstChild
        >
          <></>

        </SignUpDetail>
      </StyledChild>
      <StyledChild isFirstChild={false}>
        <StyledImage isFirstChild={false} />
        <SignUpDetail
          headerText={t(translations.APP_HOME.PROVIDER.HEADING)}
          listContent={providerData}
          isFirstChild={false}
        >
          <></>
        </SignUpDetail>
      </StyledChild>
      <StyledLink onClick={handleBackClick}>
        <Text
          family={FontFamily.Inter}
          size={FontSize.ExtraSmall}
          color={colorList.white1}
        >
          &lt; {t(translations.GENERIC.BACK_TO)} <b>{t(translations.GENERIC.HOME)}</b>
        </Text>
      </StyledLink>
      <StyledWrapper>
        <StyledLogo />
      </StyledWrapper>
      

    </StyledContainer>
  );
}
