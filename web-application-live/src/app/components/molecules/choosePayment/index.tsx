import { FontFamily, FontSize, FontWeight, Text } from 'app/components/atoms/text'
import { colorList } from 'consts/color'
import { translations } from 'locales/translations'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Container,
    StyledHeader,
    Divider,
    StyledDivider,
    StyledLabelLeft,
    StyledIcon,
    Container2,
    StyledImage,
    PaymentButtons,
    Gap,
    MarginLeft
} from './style'
import { images } from 'assets/images'
import PopUp from "app/components/atoms/popup";
import BankTransfer from '../bankTransfer'
import PaymentPopups from '../togglePaymentPopup'
import { useAtom } from 'jotai'
import { openPopup } from 'app/modules/dashboard/pages/proposalManagement/atomStore'

export default function ChoosePayment({ onClose, invoiceAmount, Id, paymentLink, status }) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isPopupOpen, setIsPopupOpen] = useAtom(openPopup);


    function renderButtons(label: string, image: any, clickHandler?: any) {
        return (
            <div style={{ display: "flex", flexDirection: "row", borderRadius: "0.9rem", cursor: "pointer" }} onClick={clickHandler ? clickHandler : ""}>
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


    const BankTransferHandler = () => {
        setIsOpen(true)

        // bankTransfer

    }

    const handleOpenUrl = (url) => {
        return () => {
            window.open(url, "_self");
        }
    }

    return (
        <Container>
            {/* <PaymentPopups
                onClose={onClose}
                invoiceAmount={invoiceAmount} /> */}
            {/* <PopUp
                modal
                position="bottom right"
                open={isOpen}
                onClose={onClose}
                closeOnDocumentClick={false}
            >
                <BankTransfer
                    onClose={onClose}
                    amountToPay={invoiceAmount}
                    Id={Id}
                    paymentStatus={status}
                />
            </PopUp> */}

            <PaymentPopups
                onClose={onClose}
                amountToPay={invoiceAmount}
                Id={Id}
                paymentStatus={status}

                isPayPopUp={null}
                bankTransfer={true}
                open={isOpen}
                invoiceAmount={invoiceAmount}
                status={null}
                paymentLink={paymentLink}

            ></PaymentPopups>

            <StyledHeader>
                <Text
                    family={FontFamily.Inter}
                    size={FontSize.ExtraRegular}
                    weight={FontWeight.SemiBold}
                    color={colorList.blue7}
                >
                    {t(translations.CHOOSE_PAYMENT['CHOOSE YOUR'])}
                </Text>
                <div style={{ cursor: "pointer" }} onClick={onClose}>
                    <img src={images.cross} width="15px" height="15px" />
                </div>
            </StyledHeader>
            <StyledDivider />
            <Container2>
                <Gap />
                <PaymentButtons>
                    {renderButtons(translations.CHOOSE_PAYMENT.VIA_CREDIT, images.creditCard, handleOpenUrl(paymentLink))}

                    <MarginLeft>
                        {renderButtons(translations.CHOOSE_PAYMENT.VIA_BANK, images.bankImage, BankTransferHandler)}
                    </MarginLeft>

                </PaymentButtons>
            </Container2>
            <Divider />
        </Container >
    )
}

//PaymentButtons