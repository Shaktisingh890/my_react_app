import React, { useState } from 'react';
import {
  StyledHeader,
  StyledContainer,
  Divider,

  FileContent,

  StyledDivider,
  FooterContainer,
  FooterButtons
} from "./style";
import {
  fileUploadApi,
} from "apiCalls/profile";
import { colorList } from 'consts/color';
import { Text, FontFamily, FontSize, FontWeight } from "app/components/atoms/text";
import { TextArea } from 'app/components/atoms/textArea';
import { useTranslation } from 'react-i18next';
import { translations } from "locales/translations";
import { t } from 'i18next';
import { images } from "assets/images/index";
import { Button } from 'app/components/atoms/mybutton';
import Notify from 'utils/notification';
import { useHistory } from 'react-router-dom';
import { sendProposal } from 'apiCalls/proposalManagement';
import { FileUpload } from 'app/components/molecules/fileUpload';
import { requiredSchema } from 'schema';

export interface ISendProposalValues {
  projectId: string;
  docs: object,
  coverLetter: any,
}

export interface IFileType {
  fileType?: string;
  mimeType?: string;
  original?: string;
  thumbnail?: string;
  name?: string;
  _id?: string;
}



export default function ProposelCoverLetter({ projectId, onClose }) {


  const initialSendProposalValues = {

    projectId: projectId,
    docs: [],
    coverLetter: "",
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<ISendProposalValues>(
    initialSendProposalValues
  );
  const [docsLoading, setDocsLoading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);

  const history = useHistory();

  const { t } = useTranslation();

  const handleSendProposal = async () => {
    formFields.docs = [...uploadedFiles];
    setLoading(true);
    try {
      const data = await sendProposal(formFields);

      setLoading(false);
      Notify({
        title: "",
        message: t(translations.COVER_LETTER.SUCCESS_MSG),
        type: "success",
      });
      onClose && onClose();
    } catch (error) {

      setLoading(false);
      Notify({
        title: "",
        message: t(translations.COVER_LETTER.ERROR_MSG),
        type: "danger",
      });
    }
  };

  const handleFieldChange = (val: any) => {
    setFormFields((prevVal) => ({ ...prevVal, ["coverLetter"]: val }));
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
    if (value.length + uploadedFiles.length === 0) {
    }

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

          setUploadedFiles(() => [...tempFiles]);
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

  return (
    <StyledContainer>
      <StyledHeader>
        <Text
          family={FontFamily.Inter}
          size={FontSize.ExtraRegular}
          weight={FontWeight.SemiBold}
          color={colorList.blue7}
        >
          {t(translations.COVER_LETTER.PROPOSEL)}
        </Text>
        <div onClick={onClose}>
          <img src={images.cross} width="15px" height="15px" />
        </div>
      </StyledHeader>
      <Divider />
      <TextArea
        label={t(translations.COVER_LETTER.COVER_LETTER)}
        handleTextAreaChange={handleFieldChange}
        required
        schema={requiredSchema}
        rows={10}
      />

      <FileContent>

        <FileUpload
          label={t(translations.COVER_LETTER.ATTACHMENTS)}
          multiple
          uploadedFiles={uploadedFiles}
          handleFileDeletion={handleFileDeletion}
          loading={docsLoading}
          accept={customStyles.acceptType1}
          maxFiles={2}
          required
          uploadMore={true}
          handleInputChange={(val: File[]) => handleAdditionalInfoChange(val)}
        />

      </FileContent>
      <StyledDivider />
      <FooterContainer>
        <FooterButtons>
          <Button
            text={t(translations.COVER_LETTER.CANCEL)}
            textColor={colorList.black1}
            borderColor={colorList.variant1}
            color={colorList.variant5}
            onClick={onClose}
            paddingHorizontal={"1rem"}
            fontSize={FontSize.Mini}
          />
          <Button
            text={t(translations.COVER_LETTER.SEND_PROPOSEL)}
            textColor={colorList.white1}
            borderColor={colorList.blue1}
            color={colorList.blue1}
            onClick={handleSendProposal}
            paddingHorizontal={"1rem"}
            fontSize={FontSize.Mini}
          />
        </FooterButtons>
      </FooterContainer>
    </StyledContainer>
  );
}

export const customStyles = {
  divider1: "1.5rem 0",
  divider2: "5rem 0",
  acceptType2: "image/*",
  acceptType1:
    "application/pdf,application/msword,'application/powerpoint', application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};