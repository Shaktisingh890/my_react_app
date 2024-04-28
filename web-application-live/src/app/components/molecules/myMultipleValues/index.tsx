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
  getConstantLabel,
  useServerConstants,
} from "apiCalls/dashboard";
import Label from "app/components/atoms/label";
import {
  StyledLabel,
} from "./style";

export default function MyMultipleValues(props: any) {

  const [constants] = useServerConstants(
    props.serverConstantKey
  );
  const { t } = useTranslation();

  return (

    <>

      <StyledLabel family={FontFamily.Inter} size={FontSize.ExtraSmall}>
        {t(props.labelKey)}
      </StyledLabel>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>

        {props.formFields[props.formKey] && props.formFields[props.formKey].length ? (
          props.formFields[props.formKey].map((item, i) => (

            <Label key={i} field={getConstantLabel(item, constants)} />

          ))
        )

          : (
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

    </>

  )
}