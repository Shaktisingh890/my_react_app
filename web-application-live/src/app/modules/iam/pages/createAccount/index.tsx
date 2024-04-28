import React, { ReactElement, useEffect, useState } from "react";
import {
  StyledContainer,
  ImageContainer,
  StyledImage,
  StyledChild,
  StyledLogo,
  ContentContainer,
  Divider,
  ContentFooter,
  StyledFont,
  StyledRadioButtons,
  StyledWidth,
} from "./style";
import {
  Text,
  FontFamily,
  FontSize,
  FontWeight,
} from "app/components/atoms/text";
import { colorList } from "consts/color";
import { privatePaths, publicPaths } from "consts/paths";
import { useHistory } from "react-router-dom";
import { RadioButtons } from "app/components/molecules/radioButtons";
import { InputField } from "app/components/atoms/inputField";
import { Button } from "app/components/atoms/mybutton";
import {
  confirmPasswordSchema,
  emailSchema,
  nameSchema,
  passwordSchema,
} from "schema";
import { accountList } from "consts/dropdown";
import { createAccountApi } from "apiCalls/iam";
import Notify from "utils/notification";
import Loader from "utils/loader";
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";

export interface IBrandFormField {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  industryExperience: string[];
  businessName: string;
  confirmPassword: string;
}

export interface IBrandValidField {
  email: boolean;
  password: boolean;
  firstName: boolean;
  lastName: boolean;
  industryExperience: boolean;
  businessName: boolean;
  confirmPassword: boolean;
}

export interface IServiceFormField {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  distributorType: string[];
  businessName: string;
  companyType: string;
  mainSpecialities: string[];
  otherMainSpecialities: string[];
  industryExperience: string[];
  confirmPassword: string;
}

export interface IServiceValidField {
  email: boolean;
  password: boolean;
  firstName: boolean;
  lastName: boolean;
  distributorType: boolean;
  businessName: boolean;
  companyType: boolean;
  mainSpecialities: boolean;
  otherMainSpecialities: boolean;
  industryExperience: boolean;
  confirmPassword: boolean;
}

export enum AccountType {
  BRAND = "brand",
  SERVICE = "serviceProvider",
}

export default function CreateAccount(): ReactElement {
  const initialBrandState: IBrandFormField = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    industryExperience: [],
    businessName: "",
    confirmPassword: "",
  };

  const initialBrandValidState: IBrandValidField = {
    email: false,
    password: false,
    firstName: false,
    lastName: false,
    industryExperience: true,
    businessName: true,
    confirmPassword: false,
  };

  const initialServiceState: IServiceFormField = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    distributorType: [],
    businessName: "",
    companyType: "",
    mainSpecialities: [],
    otherMainSpecialities: [],
    industryExperience: [],
  };

  const initialServiceValidState: IServiceValidField = {
    email: false,
    password: false,
    firstName: false,
    lastName: false,
    distributorType: true,
    businessName: true,
    companyType: true,
    mainSpecialities: true,
    otherMainSpecialities: true,
    industryExperience: true,
    confirmPassword: false,
  };

  const [formFields, setFormFields] = useState<
    IBrandFormField | IServiceFormField
  >(initialBrandState);
  const [validFields, setValidFields] = useState<
    IBrandValidField | IServiceValidField
  >(initialBrandValidState);
  const [accountType, setAccountType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const history = useHistory();
  const { t } = useTranslation();

  const handleBackClick = () => {
    history.push(publicPaths.home);
  };

  const handleLoginButton = () => {
    history.push(publicPaths.login);
  };

  useEffect(() => {
    const account = location.pathname.substr(
      location.pathname.lastIndexOf("/") + 1
    );
    setAccountType(account);

    setFormFields(
      account === AccountType.BRAND ? initialBrandState : initialServiceState
    );
    setValidFields(
      account === AccountType.BRAND
        ? initialBrandValidState
        : initialServiceValidState
    );
  }, []);

  const handleAccountSelection = (value: string) => {
    setAccountType(value);
    history.push(
      value === AccountType.BRAND
        ? publicPaths.brandAccount
        : publicPaths.serviceAccount
    );
  };

  const handleChange = (value: string | string[], label: string) => {
    if (value === AccountType.SERVICE && label === "companyType") {
      setFormFields({
        ...formFields,
        [label]: value,
        distributorType: [],
      });
    } else {
      setFormFields({
        ...formFields,
        [label]: value,
      });
    }
  };

  const handleValid = (label: string, valid: boolean) => {
    setValidFields({
      ...validFields,
      [label]: valid,
    });
  };

  const handleCreateAccountButton = () => {
    setLoading(true);
    const { email, firstName, lastName, password } = formFields;
    let fields = {
      email,
      firstName,
      lastName,
      password,
    };
    createAccountApi(fields, accountType)
      .then(() => {
        setLoading(false);
        Notify({
          title: t(translations.SUCCESS_NOTIFY.CREATE_ACCOUNT),
          message: t(translations.SUCCESS_NOTIFY.LOGIN_NOW),
          type: "success",
        });
        history.push(privatePaths.dashboardProfile);
      })
      .catch((error) => {
        setLoading(false);
        Notify({
          title: t(translations.ERROR_NOTIFY.CREATE_ACCOUNT),
          message: error,
          type: "danger",
        });
      });
  };

  useEffect(() => {
    setDisableButton(Object.values(validFields).includes(false));
  }, [validFields]);

  return (
    <StyledContainer>
      <ImageContainer>
        <StyledLogo />
        <StyledImage />
      </ImageContainer>

      <StyledChild>
        <div className="content">
          {loading ? (
            <Loader />
          ) : (
            <ContentContainer>
              {/* <div onClick={handleBackClick} className="link">
                <Text
                  family={FontFamily.Inter}
                  size={FontSize.ExtraSmall}
                  color={colorList.blue1}
                >
                  <span className="greyColor">
                    {t(translations.CREATE_ACCOUNT.BACK_TO)}
                  </span>
                  {t(translations.CREATE_ACCOUNT.HOME)}
                </Text>
              </div> */}

              {/* <Text
                family={FontFamily.Inter}
                weight={FontWeight.Light}
                size={FontSize.ExtraLarge}
                styles={customStyles.text1}
              >
                {t(translations.CREATE_ACCOUNT.CREATE_ACCOUNT)}<b>{accountType === "service" ? "Service Provider" : "Brand"}</b>
              </Text> */}
              {/* <Divider /> */}
              <Text
                size={FontSize.Large}
                weight={FontWeight.Light}
                family={FontFamily.Inter}
              >
                {t(translations.CREATE_ACCOUNT.CREATE_AN)}
              </Text>
              <StyledFont
                size={FontSize.Large}
                weight={FontWeight.Light}
                family={FontFamily.Inter}
              >

                {t(translations.CREATE_ACCOUNT.ACCOUNT_AS_A)}
              </StyledFont>
              <Text
                size={FontSize.Large}
                weight={FontWeight.Light}
                family={FontFamily.Inter}
              >
                <b>{accountType === "service" ? "Service Provider" : "Brand"}</b>
              </Text>

              {/* <Text
                family={FontFamily.Inter}
                size={FontSize.Mini}
                color={colorList.grey3}
              >
                {t(translations.CREATE_ACCOUNT.FILL_FORM)}
              </Text>

              <Text
                family={FontFamily.Inter}
                weight={FontWeight.Medium}
                size={FontSize.ExtraSmall}
                color={colorList.grey2}
                styles={customStyles.text2}
              >
                {t(translations.CREATE_ACCOUNT.SIGNING_UP)}
              </Text> */}
              <Divider margin={customStyles.divider1} />
              <StyledRadioButtons>
              <StyledWidth>
              <RadioButtons
                showBorder
                backgroundColor={colorList.white2}
                radioButtonList={accountList}
                defaultValue={accountType}
                handleRadioChange={handleAccountSelection}
              />
              </StyledWidth>
    </StyledRadioButtons>
            
              <Divider margin={customStyles.divider1} />

              <InputField
                label={t(translations.FORM_LABELS.FIRST_NAME)}
                schema={nameSchema}
                required
                handleValidationCheck={(valid: boolean) =>
                  handleValid("firstName", valid)
                }
                handleInputChange={(val: string) =>
                  handleChange(val, "firstName")
                }
              />
              <Divider margin={customStyles.divider2} />
              <InputField
                label={t(translations.FORM_LABELS.LAST_NAME)}
                schema={nameSchema}
                required
                handleValidationCheck={(valid: boolean) =>
                  handleValid("lastName", valid)
                }
                handleInputChange={(val: string) =>
                  handleChange(val, "lastName")
                }
              />
              {/* <Divider margin={customStyles.divider2} /> */}
              {/* {accountType === AccountType.BRAND ? (
                <BrandForm
                  handleChange={handleChange}
                  handleValid={handleValid}
                />
              ) : (
                <ServiceForm
                  handleChange={handleChange}
                  handleValid={handleValid}
                  setValidFields={setValidFields}
                  formFields={formFields}
                  validFields={validFields}
                />
              )} */}
              <Divider margin={customStyles.divider2} />
              <InputField
                label={t(translations.FORM_LABELS.EMAIL_ADDRESS)}
                type="email"
                required
                handleValidationCheck={(valid: boolean) =>
                  handleValid("email", valid)
                }
                schema={emailSchema}
                handleInputChange={(val: string) => handleChange(val, "email")}
              />
              <Divider margin={customStyles.divider2} />
              <InputField
                label={t(translations.FORM_LABELS.PASSWORD)}
                type="password"
                required
                handleValidationCheck={(valid: boolean) =>
                  handleValid("password", valid)
                }
                schema={passwordSchema}
                handleInputChange={(val: string) =>
                  handleChange(val, "password")
                }
              />

              <Divider margin={customStyles.divider2} />
              <InputField
                label={t(translations.FORM_LABELS.CONFIRM_PASSWORD)}
                type="password"
                required
                handleValidationCheck={(valid: boolean) =>
                  handleValid("confirmPassword", valid)
                }
                schema={confirmPasswordSchema(formFields.password)}
                handleInputChange={(val: string) =>
                  handleChange(val, "confirmPassword")
                }
              />

              <Divider margin={customStyles.divider1} />
              <div className="buttonContainer">
                <Button
                  text={t(translations.BUTTONS.CREATE_ACCOUNT_NOW)}
                  textColor={colorList.white1}
                  borderColor={colorList.blue2}
                  color={colorList.blue2}
                  disabled={disableButton}
                  onClick={handleCreateAccountButton}
                />
              </div>
            </ContentContainer>
          )}
        </div>

        <ContentFooter>
          <Text
            family={FontFamily.Inter}
            size={FontSize.Small}
            color={colorList.grey2}
            weight={FontWeight.Medium}
          >
            {t(translations.CREATE_ACCOUNT.ALREADY_HAVE)}
          </Text>
          <Button
            text={t(translations.BUTTONS.LOG_IN)}
            textColor={colorList.blue1}
            borderColor={colorList.blue1}
            color={"transparent"}
            onClick={handleLoginButton}
          />
        </ContentFooter>
      </StyledChild>
    </StyledContainer>
  );
}

export const customStyles = {
  text1: { margin: "10% 0 2.75rem" },
  text2: { margin: "1.8rem 0 1rem" },
  divider1: "1.8rem 0",
  divider2: "1rem 0",
};
