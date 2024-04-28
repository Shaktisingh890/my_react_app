import { publicPaths } from "consts/paths";
import React, { ReactElement, useEffect, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { colorList } from "consts/color";
import {
  FontFamily,
  FontSize,
  FontWeight,
  Text,
} from "app/components/atoms/text";
import { InputField } from "app/components/atoms/inputField";
import { Button } from "app/components/atoms/mybutton";
import { confirmPasswordSchema, passwordSchema } from "schema";
import {
  StyledContainer,
  StyledChildRight,
  StyledForm,
  ButtonWrapper,
  InputContainer,
  StyledText
} from "./style";
import * as yup from "yup";
import OnBoardingLeftSection from "../../organisms/onBoardingLeftSection";
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";
import Notify from "utils/notification";
import { changePassword, verifyToken } from "apiCalls/iam";
export interface IAuthFields {
  token: string;
  id: string;
  password?: string;
}

export default function ChangePwd(): ReactElement {
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id") || "";
  const token = new URLSearchParams(search).get("token") || "";

  const [loading, setLoading] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(true);

  const { t } = useTranslation();
  const history = useHistory();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<boolean>(false);

  const handlePasswordInput = (value: string) => {
    setPassword(value);
    passwordSchema?.isValid(value).then(function (valid: boolean) {
      setIsPasswordValid(valid);
    });
  };

  const handleConfirmPasswordInput = (value: string) => {
    setConfirmPassword(value);
    confirmPasswordSchema(password)?.isValid(value).then(function (valid: boolean) {
      setIsConfirmPasswordValid(valid);
    });
  };

  const verifyUser = () => {
    const payload: IAuthFields = { token, id };
    setLoading(true);
    verifyToken(payload)
      .then(() => {
        setLoading(false);

        setIsVerified(true);
      })
      .catch((error) => {
        setLoading(false);
        setIsVerified(false);
        Notify({
          title: t(translations.API_ERRORS.VERIFY_USER),
          message: error,
          type: "danger",
        });
      });
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const onSubmit = (event: any) => {
    event.preventDefault();

    const payload: IAuthFields = { token, id, password };
    setLoading(true);
    changePassword(payload)
      .then((res) => {
        setLoading(false);
        Notify({
          title: t(translations.GENERIC.SUCCESS),
          message: t(translations.API_ERRORS.EMAIL_SENT),
          type: "success",
        });
        history.push(publicPaths.thankYouPage);
      })
      .catch((error) => {
        setLoading(false);
        Notify({
          title: t(translations.API_ERRORS.CHANGE_PASSWORD),
          message: error,
          type: "danger",
        });
      });
  };
  return (
    <StyledContainer>
      <OnBoardingLeftSection color={colorList.blue2} />
      <StyledChildRight>
        {isVerified ? (
          <StyledForm onSubmit={onSubmit}>
            <Text
              size={FontSize.Large}
              weight={FontWeight.Light}
              family={FontFamily.Inter}
            >
              {t(translations.CHANGE_PASSWORD.TITLE1)} <br />
              {t(translations.CHANGE_PASSWORD.TITLE2)}
            </Text>
            <StyledText>
              <Text size={FontSize.Mini} family={FontFamily.Roboto}>
                {t(translations.CHANGE_PASSWORD.DESCRIPTION)}
              </Text>
            </StyledText>
            <InputField
              label={t(translations.FORM_LABELS.NEW_PASSWORD)}
              type="password"
              schema={passwordSchema}
              handleInputChange={handlePasswordInput}
              showEyeIcon={true}
              required
              autofocus
            />
            <InputContainer>
              <InputField
                label={t(translations.FORM_LABELS.CONFIRM_PASSWORD)}
                type="password"
                required
                showEyeIcon={true}
                schema={confirmPasswordSchema(password)}
                handleInputChange={handleConfirmPasswordInput}
              />
            </InputContainer>
            {/* todo
            {password && confirmPassword && (password !== confirmPassword) && <Text size={FontSize.Mini} family={FontFamily.Roboto}>
              {"Passwords do not match"}
            </Text>} */}

            <ButtonWrapper>
              <Button
                textColor={colorList.white1}
                color={colorList.blue1}
                borderColor={colorList.blue1}
                text={t(translations.CHANGE_PASSWORD.SUBMIT_LABEL)}
                disabled={!isPasswordValid || !isConfirmPasswordValid}
                type="submit"
              ></Button>
            </ButtonWrapper>
          </StyledForm>
        )
          : (
            <>
              <StyledText
                size={FontSize.Large}
                weight={FontWeight.Light}
                family={FontFamily.Inter}
                color={colorList.grey1}
              >
                {t(translations.CHANGE_PASSWORD.LINK_EXPIRED)}
              </StyledText>
              <Text
                size={FontSize.Small}
                weight={FontWeight.Light}
                family={FontFamily.Inter}
                color={colorList.black1}
              >
                {t(translations.CHANGE_PASSWORD.REQUEST_EMAIL)}
              </Text>
              <Link to={publicPaths.forgotPwd}>
                <Text
                  size={FontSize.ExtraSmall}
                  weight={FontWeight.SemiBold}
                  family={FontFamily.Inter}
                  color={colorList.blue1}>
                  {t(translations.CHANGE_PASSWORD.REQUEST_INSTRUCTIONS)}
                </Text>
              </Link>
            </>
          )
        }
      </StyledChildRight>
    </StyledContainer>
  );
}
