import { FontFamily, FontSize, FontWeight, Text } from 'app/components/atoms/text';
import { colorList } from 'consts/color';
import { translations } from 'locales/translations';
import moment from 'moment'
import React, { useEffect, useState } from 'react';
import {
    ServerConstantKeys,
    useServerConstants,
    useServerConstantsExtraData,
} from "apiCalls/dashboard";
import {
    Container,
    StyledHeader,
    StyledDivider,
    StyledCommission,
    FooterContainer,
    FooterButtons,
    StyledTotalAmount,
    Amounts,
    SubtitleText,
    Row,
    LogoContainer,
    StyledTextWrapper,
    Divider,
    StyledPartition,
    SpaceBetween,
    MarginLeft,
    UserLargeLogo,
    StyledLine,
    PaymentDetailsText,
    AlignPaymentText
} from './style'
import { images } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { InputField } from 'app/components/atoms/inputField';
import { Button } from 'app/components/atoms/mybutton';
import { FileUpload } from 'app/components/molecules/fileUpload';
import Notify from 'utils/notification';
import { fileUploadApi } from 'apiCalls/profile';
import { useParams } from 'react-router-dom';
import { sendInvoice, updateInvoice } from 'apiCalls/payments';
import { array } from 'yup/lib/locale';
import PopUp from 'app/components/atoms/popup';
import { InfoCircle, Person } from '@styled-icons/bootstrap';
import { getFromLocalStorage } from 'localStorage';
import { StyledLabel } from '../profile/style';

// const [constants] = useServerConstants(
//     props.serverConstantKey
// )
export interface IPaymentValues {

    milestone: any,
    services: any,
    invoiceAmount: any,
    dueDate: any,
}
export interface IFileType {
    fileType?: string;
    mimeType?: string;
    original?: string;
    thumbnail?: string;
    name?: string;
}


export default function CreateNewPayments({ onClose, isEdit, proposal, invoiceDetail, serverConstantKey = null }) {


    const [platformFeeRange] = useServerConstantsExtraData('platformFeeRange');
    const { t } = useTranslation();
    const initialValues = {
        milestone: "",
        services: "",
        invoiceAmount: 0,
        dueDate: "",
    };
    const [formFields, setFormFields] = useState<IPaymentValues>(initialValues);
    const [uploadedFiles, setUploadedFiles] = useState<any>([]);
    const [docsLoading, setDocsLoading] = useState<boolean>(false);
    const [invoice, setInvoice] = useState<any>({});
    const [invoiceAmount, setInvoiceAmount] = useState<any>("");

    useEffect(() => {
        if (invoiceDetail) {
            setInvoice(invoiceDetail);
            setFormFields({
                milestone: invoiceDetail.milestone,
                services: invoiceDetail.services,
                invoiceAmount: invoiceDetail.invoiceAmount,
                dueDate: invoiceDetail.dueDate,
            });
            setInvoiceAmount(invoiceDetail.invoiceAmount);
            setUploadedFiles([invoiceDetail.invoice]);
        }
    }, [invoiceDetail])

    const platformFee = (invoiceAmount?: any) => {

        const rangeArr = [[0, 2500, 15], [2500, 6000, 12], [6000, 12000, 10], [12000, 50000, 8], [50000, 0, 6]]

        let percentage = 0;

        rangeArr.forEach(([from, to, fee]) => {
            if (invoiceAmount >= from && (invoiceAmount < to || !to)) {
                percentage = fee;
            }
        })

        return percentage;

    }


    const { id }: any = useParams();

    const handleFieldChange = (key) => (val) => {
        if (key === 'dueDate') {
            val = new Date(val);
        }
        if (key === 'invoiceAmount') {
            setInvoiceAmount(val);
        }

        setFormFields((prevVal) => ({ ...prevVal, [key]: val }))

    }

    const handleFileDeletion = (value: IFileType) => {
        setUploadedFiles(
            uploadedFiles.filter((i: IFileType) => i.original !== value.original)
        );
    };


    const handleAdditionalInfoChange = async (value: File[]) => {

        if (value.length + uploadedFiles.length > 1) {

            Notify({
                title: t(translations.ERROR_NOTIFY.FILE),
                message: t(translations.ERROR_NOTIFY.MAX1),
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

    const handleInvoiceButton = async () => {

        try {

            let dataToSend: any = { invoice: uploadedFiles[0], ...formFields };

            if (!invoiceDetail) {
                dataToSend.proposalId = id;
            }

            let response = invoiceDetail ? await updateInvoice(invoiceDetail._id, dataToSend) : await sendInvoice(dataToSend);
            setInvoice(response);
            Notify({
                title: '',
                message: 'Invoice sent',
                type: "success",
            });
            onClose && onClose();

        } catch (error) {
            Notify({
                title: '',
                message: error + '',
                type: "warning",
            });

        }
    }

    const RenderProfiles = ({ ProviderName, businessName, email, logo }) => {

        return (
            <div>
                <Text
                    family={FontFamily.Inter}
                    size={FontSize.ExtraSmall}
                    color={colorList.grey3}
                    weight={FontWeight.Regular}
                >
                    {ProviderName}
                </Text>
                <Divider />
                <LogoContainer>

                    {logo ?
                        <UserLargeLogo src={logo} />
                        :
                        <div className="logo-container">
                            <Person color={colorList.black1} size={40} />
                        </div>}
                    <StyledTextWrapper>
                        <Text
                            family={FontFamily.Inter}
                            size={FontSize.ExtraSmall}
                            color={colorList.grey3}
                            weight={FontWeight.SemiBold}
                        >
                            {businessName}
                        </Text>
                        <Divider />
                        <Text
                            family={FontFamily.Inter}
                            size={FontSize.Mini}
                            color={colorList.grey3}
                        >
                            {email}
                        </Text>
                    </StyledTextWrapper>
                </LogoContainer>
            </div>
        );
    };



    return (
        <Container>
            <StyledHeader>
                <Text
                    family={FontFamily.Inter}
                    size={FontSize.ExtraRegular}
                    weight={FontWeight.SemiBold}
                    color={colorList.blue7}
                >
                    {(invoice && invoice._id) ?
                        t(translations.PAYMENT_CONSTANTS.UPDATE_INVOICE) :
                        t(translations.BUTTONS.CREATE_NEW_PAY)
                    }

                </Text>
                <div onClick={onClose}>
                    <img src={images.cross} width="15px" height="15px" />
                </div>
            </StyledHeader>

            <Divider />
            <StyledLine />
            <Divider />
            <SpaceBetween>
                <StyledPartition>
                    <RenderProfiles
                        ProviderName={t(translations.PAYMENT_CONSTANTS.CLIENT)}
                        businessName={proposal?.brandId?.businessName}
                        email={proposal?.brandId?.email}
                        logo={proposal?.brandId?.logo?.original}
                    />
                </StyledPartition>
                <StyledPartition>
                    <RenderProfiles
                        ProviderName={t(translations.PAYMENT_CONSTANTS.SERVICE_PROVIDER)}
                        businessName={proposal?.serviceProviderId?.businessName}
                        email={proposal?.serviceProviderId?.email}
                        logo={proposal?.serviceProviderId?.logo?.original}
                    />
                </StyledPartition>
            </SpaceBetween>
            <div>
                <StyledLabel family={FontFamily.Inter} size={FontSize.ExtraSmall}>
                    {t(translations.PAYMENT_CONSTANTS.PROJECT)}
                </StyledLabel>
                {proposal?.projectId?.name ? (
                    <Text
                        weight={FontWeight.Medium}
                        family={FontFamily.Inter}
                        size={FontSize.Small}
                    >
                        {proposal?.projectId?.name}
                    </Text>
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
            <Divider />
            <StyledDivider />
            <AlignPaymentText>
                <PaymentDetailsText
                    family={FontFamily.Inter}
                    size={FontSize.Regular}
                    weight={FontWeight.SemiBold}
                    color={colorList.blue1}
                >
                    {t(translations.PAYMENT_CONSTANTS.PAYMENT_DETAILS)}
                </PaymentDetailsText>
                <StyledLine />
            </AlignPaymentText>
            <Divider />
            <StyledDivider />
            <InputField
                label={t(translations.PAYMENT_CONSTANTS.SERVICES)}
                handleInputChange={handleFieldChange("services")}
                defaultValue={invoice ? invoice.services : ""}
                required
            />
            <StyledDivider />

            <InputField
                label={t(translations.PAYMENT_CONSTANTS.MILESTONE)}
                handleInputChange={handleFieldChange("milestone")}
                defaultValue={invoice ? invoice.milestone : ""}
                required
            />
            <StyledDivider />

            <InputField
                label={t(translations.PAYMENT_CONSTANTS.AMOUNT)}
                handleInputChange={handleFieldChange("invoiceAmount")}
                defaultValue={invoice.invoiceAmount ? invoice.invoiceAmount.toString() : "0"}
                required
            />
            <StyledDivider />
            <InputField
                label={t(translations.PAYMENT_CONSTANTS.DUE_DATE)}
                handleInputChange={handleFieldChange("dueDate")}
                defaultValue={invoice.dueDate ? moment(invoice.dueDate).format('YYYY-MM-DD') : ""}
                type='date'
                min={moment(new Date()).format('YYYY-MM-DD')}
                required
            />

            <StyledDivider />
            <FooterContainer >
            
               
                <StyledTotalAmount>
                    <Amounts>
                        <div>
                            <div>
                                <Text
                                    family={FontFamily.Inter}
                                    size={FontSize.Regular}
                                    weight={FontWeight.SemiBold}
                                    color={colorList.black1}
                                >
                                    {t(translations.PAYMENT_CONSTANTS.TOTAL_DUE_AMOUNT)}
                                </Text>

                            </div>
                            <div>
                                <Text
                                    family={FontFamily.Inter}
                                    size={FontSize.Regular}
                                    weight={FontWeight.SemiBold}
                                    color={colorList.blue1}
                                    styles={{
                                        marginLeft: '0.2rem'
                                    }}
                                >
                                    {invoiceAmount ? '$' + (parseInt(invoiceAmount) - (parseInt(invoiceAmount) * (platformFee(invoiceAmount) / 100))) : ""}
                                </Text>

                            </div>
                        </div>
                        <Divider />
                        <Row>

                            <PopUp
                                position="right top"
                                on="hover"
                                arrow
                                trigger={<InfoCircle color={colorList.grey1} size={15} />}
                            >
                                <SubtitleText>
                                    <Text family={FontFamily.Inter} size={FontSize.Mini}>

                                        {t(translations.PAYMENT_CONSTANTS.COMMISSION).split("% ").map((val) => <><span>{val + "%"}</span><br></br> </>)}
                                    </Text>
                                </SubtitleText>
                            </PopUp>

                            <MarginLeft
                                family={FontFamily.Inter}
                                size={FontSize.ExtraSmall}
                                weight={FontWeight.Light}
                                color={colorList.grey1}
                                styles={{
                                    marginLeft: '0.2rem'
                                }}
                            >
                                {t(translations.PAYMENT_CONSTANTS.PLATFORM_FEE)}${invoiceAmount && parseInt(invoiceAmount) * (platformFee(invoiceAmount) / 100)}
                            </MarginLeft>
                        </Row>

                    </Amounts>
                </StyledTotalAmount>
                <StyledDivider />
                <FooterButtons>
                {/* <div className="flex-end-container"> */}
                    <Button
                        text={t(translations.PAYMENT_CONSTANTS.CANCEL)}
                        textColor={colorList.black1}
                        borderColor={colorList.variant5}
                        color={colorList.variant5}
                        onClick={onClose}
                        paddingVertical={"0.6rem"}
                        paddingHorizontal={"2.6rem"}
                        fontSize={FontSize.Mini}
                    />
                    <Button
                        text={(invoice && invoice._id) ?
                            t(translations.PAYMENT_CONSTANTS.UPDATE_INVOICE) :
                            t(translations.PAYMENT_CONSTANTS.SEND_INVOICE)
                        }
                        textColor={colorList.white1}
                        borderColor={colorList.blue1}
                        paddingVertical={"0.6rem"}
                        onClick={handleInvoiceButton}
                        color={colorList.blue1}
                        paddingHorizontal={"2.6rem"}
                        fontSize={FontSize.Mini}
                    />
                    {/* </div> */}
                </FooterButtons>
            </FooterContainer>
        </Container>
    )
}

export const customStyles = {
    divider1: "1.5rem 0",
    divider2: "5rem 0",
    acceptType2: "image/*",
    acceptType1:
        "application/pdf,application/msword,'application/powerpoint', application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};