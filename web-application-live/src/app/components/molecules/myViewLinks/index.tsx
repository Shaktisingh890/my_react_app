import React from 'react';
import { colorList } from "consts/color";
import {
    FontFamily,
    FontSize,
    FontWeight,
    Text,
  } from "app/components/atoms/text";
  import { translations } from "locales/translations";
  import { useTranslation } from "react-i18next";
  
  import {
    StyledLabel,
  } from "./style";

export default function ViewLinks(props: any) {

    const { t } = useTranslation();
    return (
      <div>
        <StyledLabel family={FontFamily.Inter} size={FontSize.ExtraSmall}>
          {t(props.labelKey)}
        </StyledLabel>
        {props.formFields[props.formKey] ? (
          <a href={props.formFields[props.formKey]} target="_blank">
            {props.formFields[props.formKey]}
          </a>
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
    )
  
  }