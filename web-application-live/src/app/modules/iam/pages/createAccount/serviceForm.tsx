import { ServerConstantKeys } from "apiCalls/dashboard";
import Dropdown from "app/components/atoms/dropdown";
import { InputField } from "app/components/atoms/inputField";
import MultiSelect from "app/components/molecules/multiSelect";
import { translations } from "locales/translations";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { brandSchema, requiredArraySchema, requiredSchema } from "schema";
import { customStyles } from ".";
import { Divider } from "./style";

export const ServiceForm = ({
  handleChange,
  formFields,
  handleValid,
  setValidFields,
  validFields,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (formFields.companyType === "serviceProvider")
      setValidFields({
        ...validFields,
        distributorType: true,
      });
  }, [formFields.companyType]);

  return (
    <>
      <InputField
        label={t(translations.FORM_LABELS.COMPANY_NAME)}
        schema={brandSchema}
        required
        handleValidationCheck={(valid: boolean) =>
          handleValid("businessName", valid)
        }
        handleInputChange={(val: string) => handleChange(val, "businessName")}
      />
      <Divider margin={customStyles.divider2} />
      <Dropdown
        useServerConstant={ServerConstantKeys.companyTypes}
        label={t(translations.FORM_LABELS.COMPANY_TYPE)}
        schema={requiredSchema}
        required
        handleValidationCheck={(valid: boolean) =>
          handleValid("companyType", valid)
        }
        handleDropdownChange={(val: string) => handleChange(val, "companyType")}
      />
      {formFields.companyType === "distributor" && (
        <>
          <Divider margin={customStyles.divider2} />
          <MultiSelect
            useServerConstant={ServerConstantKeys.distributorType}
            label={t(translations.FORM_LABELS.DISTRIBUTOR_TYPE)}
            required
            schema={requiredArraySchema}
            handleValidationCheck={(valid: boolean) =>
              handleValid("distributorType", valid)
            }
            handleDropdownChange={(val: string[]) =>
              handleChange(val, "distributorType")
            }
          />
        </>
      )}
      <Divider margin={customStyles.divider2} />
      <MultiSelect
        useServerConstant={ServerConstantKeys.mainSpecialities}
        label={t(translations.FORM_LABELS.MAIN_SPECIALITY)}
        required
        schema={requiredArraySchema}
        handleValidationCheck={(valid: boolean) =>
          handleValid("mainSpecialities", valid)
        }
        handleDropdownChange={(val: string[]) =>
          handleChange(val, "mainSpecialities")
        }
      />
      <Divider margin={customStyles.divider2} />
      <MultiSelect
        useServerConstant={ServerConstantKeys.mainSpecialities}
        label={t(translations.FORM_LABELS.ADDITIONAL_CAPACITY)}
        required
        schema={requiredArraySchema}
        handleValidationCheck={(valid: boolean) =>
          handleValid("otherMainSpecialities", valid)
        }
        handleDropdownChange={(val: string[]) =>
          handleChange(val, "otherMainSpecialities")
        }
      />
      <Divider margin={customStyles.divider2} />
      <MultiSelect
        useServerConstant={ServerConstantKeys.industryExperience}
        label={t(translations.FORM_LABELS.INDUSTRY_EXP)}
        required
        schema={requiredArraySchema}
        handleValidationCheck={(valid: boolean) =>
          handleValid("industryExperience", valid)
        }
        handleDropdownChange={(val: string[]) =>
          handleChange(val, "industryExperience")
        }
      />
    </>
  );
};
