import React, { ReactElement, useEffect, useState } from "react";
import { atom, useAtom } from 'jotai';

//third party library imports
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";
import { Person } from "@styled-icons/bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { generatePath } from "react-router-dom";

//custom component imports
import PopUp from "app/components/atoms/popup";

import {
  ViewButton,
  StyledViewButton,
  StyledFooter,
  StyledContainer,
  LogoContainer,
  ButtonContainer,
  StyledTextWrapper,
  Wrapper,
  FooterDiv,
  StyledLabel,
  UserLogo,
  Divider,
  StyledSmallContainer,
  StyledText,
  StyledImage,
  LabelWrapper,
  Status,
  StyledLine,
  Gap,
  PayementHeadings,
  PayementStatic,
  PayementStaticChild1,
  ProgressBar1,
  ProgressBar2,
  BigButtonContainer,
  StyledWrap
} from "./style";
import {
  Text,
  FontFamily,
  FontSize,
  FontWeight,
} from "app/components/atoms/text";
import ViewServiceProvider from "app/modules/dashboard/pages/search/ViewServiceProvider";
import { initialSPState, IServiceProviderData } from "../../../modules/dashboard/pages/search";
import {
  ServerConstantKeys,
} from "apiCalls/dashboard";
import { GetConstantValues } from "../getConstantValues";
import { viewProposal, statusComplete } from "apiCalls/proposalManagement";
import EditProposelCoverLetter from "app/modules/dashboard/pages/proposalManagement/editProposalCoverLetter";
import { getUserProfileDetailById } from "apiCalls/profile";
import NoContent from "app/components/atoms/noContent";
import { privatePaths } from "consts/paths";
import { initiateChats } from "apiCalls/discussionRoom";
import { showConfirmBox } from "utils/confirmBox";

//util imports
import Notify from "utils/notification";
import DateFormated from "utils/dateFormated";
import Loader from "utils/loader";

//constant imports
import { colorList } from "consts/color";
import Hire from "app/modules/dashboard/pages/proposalManagement/hire";
import { isHired, isShortListed } from "app/modules/dashboard/pages/proposalManagement/atomStore";
import { Button } from "app/components/atoms/mybutton";
import { images } from "assets/images";
import ReactTooltip from "react-tooltip";


function FooterDetails(item): ReactElement {

  const { t } = useTranslation();
  const value = item.item
  return (
    <StyledFooter>
      <StyledSmallContainer>

        <FooterDiv>
          <StyledLabel
            family={FontFamily.Inter}
            size={FontSize.Mini}
            weight={FontWeight.Medium}
            color={colorList.black1}
          >
            {t(translations.PROPOSALS.LOCATION)}
          </StyledLabel>
          <StyledWrap>
            {value?.serviceProviderId?.locationsInChina && <GetConstantValues
              serverConstantKey={ServerConstantKeys.chinaProvinces}
              fieldArray={value.serviceProviderId.locationsInChina}
              textColor={colorList.blue7}
              bgColor={colorList.white9}
            />}

          </StyledWrap>

        </FooterDiv>
      </StyledSmallContainer>

      <div>
        <FooterDiv>
          <StyledLabel
            family={FontFamily.Inter}
            size={FontSize.Mini}
            weight={FontWeight.Medium}
            color={colorList.black1}
          >
            {t(translations.PROPOSALS.EXPERIENCE)}
          </StyledLabel>
          <Text
            family={FontFamily.Inter}
            size={FontSize.Regular}
            weight={FontWeight.SemiBold}
            color={colorList.blue7}
          >
            {value.serviceProviderId.foundingHistory ?
              <GetConstantValues
                serverConstantKey={ServerConstantKeys.foundingHistory}
                value={value.serviceProviderId.foundingHistory}

              /> :
              <NoContent />
            }


          </Text>
        </FooterDiv>
      </div>

      <StyledSmallContainer>
        <FooterDiv>
          <StyledLabel
            family={FontFamily.Inter}
            size={FontSize.Mini}
            weight={FontWeight.Medium}
            color={colorList.black1}
          >
            {t(translations.PROPOSALS.LANGUAGES)}
          </StyledLabel>
          <StyledWrap>
            {value?.serviceProviderId?.languagesSpoken && <GetConstantValues
              serverConstantKey={ServerConstantKeys.languageSpoken}
              fieldArray={value.serviceProviderId.languagesSpoken}
              textColor={colorList.blue7}
              bgColor={colorList.white9}
            />}

          </StyledWrap>
        </FooterDiv>
      </StyledSmallContainer>
    </StyledFooter>
  );
}





function ProjectProgressBar({ numberOfStates, activeIndex, statesTitle }) {

  let states: any = [];

  for (let i = 0; i < numberOfStates; i++) {
    states.push({
      isActive: i <= activeIndex
    })
  }

  const renderItem = ({ isActive }, i) => {

    let image = images.statusChecked;

    if (i == activeIndex + 1) {
      image = images.statusCircle
    }
    if (i > activeIndex + 1) {
      image = images.statusFaded
    }

    let isFaded = false;

    if (i > activeIndex) {
      isFaded = true;
    }

    return <>
      <Status src={image}></Status>
      {i < numberOfStates - 1 && <StyledLine isFaded={isFaded} />}
    </>
  }

  return <>

    <ProgressBar1>{states.map((item, i) => renderItem(item, i))}</ProgressBar1>
    <ProgressBar2>
      {states.map((item, i) =>
        <PayementHeadings key={i}>

          <Text
            family={FontFamily.Inter}
            size={FontSize.ExtraSmall}
            color={colorList.blue1}
            weight={FontWeight.Medium}
          >
            {statesTitle[i]}

          </Text>
        </PayementHeadings>
      )}
    </ProgressBar2>
  </>
}



export default function Proposals({ items }): ReactElement {

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [showViewModal, setViewModal] = useState<boolean>(false);
  const [currentState, setCurrentState] =
    useState<IServiceProviderData>(initialSPState);
  const [currentProjectId, setCurrentProjectId] = useState<string>("");
  const [currentSpId, setCurrentSptId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [viewProposalData, setViewProposalData] = useState<object>({});

  const [isOpenView, setIsOpenView] = useState<boolean>(false);
  const [isOpenHire, setIsOpenHire] = useState<boolean>(false);

  const [project, setProject] = useState<string>("");
  const [brandName, setBrandName] = useState<string>("");
  const [spName, setSpName] = useState<string>("");
  const [proposalId, setProposalId] = useState<string>("");

  const [invoice, setInvoice] = useState<any>(null);


  const [status, setStatus] = useState<string>("");
  const [invoiceList, setInvoiceList] = useState([]);

  const [hiredProposalId, setHiredProposalId] = useAtom(isHired);
  const [shortlisted] = useAtom(isShortListed);

  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    if (items) {
      items.forEach(i => {
        if (i._id === hiredProposalId) {
          i.status = 'hired';
        }
      });
    }
  }, [hiredProposalId]);


  const handlePayments = (id: string) => {
    return () => {
      history.push(
        generatePath(privatePaths.payments, { id: id })
      );
    }
  }


  const handleCompleteApiCall = async (id: string, field: any) => {

    setLoading(true);
    try {

      let complete = await statusComplete(id, field)
      setLoading(false);
      return complete;

    } catch (error) {

      Notify({
        title: "",
        message: error + "",
        type: "danger",
      });


    }
    setLoading(false);



  }

  const handleComplete = (id: string, field: any) => {
    return () => {
      showConfirmBox({
        title: t(translations.CONFIRM_BOX.COMPLETE),
        message: t(translations.CONFIRM_BOX.COMPLETE_PROJECT),
        handleYesClick: () => handleCompleteApiCall(id, field),
      });
    }

  }

  const landButtons = (item: any): ReactElement => {

    switch (item.status) {
      case "sent":
        return <ViewButton onClick={handleHireButton(
          item?.projectId?.name,
          item?.brandId?.businessName,
          item?.serviceProviderId?.businessName,
          item._id
        )}
        >
          <Text
            family={FontFamily.Inter}
            size={FontSize.ExtraSmall}
            color={colorList.white1}
            weight={FontWeight.Bold}

          >
            {t(translations.BUTTONS.HIRE)}
          </Text>
        </ViewButton>

        break;
      case "hired":
      case "paymentPending":
      case "completed":

        return <StyledViewButton onClick={handlePayments(item._id)}>
          <Text
            family={FontFamily.Inter}
            size={FontSize.ExtraSmall}
            color={colorList.white1}
            weight={FontWeight.Bold}
          >
            {t(translations.BUTTONS.PAYMENTS)}

          </Text>
        </StyledViewButton  >

      case "paid":

        return (<ButtonContainer>
          <StyledViewButton onClick={handlePayments(item._id)}>
            <Text
              family={FontFamily.Inter}
              size={FontSize.ExtraSmall}
              color={colorList.white1}
              weight={FontWeight.Bold}
            >
              {t(translations.BUTTONS.PAYMENTS)}

            </Text>
          </StyledViewButton  >
          <StyledViewButton onClick={
            handleComplete(item._id, { status: "completed" })}>
            <Text
              family={FontFamily.Inter}
              size={FontSize.ExtraSmall}
              color={colorList.white1}
              weight={FontWeight.Bold}
            >
              {t(translations.BUTTONS.COMPLETE)}

            </Text>
          </StyledViewButton  >
        </ButtonContainer>)

      default:
        return <div>{"---"}</div>
    }
  }


  const handleViewServiceProvider = (items: any) => {

    return async () => {

      setIsOpen(true);
      try {

        const response = await getUserProfileDetailById(items?.serviceProviderId?._id, items?.projectId?._id);

        setViewModal(!showViewModal);
        setCurrentState(response);

        setCurrentSptId(items.serviceProviderId._id);
        setCurrentProjectId(items?.projectId?._id);
      } catch (error) {
        Notify({
          title: t(translations.ERROR_NOTIFY.PROJECT_DETAILS),
          message: error + "",
          type: "danger",
        });
      }

    }

  };

  const handleViewProposal = (id: string,
    status: string) => {


    return async () => {
      setProposalId(id);
      setIsOpenView(true);
      setLoading(true);
      setStatus(status);
      try {
        const coverLetter = await viewProposal(id);
        setViewProposalData(coverLetter);
        if (coverLetter.invoice) {
          setInvoice([coverLetter.invoice.invoice]);

        }
        setLoading(false);
      }
      catch (error) {
        setLoading(false);
        Notify({
          title: t(translations.ERROR_NOTIFY.BRAND_PROPOSAL),
          message: "error",
          type: "danger",
        });
      }

    }

  };

  const handleDiscuss = (chat_id: string, projectId: string) => {

    return async () => {
      setLoading(true);
      try {
        const response = await initiateChats({
          projectId: projectId,
          otherUser: chat_id,
        });
        history.push(
          generatePath(privatePaths.dashboardDiscussion, {
            id: response._id,
          })
        );
        setLoading(false);
      } catch (error) {
        Notify({
          title: t(translations.ERROR_NOTIFY.DISCUSSION_INITIATE),
          message: error + "",
          type: "danger",
        });
        setLoading(false);
      }

    }

  }

  const renderShortlistedIcon = () => {
    return <StyledImage src={images.shortlistIcon} />
  }

  const handleHireButton = (
    project: string,
    brandName: string,
    spName: string,
    id: string
  ) => {

    return async () => {

      setIsOpenHire(true);
      setProject(project);
      setBrandName(brandName);
      setSpName(spName);
      setProposalId(id);


    }

  };

  const onClose = () => {
    setIsOpen(false);
    setIsOpenView(false);
    setIsOpenHire(false)

  }

  // function renderStatusIcon(status?: boolean, faded?: boolean) {

  //   if (status) {
  //     return <Status src={images.statusChecked} />
  //   }
  //   if (!status && faded) {
  //     return <Status src={images.statusFaded} />
  //   }
  //   else {
  //     return <Status src={images.statusCircle} />
  //   }

  // }

  function getStateTitles(item) {
    return [t(translations.PAYMENT_STATUS.IN_DISCUSSION),
    t(translations.PAYMENT_STATUS.PROPOSAL_RECIEVED),
    t(translations.PAYMENT_STATUS.HIRED),
    item?.status === "paid" ? t(translations.PAYMENT_STATUS.PAID) : t(translations.PAYMENT_STATUS.PAYMENT_PENDING),
    t(translations.PAYMENT_STATUS.COMPLETED)]
  }


  function getActiveIndex(item) {

    switch (item.status) {
      case "sent":
        return 1;
      case "hired":
        return 2;
      case "paymentPending":
        return 3;
      case "paid":
        return 4;
      case "completed":
        return 5;

    }

  }


  if (loading) {
    return <Loader />;
  } else {
    return (
      <div>
        <PopUp
          modal
          position="bottom right"
          open={isOpen}
          onClose={onClose}
          closeOnDocumentClick={false}
        >

          <ViewServiceProvider
            providerDetails={currentState}
            projectId={currentProjectId}
            closeModal={onClose}
            spId={currentSpId}
          />
        </PopUp>

        <PopUp
          modal
          position="bottom right"
          open={isOpenView}
          onClose={onClose}
          closeOnDocumentClick={false}
        >
          <EditProposelCoverLetter
            onClose={onClose}
            id={proposalId}
            status={status}
            showInvoice={invoice}
          />

        </PopUp>

        <PopUp
          modal
          position="bottom right"
          open={isOpenHire}
          onClose={onClose}
          closeOnDocumentClick={false}
          style={{ padding: "0", border: `4px solid ${colorList.blue5}`, borderRadius: "0.5rem" }}
        >
          <Hire
            onClose={onClose}
            project={project}
            brandName={brandName}
            spName={spName}
            proposalId={proposalId}
          />

        </PopUp>
        {items && items.map((item, i) => (
          <StyledContainer key={i}>


            <Wrapper>
              <LogoContainer>
                {item?.serviceProviderId?.logo?.thumbnail ? (
                  <UserLogo src={item.serviceProviderId?.logo?.thumbnail} />

                ) : (
                  <div className="logo-container">
                    <Person color={colorList.black1} size={40} />
                  </div>
                )}
                <StyledTextWrapper>
                  <LabelWrapper>
                    <span onClick={handleViewServiceProvider(item)}>
                      <StyledText
                        family={FontFamily.Inter}
                        size={FontSize.ExtraRegular}
                        color={colorList.blue7}
                        weight={FontWeight.SemiBold}
                      >
                        <>
                          <a className="show-underline" data-tip="View service provider">{item?.serviceProviderId?.businessName}</a>
                          <ReactTooltip place="top" type="dark" effect="float" />
                        </>

                      </StyledText>
                    </span>

                    {item?.serviceProviderId.isShortlisted &&

                      <Button
                        textColor={colorList.green2}
                        color={colorList.variant17}
                        borderColor={colorList.variant19}
                        padding={"0.1px"}
                        borderRadius={"0.2rem"}
                        paddingHorizontal={"0.5rem"}
                        paddingVertical={"0.3rem"}
                        fontSize={FontSize.Mini}
                        text={t(translations.BUTTONS.SHORTLISTED)}
                        rendorRightIcon={renderShortlistedIcon}
                      >
                      </Button>

                    }
                  </LabelWrapper>
                  <Divider />
                  <Text
                    family={FontFamily.Inter}
                    size={FontSize.Mini}
                    color={colorList.grey3}

                  >
                    {t(translations.PROPOSALS.BIO) + "\n"}
                    {item?.serviceProviderId?.description}
                  </Text>
                  <Divider />
                  <Text
                    family={FontFamily.Inter}
                    size={FontSize.Mini}
                    color={colorList.grey3}

                  >
                    {t(translations.PROPOSALS.DATE)}{DateFormated(item?.createdAt)}
                  </Text>
                </StyledTextWrapper>
              </LogoContainer>
              <BigButtonContainer>
                <ButtonContainer>
                  <StyledViewButton onClick={handleDiscuss(item?.serviceProviderId?._id, item?.projectId?._id)}>
                    <Text
                      family={FontFamily.Inter}
                      size={FontSize.ExtraSmall}
                      color={colorList.white1}
                      weight={FontWeight.Bold}
                    >
                      {t(translations.BUTTONS.DISCUSS)}

                    </Text>
                  </StyledViewButton >
                  <StyledViewButton onClick={
                    handleViewProposal(
                      item?._id,
                      item.status
                    )}>
                    <Text
                      family={FontFamily.Inter}
                      size={FontSize.ExtraSmall}
                      color={colorList.white1}
                      weight={FontWeight.Bold}
                    >
                      {t(translations.BUTTONS.VIEW_PROPOSAL)}

                    </Text>
                  </StyledViewButton>
                </ButtonContainer>
                <Divider />
                <Divider />
                {landButtons(item)}
              </BigButtonContainer>

            </Wrapper>
            <StyledFooter>
              <PayementStatic>
                <Gap />
                <ProjectProgressBar numberOfStates={5} activeIndex={getActiveIndex(item)} statesTitle={getStateTitles(item)} ></ProjectProgressBar>
                <Gap />
              </PayementStatic>
            </StyledFooter>
            <FooterDetails item={item} />
          </StyledContainer>
        ))
        }
      </div >

    )
  }


}