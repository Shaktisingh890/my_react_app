import { privatePaths, publicPaths } from "consts/paths";
import React, { ReactElement } from "react";
import { useHistory } from "react-router-dom";
import { StyledContainer, StyledLogo } from "./style";
import { Text, FontFamily, FontSize } from "app/components/atoms/text";
import { colorList } from "consts/color";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { Button } from "app/components/atoms/mybutton";

export default function NotFoundPage(): ReactElement {
  const history = useHistory();
  const { t } = useTranslation();

  const handleHomeButton = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) history.push(privatePaths.dashboardProfile);
    else history.push(publicPaths.login);

    window.location.reload();
  };

  return (
    <StyledContainer>
      <div className="logo-container">
        <StyledLogo />
      </div>

      <div className="text-container">
        <div className="text">
          <Text family={FontFamily.Inter} size={FontSize.Large}>
            {t(translations.GENERIC.NOT_FOUND_ERROR)}
          </Text>

          <Button
            text={t(translations.BUTTONS.GO_TO_HOME)}
            textColor={colorList.white1}
            borderColor={colorList.black1}
            onClick={handleHomeButton}
            color={colorList.black1}
          />
        </div>
      </div>
    </StyledContainer>
  );
}
