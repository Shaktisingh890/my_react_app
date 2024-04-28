import React, { useState, useEffect } from "react";
import Notify from "utils/notification";
import { useHistory } from "react-router-dom";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { getUserProfileDetail, getUserProfileDetailById } from "apiCalls/profile";
import { IFileType } from "app/modules/profile/createProfile/brandForm";
import {
  PageContainer,
  StyledHeader,
  StyledLabel,
  StyledRightChild,
  SpaceBetween,
  StyledPartition,
  StyledLogo,
  StyledAdminApprovedProgressText,
  Divider
} from "./style";
import { privatePaths } from "consts/paths";
import { Button } from "app/components/atoms/mybutton";
import { colorList } from "consts/color";
import {
  FontFamily,
  FontSize,
  FontWeight,
  Text,
} from "app/components/atoms/text";
import {
  ServerConstantKeys,
} from "apiCalls/dashboard";
import FilePreview from "app/components/atoms/filePreview";
import MultipleValues from "app/components/molecules/myMultipleValues";
import ViewLinks from "app/components/molecules/myViewLinks";
import ViewText from "app/components/molecules/myViewText";
import { getFromLocalStorage } from "localStorage";
interface IServiceProfileFormField {
  email?: string;
  businessName: string;
  description: string;
  logo: IFileType;
  linkedinUrl: string;
  annualTurnover: string;
  segmentExperience: string[];
  docs: IFileType[];
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  staffSize: string;
  website: string;
  languagesSpoken: string[];
  originCountry: string;
  industryExperience: string[];
  foundingHistory: string;
  companyRegistrationType: string;
  internationalPresence: string[];
  locationsInChina: string[];
  otherDetails: string;
  globalNoPOS: string;
  hqLocation: string;
  presenceInChina: string;
  experienceInChina: string;
  mainSpecialities: string[];
  services: string;
  notableClients: string;
  bankAccDetails: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    bankAddress?: string;
    bankCode?: string;
    swiftCode?: string;
    country?: string;
  }
}

export default function ServiceProfile() {
  const history = useHistory();
  const { t } = useTranslation();

  const initialServiceState: IServiceProfileFormField = {
    email: "",
    businessName: "",
    description: "",
    logo: {},
    linkedinUrl: "",
    annualTurnover: "",
    segmentExperience: [],
    docs: [],
    contactName: "",
    contactTitle: "",
    contactEmail: "",
    staffSize: "",
    website: "",
    languagesSpoken: [],
    originCountry: "",
    industryExperience: [],
    foundingHistory: "",
    companyRegistrationType: "",
    internationalPresence: [],
    globalNoPOS: "",
    locationsInChina: [],

    hqLocation: "",
    otherDetails: "",
    presenceInChina: "",
    experienceInChina: "",
    mainSpecialities: [],
    services: "",
    notableClients: "",
    bankAccDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      bankAddress: "",
      bankCode: "",
      swiftCode: "",
      country: "",
    }
  };

  const [loading, setLoading] = useState<boolean>();
  const [isAdminApproved, setIsAdminApproved] = useState<boolean>(true);
  const [formFields, setFormFields] =
    useState<IServiceProfileFormField>(initialServiceState);

  useEffect(() => {
    setLoading(true);
    getUserProfileDetail("serviceProvider")
      .then((resp: any) => {
        const profileData = { ...resp };
        if (!profileData.bankAccDetails) {
          profileData.bankAccDetails = {};
        }
        setFormFields(profileData);
        setLoading(false);
      })
      .catch((error) => {
        Notify({
          title: t(translations.ERROR_NOTIFY.SERVICE_PROFILE),
          message: error,
          type: "danger",
        });
      });
  }, []);



  useEffect(() => {
    const userRole = getFromLocalStorage("userRole");
    const userId = getFromLocalStorage("userId");
    if (userRole === "serviceProvider") {
      adminApproval(userId)

    }
  }, []);

  const adminApproval = async (id: any) => {
    try {
      const response = await getUserProfileDetailById(id);
      setIsAdminApproved(response.approvedByAdmin);

    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.PROJECT_DETAILS),
        message: error + "",
        type: "danger",
      });
    }

  };


  const handleEditProfile = () => {
    history.push(privatePaths.serviceProfile);
  };

  return (
    <>
      {!isAdminApproved && <StyledAdminApprovedProgressText> Your profile is under review, please complete your profile to help us approve your profile. For any query, contact us at hello@expanter.com </StyledAdminApprovedProgressText>}
      <PageContainer>

        <StyledHeader>
          <Text
            weight={FontWeight.SemiBold}
            family={FontFamily.Inter}
            size={FontSize.ExtraRegular}
          >
            {t(translations.VIEW_PROFILE.SERVICE_PROFILE)}
          </Text>
          <Button
            textColor={colorList.blue2}
            color={"transparent"}
            borderColor={colorList.blue2}
            text={t(translations.VIEW_PROFILE.EDIT_PROFILE)}
            onClick={handleEditProfile}
          ></Button>
        </StyledHeader>
        <StyledRightChild>
          <StyledLabel family={FontFamily.Inter} size={FontSize.ExtraSmall}>
            {t(translations.VIEW_PROFILE.EMAIL)}
          </StyledLabel>
          {formFields.email ? (
            <Text
              weight={FontWeight.Medium}
              family={FontFamily.Inter}
              size={FontSize.Small}
            >
              {formFields.email}
            </Text>
          ) : (
            <Text
              weight={FontWeight.Medium}
              family={FontFamily.Inter}
              color={colorList.grey4}
              size={FontSize.Small}
            >
              {t(translations.VIEW_PROFILE.NO_CONTENT)}
            </Text>
          )}

          <SpaceBetween>
            <StyledPartition>
              <MultipleValues
                labelKey={translations.FORM_LABELS.TYPE_OF_SERVICE}
                formFields={formFields}
                serverConstantKey={ServerConstantKeys.mainSpecialities}
                formKey={"mainSpecialities"}
              />
              <StyledLabel family={FontFamily.Inter} size={FontSize.ExtraSmall}>
                {t(translations.FORM_LABELS.COMPANY_NAME)}
              </StyledLabel>
              {formFields.businessName ? (
                <Text
                  weight={FontWeight.Medium}
                  family={FontFamily.Inter}
                  size={FontSize.Small}
                >
                  {formFields.businessName}
                </Text>
              ) : (
                <Text
                  weight={FontWeight.Medium}
                  family={FontFamily.Inter}
                  color={colorList.grey4}
                  size={FontSize.Small}
                >
                  {t(translations.VIEW_PROFILE.NO_CONTENT)}
                </Text>
              )}
            </StyledPartition>
            <StyledPartition>
              <StyledLogo
                src={formFields.logo.thumbnail}
                width="70rem"
                height="70rem"
              />
            </StyledPartition>
          </SpaceBetween>

          <div>
            <StyledLabel family={FontFamily.Inter} size={FontSize.ExtraSmall}>
              {t(translations.FORM_LABELS.ABOUT)}
            </StyledLabel>
            {!formFields.description ? (
              <Text
                weight={FontWeight.Medium}
                family={FontFamily.Inter}
                color={colorList.grey4}
                size={FontSize.Small}
              >
                {t(translations.VIEW_PROFILE.NO_CONTENT)}
              </Text>
            ) : (
              <Text
                weight={FontWeight.Medium}
                family={FontFamily.Inter}
                size={FontSize.Small}
              >
                {formFields.description}
              </Text>
            )}
          </div>

          <StyledLabel family={FontFamily.Inter} size={FontSize.ExtraSmall}>
            {t(translations.FORM_LABELS.SERVICES)}
          </StyledLabel>
          {formFields.services ? (
            <Text
              weight={FontWeight.Medium}
              family={FontFamily.Inter}
              size={FontSize.Small}
            >
              {formFields.services}
            </Text>
          ) : (
            <Text
              weight={FontWeight.Medium}
              family={FontFamily.Inter}
              color={colorList.grey4}
              size={FontSize.Small}
            >
              {t(translations.VIEW_PROFILE.NO_CONTENT)}
            </Text>
          )}
          <SpaceBetween>
            <StyledPartition>
              <ViewLinks
                labelKey={translations.VIEW_PROFILE.WEB_URL}
                formFields={formFields}
                formKey={"website"}
              />


            </StyledPartition>
            <StyledPartition>
              <ViewLinks
                labelKey={translations.VIEW_PROFILE.LINK_URL}
                formFields={formFields}
                formKey={"linkedinUrl"}
              />

            </StyledPartition>
          </SpaceBetween>

          <ViewText
            formFields={formFields}
            formKey={"staffSize"}
            labelKey={translations.FORM_LABELS.COMPANY_SIZE}
            serverConstantKey={ServerConstantKeys.staffSize}
          />

          <SpaceBetween>
            <StyledPartition>
              <MultipleValues
                labelKey={translations.FORM_LABELS.CHINA_LOCATION}
                formFields={formFields}
                serverConstantKey={ServerConstantKeys.chinaProvinces}
                formKey={"locationsInChina"}
              />

              <ViewText
                formFields={formFields}
                formKey={"foundingHistory"}
                labelKey={translations.VIEW_PROFILE.FOUNDING_HIST}
                serverConstantKey={ServerConstantKeys.foundingHistory}
              />


              <ViewText
                formFields={formFields}
                formKey={"projectBasedFeeUSD"}
                labelKey={translations.FORM_LABELS.PROJECT_STARTING_FEE}
                serverConstantKey={ServerConstantKeys.projectStartingFee_USD}
              />

              <MultipleValues
                labelKey={translations.VIEW_PROFILE.INDUSTRY_EXPE}
                formFields={formFields}
                serverConstantKey={ServerConstantKeys.industryExperience}
                formKey={"industryExperience"}
              />
            </StyledPartition>

            <StyledPartition>
              <ViewText
                formFields={formFields}
                formKey={"hqLocation"}
                labelKey={translations.VIEW_PROFILE.HQ_LOCATIONS}
                serverConstantKey={ServerConstantKeys.countries}
              />
              <MultipleValues
                labelKey={translations.VIEW_PROFILE.LANGUAUGES}
                formFields={formFields}
                serverConstantKey={ServerConstantKeys.languageSpoken}
                formKey={"languagesSpoken"}
              />
              <ViewText
                formFields={formFields}
                formKey={"retainerBasedFeeUSD"}
                labelKey={translations.FORM_LABELS.RETAINER_STARTING_FEE}
                serverConstantKey={ServerConstantKeys.projectStartingFee_USD}
              />
            </StyledPartition>
          </SpaceBetween>

          <StyledLabel family={FontFamily.Inter} size={FontSize.ExtraSmall}>
            {t(translations.FORM_LABELS.NOTABLE_CLIENTS)}
          </StyledLabel>
          {formFields.notableClients ? (
            <Text
              weight={FontWeight.Medium}
              family={FontFamily.Inter}
              size={FontSize.Small}
            >
              {formFields.notableClients}
            </Text>
          ) : (
            <Text
              weight={FontWeight.Medium}
              family={FontFamily.Inter}
              color={colorList.grey4}
              size={FontSize.Small}
            >
              {t(translations.VIEW_PROFILE.NO_CONTENT)}
            </Text>
          )}

          <StyledLabel family={FontFamily.Inter} size={FontSize.ExtraSmall}>
            {t(translations.FORM_LABELS.CASE_STUDY)}
          </StyledLabel>
          {formFields.otherDetails ? (
            <Text
              weight={FontWeight.Medium}
              family={FontFamily.Inter}
              size={FontSize.Small}
            >
              {formFields.otherDetails}
            </Text>
          ) : (
            <Text
              weight={FontWeight.Medium}
              family={FontFamily.Inter}
              color={colorList.grey4}
              size={FontSize.Small}
            >
              {t(translations.VIEW_PROFILE.NO_CONTENT)}
            </Text>
          )}

          <StyledLabel family={FontFamily.Inter} size={FontSize.ExtraSmall}>
            {t(translations.FORM_LABELS.COMPANY_INTRODUCTIONS)}
          </StyledLabel>
          {formFields.docs && formFields.docs.length ? (
            <FilePreview docs={formFields.docs} />
          ) : (
            <Text
              weight={FontWeight.Medium}
              family={FontFamily.Inter}
              color={colorList.grey4}
              size={FontSize.Small}
            >
              {t(translations.VIEW_PROFILE.NO_CONTENT)}
            </Text>
          )}

          <Divider />

          <Text
            weight={FontWeight.SemiBold}
            family={FontFamily.Inter}
            size={FontSize.Regular}
          >
            {t(translations.ACCOUNT_DETAILS.ACCOUNT_DETAILS)}
          </Text>

          <SpaceBetween>
            <StyledPartition>
              <ViewText
                formFields={formFields.bankAccDetails}
                formKey={"accountName"}
                labelKey={translations.ACCOUNT_DETAILS.ACCOUNT_NAME}


              />
              <ViewText
                formFields={formFields.bankAccDetails}
                formKey={"bankName"}
                labelKey={translations.ACCOUNT_DETAILS.BANK_NAME}
              />
              <ViewText
                formFields={formFields.bankAccDetails}
                formKey={"bankAddress"}
                labelKey={translations.ACCOUNT_DETAILS.BANK_ADDRESS}
              />
            </StyledPartition>
            <StyledPartition>
              <ViewText
                formFields={formFields.bankAccDetails}
                formKey={"accountNumber"}
                labelKey={translations.ACCOUNT_DETAILS.ACCOUNT_NUMBER}
              />
              <ViewText
                formFields={formFields.bankAccDetails}
                formKey={"bankCode"}
                labelKey={translations.ACCOUNT_DETAILS.BANK_CODE}
              />
              <ViewText
                formFields={formFields.bankAccDetails}
                formKey={"swiftCode"}
                labelKey={translations.ACCOUNT_DETAILS.SWIFT_CODE}
              />
            </StyledPartition>

          </SpaceBetween>
          <ViewText
            formFields={formFields.bankAccDetails}
            formKey={"country"}
            labelKey={translations.ACCOUNT_DETAILS.COUNTRY}
          // serverConstantKey={ServerConstantKeys.foundingHistory}
          />

        </StyledRightChild>
      </PageContainer>
    </>

  );
}
