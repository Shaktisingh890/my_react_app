import React, { useEffect, useState } from "react";
import { Text, FontFamily, FontSize } from "app/components/atoms/text";
import { colorList } from "consts/color";
import {
  Container,
  FileContainer,
  ImageContainer,
  StyledContainer,
  StyledFile,
  StyledImage,
  StyledInput,
  SubtitleText,
} from "app/components/atoms/inputField/style";
import { IFileType } from "app/modules/profile/createProfile/brandForm";
import { Button } from "app/components/atoms/mybutton";
import { FileEarmarkWord } from "@styled-icons/bootstrap/FileEarmarkWord";
import { FileEarmarkPdf } from "@styled-icons/bootstrap/FileEarmarkPdf";
import { FileEarmarkPpt } from "@styled-icons/bootstrap/FileEarmarkPpt";
import { FileEarmarkText } from "@styled-icons/bootstrap/FileEarmarkText";
import { FileEarmarkExcel } from "@styled-icons/bootstrap/FileEarmarkExcel";
import { X } from "@styled-icons/bootstrap/X";
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";
import PopUp from "app/components/atoms/popup";
import { InfoCircle } from "@styled-icons/bootstrap/InfoCircle";

interface IInputProps {
  handleInputChange?: Function;
  handleFileDeletion?: Function;
  label?: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  loading?: boolean;
  uploadedFiles?: IFileType[];
  subtitleText?: string;
  maxFiles?: number;
  uploadMore?: boolean
  maxFileSize?: number;
}

export const FileUpload = (props: IInputProps) => {
  const {
    handleInputChange,
    label,
    required,
    accept,
    multiple,
    uploadedFiles,
    loading = false,
    handleFileDeletion,
    subtitleText,
    maxFiles = 10,
    maxFileSize = 5e+7,
    uploadMore = false
  } = props;

  const [displayFiles, setDisplayFiles] = useState<IFileType[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (uploadedFiles)
      setDisplayFiles(uploadedFiles?.filter((item) => item !== undefined));
  }, [uploadedFiles]);

  const onChange = (event: any) => {
    const { files } = event.target;


    let isValid = true;
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxFileSize) {
        window.alert("Please upload a file smaller than 50 MB");
        isValid = false;
      }
    }

    if (isValid) {
      handleInputChange && handleInputChange(files);
    }

  };

  const triggerInput = () => {
    document.getElementById(`fileInput-${label}`)?.click();
  };

  const showImage = (file: IFileType) => {
    var fileExt = file?.original?.split(".").pop() || "";
    if (["png", "jpg", "jpeg", "svg"].includes(fileExt))
      return <StyledImage src={file.original} />;
    else if (["pdf"].includes(fileExt))
      return <FileEarmarkPdf color="red" size={40} />;
    else if (["ppt", "pptx"].includes(fileExt))
      return <FileEarmarkPpt color="yellow" size={40} />;
    else if (["doc", "docx", "msword"].includes(fileExt))
      return <FileEarmarkWord color="blue" size={40} />;
    else if (["xls", "csv", "ms-excel"].includes(fileExt))
      return <FileEarmarkExcel color="green" size={40} />;
    else return <FileEarmarkText color="black" size={40} />;
  };

  const handleFileOpen = (file: IFileType) => {
    window.open(file.original, "_blank");
  };

  const handleDelete = (file: IFileType) => {
    handleFileDeletion && handleFileDeletion(file);
  };

  return (
    <Container>
      {label && (
        <StyledContainer>
          <Text family={FontFamily.Inter} size={FontSize.ExtraSmall}>
            {label}
          </Text>
          {required && (
            <Text size={FontSize.ExtraSmall} color={colorList.red1}>
              *
            </Text>
          )}
          {subtitleText && (
            <PopUp
              position="right top"
              on="hover"
              arrow
              trigger={<InfoCircle color={colorList.grey1} size={15} />}
            >
              <SubtitleText>
                <Text family={FontFamily.Inter} size={FontSize.Mini}>
                  {subtitleText}
                </Text>
              </SubtitleText>
            </PopUp>
          )}

        </StyledContainer>
      )}

      <FileContainer>
        {loading ? (
          <div className="loading">
            <Text family={FontFamily.Inter} size={FontSize.Regular}>
              Uploading...
            </Text>
          </div>
        ) : (
          <ImageContainer>
            {displayFiles?.map((file: IFileType, index: number) => (
              <div className="nameContainer" key={index}>
                <StyledFile>
                  <div onClick={() => handleFileOpen(file)}>
                    {showImage(file)}
                  </div>
                  {multiple && (
                    <X
                      className="cross-icon"
                      size={20}
                      color={colorList.white1}
                      onClick={() => handleDelete(file)}
                    />
                  )}
                </StyledFile>
                <div className="fileNameContainer">
                  <Text family={FontFamily.Inter} size={FontSize.Mini}>
                    {file.name ||
                      t(translations.GENERIC.DOCUMENT) + (index + 1)}
                  </Text>
                </div>
              </div>
            ))}
          </ImageContainer>
        )}

        <div
          className={
            displayFiles && displayFiles.length > 0
              ? "buttonRightContainer"
              : "buttonLeftContainer"
          }
        >
          {
            (displayFiles && displayFiles.length <= maxFiles || !multiple) && <Button
              type="button"
              text={
                displayFiles && displayFiles.length > 0 && uploadMore ? t(translations.GENERIC.UPLOAD_MORE) :
                  displayFiles && displayFiles.length > 0 ? t(translations.GENERIC.UPLOAD_AGAIN) :
                    t(translations.GENERIC.UPLOAD)
              }
              textColor={colorList.blue5}
              borderColor={colorList.blue5}
              color={colorList.white1}
              onClick={triggerInput}
              disabled={displayFiles && displayFiles.length > maxFiles}
            />

          }

          <StyledInput
            type="file"
            onChange={onChange}
            accept={accept}
            multiple={multiple}
            valid
            hideDisplay
            id={`fileInput-${label}`}
          />
        </div>
      </FileContainer>
    </Container>
  );
};
