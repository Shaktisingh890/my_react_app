import React, { ReactElement, useEffect, useState } from "react";
import { generatePath, useHistory, useParams } from "react-router-dom";
import {
  ButtonContainer,
  Container,
  DividerLine,
  RowContainer,
  StyledRadioContainer,
  Tag,
  StyledRadioLabel,
  StyledText1,
  AlignTitle
} from "./style";
import {
  FontFamily,
  FontWeight,
  FontSize,
  Text,
} from "app/components/atoms/text";
import { colorList } from "consts/color";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { Button } from "app/components/atoms/mybutton";
import {
  deleteProjectBriefList,
  getProjectData,
  putProjectData,
} from "apiCalls/projectBriefing";
import Notify from "utils/notification";
import Loader from "utils/loader";
import { getFromLocalStorage } from "localStorage";
import { images } from "assets/images";
import { ServerConstantKeys } from "apiCalls/dashboard";
import { privatePaths } from "consts/paths";
import { StyledRadioButton } from "app/components/molecules/radioButtons/style";
import { Search } from "@styled-icons/bootstrap";
import { shareFunction } from "apiCalls/marketplace";
import { initiateChats } from "apiCalls/discussionRoom";
import { showConfirmBox } from "utils/confirmBox";
import FilePreview from "app/components/atoms/filePreview";
import { IFileType } from "app/modules/profile/createProfile/brandForm";

interface IProjectFields {
  brandId: {
    _id: string;
  };
  name: string;
  briefType: string;
  brandOverview: string;
  wayOfOperation: string[];
  objective: string[];
  requirements: {
    chinaOfficeLocation: string[];
    languageSpoken: string[];
    segmentExperience: string[];
    industryExperience: string[];
    teamSize: string;
    experience: string;
  };
  budgetTypes: string[];
  isPublished: boolean;
  budget: any;
  startingTimeline: string;
  docs: IFileType[];
}

export default function ViewProject(): ReactElement {
  const { t } = useTranslation();
  const history = useHistory();

  const initialProjectState: IProjectFields = {
    brandId: {
      _id: "",
    },
    name: "",
    briefType: "",
    brandOverview: "",
    wayOfOperation: [],
    objective: [],
    requirements: {
      chinaOfficeLocation: [],
      languageSpoken: [],
      segmentExperience: [],
      industryExperience: [],
      teamSize: "",
      experience: "",
    },
    budgetTypes: [],
    isPublished: false,
    budget: {},
    startingTimeline: "",
    docs: [],
  };

  const [isServiceProvider, setServiceProvider] = useState<boolean>(false);
  const [isProjectBriefing, setProjectBriefing] = useState<boolean>(false);

  const [currentProjectId, setCurrentProjectId] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [formFields, setFormFields] =
    useState<IProjectFields>(initialProjectState);
  const { id, screenName }: any = useParams();

  useEffect(() => {
    const role = getFromLocalStorage("userRole");
    setServiceProvider(role === "serviceProvider");
    setCurrentProjectId(id);
    setProjectBriefing(screenName === "projectBriefing");

    setLoading(true);
    getProjectData(id)
      .then((resp: any) => {
        setFormFields(resp);
        setLoading(false);
      })
      .catch((error) => {
        Notify({
          title: t(translations.ERROR_NOTIFY.PROJECT_DETAILS),
          message: error,
          type: "danger",
        });
        setFormFields(initialProjectState);
        setLoading(false);
      });
  }, []);

  const handleShareApi = async () => {
    setLoading(true);

    try {
      const response = await shareFunction(currentProjectId);

      const blob = new Blob([response.data], {
        type: "application/pdf; charset=utf-8",
      });

      const url = (window.URL || window.webkitURL).createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "project-brief.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setLoading(false);
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.SHARE),
        message: error + "",
        type: "danger",
      });
      setLoading(false);
    }
  };

  const handlePublishButton = (isPublished: boolean) => {
    setLoading(true);
    putProjectData(currentProjectId, {
      isPublished,
    })
      .then((resp: any) => {
        setFormFields(resp);
        setLoading(false);
      })
      .catch((error) => {
        Notify({
          title: t(translations.ERROR_NOTIFY.PUBLISH_PROJECT),
          message: error,
          type: "danger",
        });
        setLoading(false);
      });
  };

  const handleEditButton = () => {
    history.push(
      generatePath(privatePaths.editProjectBriefingForm, {
        id: currentProjectId,
        screenName,
      })
    );
  };

  const handleSearchButton = () => {
    // Notify({
    //   title: "Search service provider feature coming soon",
    //   message: "",
    //   type: "success",
    // });
    history.push(
      generatePath(privatePaths.dashboardSearch, {
        id: currentProjectId,
        screenName,
      })
    );
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

  const showLabelText = (
    label: string,
    value: string,
    key?: ServerConstantKeys
  ) => {
    return (
      <div className="column-container">
        <Text family={FontFamily.Inter} size={FontSize.ExtraSmall}>
          {label}
        </Text>
        <div className="divider1" />
        {key || value ? (
          key ? (
            <Text
              family={FontFamily.Inter}
              size={FontSize.Small}
              weight={FontWeight.Medium}
              useServerLabel={key}
              value={value}
            />
          ) : (
            <Text
              family={FontFamily.Inter}
              size={FontSize.Small}
              weight={FontWeight.Medium}
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
    key: ServerConstantKeys
  ) => {
    return (
      <div className="column-container">
        <Text family={FontFamily.Inter} size={FontSize.ExtraSmall}>
          {label}
        </Text>
        <div className="divider1" />
        <div className="tag-row">
          {values.length > 0
            ? values?.map((el, index) => (
              <Tag key={index}>
                <Text
                  family={FontFamily.Inter}
                  size={FontSize.Small}
                  weight={FontWeight.Medium}
                  useServerLabel={key}
                  value={el}
                />
              </Tag>
            ))
            : showNoContent()}
        </div>
      </div>
    );
  };

  const showBudgetTag = (label: string, values: any) => {
    return (
      <div className="column-container">
        <Text family={FontFamily.Inter} size={FontSize.ExtraSmall}>
          {label}
        </Text>
        <div className="divider1" />
        <div className="tag-row">
          {values
            ? Object.keys(values)?.map((el, index) => (
              <Tag key={index}>
                <Text
                  family={FontFamily.Inter}
                  size={FontSize.Small}
                  weight={FontWeight.Medium}
                  useServerLabel={ServerConstantKeys.projectStartingFee_USD}
                  value={values[el]}
                />
                <Text
                  family={FontFamily.Inter}
                  size={FontSize.Mini}
                  weight={FontWeight.Medium}
                  useServerLabel={ServerConstantKeys.budgetTypes}
                  value={el}
                  color={colorList.grey1}
                />
              </Tag>
            ))
            : showNoContent()}
        </div>
      </div>
    );
  };

  const handleRadioSelection = (value: string) => {
    if (value === "public") {
      Notify({
        title: t(translations.SUCCESS),
        message: t(translations.PROJECT_BRIEFING.PUBLIC),
        type: "success",
      });
    }
    if (value === "private") {
      Notify({
        title: t(translations.SUCCESS),
        message: t(translations.PROJECT_BRIEFING.PRIVATE),
        type: "success",
      });
    }
    handlePublishButton(value === "public");
  };

  const showRadioButton = (value: string, text: string[]) => {
    return (
      <div className="radio-box">
        <StyledRadioButton
          className="cursor"
          onClick={() => handleRadioSelection(value)}
          selectedOption={
            formFields.isPublished ? value === "public" : value === "private"
          }
        />

        <StyledRadioLabel
          smallWidth={value === "private" && !formFields.isPublished}
        >
          <Text family={FontFamily.Inter}>
            <span className="bold">{text[0]}</span>
            {text[1]}
          </Text>
          <div className="divider" />
          <Text family={FontFamily.Inter} size={FontSize.Mini}>
            {text[2]}
          </Text>
        </StyledRadioLabel>

        {value === "private" && !formFields.isPublished && (
          <Button
            text={t(translations.BUTTONS.SEARCH)}
            textColor={colorList.white1}
            borderColor={colorList.blue1}
            color={colorList.blue1}
            onClick={handleSearchButton}
          >
            <Search className="iconImage" color={colorList.white1} />
          </Button>
        )}
      </div>
    );
  };

  const showFileTag = (label: string, values: IFileType[]) => {
    return (
      <div className="label-container">
        <Text family={FontFamily.Inter} size={FontSize.ExtraSmall}>
          {label}
        </Text>
        <div className="divider1" />
        <div className="row">
          {values?.length > 0 ? (
            <FilePreview docs={values} bgColor={colorList.variant3} />
          ) : (
            showNoContent()
          )}
        </div>
      </div>
    );
  };

  const handleDiscussionStartApi = async () => {
    setLoading(true);
    try {
      const response = await initiateChats({
        projectId: currentProjectId,
        otherUser: formFields.brandId._id,
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
  };

  const handleDeleteApiCall = async () => {
    setLoading(true);
    try {
      await deleteProjectBriefList(currentProjectId);
      history.push(privatePaths.dashboardBreifing);
      setLoading(false);
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.DELETE_PROJECT),
        message: error + "",
        type: "danger",
      });
      setLoading(false);
    }
  };

  const handleDeleteButton = async () => {
    showConfirmBox({
      title: t(translations.CONFIRM_BOX.DELETING) + formFields.name,
      message: t(translations.CONFIRM_BOX.DELETE_PROJECT),
      handleYesClick: () => handleDeleteApiCall(),
    });
  };

  const handleBackClick = () => {
    history.goBack();
  };

  if (loading) {
    return <Loader />;
  } else {
    return (
      <Container>
        <AlignTitle>
          <span onClick={handleBackClick}>
            <img src={images.arrowLeft} />
          </span>
          <StyledText1
            family={FontFamily.Inter}
            size={FontSize.ExtraRegular}
            color={colorList.blue1}
            weight={FontWeight.Medium}
          >
            {t(translations.PROJECT_BRIEFING.PROJECT_DETAILS)}
          </StyledText1>
        </AlignTitle>
        <div className="flex-end-container">
          {!isServiceProvider && (
            <Button
              text={t(translations.BUTTONS.EDIT)}
              textColor={colorList.blue1}
              borderColor={colorList.blue1}
              color={"transparent"}
              paddingHorizontal={"3rem"}
              onClick={handleEditButton}
            />
          )}
          {!isServiceProvider && isProjectBriefing && (
            <Button
              text={t(translations.BUTTONS.DELETE)}
              textColor={colorList.red1}
              borderColor={colorList.red1}
              color={"transparent"}
              paddingHorizontal={"3rem"}
              onClick={handleDeleteButton}
            />
          )}
        </div>

        {showLabelText(t(translations.FORM_LABELS.TITLE), formFields.name)}
        {showLabelText(
          t(translations.FORM_LABELS.PROJECT_TYPE),
          formFields.briefType,
          ServerConstantKeys.projectBriefingTypes
        )}
        {showLabelText(
          t(translations.FORM_LABELS.PROJECT_OVERVIEW),
          formFields.brandOverview
        )}
        {/* {showLabelTag(
          t(translations.FORM_LABELS.WAY_OF_OPERATION),
          formFields.wayOfOperation,
          ServerConstantKeys.wayOfOperations
        )} */}
        {showLabelText(
          t(translations.FORM_LABELS.OBJECTIVE),
          formFields.objective[0]
        )}
        <div className="row-container">
          <div className="text-container">
            <Text
              family={FontFamily.Inter}
              color={colorList.blue1}
              weight={FontWeight.Medium}
            >
              {t(translations.FORM_LABELS.IDEAL_SERVICE_PROVIDER)}
            </Text>
          </div>

          <DividerLine />
        </div>
        <div className="divider2" />
        <RowContainer>
          {showLabelText(
            t(translations.FORM_LABELS.COMPANY_SIZE),
            formFields.requirements.teamSize,
            ServerConstantKeys.teamSizeRequirements
          )}
          {showLabelText(
            t(translations.FORM_LABELS.REQUIRED_EXP),
            formFields.requirements.experience,
            ServerConstantKeys.requiredExperience
          )}
        </RowContainer>
        <RowContainer>
          {showLabelTag(
            t(translations.FORM_LABELS.INDUSTRY_EXP),
            formFields.requirements.industryExperience,
            ServerConstantKeys.industryExperience
          )}
          {showLabelTag(
            t(translations.FORM_LABELS.SEGMENT_EXP),
            formFields.requirements.segmentExperience,
            ServerConstantKeys.segmentExperience
          )}
        </RowContainer>
        <div className="row-container">
          <div className="text-container">
            <Text
              family={FontFamily.Inter}
              color={colorList.blue1}
              weight={FontWeight.Medium}
            >
              {t(translations.FORM_LABELS.BUDGET_TIMELINE)}
            </Text>
          </div>

          <DividerLine />
        </div>
        <div className="divider2" />
        <RowContainer>
          {showLabelTag(
            t(translations.FORM_LABELS.BUDGET_TYPE),
            formFields.budgetTypes,
            ServerConstantKeys.budgetTypes
          )}
          {showBudgetTag(t(translations.FORM_LABELS.BUDGET), formFields.budget)}
        </RowContainer>

        {showLabelText(
          t(translations.FORM_LABELS.TIMELINE),
          formFields.startingTimeline,
          ServerConstantKeys.startingTimeline
        )}


        {showLabelTag(
          t(translations.FORM_LABELS.CHINA_LOCATION),
          formFields.requirements.chinaOfficeLocation,
          ServerConstantKeys.chinaCities
        )}
        {showLabelTag(
          t(translations.FORM_LABELS.LANGUAGES_SPOKEN),
          formFields.requirements.languageSpoken,
          ServerConstantKeys.languageSpoken
        )}
        {showFileTag(t(translations.FORM_LABELS.OTHER_FILES), formFields.docs)}

        {!isServiceProvider && isProjectBriefing && (
          <StyledRadioContainer>
            {showRadioButton("public", [
              t(translations.MARKETPLACE.PUBLIC),
              t(translations.MARKETPLACE.VISIBLE_IN_MARKETPLACE),
              t(translations.MARKETPLACE.PUBLIC_SUBTITLE),

            ])}
            {showRadioButton("private", [
              t(translations.MARKETPLACE.PRIVATE),
              t(translations.MARKETPLACE.BY_INVIATION),
              t(translations.MARKETPLACE.PRIVATE_SUBTITLE),
            ])}
          </StyledRadioContainer>
        )}

        <ButtonContainer>
          <Button
            text={t(translations.BUTTONS.SAVE_AS_PDF)}
            textColor={colorList.white1}
            borderColor={colorList.blue1}
            color={colorList.blue1}
            paddingHorizontal={"2rem"}
            onClick={handleShareApi}
          >
            <img src={images.pdf} alt="pdf" className="iconImage" />
          </Button>
          {/* {!isServiceProvider && isProjectBriefing && (
            <Button
              text={t(translations.BUTTONS.SEARCH_SERVICE_PROVIDER)}
              textColor={colorList.white1}
              borderColor={colorList.blue1}
              color={colorList.blue1}
              paddingHorizontal={"2rem"}
              disabled={formFields.isPublished}
              onClick={handleSearchButton}
            >
              <Search className="iconImage" color={colorList.white1} />
            </Button>
          )} */}
          {isServiceProvider && !isProjectBriefing && (
            <Button
              text={t(translations.BUTTONS.INTERESTED_APPLY)}
              textColor={colorList.white1}
              borderColor={colorList.blue1}
              color={colorList.blue1}
              paddingHorizontal={"2rem"}
              onClick={handleDiscussionStartApi}
            />
          )}
        </ButtonContainer>
      </Container>
    );
  }
}
