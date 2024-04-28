import React from 'react'
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { colorList } from "consts/color";

import {
    FontFamily,
    FontSize,
    FontWeight,
    Text,
  } from "app/components/atoms/text";

export default function NoContent() {
  const { t } = useTranslation();

  return (
    <Text
    weight={FontWeight.Medium}
    family={FontFamily.Inter}
    color={colorList.grey4}
    size={FontSize.Small}
    >
    {t(translations.VIEW_PROFILE.NO_CONTENT)}
  </Text>
  )
}
