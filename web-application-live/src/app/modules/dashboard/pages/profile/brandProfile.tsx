import React, { useState, useEffect } from "react";
import { AccountType } from "app/modules/iam/pages/createAccount";
import Notify from "utils/notification";
import { useHistory } from "react-router-dom";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { getUserProfileDetail, getUserProfileDetailById } from "apiCalls/profile";
import { IBrandProfileFormField } from "app/modules/profile/createProfile/brandForm";
import {
  PageContainer,
  StyledHeader,
  StyledLabel,
  StyledRightChild,
  SpaceBetween,
  StyledPartition,
  StyledLogo,
  StyledAdminApprovedProgressText,

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
import { ServerConstantKeys } from "apiCalls/dashboard";
import FilePreview from "app/components/atoms/filePreview";
import MultipleValues from "app/components/molecules/myMultipleValues";
import ViewLinks from "app/components/molecules/myViewLinks";
import ViewText from "app/components/molecules/myViewText";
import { getFromLocalStorage } from "localStorage";

export default function BrandProfile() {
  const history = useHistory();
  const { t } = useTranslation();

  const initialBrandState: IBrandProfileFormField = {
    email: "",
    businessName: "",
    description: "",
    logo: {},
    linkedinUrl: "",
    annualTurnover: "",
    segmentExperience: [],
    docs: [],
    staffSize: "",
    website: "",
    languagesSpoken: [],
    hqLocation: "",
    industryExperience: [],
    foundingHistory: "",
    internationalPresence: [],
    presenceInChina: "",
    experienceInChina: "",
  };

  const [loading, setLoading] = useState<boolean>();
  const [isAdminApproved, setIsAdminApproved] = useState<boolean>(true);
  const [formFields, setFormFields] =
    useState<IBrandProfileFormField>(initialBrandState);

  useEffect(() => {
    setLoading(true);
    getUserProfileDetail(AccountType.BRAND)
      .then((resp: any) => {
        setFormFields({ ...resp });
        setLoading(false);
      })
      .catch((error) => {
        Notify({
          title: t(translations.ERROR_NOTIFY.BRAND_PROFILE),
          message: error,
          type: "danger",
        });
      });
  }, []);

  const capitalizeFirstLetter = (val: string) => {
    if (val && val.length) {
      return val[0].toUpperCase() + val.substring(1);
    }
  };

  useEffect(() => {
    const userRole = getFromLocalStorage("userRole");
    const userId = getFromLocalStorage("userId");
    adminApproval(userId)

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
    history.push(privatePaths.brandProfile);
  };

  return (
    <div style={{ position: "relative" }}>


      {!isAdminApproved && <StyledAdminApprovedProgressText> Your profile is under review, please complete your profile to help us approve your profile. For any query, contact us at hello@expanter.com </StyledAdminApprovedProgressText>}
      <PageContainer>
        <StyledHeader>
          <Text
            weight={FontWeight.SemiBold}
            family={FontFamily.Inter}
            size={FontSize.ExtraRegular}
          >
            {t(translations.VIEW_PROFILE.BRAND_PROFILE)}
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

          <SpaceBetween>
            <StyledPartition>
              <div>
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
                <StyledLabel family={FontFamily.Inter} size={FontSize.ExtraSmall}>
                  {t(translations.FORM_LABELS.COMPANY_NAME)}
                </StyledLabel>
                {formFields.businessName ? (
                  <Text
                    weight={FontWeight.Medium}
                    family={FontFamily.Inter}
                    size={FontSize.Small}
                  >
                    {capitalizeFirstLetter(formFields.businessName)}
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
              </div>
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

          <SpaceBetween>
            <StyledPartition>

              <ViewLinks
                labelKey={translations.VIEW_PROFILE.WEB_URL}
                formFields={formFields}
                formKey={"website"}
              />

              <MultipleValues
                labelKey={translations.VIEW_PROFILE.INDUSTRY_EXP}
                formFields={formFields}
                serverConstantKey={ServerConstantKeys.industryExperience}
                formKey={"industryExperience"}
              />

              <ViewText
                formFields={formFields}
                formKey={"foundingHistory"}
                labelKey={translations.VIEW_PROFILE.FOUNDING_HIST}
                serverConstantKey={ServerConstantKeys.foundingHistory}
              />
              <ViewText
                formFields={formFields}
                formKey={"staffSize"}
                labelKey={translations.FORM_LABELS.COMPANY_SIZE}
                serverConstantKey={ServerConstantKeys.staffSize}
              />

              <ViewText
                formFields={formFields}
                formKey={"hqLocation"}
                labelKey={translations.VIEW_PROFILE.HQ_LOCATION}
                serverConstantKey={ServerConstantKeys.countries}
              />
            </StyledPartition>
            <StyledPartition>
              <ViewLinks
                labelKey={translations.VIEW_PROFILE.LINK_URL}
                formFields={formFields}
                formKey={"linkedinUrl"}
              />

              <MultipleValues
                labelKey={translations.VIEW_PROFILE.SEGMENT_EXP}
                formFields={formFields}
                serverConstantKey={ServerConstantKeys.segmentExperience}
                formKey={"segmentExperience"}
              />

              <MultipleValues
                labelKey={translations.VIEW_PROFILE.LANGUAUGES}
                formFields={formFields}
                serverConstantKey={ServerConstantKeys.languageSpoken}
                formKey={"languagesSpoken"}
              />

              <ViewText
                formFields={formFields}
                formKey={"annualTurnover"}
                labelKey={translations.VIEW_PROFILE.TURNOVER}
                serverConstantKey={ServerConstantKeys.annualTurnover}
              />

              <MultipleValues
                labelKey={translations.VIEW_PROFILE.INTERNATIONAL_PRESENCE}
                formFields={formFields}
                serverConstantKey={ServerConstantKeys.countries}
                formKey={"internationalPresence"}
              />

            </StyledPartition>
          </SpaceBetween>



          <SpaceBetween>
            <StyledPartition>
              <StyledLabel family={FontFamily.Inter} size={FontSize.ExtraSmall}>
                {t(translations.VIEW_PROFILE.CHINESE_PRESENCE)}
              </StyledLabel>
              {formFields.presenceInChina ? (
                <Text
                  weight={FontWeight.Medium}
                  family={FontFamily.Inter}
                  size={FontSize.Small}
                >
                  {capitalizeFirstLetter(formFields.presenceInChina)}
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
              <ViewText
                formFields={formFields}
                formKey={"experienceInChina"}
                labelKey={translations.VIEW_PROFILE.CHINESE_EXPERIENCE}
                serverConstantKey={ServerConstantKeys.experienceInChina}
              />
            </StyledPartition>
          </SpaceBetween>
        </StyledRightChild>

        <StyledLabel family={FontFamily.Inter} size={FontSize.ExtraSmall}>
          {t(translations.VIEW_PROFILE.UPLOADED)}
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
      </PageContainer>
    </div>
  );
}
