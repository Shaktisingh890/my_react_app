import { brandInvoiceList, downloadInvoice, serviceProviderInvoiceList } from "apiCalls/payments";
import { viewProposal } from "apiCalls/proposalManagement";
import Label from "app/components/atoms/label";
import { Button } from "app/components/atoms/mybutton";
import PopUp from "app/components/atoms/popup";
import { FontFamily, FontSize, FontWeight, Text } from "app/components/atoms/text";
import { images } from "assets/images";
import { colorList } from "consts/color";
import { privatePaths } from "consts/paths";
import { translations } from "locales/translations";
import { getFromLocalStorage } from "localStorage";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { generatePath, useHistory, useParams } from "react-router-dom";
import DateFormated from "utils/dateFormated";
import Notify from "utils/notification";
import moment from 'moment'
import CreateNewPayments from "../createNewPayments";
import {
    StyledViewButton,
    SpaceBetween,
    StyledHeader,
    StyledChild2,
    StyledChild1,
    StyledText1,
    AlignTitle,
    Divider,
    StyledCard,
    ButtonContainer,
    StyledButton,
    PayButton,
    NoData
} from "./style";
import { Person } from "@styled-icons/bootstrap";
import Loader from "utils/loader";
import ChoosePayment from "app/components/molecules/choosePayment";
import { useAtom } from "jotai";
import { openPopup } from "../proposalManagement/atomStore";
import PaymentPopups from "app/components/molecules/togglePaymentPopup";



export default function Payments(): ReactElement {
    const [invoiceList, setInvoiceList] = useState([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string>("");
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [currentInvoice, setCurrentInvoice] = useState<any>(null);
    const [proposal, setProposal] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [invoiceAmount, setInvoiceAmount] = useState<any>(null);
    const [currentId, setCurrentId] = useState<any>(null);
    const [isPayPopUp, setIsPayPopUp] = useState<boolean>(false);
    const [paymentLink, setPaymentLink] = useState<any>(null);
    const [status, setStatus] = useState<any>(null);


    const { id }: any = useParams();
    const { t } = useTranslation();
    const history = useHistory();

    const total = (userRole === 'brand') ? 'Total Amount' : 'Net Amount'
    const headerFields = [{
        title: 'Services',
        width: '20%'
    }, {
        title: 'Milestones',
        width: '20%'
    }, {
        title: 'Project Fee',
        width: '10%'
    }, {
        title: 'Platform Fee',
        width: '10%'
    }, {
        title: total,
        width: '10%'
    }, {
        title: 'Due Date',
        width: '10%'
    }, {
        title: 'Status',
        width: '10%'
    }, {
        title: 'Action',
        width: '12%'
    }]


    const handleCreateNewPayments = async () => {

        setIsOpen(!isOpen)

    }
    const brandData = async () => {
        try {
            const response = await brandInvoiceList(id);
            setInvoiceList(response)
        } catch (error) {
            Notify({
                title: "",
                message: error + "",
                type: "danger",
            });

        }
    }
    const serviceProviderData = async () => {
        try {
            const response = await serviceProviderInvoiceList(id);
            setInvoiceList(response);
        } catch (error) {
            Notify({
                title: "",
                message: error + "",
                type: "danger",
            });

        }
    }

    useEffect(() => {
        let userRole = getFromLocalStorage('userRole');
        setUserRole(userRole);

        { userRole === "brand" && brandData() }
        { userRole === "serviceProvider" && serviceProviderData() }

        fetchProposalDetails(id);

    }, [id])

    const fetchProposalDetails = async (id) => {
        try {
            const response = await viewProposal(id);
            setProposal(response);
        }
        catch (error) {
            Notify({
                title: "",
                message: error + "",
                type: "danger",
            });
        }
    }

    const renderHeader = () => {
        return <StyledHeader>

            {headerFields.map((field, i) => {
                return <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'center', width: field.width, borderRight: i < headerFields.length - 1 ? `2px solid grey` : ''
                }}>
                    {field.title}</div>
            })}


        </StyledHeader>
    }

    const handleBackClick = () => {
        history.goBack();
    };

    const onClose = (isBackAction?: boolean) => {
        setIsOpen(false);
        if (isBackAction === true) {
            console.log(isBackAction, "isbackaction");
            setIsPayPopUp(true);
        } else {
            setIsPayPopUp(false);
        }
        setCurrentInvoice(null)
        { userRole === "brand" && brandData() }
        { userRole === "serviceProvider" && serviceProviderData() }

    }

    const renderStatus = (item: any) => {

        switch (item.paymentStatus) {
            case "pending":
                const isDueDate = new Date(item.dueDate).getTime() < new Date().getTime();
                return <Label field="pending" textColor={isDueDate ? colorList.white1 : colorList.black1} bgColor={isDueDate ? colorList.red1 : colorList.yellow1} />
            case "inProcess":
                return <Label field="In Process" textColor={colorList.black1} bgColor={colorList.yellow1} />
            case "completed":
                return <Label field="completed" textColor={colorList.white1} bgColor={colorList.green1} />
            case "failed":
                return <Label field="failed" textColor={colorList.white1} bgColor={colorList.red1} />
            case "expired":
                return <Label field="expired" textColor={colorList.white1} bgColor={colorList.red1} />
        }
    }

    const handleEditButton = (invoice) => {

        return () => {
            setCurrentInvoice(invoice)
            setIsOpen(!isOpen);
            setIsEdit(!isEdit);
        }
    }

    const handleOpenUrl = (url) => {
        return () => {
            window.open(url, "_self");
        }
    }



    const handleViewProject = (id: string) => {
        return () => {
            history.push(
                generatePath(privatePaths.viewProject, {
                    screenName: "marketplace",
                    id,
                })
            );
        };
    };
    useEffect(() => {
        setIsPayPopUp(isPayPopUp);

    }, [isPayPopUp])

    const handlePayButton = (
        invoiceAmount: any,
        id: string,
        paymentLink: string,
        status: any,
        invoice: any
    ) => {
        const totalAmount = (userRole === 'brand') ? invoice.payableByBrand : invoice.spAmount

        return () => {


            setStatus(status);
            setPaymentLink(paymentLink);
            setCurrentId(id);
            setInvoiceAmount(totalAmount);
            setIsPayPopUp(true);
        }

    }



    const buttonContainer = (status: any, invoice: any) => {

        return <ButtonContainer>
            {(userRole === "brand" && status === "pending") && <PayButton onClick={handlePayButton(invoice?.invoiceAmount, invoice?._id, invoice?.paymentLink, status, invoice)}>
                <Text
                    family={FontFamily.Inter}
                    size={FontSize.Mini}
                    color={colorList.white1}
                    weight={FontWeight.Bold}
                >
                    {t(translations.PAYMENT_ACTIONS.PAY)}
                </Text>
            </PayButton>
            }

            <StyledButton

                onClick={handleViewProject(invoice.projectId._id)}
            >
                <Text
                    family={FontFamily.Inter}
                    size={FontSize.Mini}
                    color={colorList.blue1}
                    weight={FontWeight.Bold}
                >
                    {t(translations.PAYMENT_ACTIONS.VIEW_PROJECT)}
                </Text>
            </StyledButton>

            <StyledButton

                onClick={handleViewInvoiceButton(invoice._id)}
            >
                <Text
                    family={FontFamily.Inter}
                    size={FontSize.Mini}
                    color={colorList.blue1}
                    weight={FontWeight.Bold}
                >
                    {t(translations.PAYMENT_ACTIONS.VIEW_INVOICE)}
                </Text>
            </StyledButton>


            {(userRole === "serviceProvider" && status === "pending") && < StyledButton
                onClick={handleEditButton(invoice)}
            >
                <Text
                    family={FontFamily.Inter}
                    size={FontSize.Mini}
                    color={colorList.blue1}
                    weight={FontWeight.Bold}
                >
                    {t(translations.PAYMENT_ACTIONS.EDIT)}
                </Text>
            </StyledButton>
            }


        </ButtonContainer >

    }

    const renderInvoiceCard = (invoice, index) => {

        var commissionAmount = (userRole === 'brand') ? invoice.brandCommisionAmount : invoice.spCommissionAmount
        var totalAmount = (userRole === 'brand') ? invoice.payableByBrand : invoice.spAmount
        return <div key={index}><StyledCard >
            <StyledChild1>
                {invoice.services}</StyledChild1>
            <StyledChild1>{invoice.milestone}</StyledChild1>
            <StyledChild2>{"$" + invoice.invoiceAmount}</StyledChild2>
            <StyledChild2>{"$" + commissionAmount}</StyledChild2>
            <StyledChild2>{"$" + totalAmount}</StyledChild2>

            <StyledChild2>{moment(invoice.dueDate).format(" Do MMM  YYYY")}</StyledChild2>
            <StyledChild2>
                <div style={{ display: "flex", alignItems: "center" }}>
                    {renderStatus(invoice)}
                </div>
            </StyledChild2>
            <StyledChild2>
                {buttonContainer(invoice.paymentStatus, invoice)}
            </StyledChild2>
        </StyledCard>
            <Divider />
        </div>
    }

    const handleViewInvoiceButton = (id: string) => {
        return async () => {
            setLoading(true);
            try {
                const response = await downloadInvoice(id);
                const blob = new Blob([response.data], {
                    type: "application/pdf; charset=utf-8",
                });
                const url = (window.URL || window.webkitURL).createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", "invoice.pdf");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setLoading(false);
            } catch (e) {
                Notify({
                    title: "",
                    message: "" + e,
                    type: "danger",
                });
                setLoading(false);


            }
        }

    }

    if (loading) {
        return <Loader />;
    } else {

        return (
            <div style={{ margin: '1rem' }}>
                <PopUp
                    modal
                    position="bottom right"
                    open={isOpen}
                    onClose={onClose}
                    closeOnDocumentClick={false}
                >
                    <CreateNewPayments
                        proposal={proposal}
                        invoiceDetail={currentInvoice}
                        onClose={onClose}
                        isEdit={isEdit} />
                </PopUp>

                <PaymentPopups
                    isPayPopUp={false}
                    amountToPay={null}
                    paymentStatus={null}
                    bankTransfer={false}
                    open={isPayPopUp}
                    onClose={onClose}
                    invoiceAmount={invoiceAmount}
                    Id={currentId}
                    status={status}
                    paymentLink={paymentLink}
                ></PaymentPopups>

                {/* <PopUp
                    modal
                    position="bottom right"
                    open={isPayPopUp}
                    onClose={onClose}
                    closeOnDocumentClick={false}

                >
                    <ChoosePayment
                        onClose={onClose}
                        invoiceAmount={invoiceAmount}
                        Id={currentId}
                        status={status}
                        paymentLink={paymentLink}
                    />
                </PopUp> */}
                <SpaceBetween>
                    <AlignTitle>
                        <span onClick={handleBackClick}>
                            <img src={images.arrowLeft} />
                        </span>

                        <StyledText1

                            family={FontFamily.Inter}
                            size={FontSize.ExtraRegular}
                            color={colorList.grey1}
                            weight={FontWeight.Medium}
                        >
                            {t(translations.PAYMENT_CONSTANTS.PAYMENTS)}
                        </StyledText1>
                    </AlignTitle>

                    {userRole === "serviceProvider" &&
                        (<Button
                            borderColor={colorList.blue1}
                            paddingHorizontal={"1.5rem"}
                            paddingVertical={"0.6rem"}
                            onClick={handleCreateNewPayments}
                            color={colorList.blue1}
                        >
                            <Text
                                family={FontFamily.Inter}
                                size={FontSize.ExtraSmall}
                                color={colorList.white1}
                                weight={FontWeight.Bold}
                            >
                                {t(translations.BUTTONS.CREATE_NEW_PAYMENT)}

                            </Text>

                        </Button>)
                    }

                </SpaceBetween>
                <Divider />
                {renderHeader()}
                <Divider />
                {invoiceList.length ?
                    invoiceList.map((invoice, index) => renderInvoiceCard(invoice, index)) :
                    (
                        <NoData>
                            <Text
                                family={FontFamily.Inter}
                                size={FontSize.Small}
                                weight={FontWeight.Light}
                            >
                                {t(translations.GENERIC.NO_DATA_FOUND)}
                            </Text>
                        </NoData>
                    )
                }
            </div>
        )
    }
}
