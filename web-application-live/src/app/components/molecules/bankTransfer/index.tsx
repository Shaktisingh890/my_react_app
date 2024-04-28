import { getExpanterBankAccounts, payViaBankTransfer } from 'apiCalls/payments'
import { FontFamily, FontSize, FontWeight, Text } from 'app/components/atoms/text'
import { openPopup } from 'app/modules/dashboard/pages/proposalManagement/atomStore'
import { images } from 'assets/images'
import { colorList } from 'consts/color'
import { useAtom } from 'jotai'
import { translations } from 'locales/translations'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { showConfirmBox } from 'utils/confirmBox'
import Notify from 'utils/notification'
import { Container, StyledDivider, StyledIcon, StyledImage, StyledLabelLeft } from '../choosePayment/style'
import ViewText from '../myViewText'
import PaymentPopups from '../togglePaymentPopup'
import { AlignAtCenter, SpaceBetween, StyledPartition, StyledTitleText, StyledHeader, Row, Divider, Margin } from './style'

interface IServiceProfileFormField {

    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    bankAddress?: string;
    bankCode?: string;
    swiftCode?: string;
    country?: string;

}


export default function BankTransfer({ onClose, amountToPay, Id, onBack, paymentStatus, paymentLink }) {


    const { t } = useTranslation();
    const history = useHistory();
    const initialServiceState: IServiceProfileFormField = {

        accountName: "",
        accountNumber: "",
        bankName: "",
        bankAddress: "",
        bankCode: "",
        swiftCode: "",
        country: "",

    };
    const [formFields, setFormFields] =
        useState<IServiceProfileFormField>(initialServiceState);
    const [loading, setLoading] = useState<boolean>(false);
    const [isPopupOpen, setIsPopupOpen] = useAtom(openPopup);

    const handleComplete = () => {
        onClose && onClose();

        return showConfirmBox({
            title: t(translations.ACCOUNT_DETAILS.BANK_TRANSFER),
            message: t(translations.CONFIRM_BOX.PLEASE_CONFIRM),
            handleYesClick: paidViaBank()
        });


    }

    function renderButtons(label: string, image: any, clickHandler?: any) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "row",
                borderRadius: "0.9rem",
                cursor: "pointer"
            }} onClick={handleComplete}>

                <StyledLabelLeft
                    family={FontFamily.Inter}
                    size={FontSize.ExtraSmall}
                    weight={FontWeight.SemiBold}
                    color={colorList.white1}
                >
                    {t(label)}
                </StyledLabelLeft>
                <StyledIcon>
                    <StyledImage src={image} width="22px" height="22px" />
                </StyledIcon>
            </div>
        )

    }




    const getBankDetails = async () => {
        try {
            const response = await getExpanterBankAccounts();
            setFormFields(response);
        } catch (error) {

        }

    }
    useEffect(() => {
        getBankDetails();
    }, [])

    const paidViaBank = () => {
        return async () => {
            let payload = {
                paymentMethod: "bankTransfer",
                paymentStatus: "inProcess"
            }
            try {
                const response = await payViaBankTransfer(Id, payload);
                onClose && onClose();
                Notify({
                    title: t(translations.ACCOUNT_DETAILS.PLEASE_NOTIFY_EXPANTER),
                    message: "",
                    type: "success",
                });

            } catch (error) {

            }
        }
    }



    const handleBackClick = () => {
        onBack()
        onClose && onClose(true);
    };

    return (
        <Container style={{ padding: "2rem 0rem" }}>

            <StyledHeader>

                <div style={{ cursor: "pointer" }} onClick={handleBackClick}>
                    <img src={images.arrowLeft} />
                </div>

                <Text
                    family={FontFamily.Inter}
                    size={FontSize.ExtraRegular}
                    weight={FontWeight.SemiBold}
                    color={colorList.black1}
                >
                    {t(translations.ACCOUNT_DETAILS.BANK_TRANSFER)}
                </Text>
                <div style={{ cursor: "pointer" }} onClick={onClose}>
                    <img src={images.cross} width="15px" height="15px" />
                </div>
            </StyledHeader>
            <StyledDivider />
            <AlignAtCenter>
                <Row>
                    <StyledTitleText
                        family={FontFamily.Inter}
                        size={FontSize.ExtraSmall}
                        weight={FontWeight.Light}
                        color={colorList.black1}
                    >{t(translations.ACCOUNT_DETAILS.PLEASE_TRANSFER)}
                        <b>  {"$" + amountToPay} </b>
                        {t(translations.ACCOUNT_DETAILS.To_FOLLOWING)}
                        <b>  {t(translations.ACCOUNT_DETAILS.PAID_VIA_BANK)} </b>
                        {t(translations.ACCOUNT_DETAILS.PLEASE_NOTIFY)}
                        <b>  {"hello@expanter.com"} </b>
                        {t(translations.ACCOUNT_DETAILS.THANK_YOU)}
                    </StyledTitleText>
                </Row>
            </AlignAtCenter>
            <Margin>
                <SpaceBetween>
                    <StyledPartition>
                        <ViewText
                            formFields={formFields}
                            formKey={"accountName"}
                            labelKey={translations.ACCOUNT_DETAILS.ACCOUNT_NAME}
                            copyIcon
                        />

                        <ViewText
                            formFields={formFields}
                            formKey={"bankName"}
                            labelKey={translations.ACCOUNT_DETAILS.BANK_NAME}
                            copyIcon
                        />
                        <ViewText
                            formFields={formFields}
                            formKey={"branchCode"}
                            labelKey={translations.ACCOUNT_DETAILS.BRANCH_CODE}
                            copyIcon
                        />
                        <ViewText
                            formFields={formFields}
                            formKey={"swiftCode"}
                            labelKey={translations.ACCOUNT_DETAILS.SWIFT_CODE}
                            copyIcon
                        />
                    </StyledPartition>
                    <StyledPartition>
                        <ViewText
                            formFields={formFields}
                            formKey={"accountNumber"}
                            labelKey={translations.ACCOUNT_DETAILS.ACCOUNT_NUMBER}
                            copyIcon
                        />
                        <ViewText
                            formFields={formFields}
                            formKey={"bankCode"}
                            labelKey={translations.ACCOUNT_DETAILS.BANK_CODE}
                            copyIcon
                        />
                        <ViewText
                            formFields={formFields}
                            formKey={"bankAddress"}
                            labelKey={translations.ACCOUNT_DETAILS.BANK_ADDRESS}
                            copyIcon
                        />
                        <ViewText
                            formFields={formFields}
                            formKey={"country"}
                            labelKey={translations.ACCOUNT_DETAILS.COUNTRY}
                            copyIcon
                        />
                    </StyledPartition>
                </SpaceBetween>
            </Margin>
            <AlignAtCenter>
                {renderButtons(translations.CHOOSE_PAYMENT.PAID_VIA, images.bankImage)}
            </AlignAtCenter>
        </Container >
    )
}
