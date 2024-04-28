import React, { useState, useEffect } from 'react';

import { atom, useAtom } from 'jotai';

import {
    StyledHeader,
    StyledContainer,
    Divider,
    FileContent,
    FooterContainer,
    FooterButtons,

} from "./style";
import {
    fileUploadApi,
} from "apiCalls/profile";
import { colorList } from 'consts/color';
import { Text, FontFamily, FontSize, FontWeight } from "app/components/atoms/text";
import { TextArea } from 'app/components/atoms/textArea';
import { useTranslation } from 'react-i18next';
import { translations } from "locales/translations";
import { images } from "assets/images/index";
import { Button } from 'app/components/atoms/mybutton';
import { getFromLocalStorage } from "localStorage";
import FilePreview from 'app/components/atoms/filePreview';
import NoContent from 'app/components/atoms/noContent';
import Notify from 'utils/notification';
import { X } from "@styled-icons/bootstrap/X";
import { editProposal, inVoice } from 'apiCalls/proposalManagement';
import { privatePaths } from 'consts/paths';
import { useHistory } from 'react-router-dom';
import { FileUpload } from 'app/components/molecules/fileUpload';
import { viewProposal } from 'apiCalls/proposalManagement';
import DateFormated from 'utils/dateFormated';
import DateFormatedWithSalshes from 'utils/dateFormattedwithSlashes';
import { on } from 'stream';

export interface IEditProposalValues {
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


export default function EditProposelCoverLetter({ id, onClose, isNavigate = true, status, showInvoice }) {
    const history = useHistory();
    const [userType, setUserType] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [docsLoading, setDocsLoading] = useState<boolean>(false);
    const [uploadedFiles, setUploadedFiles] = useState<any>([]);
    const [uploadedInvoice, setUploadedInvoice] = useState<any>([]);
    const [viewProposalData, setViewProposalData] = useState<any>({});
    const [viewInvoice, setViewInvoice] = useState<any>([]);
    const [hiringId, setHiringId] = useState<string>("");
    const [invoiceCreated, setInvoiceCreated] = useState<any>(null);



    const initialEditProposalValues = {
        docs: [],
        coverLetter: viewProposalData.coverLetter,

    }


    const [formFields, setFormFields] = useState<IEditProposalValues>(initialEditProposalValues);

    const { t } = useTranslation();



    useEffect(() => {

        const handleShowProposal = async (id: string) => {
            setLoading(true);
            try {
                const data = await viewProposal(id);
                if (data.hiringDetails && data.hiringDetails._id) {
                    setHiringId(data.hiringDetails._id)
                }
                setViewProposalData(data);
                setFormFields({
                    coverLetter: data.coverLetter,
                    docs: data.docs
                })
                if (data.invoice) {
                    setUploadedInvoice([data.invoice.invoice])
                    setInvoiceCreated(t(translations.COVER_LETTER.UPLOADED_AT) + DateFormatedWithSalshes(data.invoice.createdAt));
                }
                setUploadedFiles(data.docs);
                setLoading(false);

            } catch (error) {
                setLoading(false);
                Notify({
                    title: "",
                    message: t(translations.COVER_LETTER.ERROR_SHOW_PROP),
                    type: "danger",
                });
            }
        }
        handleShowProposal(id);


    }, [id])

    const handleEditProposal = async () => {
        formFields.docs = [...uploadedFiles];
        setLoading(true);
        try {
            const editLetter = await editProposal(id, formFields);

            setLoading(false);
            if (isNavigate) {
                history.push(privatePaths.dashboardProposal)
            }
            Notify({
                title: "",
                message: t(translations.COVER_LETTER.SUCCESS_EDIT_PROP),
                type: "success",
            });

            onClose && onClose();

        }
        catch (error) {

            setLoading(false);
            Notify({
                title: "",
                message: error + "",
                type: "danger",
            });
        }

    }

    const invoice = async () => {
        try {
            const data = await inVoice({ hiringId: hiringId, invoice: uploadedInvoice[0] });
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            Notify({
                title: "",
                message: t(translations.COVER_LETTER.ERROR_INVOICE),
                type: "danger",
            });
        }

    }

    const submitButtonClick = (status && status === "hired") ? invoice : handleEditProposal;
    const submitButtonTitle = (status && status === "hired") ? t(translations.COVER_LETTER.SEND_INVOICE) :
        t(translations.COVER_LETTER.EDIT_PROPOSEL)

    useEffect(() => {
        setUserType(getFromLocalStorage("userRole"))

    }, [])

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

    const handleInvoiceDeletion = (value: IFileType) => {

        setUploadedInvoice([]);
    };

    const handleAdditionalInfoChange = async (value: File[]) => {
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

    const handleInvoiceChange = async (value: File[]) => {

        setDocsLoading(true);
        Promise.all(
            Array.from(value).map((url) => fileUploadApi(url).then((e) => e))
        )
            .then((data) => {


                setUploadedInvoice(() => [...data]);
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
    };


    const handleFieldChange = (val: any) => {
        setFormFields((prevVal) => ({ ...prevVal, ["coverLetter"]: val }))
    };

    return (
        <StyledContainer style={{ overflow: "auto" }}>

            <div className="crossIcon">
                <X
                    size={30}
                    color={colorList.white1}
                    onClick={onClose}
                    className="cursor"
                />
            </div>
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
            {(userType && userType === "brand") || (userType && userType === "serviceProvider" && viewProposalData?.isHiringDone) ?
                (<div>
                    <Text family={FontFamily.Inter} size={FontSize.ExtraSmall} weight={FontWeight.SemiBold}>
                        {t(translations.COVER_LETTER.COVER_LETTER)}
                    </Text>
                    <p>{viewProposalData?.coverLetter}</p></div>)
                :

                (userType && userType === "serviceProvider" &&

                    (<TextArea
                        label={t(translations.COVER_LETTER.COVER_LETTER)}
                        rows={10}
                        text={viewProposalData?.coverLetter}
                        handleTextAreaChange={handleFieldChange}
                    />))
            }

            <FileContent>
                {((userType && userType === "brand") || (userType && userType === "serviceProvider" && viewProposalData?.isHiringDone)) &&
                    (<div>
                        <Text family={FontFamily.Inter} size={FontSize.ExtraSmall}>
                            {t(translations.COVER_LETTER.ATTACHMENTS)}
                        </Text>
                        <Divider />
                        {viewProposalData?.docs?.length ? <FilePreview docs={viewProposalData?.docs} /> : <NoContent />}
                    </div>)
                }

                {(userType && userType === "serviceProvider" && !viewProposalData?.isHiringDone) &&

                    (
                        <FileUpload
                            label={t(translations.COVER_LETTER.ATTACHMENTS)}
                            multiple
                            uploadedFiles={uploadedFiles}
                            uploadMore={true}
                            handleFileDeletion={handleFileDeletion}
                            loading={docsLoading}
                            accept={customStyles.acceptType1}
                            maxFiles={2}
                            handleInputChange={(val: File[]) => handleAdditionalInfoChange(val)}

                        />
                    )


                }

            </FileContent>
            {(userType && userType === "serviceProvider" && status && status === "hired") && (<FileUpload
                label={t(translations.COVER_LETTER.INVOICE) + "\n" + (invoiceCreated ? "(" + invoiceCreated + ")" : "")}
                uploadedFiles={uploadedInvoice}
                handleFileDeletion={handleInvoiceDeletion}
                loading={docsLoading}
                accept={customStyles.acceptType1}
                maxFiles={1}
                handleInputChange={(val: File[]) => handleInvoiceChange(val)}

            />)

            }
            {(userType && userType === "brand" && status === "hired") &&
                (<div>
                    <Text family={FontFamily.Inter} size={FontSize.ExtraSmall}>
                        {t(translations.COVER_LETTER.INVOICE) + "\n " + (invoiceCreated ? "(" + invoiceCreated + ")" : "")}
                    </Text>
                    <Divider />

                    {showInvoice?.length ? <FilePreview docs={showInvoice} /> : <NoContent />}
                </div>)
            }

            {userType && userType == "serviceProvider" && !viewProposalData?.isHiringDone &&
                (<FooterContainer>
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
                            text={submitButtonTitle}
                            textColor={colorList.white1}
                            borderColor={colorList.blue1}
                            onClick={submitButtonClick}
                            color={colorList.blue1}
                            paddingHorizontal={"1rem"}
                            fontSize={FontSize.Mini}
                        />
                    </FooterButtons>
                </FooterContainer>
                )
            }

        </StyledContainer>
    )
}

export const customStyles = {
    divider1: "1.5rem 0",
    divider2: "5rem 0",
    acceptType2: "image/*",
    acceptType1:
        "application/pdf,application/msword,'application/powerpoint', application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};