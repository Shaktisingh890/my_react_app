import React, { useEffect, useState } from "react";
import {
  createProfileApi,
  fileUploadApi,
  getUserProfileDetail,
} from "apiCalls/profile";
import { Button } from "app/components/atoms/mybutton";
import Dropdown from "app/components/atoms/dropdown";
import { InputField } from "app/components/atoms/inputField";
import { TextArea } from "app/components/atoms/textArea";
import MultiSelect from "app/components/molecules/multiSelect";
import { colorList } from "consts/color";
import {
  brandSchema,
  websiteSchema,
  requiredSchema,
  requiredArraySchema,
} from "schema";
import Notify from "utils/notification";
import { Divider, Footer, RowContainer, StyledDivider } from "./style";
import { privatePaths } from "consts/paths";
import { useHistory } from "react-router-dom";
import Loader from "utils/loader";
import { customStyles, IFileType } from "./brandForm";
import { FileUpload } from "app/components/molecules/fileUpload";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { ServerConstantKeys } from "apiCalls/dashboard";

export interface IServiceProfileFormField {
  email?: string;
  linkedinUrl: string;
  mainSpecialities: string[];
  additionalCapacities?: string[];
  industryExperience: string[];
  businessName: string;
  description: string;
  logo: IFileType;
  internationalPresence?: string[];
  staffSize: string;
  website?: string;
  hqLocation: string;
  languagesSpoken: string[];
  locationsInChina: string[];
  foundingHistory: string;
  companyRegistrationType?: string;
  docs: IFileType[];
  otherDetails: string;
  annualTurnover?: string;
  services: string;
  notableClients: string;
  projectBasedFeeUSD: string;
  retainerBasedFeeUSD: string;
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
export interface IServiceValidField {
  // mainSpecialities: boolean;
  industryExperience: boolean;
  businessName: boolean;
  logo: boolean;
  staffSize: boolean;
  website?: boolean;
  hqLocation: boolean;
  languagesSpoken: boolean;
  locationsInChina: boolean;
  foundingHistory: boolean;
  bankAccDetails: {
    accountName?: boolean;
    accountNumber?: boolean;
    bankName?: boolean;
    bankAddress?: boolean;
    bankCode?: boolean;
    swiftCode?: boolean;
    country?: boolean;
  }

}

export const ServiceProfileForm = ({ accountType }) => {
  const initialServiceState: IServiceProfileFormField = {
    email: "",
    businessName: "",
    description: "",
    linkedinUrl: "",
    logo: {},
    mainSpecialities: [],
    industryExperience: [],
    staffSize: "",
    website: "",
    hqLocation: "",
    languagesSpoken: [],
    locationsInChina: [],
    foundingHistory: "",
    docs: [],
    otherDetails: "",
    services: "",
    notableClients: "",
    projectBasedFeeUSD: "",
    retainerBasedFeeUSD: "",
    bankAccDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      bankAddress: "",
      bankCode: "",
      swiftCode: "",
      country: ""
    }

  };

  const initialServiceValidState: IServiceValidField = {
    businessName: false,
    logo: false,
    // mainSpecialities: false,
    industryExperience: false,
    staffSize: false,
    website: false,
    hqLocation: false,
    languagesSpoken: false,
    locationsInChina: false,
    foundingHistory: false,
    bankAccDetails: {
      accountName: false,
      accountNumber: false,
      bankName: false,
      bankAddress: false,
      bankCode: false,
      swiftCode: false,
      country: false,
    }

  };

  const [loading, setLoading] = useState<boolean>(false);
  const [formFields, setFormFields] =
    useState<IServiceProfileFormField>(initialServiceState);
  const [logoLoading, setLogoLoading] = useState<boolean>(false);
  const [docsLoading, setDocsLoading] = useState<boolean>(false);
  const [validFields, setValidFields] = useState<IServiceValidField>(
    initialServiceValidState
  );
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);

  const history = useHistory();
  const { t } = useTranslation();

  const handleChange = (value: string | string[], label: string) => {
    setFormFields({
      ...formFields,
      [label]: value,
    });
  };

  const handleValid = (label: string, valid: boolean) => {
    setValidFields((f) => ({
      ...f,
      [label]: valid,
    }));
  };

  const handleLogoChange = (value: File) => {
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
      uploadedFiles.filter((i: IFileType) => i.original !== value.original)
    );
  };

  const handleAdditionalInfoChange = async (value: File[]) => {
    setDocsLoading(true);
    Promise.all(
      Array.from(value).map((url) => fileUploadApi(url).then((e) => e))
    )
      .then((data) => {
        let tempFiles = [...uploadedFiles];
        data.map((i) => tempFiles.push(i));
        setUploadedFiles(tempFiles);
        setDocsLoading(false);
        setValidFields((f) => ({
          ...f,
          docs: true,
        }));
      })
      .catch((error) => {
        Notify({
          title: t(translations.ERROR_NOTIFY.FILE),
          message: error,
          type: "danger",
        });
        setDocsLoading(false);
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


    setLoading(true);
    let tempList: any = { ...formFields };



    tempList.bankAccDetails = {
      accountName: tempList.accountName,
      accountNumber: tempList.accountNumber,
      bankName: tempList.bankName,
      bankAddress: tempList.bankAddress,
      bankCode: tempList.bankCode,
      swiftCode: tempList.swiftCode,
      country: tempList.country
    }

    delete tempList.accountName
    delete tempList.accountNumber
    delete tempList.bankName
    delete tempList.bankAddress
    delete tempList.bankCode
    delete tempList.swiftCode
    delete tempList.country

    tempList.email = undefined;
    tempList.annualTurnover = undefined;
    tempList.additionalCapacities = undefined;
    tempList.internationalPresence = undefined;
    tempList.companyRegistrationType = undefined;

    if (!tempList.description) tempList.description = undefined;
    if (!tempList.linkedinUrl) tempList.linkedinUrl = undefined;
    if (!tempList.otherDetails) tempList.otherDetails = undefined;
    if (!tempList.services) tempList.services = undefined;
    if (!tempList.notableClients) tempList.notableClients = undefined;
    if (!tempList.projectBasedFeeUSD) tempList.projectBasedFeeUSD = undefined;
    if (!tempList.retainerBasedFeeUSD) tempList.retainerBasedFeeUSD = undefined;

    createProfileApi({ ...tempList, mainSpecialities: Array.isArray(tempList.mainSpecialities) ? tempList.mainSpecialities : [tempList.mainSpecialities] })
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
    }
  };

  useEffect(() => {
    if (accountType === "serviceProvider") {
      setLoading(true);
      getUserProfileDetail("serviceProvider")
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
            ...(resp.bankAccDetails || {})
          });
          setLoading(false);
        })
        .catch((error) => {
          Notify({
            title: t(translations.ERROR_NOTIFY.ACCOUNT_DETAILS),
            message: error,
            type: "danger",
          });
          setFormFields(initialServiceState);
          setLoading(false);
        });
    }
  }, [accountType]);

  useEffect(() => {
    setDisableButton(Object.values(validFields).includes(false));
  }, [validFields]);

  useEffect(() => {
    if (formFields?.logo?.original) {
      setValidFields((f) => ({
        ...f,
        logo: true,
      }));
    }
  }, [formFields.logo]);

  if (loading) {
    return <Loader />;
  } else {
    return (
      <>
        <Dropdown
          useServerConstant={ServerConstantKeys.mainSpecialities}
          schema={requiredSchema}
          required
          handleValidationCheck={(valid: boolean) =>
            handleValid("mainSpecialities", valid)
          }
          label={t(translations.FORM_LABELS.TYPE_OF_SERVCIES)}
          defaultValue={typeof (formFields.mainSpecialities) === "object" ? formFields.mainSpecialities[0] : formFields.mainSpecialities}
          handleDropdownChange={(val: string[]) =>
            handleChange(val, "mainSpecialities")
          }
        />

        <Divider margin={customStyles.divider1} />

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

        <TextArea
          label={t(translations.FORM_LABELS.SERVICES)}
          maxCharacters={300}
          defaultValue={formFields.services}
          handleTextAreaChange={(val: string) => handleChange(val, "services")}
        />
        <Divider margin={customStyles.divider1} />
        <RowContainer>
          <InputField
            label={t(translations.FORM_LABELS.WEBSITE_URL)}
            schema={websiteSchema}
            required
            handleValidationCheck={(valid: boolean) =>
              handleValid("website", valid)
            }
            defaultValue={formFields.website}
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

        <Dropdown
          useServerConstant={ServerConstantKeys.staffSize}
          label={t(translations.FORM_LABELS.COMPANY_SIZE)}
          required
          schema={requiredSchema}
          handleValidationCheck={(valid: boolean) =>
            handleValid("staffSize", valid)
          }
          defaultValue={formFields.staffSize}
          handleDropdownChange={(val: string) =>
            handleChange(val, "staffSize")
          }
        />
        <Divider margin={customStyles.divider1} />

        <RowContainer>

          <MultiSelect
            useServerConstant={ServerConstantKeys.chinaProvinces}
            label={t(translations.FORM_LABELS.CHINA_LOCATION)}
            required
            schema={requiredArraySchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("locationsInChina", valid)
            }
            defaultValues={formFields.locationsInChina}
            handleDropdownChange={(val: string) =>
              handleChange(val, "locationsInChina")
            }
          />
          <Dropdown
            useServerConstant={ServerConstantKeys.countries}
            label={t(translations.VIEW_PROFILE.HQ_LOCATIONS)}
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

          <Divider margin={customStyles.divider1} />

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
            useServerConstant={ServerConstantKeys.projectStartingFee_USD}
            label={t(translations.FORM_LABELS.PROJECT_STARTING_FEE)}
            defaultValue={formFields.projectBasedFeeUSD}
            handleDropdownChange={(val: string[]) =>
              handleChange(val, "projectBasedFeeUSD")
            }
          />

          <Dropdown
            useServerConstant={ServerConstantKeys.projectStartingFee_USD}
            label={t(translations.FORM_LABELS.RETAINER_STARTING_FEE)}
            defaultValue={formFields.retainerBasedFeeUSD}
            handleDropdownChange={(val: string[]) =>
              handleChange(val, "retainerBasedFeeUSD")
            }
          />
        </RowContainer>


        <Divider margin={customStyles.divider1} />

        <MultiSelect
          useServerConstant={ServerConstantKeys.industryExperience}
          label={t(translations.FORM_LABELS.INDUSTRY_EXPER)}
          required
          schema={requiredArraySchema}
          handleValidationCheck={(valid: boolean) =>
            handleValid("industryExperience", valid)
          }
          defaultValues={formFields.industryExperience}
          handleDropdownChange={(val: string[]) =>
            handleChange(val, "industryExperience")
          }
        />

        <Divider margin={customStyles.divider1} />

        <TextArea
          label={t(translations.FORM_LABELS.NOTABLE_CLIENTS)}
          maxCharacters={300}
          defaultValue={formFields.notableClients}
          handleTextAreaChange={(val: string) =>
            handleChange(val, "notableClients")
          }
        />
        <Divider margin={customStyles.divider1} />

        <TextArea
          label={t(translations.FORM_LABELS.CASE_STUDY_EXP)}
          defaultValue={formFields.otherDetails}
          handleTextAreaChange={(val: string) =>
            handleChange(val, "otherDetails")
          }
        />

        <Divider margin={customStyles.divider1} />

        <FileUpload
          label={t(translations.FORM_LABELS.LOGO_UPLOAD)}
          accept={customStyles.acceptType2}
          required
          loading={logoLoading}
          uploadedFiles={[formFields.logo]}
          handleInputChange={(val: any) => handleLogoChange(val)}
        />


        <Divider margin={customStyles.divider1} />


        <FileUpload
          label={t(translations.FORM_LABELS.COMPANY_INTRODUCTIONS)}
          multiple
          uploadedFiles={uploadedFiles}
          handleFileDeletion={handleFileDeletion}
          loading={docsLoading}
          accept={customStyles.acceptType1}
          handleInputChange={(val: File[]) => handleAdditionalInfoChange(val)}
        />

        <StyledDivider />


        <RowContainer>
          <InputField
            label={t(translations.ACCOUNT_DETAILS.ACCOUNT_NAME)}

            required
            schema={requiredSchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("accountName", valid)
            }
            defaultValue={formFields.bankAccDetails?.accountName}
            handleInputChange={(val: string) => handleChange(val, "accountName")}
          />
          <InputField
            label={t(translations.ACCOUNT_DETAILS.ACCOUNT_NUMBER)}
            required
            schema={requiredSchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("accountNumber", valid)
            }
            defaultValue={formFields.bankAccDetails?.accountNumber}
            handleInputChange={(val: string) =>
              handleChange(val, "accountNumber")
            }
          />
        </RowContainer>
        <Divider margin={customStyles.divider1} />
        <RowContainer>
          <InputField
            label={t(translations.ACCOUNT_DETAILS.BANK_NAME)}

            required
            schema={requiredSchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("bankName", valid)
            }
            defaultValue={formFields.bankAccDetails?.bankName}
            handleInputChange={(val: string) => handleChange(val, "bankName")}
          />
          <InputField
            label={t(translations.ACCOUNT_DETAILS.BANK_CODE)}
            required
            schema={requiredSchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("bankCode", valid)
            }
            defaultValue={formFields.bankAccDetails?.bankCode}
            handleInputChange={(val: string) =>
              handleChange(val, "bankCode")
            }
          />
        </RowContainer>
        <Divider margin={customStyles.divider1} />
        <TextArea
          label={t(translations.ACCOUNT_DETAILS.BANK_ADDRESS)}
          required
          schema={requiredSchema}
          handleValidationCheck={(valid: boolean) =>
            handleValid("bankAddress", valid)
          }
          defaultValue={formFields.bankAccDetails?.bankAddress}
          handleTextAreaChange={(val: string) =>
            handleChange(val, "bankAddress")
          }
        />
        <Divider margin={customStyles.divider1} />
        <RowContainer>
          <InputField
            label={t(translations.ACCOUNT_DETAILS.SWIFT_CODE)}

            required
            schema={requiredSchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("swiftCode", valid)
            }
            defaultValue={formFields.bankAccDetails?.swiftCode}
            handleInputChange={(val: string) => handleChange(val, "swiftCode")}
          />
          <InputField
            label={t(translations.ACCOUNT_DETAILS.COUNTRY)}
            required
            schema={requiredSchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("country", valid)
            }
            defaultValue={formFields.bankAccDetails?.country}
            handleInputChange={(val: string) =>
              handleChange(val, "country")
            }
          />
        </RowContainer>
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