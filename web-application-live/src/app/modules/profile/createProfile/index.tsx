import React, { ReactElement, useEffect, useState } from "react";
import {
  Divider,
  FormContainer,
  HeadingContainer,
  PageContainer,
  StyledLogo,
} from "./style";
import {
  Text,
  FontFamily,
  FontSize,
  FontWeight,
} from "app/components/atoms/text";
import { colorList } from "consts/color";
import { useHistory } from "react-router-dom";
import { ServiceProfileForm } from "./serviceForm";
import { BrandProfileForm } from "./brandForm";
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";
import { images } from "assets/images";

export default function CreateProfile(): ReactElement {
  const [accountType, setAccountType] = useState<string>("");

  const history = useHistory();
  const { t } = useTranslation();

  const handleBackClick = () => {
    history.goBack();
  };

  useEffect(() => {
    const account = location.pathname.substr(
      location.pathname.lastIndexOf("/") + 1
    );

    setAccountType(account);
  }, []);

  return (
    <PageContainer>
      <HeadingContainer>
        <div onClick={handleBackClick}>
          <Text
            family={FontFamily.Inter}
            size={FontSize.Small}
            weight={FontWeight.Medium}
            color={colorList.blue1}
          >
            <img src={images.arrowLeft} height={"15px"} width={"15px"} />
            <span className="spacing">
              {t(translations.CREATE_PROFILE.BACK)}
            </span>
          </Text>
        </div>
        <Divider margin="1.5rem 0" />
        <Text
          family={FontFamily.Inter}
          size={FontSize.Large}
          weight={FontWeight.Light}
          color={colorList.grey2}
          styles={{
            letterSpacing: "-0.02em",
            textShadow: `1px 1px 1px ${colorList.white1}`,
          }}
        >
          {t(translations.CREATE_PROFILE.TITLE)}
        </Text>
        <Divider margin="0.3rem 0" />
        <Text
          family={FontFamily.Inter}
          size={FontSize.Large}
          weight={FontWeight.Bold}
          color={colorList.black1}
          styles={{
            letterSpacing: "-0.02em",
            textShadow: `1px 1px 1px ${colorList.white1}`,
          }}
        >
          {accountType === "brand"
            ? t(translations.CREATE_PROFILE.TITLE1)
            : t(translations.CREATE_PROFILE.TITLE2)}
        </Text>
        <Divider margin="1.5rem 0" />
        {/* <Text
          family={FontFamily.Inter}
          size={FontSize.Small}
          color={colorList.grey2}
        >
          {t(translations.CREATE_PROFILE.SUBTITLE)}
        </Text> */}
      </HeadingContainer>

      <FormContainer>
        <StyledLogo />

        <div className="formFields">
          {/* <Text
            family={FontFamily.Inter}
            size={FontSize.ExtraSmall}
            color={colorList.grey1}
          >
            {t(translations.CREATE_PROFILE.SMALLTEXT1)} (
            <span className="symbol">*</span>)
            {t(translations.CREATE_PROFILE.SMALLTEXT2)}
          </Text>

          <Divider margin="2.5rem 0" />

          <Text
            family={FontFamily.Inter}
            size={FontSize.ExtraRegular}
            color={colorList.black1}
            weight={FontWeight.SemiBold}
          >
            {accountType === "brand"
              ? t(translations.CREATE_PROFILE.LABEL1)
              : t(translations.CREATE_PROFILE.LABEL2)}
          </Text> */}
          <Divider margin="2rem 0" />

          {accountType === "brand" ? (
            <BrandProfileForm accountType={accountType} />
          ) : (
            <ServiceProfileForm accountType={accountType} />
          )}
        </div>
      </FormContainer>
    </PageContainer>
  );
}
