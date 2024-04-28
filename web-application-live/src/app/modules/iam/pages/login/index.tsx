import { privatePaths, publicPaths } from "consts/paths";
import React, {
  isValidElement,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { useHistory, Link } from "react-router-dom";
import { colorList } from "consts/color";
import {
  FontFamily,
  FontSize,
  FontWeight,
  Text,
} from "app/components/atoms/text";
import { InputField } from "app/components/atoms/inputField";
import { Button } from "app/components/atoms/mybutton";
import { CheckboxButtons } from "app/components/molecules/checkboxButtons";
import { emailSchema, passwordSchema } from "schema";

import {
  StyledContainer,
  StyledChildRight,
  StyledForm,
  ButtonWrapper,
  StyledText,
  StyledChildRightTop,
  StyledChildRightBottom,
  StyledLink,
  StyledWidth,
  StyledRadioButtons,
  StyledFont,
} from "./style";
import OnBoardingLeftSection from "../../organisms/onBoardingLeftSection";
import { rememberMe } from "consts/checkbox";
import Notify from "utils/notification";

import { login } from "apiCalls/iam";
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";
import {
  getFromLocalStorage,
  setInLocalStorage,
  clearFromLocalStorage,
} from "localStorage";
import { accountList } from "consts/dropdown";

import { RadioButtons } from "app/components/molecules/radioButtons";
import { RotatingLines } from "react-loader-spinner";

export interface Ilogin {
  email: string;
  password: string;
}
export enum AccountType {
  BRAND = "brand",
  SERVICE = "serviceProvider",
}
export default function Login(props: any): ReactElement {
  const initialEmailPassState: Ilogin = {
    email: "",
    password: "",
  };

  const [formFields, setFormFields] = useState<Ilogin>(initialEmailPassState);

  const { t } = useTranslation();
  const [password, setPassword] = useState<string>("");
  const [workEmail, setWorkEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [checked, setChecked] = useState<any>(false);
  const [accountType, setAccountType] = useState<string>("");


  const history = useHistory();

  const { type }: any = history?.location?.state || "";

  const handlePasswordInput = (value: string) => {
    setPassword(value);
    passwordSchema?.isValid(value).then(function (valid: boolean) {
      setIsPasswordValid(valid);
    });
  };

  const handleEmailInput = (value: string) => {
    setWorkEmail(value);
    emailSchema?.isValid(value).then(function (valid: boolean) {
      setIsEmailValid(valid);
    });
  };

  const handleBackClick = () => {
    history.push(publicPaths.home);
  };

  const handleSignUpButton = () => {
    if (accountType === 'brand') {
      history.push(publicPaths.brandAccount);

    }
    // history.push(publicPaths.signup);
    history.push(publicPaths.serviceAccount);

  };

  const handleCheckChange = (val: any) => {
    setChecked(true);
  };

  useEffect(() => {
    const token = getFromLocalStorage("accessToken");
    if (token) {
      history.push(privatePaths.dashboardProfile);
    }
    const email = getFromLocalStorage("email");
    const password = getFromLocalStorage("password");

    if (password && email) {
      setWorkEmail(email);
      setPassword(password);
      setIsEmailValid(true);
      setIsPasswordValid(true);
      setChecked(true);
    }
  }, []);

  const onSubmit = (event: any) => {
    event.preventDefault();

    const payload = { email: workEmail, password: password };
    setFormFields(payload);
    setLoading(true);
    if (checked) {
      setInLocalStorage("email", workEmail);
      setInLocalStorage("password", password);
    } else {
      setInLocalStorage("email", "");
      setInLocalStorage("password", "");
    }

    login(payload)
      .then((res) => {
        setInLocalStorage("accessToken", res.accessToken);
        setInLocalStorage("userId", res._id);
        setInLocalStorage("userRole", res.userRole);
        setInLocalStorage("userInfo", {
          name: `${res.firstName} ${res.lastName}`,
          logo: res?.logo?.thumbnail,
          email: res.email,
        });

        setLoading(false);
        history.push(privatePaths.dashboardProfile);
      })
      .catch((error) => {
        setLoading(false);
        Notify({
          title: t(translations.API_ERRORS.LOGIN),
          message: error,
          type: "danger",
        });
      });
  };


  const handleAccountSelection = (value: string) => {

    setAccountType(value);

  };

  return (
    <StyledContainer>
      <OnBoardingLeftSection color={colorList.blue2} />
      <StyledChildRight>
        <StyledChildRightTop>
          {/* <span onClick={handleBackClick}>
            <Text family={FontFamily.Inter} size={FontSize.ExtraSmall}>
              <span> &lt;</span>
              <StyledSpan1>{t("LOGIN.BACK_TO")}</StyledSpan1>
              <StyledSpan2>{t(translations.LOGIN.HOME)}</StyledSpan2>
            </Text>
          </span> */}

          <StyledForm onSubmit={onSubmit}>
            <Text
              size={FontSize.Large}
              weight={FontWeight.Light}
              family={FontFamily.Inter}
            >
              {t(translations.LOGIN.HEADING1)}
              <br />
              {t(translations.LOGIN.HEADING2)} <br />
            </Text>
            <StyledFont
              size={FontSize.Large}
              weight={FontWeight.Light}
              family={FontFamily.Inter}
            >
              {t(translations.LOGIN.HEADING3)}
            </StyledFont>

            {accountType === "brand" ? (
              <Text
                size={FontSize.Large}
                weight={FontWeight.Regular}
                family={FontFamily.Inter}
              >
                {t(translations.LOGIN.BRAND)}
              </Text>
            ) : (
              <Text
                size={FontSize.Large}
                weight={FontWeight.Regular}
                family={FontFamily.Inter}
              >
                {t(translations.LOGIN.SERVICE)}
              </Text>
            )}
            <StyledRadioButtons>
              <StyledWidth>

                <RadioButtons
                  showBorder
                  backgroundColor={colorList.white2}
                  radioButtonList={accountList}
                  defaultValue={"service" || accountType}
                  handleRadioChange={handleAccountSelection}
                />
              </StyledWidth>
            </StyledRadioButtons>
            <InputField
              label={t(translations.LOGIN.EMAIL)}
              type="email"
              defaultValue={workEmail}
              schema={emailSchema}
              handleInputChange={handleEmailInput}
              required
            />

            <InputField
              label={t(translations.LOGIN.PASSWORD)}
              type="password"
              defaultValue={password}
              schema={passwordSchema}
              handleInputChange={handlePasswordInput}
              required
            />

            <StyledLink to={publicPaths.forgotPwd}>
              <StyledText
                size={FontSize.ExtraSmall}
                color={colorList.blue1}
                family={FontFamily.Inter}
              >
                {t(translations.LOGIN.FORGOT)}
              </StyledText>
            </StyledLink>

            <ButtonWrapper>
              <CheckboxButtons
                handleCheckChange={handleCheckChange}
                checkButtonList={rememberMe}
              />

              <Button
                textColor={colorList.white1}
                color={colorList.blue1}
                borderColor={colorList.blue1}
                text={loading ? "" : t(translations.LOGIN.LOG_IN_NOW)}
                disabled={!isEmailValid || !isPasswordValid}
                loading={loading}
                type="submit"
              ></Button>
            </ButtonWrapper>
          </StyledForm>
        </StyledChildRightTop>

        <StyledChildRightBottom>
          <Text
            family={FontFamily.Inter}
            size={FontSize.Small}
            color={colorList.grey2}
            weight={FontWeight.Medium}
          >
            {t(translations.LOGIN.DONT_HAVE)}
          </Text>
          <Button
            text={t(translations.LOGIN.CREATE)}
            textColor={colorList.blue1}
            borderColor={colorList.blue1}
            color={"transparent"}
            onClick={handleSignUpButton}
          />
        </StyledChildRightBottom>
      </StyledChildRight>
    </StyledContainer>
  );
}
