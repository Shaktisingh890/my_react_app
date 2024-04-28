import {
  createProfileApi,
  fileUploadApi,
  getUserProfileDetail,
} from "apiCalls/profile";
import { Button } from "app/components/atoms/mybutton";
import Dropdown from "app/components/atoms/dropdown";
import { InputField } from "app/components/atoms/inputField";
import { TextArea } from "app/components/atoms/textArea";
import { FileUpload } from "app/components/molecules/fileUpload";
import MultiSelect from "app/components/molecules/multiSelect";
import { colorList } from "consts/color";
import { yesNo } from "consts/dropdown";
import { privatePaths } from "consts/paths";
import { translations } from "locales/translations";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  brandSchema,
  websiteSchema,
  requiredSchema,
  requiredArraySchema,
} from "schema";
import Loader from "utils/loader";
import Notify from "utils/notification";
import { Divider, Footer, RowContainer } from "./style";
import { useTranslation } from "react-i18next";
import { AccountType } from "app/modules/iam/pages/createAccount";
import { ServerConstantKeys } from "apiCalls/dashboard";

export interface IFileType {
  fileType?: string;
  mimeType?: string;
  original?: string;
  thumbnail?: string;
  name?: string;
  _id?: string;
}
export interface IBrandProfileFormField {
  email?: string;
  businessName: string;
  description: string;
  logo: IFileType;
  linkedinUrl: string;
  annualTurnover: string;
  segmentExperience: string[];
  docs: IFileType[];
  staffSize: string;
  website: string;
  languagesSpoken: string[];
  hqLocation: string;
  industryExperience: string[];
  foundingHistory: string;
  internationalPresence: string[];
  presenceInChina: string;
  experienceInChina: string;
}
export interface IBrandProfileValidField {
  businessName: boolean;
  logo: boolean;
  segmentExperience: boolean;
  staffSize: boolean;
  website: boolean;
  languagesSpoken: boolean;
  hqLocation: boolean;
  industryExperience: boolean;
  foundingHistory: boolean;
  presenceInChina: boolean;
  experienceInChina: boolean;
}

export const BrandProfileForm = ({ accountType }) => {
  const initialBrandState: IBrandProfileFormField = {
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

  const initialBrandValidState: IBrandProfileValidField = {
    businessName: false,
    logo: false,
    segmentExperience: false,
    staffSize: false,
    website: false,
    languagesSpoken: false,
    hqLocation: false,
    industryExperience: false,
    foundingHistory: false,
    presenceInChina: false,
    experienceInChina: false,
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [formFields, setFormFields] =
    useState<IBrandProfileFormField>(initialBrandState);
  const [validFields, setValidFields] = useState<IBrandProfileValidField>(
    initialBrandValidState
  );
  const [docsLoading, setDocsLoading] = useState<boolean>(false);
  const [logoLoading, setLogoLoading] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  // const [showUploadButton, setShowUploadButton] = useState<boolean>(true);

  const { t } = useTranslation();
  const history = useHistory();

  const handleChange = (value: string | string[], label: string) => {
    if (value === "no" && label === "presenceInChina") {
      setFormFields({
        ...formFields,
        [label]: value,
        experienceInChina: "",
      });
    } else {
      setFormFields({
        ...formFields,
        [label]: value,
      });
    }
  };

  useEffect(() => {
    if (formFields.presenceInChina === "no")
      setValidFields((f) => ({
        ...f,
        experienceInChina: true,
      }));
  }, [formFields.presenceInChina]);

  const handleValid = (label: string, valid: boolean) => {
    setValidFields((f) => ({
      ...f,
      [label]: valid,
    }));
  };

  const handleLogoFileChange = (value: File) => {
    setLogoLoading(true);
    fileUploadApi(value[0])
      .then((resp) => {
        setFormFields({
          ...formFields,
          logo: resp,
        });
        setLogoLoading(false);
      })
      .catch((error) => {
        Notify({
          title: t(translations.ERROR_NOTIFY.LOGO),
          message: error,
          type: "danger",
        });
        setValidFields((f) => ({
          ...f,
          logo: false,
        }));
        setLogoLoading(false);
      });
  };

  const handleFileDeletion = (value: IFileType) => {
    setUploadedFiles(
      uploadedFiles.filter((i: IFileType) => {
        if (value._id) {
          return i._id !== value._id;
        }
        return i.original !== value.original;
      })
    );
  };

  const handleAdditionalInfoChange = async (value: File[]) => {

    if (value.length + uploadedFiles.length > 3) {
      Notify({
        title: t(translations.ERROR_NOTIFY.FILE),
        message: t(translations.ERROR_NOTIFY.MAX_FILE),
        type: "warning",
      });
    } else {
      setDocsLoading(true);
      Promise.all(
        Array.from(value).map((url) => fileUploadApi(url).then((e) => e))
      )
        .then((data) => {

          let tempFiles = [...uploadedFiles];
          data.map((i) => tempFiles.push(i));
          setUploadedFiles(tempFiles);
          setDocsLoading(false);
        })
        .catch((error) => {
          Notify({
            title: t(translations.ERROR_NOTIFY.FILE),
            message: error,
            type: "danger",
          });
          setDocsLoading(false);
        });
    }
  };

  const handleProfileApi = (fields: any) => {
    setLoading(true);
    createProfileApi(fields)
      .then(() => {
        setLoading(false);
        Notify({
          title: t(translations.SUCCESS_NOTIFY.ACCOUNT),
          message: "",
          type: "success",
        });
        history.push(privatePaths.dashboardProfile);
      })
      .catch((error) => {
        setLoading(false);
        Notify({
          title: t(translations.ERROR_NOTIFY.ACCOUNT),
          message: error,
          type: "danger",
        });
      });
  };

  const handleSaveButton = () => {

    if(Object.values(validFields).includes(false)) {

      Notify({
        title: t(translations.ERROR_NOTIFY.ACCOUNT),
        message: "Please fill all the required fields.",
        type: "danger",
      });

    } else {
      let tempList: any = { ...formFields };

      tempList.email = undefined;
      tempList.docs = uploadedFiles;

      if (!tempList.description) tempList.description = undefined;
      if (!tempList.linkedinUrl) tempList.linkedinUrl = undefined;
      if (!tempList.annualTurnover) tempList.annualTurnover = undefined;

      if (tempList.presenceInChina === "no")
        tempList.experienceInChina = undefined;

      tempList.presenceInChina =
        tempList.presenceInChina === "yes" ? true : false;

      handleProfileApi(tempList);
    }

  };

  useEffect(() => {
    if (accountType === AccountType.BRAND) {
      setLoading(true);
      getUserProfileDetail(AccountType.BRAND)
        .then((resp: any) => {
          let obj = { original: null, thumbnail: null };
          if (resp.logo) {
            setValidFields((f) => ({
              ...f,
              logo: JSON.stringify(resp.logo) === JSON.stringify(obj),
            }));
          }
          if (resp.docs.length > 0) {
            setUploadedFiles(resp.docs);
          }

          setFormFields({
            ...resp,
            logo:
              JSON.stringify(resp.logo) === JSON.stringify(obj)
                ? undefined
                : resp.logo,
          });
          setLoading(false);
        })
        .catch((error) => {
          Notify({
            title: t(translations.ERROR_NOTIFY.ACCOUNT_DETAILS),
            message: error,
            type: "danger",
          });
          setFormFields(initialBrandState);
          setLoading(false);
        });
    }
  }, [accountType]);

  useEffect(() => {
    setDisableButton(Object.values(validFields).includes(false));
  }, [validFields]);

  useEffect(() => {
    if (formFields?.logo?.original)
      setValidFields((f) => ({
        ...f,
        logo: true,
      }));
  }, [formFields.logo]);

  if (loading) {
    return <Loader />;
  } else {
    return (
      <>
        <InputField
          label={t(translations.FORM_LABELS.COMPANY_NAME)}
          schema={brandSchema}
          required
          defaultValue={formFields.businessName}
          handleValidationCheck={(valid: boolean) =>
            handleValid("businessName", valid)
          }
          handleInputChange={(val: string) => handleChange(val, "businessName")}
        />
        <Divider margin={customStyles.divider1} />
        <TextArea
          label={t(translations.FORM_LABELS.ABOUT)}
          maxCharacters={300}
          defaultValue={formFields.description}
          handleTextAreaChange={(val: string) =>
            handleChange(val, "description")
          }
        />
        <Divider margin={customStyles.divider1} />
        <RowContainer>
          <InputField
            label={t(translations.FORM_LABELS.WEBSITE_URL)}
            required
            schema={websiteSchema}
            defaultValue={formFields.website}
            handleValidationCheck={(valid: boolean) =>
              handleValid("website", valid)
            }
            handleInputChange={(val: string) => handleChange(val, "website")}
          />
          <InputField
            label={t(translations.FORM_LABELS.LINKEDIN_URL)}
            defaultValue={formFields.linkedinUrl}
            handleInputChange={(val: string) =>
              handleChange(val, "linkedinUrl")
            }
          />
        </RowContainer>
        <Divider margin={customStyles.divider1} />
        <RowContainer>
          <MultiSelect
            useServerConstant={ServerConstantKeys.industryExperience}
            required
            label={t(translations.FORM_LABELS.INDUSTRY_EXP)}
            defaultValues={formFields.industryExperience}
            handleDropdownChange={(val: string[]) =>
              handleChange(val, "industryExperience")
            }
            schema={requiredArraySchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("industryExperience", valid)
            }
          />


          <MultiSelect
            useServerConstant={ServerConstantKeys.segmentExperience}
            label={t(translations.FORM_LABELS.SEGMENT)}
            required
            schema={requiredArraySchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("segmentExperience", valid)
            }
            defaultValues={formFields.segmentExperience}
            handleDropdownChange={(val: string[]) =>
              handleChange(val, "segmentExperience")
            }
          />
        </RowContainer>
        <Divider margin={customStyles.divider1} />
        <RowContainer>
          <Dropdown
            useServerConstant={ServerConstantKeys.experienceInChina}
            required
            schema={requiredSchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("foundingHistory", valid)
            }
            label={t(translations.FORM_LABELS.FOUNDING_HISTORY)}
            defaultValue={formFields.foundingHistory}
            handleDropdownChange={(val: string) =>
              handleChange(val, "foundingHistory")
            }
          />
          <MultiSelect
            useServerConstant={ServerConstantKeys.languageSpoken}
            label={t(translations.FORM_LABELS.LANGUAGES_SPOKEN)}
            required
            sort={true}
            schema={requiredArraySchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("languagesSpoken", valid)
            }
            defaultValues={formFields.languagesSpoken}
            handleDropdownChange={(val: string) =>
              handleChange(val, "languagesSpoken")
            }
          />

        </RowContainer>
        <Divider margin={customStyles.divider1} />

        <RowContainer>
          <Dropdown
            useServerConstant={ServerConstantKeys.staffSize}
            required
            schema={requiredSchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("staffSize", valid)
            }
            label={t(translations.FORM_LABELS.COMPANY_SIZE)}
            defaultValue={formFields.staffSize}
            handleDropdownChange={(val: string) => handleChange(val, "staffSize")}
          />
          <Dropdown
            useServerConstant={ServerConstantKeys.annualTurnover}
            label={t(translations.FORM_LABELS.ANNUAL_TURNOVER)}
            defaultValue={formFields.annualTurnover}
            handleDropdownChange={(val: string) =>
              handleChange(val, "annualTurnover")
            }
          />
        </RowContainer>
        <Divider margin={customStyles.divider1} />
        <RowContainer>
          <Dropdown
            useServerConstant={ServerConstantKeys.countries}
            label={t(translations.FORM_LABELS.HQ_LOCATION)}
            required
            schema={requiredSchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("hqLocation", valid)
            }
            defaultValue={formFields.hqLocation}
            handleDropdownChange={(val: string[]) =>
              handleChange(val, "hqLocation")
            }
          />
          <MultiSelect
            useServerConstant={ServerConstantKeys.countries}
            label={t(translations.FORM_LABELS.OTHER_LOCATIONS)}
            defaultValues={formFields.internationalPresence}
            handleDropdownChange={(val: string[]) =>
              handleChange(val, "internationalPresence")
            }
          />



        </RowContainer>
        <Divider margin={customStyles.divider1} />
        <RowContainer>
          <Dropdown
            dropdownList={yesNo}
            required
            schema={requiredSchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("presenceInChina", valid)
            }
            label={t(translations.FORM_LABELS.PRESENCE_IN_CHINA)}
            defaultValue={formFields.presenceInChina}
            handleDropdownChange={(val: string) =>
              handleChange(val, "presenceInChina")
            }
          />
          {formFields.presenceInChina === "yes" && (
            <Dropdown
              useServerConstant={ServerConstantKeys.experienceInChina}
              required
              schema={requiredSchema}
              handleValidationCheck={(valid: boolean) =>
                handleValid("experienceInChina", valid)
              }
              label={t(translations.FORM_LABELS.EXPERIENCE_IN_CHINA)}
              defaultValue={formFields.experienceInChina}
              handleDropdownChange={(val: string) =>
                handleChange(val, "experienceInChina")
              }
            />
          )}
        </RowContainer>


        <Divider margin={customStyles.divider1} />
        <FileUpload
          label={t(translations.FORM_LABELS.COMPANY_LOGO)}
          required
          loading={logoLoading}
          uploadedFiles={[formFields.logo]}
          accept={customStyles.acceptType2}
          handleInputChange={(val: any) => handleLogoFileChange(val)}
        />

        <Divider margin={customStyles.divider1} />


        {/* {showUploadButton &&} */}
        <FileUpload
          label={t(translations.FORM_LABELS.ADDITIONAL_INFO_SUBTITLE)}
          subtitleText={t(translations.FORM_LABELS.ADDITIONAL_INFO_VALIDATION)}
          multiple
          uploadedFiles={uploadedFiles}
          handleFileDeletion={handleFileDeletion}
          loading={docsLoading}
          uploadMore={true}
          accept={customStyles.acceptType1}
          maxFiles={2}
          handleInputChange={(val: File[]) => handleAdditionalInfoChange(val)}
        />
        <Divider margin={customStyles.divider1} />
        <Footer>
          <Button
            text={t(translations.BUTTONS.SAVE_PROCCED)}
            textColor={colorList.white1}
            borderColor={colorList.blue1}
            color={colorList.blue1}
            onClick={handleSaveButton}
            // disabled={disableButton}
          />
        </Footer>
      </>
    );
  }
};

export const customStyles = {
  divider1: "1.5rem 0",
  divider2: "5rem 0",
  acceptType2: "image/*",
  acceptType1:
    "application/pdf,application/msword,'application/powerpoint', application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};
