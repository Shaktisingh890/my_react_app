import React, { useState, useEffect } from "react";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { Container, Divider, UserLogo } from "./style";
import { atom, useAtom } from 'jotai';
import {
  Text,
  FontSize,
  FontWeight,
  FontFamily,
} from "app/components/atoms/text";
import { Button } from "app/components/atoms/mybutton";
import { colorList } from "consts/color";
import {
  removeShortlistedServiceProvider,
  shortlistServiceProvider,
} from "apiCalls/projectBriefing";
import Loader from "utils/loader";
import Notify from "utils/notification";
import { IFileType } from "app/modules/profile/createProfile/brandForm";
import { IServiceProviderData } from ".";
import { X } from "@styled-icons/bootstrap/X";
import { Person } from "@styled-icons/bootstrap";
import { ServerConstantKeys } from "apiCalls/dashboard";
import FilePreview from "app/components/atoms/filePreview";
import { privatePaths } from "consts/paths";
import { initiateChats, proposalInvite } from "apiCalls/discussionRoom";
import { generatePath, useHistory } from "react-router-dom";
import { getFromLocalStorage } from "localStorage";
import { isShortListed } from "../proposalManagement/atomStore"
interface IServiceProviderProps {
  providerDetails: IServiceProviderData;
  projectId: string;
  spId: string;
  closeModal: any;
  handleDiscussionFunction?: any;
}

export default function ViewServiceProvider({
  providerDetails,
  projectId,
  closeModal,
  spId,
  handleDiscussionFunction,
}: IServiceProviderProps) {
  const { t } = useTranslation();

  const {
    businessName,
    logo,
    hqLocation,
    foundingHistory,
    staffSize,
    description,
    mainSpecialities,
    industryExperience,
    languagesSpoken,
    docs,
    isShortlisted,
    askedForProposal,
    locationsInChina,
    services,
    notableClients,
    caseStudies,
    retainerBasedFeeUSD,
    projectBasedFeeUSD,
  } = providerDetails;

  const history = useHistory();
  const [isShortlistedSp, setIsShortlistedSp] =
    useState<boolean>(isShortlisted);
  const [loading, setLoading] = useState<boolean>(false);
  const [proposalloading, setProposalLoading] = useState<boolean>(false);
  const [isProposalAskedSp, setIsProposalAskedSp] = useState<boolean>(
    askedForProposal || false
  );
  const [, setShortlisted] = useAtom(isShortListed);

  const handleShortlistApi = async () => {
    setLoading(true);
    try {
      if (isShortlistedSp) {

        const response = await removeShortlistedServiceProvider(projectId, spId);

        setIsShortlistedSp(false);
        setShortlisted(projectId);
        closeModal && closeModal();
      } else {
        const response = await shortlistServiceProvider({
          projectId,
          serviceProviderId: spId,
        });

        setIsShortlistedSp(true);
        setShortlisted(projectId);
        closeModal && closeModal();
      }
      setLoading(false);
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.SHORTLIST_SP),
        message: error + "",
        type: "danger",
      });
      setLoading(false);
    }
  };

  const handleProposalApi = async () => {
    setProposalLoading(true);
    try {
      await proposalInvite(projectId, spId);
      setIsProposalAskedSp(true);
      setProposalLoading(false);
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.PROPOSAL),
        message: error + "",
        type: "danger",
      });
      setIsProposalAskedSp(false);
      setProposalLoading(false);
    }
  };

  const handleDiscussionStartApi = async () => {
    try {
      const response = await initiateChats({
        projectId,
        otherUser: spId,
      });
      if (handleDiscussionFunction) {
        handleDiscussionFunction(response._id);
      } else {
        history.push(
          generatePath(privatePaths.dashboardDiscussion, {
            id: response._id,
          })
        );
      }
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.DISCUSSION_INITIATE),
        message: error + "",
        type: "danger",
      });
    }
  };

  const showNoContent = () => {
    return (
      <Text
        family={FontFamily.Inter}
        size={FontSize.Small}
        color={colorList.variant6}
        weight={FontWeight.Medium}
      >
        {t(translations.PROJECT_BRIEFING.NO_CONTENT)}
      </Text>
    );
  };

  const showDescriptionText = (
    label: string,
    value: string = "",
    showLarger: boolean = false
  ) => {
    return (
      <div className="label-container">
        <Text
          family={FontFamily.Inter}
          size={showLarger ? FontSize.ExtraRegular : FontSize.Mini}
        >
          {label}
        </Text>
        <Divider height={showLarger ? 1 : 0.375} />
        {value ? (
          <Text
            family={FontFamily.Inter}
            color={showLarger ? colorList.grey3 : colorList.black1}
            weight={showLarger ? FontWeight.Light : FontWeight.Regular}
            size={FontSize.Small}
          >
            {value}
          </Text>
        ) : (
          showNoContent()
        )}
      </div>
    );
  };

  const showLabelText = (
    label: string,
    value: string,
    key?: ServerConstantKeys,
    showLarger: boolean = false
  ) => {
    return (
      <div className="label-container">
        <Text
          family={FontFamily.Inter}
          size={showLarger ? FontSize.ExtraRegular : FontSize.Mini}
        >
          {label}
        </Text>
        <Divider height={showLarger ? 1 : 0.375} />
        {value ? (
          key ? (
            <Text
              family={FontFamily.Inter}
              color={colorList.blue7}
              weight={FontWeight.SemiBold}
              useServerLabel={key}
              value={value}
            />
          ) : (
            <Text
              family={FontFamily.Inter}
              color={colorList.blue7}
              weight={FontWeight.SemiBold}
            >
              {value}
            </Text>
          )
        ) : (
          showNoContent()
        )}
      </div>
    );
  };

  const showLabelTag = (
    label: string,
    values: string[],
    key?: ServerConstantKeys,
    showLarger: boolean = false
  ) => {
    return (
      <div className="label-container">
        <Text
          family={FontFamily.Inter}
          size={showLarger ? FontSize.ExtraRegular : FontSize.Mini}
        >
          {label}
        </Text>
        <Divider height={showLarger ? 1 : 0.375} />
        <div className="row">
          {values?.length > 0
            ? values.map((el, i) => (
              <div className="tag" key={i}>
                {!key ? (
                  <Text
                    family={FontFamily.Inter}
                    color={colorList.blue7}
                    weight={FontWeight.SemiBold}
                  >
                    {el}
                  </Text>
                ) : (
                  <Text
                    family={FontFamily.Inter}
                    color={colorList.blue7}
                    weight={FontWeight.SemiBold}
                    size={FontSize.ExtraSmall}
                    useServerLabel={key}
                    value={el}
                  />
                )}
              </div>
            ))
            : showNoContent()}
        </div>
      </div>
    );
  };

  const showFileTag = (label: string, values: IFileType[]) => {
    return (
      <div className="label-container">
        <Text family={FontFamily.Inter} size={FontSize.Mini}>
          {label}
        </Text>
        <Divider height={0.375} />
        <div className="row">
          {values?.length > 0 ? (
            <FilePreview docs={values} bgColor={colorList.white8} />
          ) : (
            showNoContent()
          )}
        </div>
      </div>
    );
  };

  return (
    <Container>
      <div className="purpleContainer">
      
        <div className="row">
          <div className="logo">
            {logo?.thumbnail ? (
              <UserLogo src={logo?.thumbnail} />
            ) : (
              <div className="logo-container">
                <Person color={colorList.black1} size={40} />
              </div>
            )}
          </div>
          <div className="column spacing">
            <Text
              family={FontFamily.Inter}
              size={FontSize.ExtraRegular}
              weight={FontWeight.Medium}
              color={colorList.white1}
            >
              {businessName}
            </Text>
          </div>
        </div>
        <div className="crossIcon">
          <X
            size={30}
            color={colorList.white1}
            onClick={closeModal}
            className="cursor"
          />
        </div>
      </div>
      <div className="whiteContainer">
        <div className="firstChild">
          {showLabelTag(
            t(translations.FORM_LABELS.HEAD_QUARTER),
            [hqLocation],
            ServerConstantKeys.countries
          )}
          {showLabelTag(
            t(translations.FORM_LABELS.CHINA_LOCATION),
            locationsInChina,
            ServerConstantKeys.chinaCities
          )}
          {showLabelText(
            t(translations.FORM_LABELS.FOUNDING_HISTORY),
            foundingHistory,
            ServerConstantKeys.foundingHistory
          )}
          {showLabelText(
            t(translations.FORM_LABELS.COMPANY_SIZE),
            staffSize,
            ServerConstantKeys.staffSize
          )}
          {showLabelText(
            t(translations.FORM_LABELS.RETAINER_STARTING_FEE),
            retainerBasedFeeUSD,
            ServerConstantKeys.projectStartingFee_USD
          )}
          {showLabelText(
            t(translations.FORM_LABELS.PROJECT_STARTING_FEE),
            projectBasedFeeUSD,
            ServerConstantKeys.projectStartingFee_USD
          )}
        </div>
        <div className="secondChild">
          {showDescriptionText(
            t(translations.FORM_LABELS.ABOUT),
            description,
            true
          )}
          {showLabelTag(
            t(translations.FORM_LABELS.TYPE_OF_SERVCIES),
            mainSpecialities,
            ServerConstantKeys.mainSpecialities,
            true
          )}
          {showLabelTag(
            t(translations.FORM_LABELS.INDUSTRY),
            industryExperience,
            ServerConstantKeys.industryExperience,
            true
          )}
          {showLabelTag(
            t(translations.FORM_LABELS.LANGUAGES),
            languagesSpoken,
            ServerConstantKeys.languageSpoken,
            true
          )}
          {showDescriptionText(
            t(translations.FORM_LABELS.SERVICES),
            services,
            false
          )}
          {showDescriptionText(
            t(translations.FORM_LABELS.NOTABLE_CLIENTS),
            notableClients,
            false
          )}
          {showDescriptionText(
            t(translations.FORM_LABELS.CASE_STUDY),
            caseStudies,
            false
          )}
          {showFileTag(t(translations.FORM_LABELS.COMPANY_INTRODUCTIONS), docs)}
        </div>
      </div>
      <div className="footer">
        <Button
          text={t(translations.BUTTONS.START_DISCUSSION)}
          onClick={handleDiscussionStartApi}
          textColor={colorList.white1}
          borderColor={colorList.blue1}
          color={colorList.blue1}
        />
        {getFromLocalStorage("userId") !== spId && (
          <Button
            text={
              isShortlistedSp
                ? t(translations.BUTTONS.REMOVE_FROM_SHORTLIST)
                : t(translations.BUTTONS.ADD_TO_SHORTLIST)
            }
            textColor={isShortlistedSp ? colorList.red1 : colorList.blue1}
            borderColor={isShortlistedSp ? colorList.red1 : colorList.blue1}
            onClick={handleShortlistApi}
            color={isShortlistedSp ? colorList.variant13 : colorList.grey5}
            loading={loading}
            loaderColor={isShortlistedSp ? colorList.red1 : colorList.blue1}
            paddingHorizontal={isShortlistedSp ? "1.5rem" : "3rem"}
          />
        )}
        {/* <Button
          text={
            isProposalAskedSp
              ? t(translations.BUTTONS.ASKED_FOR_PROPOSAL)
              : t(translations.BUTTONS.ASK_FOR_PROPOSAL)
          }
          textColor={colorList.white1}
          borderColor={colorList.blue1}
          color={colorList.blue1}
          onClick={handleProposalApi}
          loading={proposalloading}
          disabled={isProposalAskedSp}
        /> */}
      </div>
    </Container>
  );
}
