import React, { useState, useEffect } from 'react';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { InputField } from 'app/components/atoms/inputField';
import Dropdown from "app/components/atoms/dropdown";
import { Text, FontSize, FontWeight, FontFamily } from 'app/components/atoms/text';

import {
  PageContainer,
  StyledText,
  StyledDivider,
  StyledFont,
  Thanks
} from "./style";
import { TextArea } from 'app/components/atoms/textArea';
import { Button } from 'app/components/atoms/mybutton';
import { colorList } from 'consts/color';
import { talkToExpert } from 'apiCalls/iam';
import Notify from "utils/notification";
import Loader from "utils/loader";

import { requiredSchema } from "schema";
import { talkToExpertTopic } from "consts/dropdown";
export interface IAskToExpertValues {

  topic: string;
  query: string;
}

export default function TalkToExpert() {
  const initialAskToExpertValues = {

    topic: "",
    query: "",
  };

  const [formFields, setFormFields] = useState<IAskToExpertValues>(initialAskToExpertValues);

  const [loading, setLoading] = useState<boolean>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);


  const { t } = useTranslation();


  const handleFieldChange = (key) => (val) => {
    setFormFields((prevVal) => ({ ...prevVal, [key]: val }))

  }

  const handleChange = (val: any) => {
    setFormFields((prevVal) => ({ ...prevVal, ["topic"]: val }))
  };


  const onSubmit = async (event: any) => {
    event.preventDefault();
    const payload = formFields;

    setLoading(true);
    try {
      const talk = await talkToExpert(payload)
      setLoading(false);
      setFormFields(initialAskToExpertValues);
      setIsSubmitted(true);
      Notify({
        title: t(translations.GENERIC.SUCCESS),
        message: t(translations.TALK_TO_EXPERT.SUCCESS_MESSAGE),
        type: "success",
      });
    }
    catch (error) {
      setLoading(false);
      Notify({
        title: t(translations.ERROR_NOTIFY.TALK_TO_EXPERT),
        message: "" + error,
        type: "danger",
      });
    }

  };

  if (loading) {
    return <Loader />;
  } else {
    return (
      <PageContainer>
        {!isSubmitted ? (<form onSubmit={onSubmit}>
          {/* <Text
            size={FontSize.Large}
            weight={FontWeight.Light}
            family={FontFamily.Roboto}>
            {t(translations.TALK_TO_EXPERT.HEADING)}
          </Text> */}
          <StyledText family={FontFamily.Inter} size={FontSize.ExtraSmall}>
            {t(translations.TALK_TO_EXPERT.DISCUSS)}
          </StyledText>

          {/* <InputField
            label={t(translations.TALK_TO_EXPERT.FIRST)}
            handleInputChange={handleFieldChange("firstName")}
            required
          />
          <StyledDivider />
          <InputField
            label={t(translations.TALK_TO_EXPERT.LAST)}
            handleInputChange={handleFieldChange("lastName")}
            required
          />
          <StyledDivider />
          <InputField
            label={t(translations.TALK_TO_EXPERT.BRAND)}
            handleInputChange={handleFieldChange("businessName")}
            required
          />
          <StyledDivider />
          <InputField
            label={t(translations.TALK_TO_EXPERT.EMAIL)}
            handleInputChange={handleFieldChange("email")}
            type="email"
            required
          /> */}
          <StyledDivider />
          <Dropdown
            dropdownList={talkToExpertTopic}
            required
            schema={requiredSchema}
            label={t(translations.TALK_TO_EXPERT.TOPIC)}
            handleDropdownChange={handleChange}
          />
          <StyledDivider />
          <TextArea
            label={t(translations.TALK_TO_EXPERT.QUERY)}
            maxCharacters={500}
            rows={10}
            handleTextAreaChange={handleFieldChange("query")}
            required
          />
          <StyledDivider />
          <Button
            textColor={colorList.white1}
            color={colorList.blue1}
            borderColor={colorList.blue1}
            loading={loading}
            disabled={
              !formFields.query ||
              !formFields.topic}
            text={t(translations.TALK_TO_EXPERT.SUBMIT)}
            type="submit"
          />

        </form>)
          : (
            <Thanks>
              <StyledFont
                size={FontSize.Large}
                weight={FontWeight.Light}
                family={FontFamily.Inter}
                color={colorList.grey1}
              >
                {t(translations.CONTACT_US.THANKS_MESSAGE)}
              </StyledFont>
              <Text
                size={FontSize.Small}
                weight={FontWeight.Light}
                family={FontFamily.Inter}
                color={colorList.black1}
              >
                {t(translations.TALK_TO_EXPERT.SUCCESS_MESSAGE)}
              </Text>
            </Thanks>
          )}

      </PageContainer>
    );
  }
}
