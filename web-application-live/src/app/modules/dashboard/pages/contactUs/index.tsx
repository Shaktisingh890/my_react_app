import React, { useState } from 'react';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { InputField } from 'app/components/atoms/inputField';
import {
  fileUploadApi,
} from "apiCalls/profile";

import {
  PageContainer,
  StyledDivider,
  StyledText,
  Thanks
} from "./style";
import { TextArea } from 'app/components/atoms/textArea';
import { Text, FontSize, FontWeight, FontFamily } from 'app/components/atoms/text';
import { Button } from 'app/components/atoms/mybutton';
import { colorList } from 'consts/color';
import { contactTeam } from 'apiCalls/iam';
import Notify from "utils/notification";
import Loader from "utils/loader";
import { FileUpload } from "app/components/molecules/fileUpload";
import { IFileType } from "app/modules/profile/createProfile/brandForm";


export interface IContactUs {
  subject: string;
  query: string;
  docs: string[];
}

export default function ContactUs() {

  const initialContactUsValues = {
    subject: "",
    query: "",
    docs: []
  };

  const [docsLoading, setDocsLoading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>();
  const [formFields, setFormFields] = useState<IContactUs>(initialContactUsValues);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);




  const { t } = useTranslation();


  const onSubmit = async (event: any) => {
    event.preventDefault();
  }
  const onButtonClick = () => {

    const payload = formFields;
    payload.docs = [...uploadedFiles];
    contactTeam(payload)
      .then((res) => {
        setLoading(false);
        setIsSubmitted(true);


      })
      .catch((error) => {

        Notify({
          title: t(translations.ERROR_NOTIFY.CONTACT_US),
          message: error,
          type: "danger",
        });
      });
  }

  const handleChange = (key: string) => (val: string) => {
    setFormFields((prev) => ({ ...prev, [key]: val }));
  }


  const handleAdditionalInfoChange = async (value: File[]) => {
    if (value.length + uploadedFiles.length > 3) {
      Notify({
        title: t(translations.ERROR_NOTIFY.FILE),
        message: t(translations.ERROR_NOTIFY.MAX_FILE),
        type: "warning",
      });
    }
    else {
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

  const handleFileDeletion = (value: IFileType) => {
    setUploadedFiles(
      uploadedFiles.filter((i: IFileType) => {
        if(value._id){
          return i._id !== value._id;
        }
        return i.original !== value.original;
      })
    );
  };


  if (loading) {
    return <Loader />;
  } else {
    return (
      <PageContainer>
        {!isSubmitted ? (<form onSubmit={onSubmit}>
          <Text
            size={FontSize.Large}
            weight={FontWeight.Light}
            family={FontFamily.Roboto}>
            {t(translations.CONTACT_US.TITLE)}
          </Text>
          {/* <StyledDivider />
          <InputField
            label={t(translations.CONTACT_US.FIRST)}
            handleInputChange={handleChange("firstName")}
            required
          />
          <StyledDivider />
          <InputField
            label={t(translations.CONTACT_US.LAST)}
            handleInputChange={handleChange("lastName")}
            required
          />
          <StyledDivider />
          <InputField
            label={t(translations.CONTACT_US.EMAIL)}
            handleInputChange={handleChange("email")}
            required
          />
          <StyledDivider />
          <InputField
            label={t(translations.CONTACT_US.BUSINESS)}
            handleInputChange={handleChange("businessName")}
            required
          /> */}
          <StyledDivider />
          <InputField
            label={t(translations.CONTACT_US.SUBJECT)}
            handleInputChange={handleChange("subject")}
            required
          />
          <StyledDivider />
          <TextArea
            label={t(translations.CONTACT_US.MESSAGE)}
            maxCharacters={500}
            rows={10}
            handleTextAreaChange={handleChange("query")}
            required
          />
          <StyledDivider />
          <FileUpload
            label={t(translations.CONTACT_US.ATTACHMENT)}
            multiple
            maxFiles={3}
            uploadedFiles={uploadedFiles}
            handleFileDeletion={handleFileDeletion}
            loading={docsLoading}
            accept={customStyles.acceptType1}
            handleInputChange={(val: File[]) => {
              return handleAdditionalInfoChange(val)
            }}
          />
          <StyledDivider />
          <Button
            textColor={colorList.white1}
            color={colorList.blue1}
            borderColor={colorList.blue1}
            text={t(translations.TALK_TO_EXPERT.SUBMIT)}
            onClick={onButtonClick}
            disabled={
              !formFields.query ||
              !formFields.subject}
          //todo
          // type="submit"
          />

        </form>)
          : (
            <Thanks>
              <StyledText
                size={FontSize.Large}
                weight={FontWeight.Light}
                family={FontFamily.Inter}
                color={colorList.grey1}
              >
                {t(translations.CONTACT_US.THANKS_MESSAGE)}
              </StyledText>
              <Text
                size={FontSize.Small}
                weight={FontWeight.Light}
                family={FontFamily.Inter}
                color={colorList.black1}
              >
                {t(translations.CONTACT_US.QUERY_SUBMITTED)}
              </Text>
            </Thanks>
          )}

      </PageContainer>
    );
  }

}

export const customStyles = {
  divider1: "1.5rem 0",
  divider2: "5rem 0",
  acceptType2: "image/*",
  acceptType1:
    "application/pdf,application/msword,'application/powerpoint', application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

