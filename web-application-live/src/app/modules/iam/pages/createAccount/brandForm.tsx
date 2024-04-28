import { ServerConstantKeys } from "apiCalls/dashboard";
import { InputField } from "app/components/atoms/inputField";
import MultiSelect from "app/components/molecules/multiSelect";
import { translations } from "locales/translations";
import React from "react";
import { useTranslation } from "react-i18next";
import { brandSchema, requiredArraySchema } from "schema";
import { customStyles } from ".";
import { Divider } from "./style";

export const BrandForm = ({ handleChange, handleValid }) => {
  const { t } = useTranslation();

  return (
    <>
      <InputField
        label={t(translations.FORM_LABELS.BRAND_NAME)}
        schema={brandSchema}
        required
        handleValidationCheck={(valid: boolean) =>
          handleValid("businessName", valid)
        }
        handleInputChange={(val: string) => handleChange(val, "businessName")}
      />
      <Divider margin={customStyles.divider2} />
      <MultiSelect
        useServerConstant={ServerConstantKeys.industryExperience}
        label={t(translations.FORM_LABELS.INDUSTRY_CATEGORY)}
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
