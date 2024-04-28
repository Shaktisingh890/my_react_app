import React, { useState, useEffect } from "react";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import Dropdown from "app/components/atoms/dropdown";
import {
  Divider,
  DropdownContainer,
  LargeDividerLine,
  PageContainer,
  SPCard,
  UserLogo,
} from "./style";
import {
  Text,
  FontSize,
  FontWeight,
  FontFamily,
} from "app/components/atoms/text";
import { Button } from "app/components/atoms/mybutton";
import { colorList } from "consts/color";
import Loader from "utils/loader";
import MultiSelect from "app/components/molecules/multiSelect";
import { ServerConstantKeys } from "apiCalls/dashboard";
import { Person } from "@styled-icons/bootstrap/Person";
import { generatePath, useHistory, useParams } from "react-router-dom";
import Notify from "utils/notification";
import {
  contactExpanter,
  getProjectData,
  searchServiceProvider,
  shortlistServiceProvider,
} from "apiCalls/projectBriefing";
import { IFileType } from "app/modules/profile/createProfile/brandForm";
import { privatePaths } from "consts/paths";
import { removeShortlistedServiceProvider } from "apiCalls/projectBriefing/index";
import PopUp from "app/components/atoms/popup";
import ViewServiceProvider from "./ViewServiceProvider";
import { initiateChats } from "apiCalls/discussionRoom";

export interface IServiceProviderData {
  _id: string;
  businessName: string;
  description: string;
  mainSpecialities: string[];
  additionalCapacities: string[];
  industryExperience: string[];
  internationalPresence: string[];
  languagesSpoken: string[];
  hqLocation: string;
  logo: IFileType;
  docs: IFileType[];
  annualTurnover: string;
  companyRegistrationType: string;
  foundingHistory: string;
  foundingYear?: string;
  linkedinUrl: string;
  staffSize: string;
  website: string;
  isShortlisted: boolean;
  isSignedUp?: boolean;
  name?: string;
  hq_location?: string;
  founding_year?: string;
  language?: string[];
  specialities?: string;
  industry?: string;
  primary_email?: string;
  askedForProposal?: boolean;
  locationsInChina: string[];
  services?: string;
  notableClients?: string;
  caseStudies?: string;
  retainerBasedFeeUSD: string;
  projectBasedFeeUSD: string;
}

interface IProjectFields {
  locationsInChina: string[];
  languagesSpoken: string[];
  industryExperience: string[];
  staffSize: string;
  budgetProjectBased: string;
  budgetRetainerBased: string;
  foundingHistory?: string;
  mainSpecialities?: string[];
}

export const initialSPState = {
  _id: "",
  businessName: "",
  description: "",
  mainSpecialities: [],
  additionalCapacities: [],
  industryExperience: [],
  internationalPresence: [],
  languagesSpoken: [],
  hqLocation: "",
  logo: {},
  docs: [],
  annualTurnover: "",
  companyRegistrationType: "",
  foundingHistory: "",
  linkedinUrl: "",
  staffSize: "",
  website: "",
  isShortlisted: false,
  isSignedUp: false,
  locationsInChina: [],
  retainerBasedFeeUSD: "",
  projectBasedFeeUSD: "",
};

export default function Search() {
  const initialDropdownState = {
    locationsInChina: [],
    languagesSpoken: [],
    industryExperience: [],
    staffSize: "",
    budgetProjectBased: "",
    budgetRetainerBased: "",
    foundingHistory: "",
    mainSpecialities: [],
  };

  const [projectId, setProjectId] = useState<string>("");
  const [showViewModal, setViewModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>();
  const [currentState, setCurrentState] =
    useState<IServiceProviderData>(initialSPState);
  const [spLoading, setSpLoading] = useState<boolean>(false);
  const [formFields, setFormFields] =
    useState<IProjectFields>(initialDropdownState);
  const [contactedExpanter, setContactedExpanter] = useState<string[]>([]);
  const [serviceProviderData, setServiceProviderData] = useState<
    IServiceProviderData[]
  >([]);
  const { id: currentId }: any = useParams();

  const history = useHistory();
  const { t } = useTranslation();

  const getProjectDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await getProjectData(id);
      setFormFields({
        mainSpecialities: response?.mainSpecialities,
        locationsInChina: response?.requirements?.chinaOfficeLocation,
        languagesSpoken: response?.requirements?.languageSpoken,
        staffSize: response?.requirements?.staffSize,
        industryExperience: response?.requirements?.industryExperience,
        budgetRetainerBased: response?.budget?.retainerBased,
        budgetProjectBased: response?.budget?.projectBased,
        foundingHistory: response?.foundingHistory,
      });
      setLoading(false);
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.PROJECT_DETAILS),
        message: error + "",
        type: "danger",
      });
      setFormFields(initialDropdownState);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentId) {
      setProjectId(currentId);
      getProjectDetails(currentId);
    }
  }, []);

  useEffect(() => {
    if (!showViewModal) {
      getSearchApi();
    }
  }, [showViewModal]);

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
    value?: string,
    key?: ServerConstantKeys,
    color: string = colorList.blue7,
    weight: FontWeight = FontWeight.SemiBold
  ) => {
    return (
      <div className="label-container">
        <Text
          family={FontFamily.Inter}
          size={FontSize.Mini}
          weight={FontWeight.Medium}
        >
          {label}
        </Text>
        <Divider height={0.375} />
        {value ? (
          key ? (
            <Text
              family={FontFamily.Inter}
              color={color}
              weight={weight}
              useServerLabel={key}
              value={value}
            />
          ) : (
            <Text family={FontFamily.Inter} color={color} weight={weight}>
              {value}
            </Text>
          )
        ) : (
          showNoContent()
        )}
      </div>
    );
  };

  const handleShortlistApi = async (spId: string, isShortlisted: boolean) => {
    setSpLoading(true);
    try {
      if (isShortlisted) {
        await removeShortlistedServiceProvider(projectId, spId);
      } else {
        await shortlistServiceProvider({
          projectId,
          serviceProviderId: spId,
        });
      }

      setSpLoading(false);
      getSearchApi();
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.SHORTLIST_SP),
        message: error + "",
        type: "danger",
      });
      setSpLoading(false);
    }
  };

  const showLabelTag = (
    label: string,
    values?: string[],
    key?: ServerConstantKeys
  ) => {
    return (
      <div className="label-container">
        <Text
          family={FontFamily.Inter}
          size={FontSize.Mini}
          weight={FontWeight.Medium}
        >
          {label}
        </Text>
        <Divider height={0.375} />
        <div className="column">
          {values && values?.length > 0
            ? values.map((el, i) => (
              <div className="tag" key={i}>
                {key ? (
                  <Text
                    family={FontFamily.Inter}
                    color={colorList.blue7}
                    weight={FontWeight.SemiBold}
                    size={FontSize.ExtraSmall}
                    useServerLabel={key}
                    value={el}
                  />
                ) : (
                  <Text
                    family={FontFamily.Inter}
                    color={colorList.blue7}
                    weight={FontWeight.SemiBold}
                    size={FontSize.ExtraSmall}
                  >
                    {el}
                  </Text>
                )}
              </div>
            ))
            : showNoContent()}
        </div>
      </div>
    );
  };

  const handleModal = (item: IServiceProviderData) => {
    setViewModal(!showViewModal);
    setCurrentState(item);
  };

  const closeModal = () => {
    setViewModal(false);
  };

  const handleDiscussionStartApi = async (sId: string) => {
    setLoading(true);
    try {
      const response = await initiateChats({
        projectId,
        otherUser: sId,
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

  const handleContactExpanter = async (item: IServiceProviderData) => {
    setSpLoading(true);
    try {
      if (item.primary_email) {
        await contactExpanter({
          serviceProviderEmail: item.primary_email,
          otherDetails: JSON.stringify(item),
        });
        let tempArr = [...contactedExpanter];
        tempArr.push(item?.primary_email);
        setContactedExpanter(tempArr);
      }
      Notify({
        title: "",
        message: t(translations.SUCCESS_NOTIFY.EXPANTER_WILL_CONTACT),
        type: "success",
      });

      setSpLoading(false);
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.EXPANTER_CONTACT),
        message: error + "",
        type: "danger",
      });
      setSpLoading(false);
    }
  };

  const getFoundingHistoryFromYear = (year: string = "") => {
    let yearDiff = new Date().getFullYear() - parseInt(year);

    if (yearDiff > 10) return t(translations.FOUNDING_HISTORY.MORE_THAN_10);
    else if (yearDiff > 5 && yearDiff <= 10)
      return t(translations.FOUNDING_HISTORY.FIVE_AND_10);
    else if (yearDiff > 3 && yearDiff <= 5)
      return t(translations.FOUNDING_HISTORY.THREE_AND_5);
    else if (yearDiff > 1 && yearDiff <= 3)
      return t(translations.FOUNDING_HISTORY.ONE_AND_3);
    else return t(translations.FOUNDING_HISTORY.LESS_1);
  };

  const showOldServiceProviderCard = (
    item: IServiceProviderData,
    index: number
  ) => {
    return (
      <SPCard key={index}>
        <div className="first-row">
          <div className="logo">
            {item.logo ? (
              <UserLogo src={item?.logo?.thumbnail} />
            ) : (
              <div className="logo-container">
                <Person color={colorList.black1} size={40} />
              </div>
            )}
          </div>

          <div className="buttons">
            <Button
              text={t(translations.BUTTONS.VIEW)}
              textColor={colorList.blue1}
              borderColor={colorList.blue1}
              color={colorList.white1}
              onClick={() => handleModal(item)}
            />

            <Button
              text={
                item.isShortlisted
                  ? t(translations.BUTTONS.REMOVE_FROM_FAVOURITE)
                  : t(translations.BUTTONS.ADD_TO_FAVOURITE)
              }
              textColor={colorList.white1}
              borderColor={colorList.blue1}
              color={colorList.blue1}
              onClick={() => handleShortlistApi(item._id, item.isShortlisted)}
            />

            <Button
              text={t(translations.BUTTONS.START_DISCUSSION)}
              textColor={colorList.white1}
              borderColor={colorList.blue1}
              color={colorList.blue1}
              onClick={() => handleDiscussionStartApi(item._id)}
            />
          </div>
        </div>
        <div className="second-row">
          <Text
            family={FontFamily.Inter}
            size={FontSize.ExtraRegular}
            color={colorList.blue7}
            weight={FontWeight.Bold}
          >
            {item.businessName}
          </Text>
          <Divider height={0.25} />
          <Text
            family={FontFamily.Inter}
            size={FontSize.Mini}
            color={colorList.grey3}
          >
            {item.description}
          </Text>

          <div className="row flex-3">
            {showLabelText(
              t(translations.FORM_LABELS.LOCATION),
              item?.hqLocation,
              ServerConstantKeys.countries
            )}
            {showLabelText(
              t(translations.FORM_LABELS.YEARS_OF_EXPERIENCE),
              item.foundingHistory,
              ServerConstantKeys.foundingHistory
            )}
            {showLabelTag(
              t(translations.FORM_LABELS.LANGUAGES),
              item.languagesSpoken,
              ServerConstantKeys.languageSpoken
            )}
          </div>
          <LargeDividerLine />
          <div className="row flex-4">
            {showLabelTag(
              t(translations.FORM_LABELS.TYPE_OF_SERVCIES),
              item.mainSpecialities,
              ServerConstantKeys.mainSpecialities
            )}
            {showLabelText(
              t(translations.FORM_LABELS.SERVICES),
              item?.services,
              undefined,
              colorList.grey3,
              FontWeight.Regular
            )}
            {showLabelTag(
              t(translations.FORM_LABELS.INDUSTRY),
              item.industryExperience,
              ServerConstantKeys.industryExperience
            )}
            {showLabelText(
              t(translations.FORM_LABELS.NOTABLE_CLIENTS),
              item?.notableClients,
              undefined,
              colorList.grey3,
              FontWeight.Regular
            )}
          </div>
        </div>
      </SPCard>
    );
  };

  const showNewServiceProviderCard = (
    item: IServiceProviderData,
    index: number
  ) => {
    return (
      <SPCard key={index}>
        <div className="first-row">
          <div className="logo">
            {item.logo ? (
              <UserLogo src={item?.logo?.thumbnail} />
            ) : (
              <div className="logo-container">
                <Person color={colorList.black1} size={40} />
              </div>
            )}
          </div>

          <div className="buttons">
            <Button
              text={
                item?.primary_email &&
                  contactedExpanter.includes(item?.primary_email)
                  ? t(translations.BUTTONS.CONTACTED)
                  : t(translations.BUTTONS.INTERESTED_EXPANTER)
              }
              textColor={colorList.white1}
              borderColor={colorList.blue1}
              color={colorList.blue1}
              disabled={contactedExpanter.includes(item?.primary_email || "")}
              onClick={() => handleContactExpanter(item)}
            />
          </div>
        </div>
        <div className="second-row">
          <Text
            family={FontFamily.Inter}
            size={FontSize.ExtraRegular}
            color={colorList.blue7}
            weight={FontWeight.Bold}
          >
            {item?.name}
          </Text>
          <Divider height={0.25} />
          <Text
            family={FontFamily.Inter}
            size={FontSize.Mini}
            color={colorList.grey3}
          >
            {item?.description}
          </Text>

          <div className="row flex-3">
            {showLabelText(
              t(translations.FORM_LABELS.LOCATION),
              item?.hq_location
            )}
            {showLabelText(
              t(translations.FORM_LABELS.YEARS_OF_EXPERIENCE),
              getFoundingHistoryFromYear(item?.founding_year)
            )}
            {showLabelTag(
              t(translations.FORM_LABELS.LANGUAGES),
              item?.language
            )}
          </div>
          <LargeDividerLine />
          <div className="row flex-4">
            {showLabelTag(
              t(translations.FORM_LABELS.TYPE_OF_SERVCIES),
              item?.specialities?.split(",")
            )}
            {showLabelText(
              t(translations.FORM_LABELS.SERVICES),
              item?.services,
              undefined,
              colorList.grey3,
              FontWeight.Regular
            )}
            {showLabelTag(
              "",
              // t(translations.FORM_LABELS.INDUSTRY),
              item?.industry?.split(",")
            )}
            {showLabelText(
              t(translations.FORM_LABELS.NOTABLE_CLIENTS),
              item?.notableClients,
              undefined,
              colorList.grey3,
              FontWeight.Regular
            )}
          </div>
        </div>
      </SPCard>
    );
  };

  const getSearchApi = async () => {
    if (projectId.length > 0) {
      setSpLoading(true);
      try {
        let response = await searchServiceProvider(projectId, formFields);
        response = response.map((i) => {
          if (typeof i.hqLocation !== "string") return { ...i, hqLocation: "" };
          else return i;
        });
        setServiceProviderData(response);
        setSpLoading(false);
      } catch (error) {
        Notify({
          title: t(translations.ERROR_NOTIFY.SERVICE_PROVIDER),
          message: error + "",
          type: "danger",
        });
        setServiceProviderData([]);
        setSpLoading(false);
      }
    }
  };

  const handleProjectBriefingView = () => {
    history.goBack();
  };

  const handleChange = (key, value) => {
    setFormFields({
      ...formFields,
      [key]: value,
    });
  };

  const set = (key) => (value) => handleChange(key, value);

  useEffect(() => {
    getSearchApi();
  }, [formFields]);

  if (loading) {
    return <Loader />;
  } else {
    return (
      <PageContainer>
        <div className="row-container">
          <div className="text-container">
            <Text
              family={FontFamily.Inter}
              size={FontSize.ExtraRegular}
              color={colorList.blue1}
              weight={FontWeight.Medium}
            >
              {t(translations.PROJECT_BRIEFING.SEARCH)}
            </Text>
          </div>
        </div>
        <LargeDividerLine />
        <DropdownContainer>
          <MultiSelect
            useServerConstant={ServerConstantKeys.mainSpecialities}
            label={t(translations.FORM_LABELS.TYPE_OF_SERVCIES)}
            defaultValues={formFields.mainSpecialities}
            handleDropdownChange={set("mainSpecialities")}
          />
          {/* <MultiSelect
            useServerConstant={ServerConstantKeys.mainSpecialities}
            label={t(translations.FORM_LABELS.OTHER_SPECIALITIES)}
            defaultValues={formFields.additionalCapacities}
            handleDropdownChange={set("additionalCapacities")}
          /> */}
          <MultiSelect
            useServerConstant={ServerConstantKeys.chinaProvinces}
            label={t(translations.FORM_LABELS.LOCATIONS)}
            defaultValues={formFields.locationsInChina}
            handleDropdownChange={set("locationsInChina")}
          />
          <MultiSelect
            sort={true}
            useServerConstant={ServerConstantKeys.languageSpoken}
            label={t(translations.FORM_LABELS.LANGUAGES_SPOKEN)}
            defaultValues={formFields.languagesSpoken}
            handleDropdownChange={set("languagesSpoken")}
          />
          <Dropdown
            useServerConstant={ServerConstantKeys.staffSize}
            label={t(translations.FORM_LABELS.COMPANY_SIZE)}
            defaultValue={formFields.staffSize}
            handleDropdownChange={set("staffSize")}
          />
          <MultiSelect
            useServerConstant={ServerConstantKeys.industryExperience}
            label={t(translations.FORM_LABELS.EXPERIENCED_INDUSTRIES)}
            defaultValues={formFields.industryExperience}
            handleDropdownChange={set("industryExperience")}
          />
          {/* <MultiSelect
            useServerConstant={ServerConstantKeys.segmentExperience}
            label={t(translations.FORM_LABELS.SEGMENT_EXP)}
            defaultValues={formFields.segmentExperience}
            handleDropdownChange={set("segmentExperience")}
          /> */}
          {/* <Dropdown
            useServerConstant={ServerConstantKeys.annualTurnover}
            label={t(translations.FORM_LABELS.TURNOVER)}
            defaultValue={formFields.annualTurnover}
            handleDropdownChange={set("annualTurnover")}
          /> */}
          <Dropdown
            useServerConstant={ServerConstantKeys.projectStartingFee_USD}
            label={t(translations.FORM_LABELS.BUDGET_REQUIREMENT_RETAINER)}
            defaultValue={formFields.budgetRetainerBased}
            handleDropdownChange={set("budgetRetainerBased")}
          />
          <Dropdown
            useServerConstant={ServerConstantKeys.projectStartingFee_USD}
            label={t(translations.FORM_LABELS.BUDGET_TYPE_PROEJCT)}
            defaultValue={formFields.budgetProjectBased}
            handleDropdownChange={set("budgetProjectBased")}
          />

          <Dropdown
            useServerConstant={ServerConstantKeys.foundingHistory}
            label={t(translations.FORM_LABELS.FOUNDING_HISTORY)}
            defaultValue={formFields.foundingHistory}
            handleDropdownChange={set("foundingHistory")}
          />
        </DropdownContainer>

        <LargeDividerLine />
        <div className="row-container">
          <Text
            family={FontFamily.Inter}
            size={FontSize.ExtraRegular}
            weight={FontWeight.Light}
          >
            {t(translations.PROJECT_BRIEFING.RECOMMENDED_SERVICE_PROVIDER)} (
            {serviceProviderData.length})
          </Text>
          <Button
            text={t(translations.BUTTONS.VIEW_PROJECT_BRIEFING)}
            textColor={colorList.white1}
            borderColor={colorList.blue1}
            color={colorList.blue1}
            onClick={handleProjectBriefingView}
          />
        </div>
        {spLoading ? (
          <Loader />
        ) : serviceProviderData?.length > 0 ? (
          serviceProviderData?.map((item, index) =>
            item.isSignedUp
              ? showOldServiceProviderCard(item, index)
              : showNewServiceProviderCard(item, index)
          )
        ) : (
          <div className="center">
            <Text
              family={FontFamily.Inter}
              size={FontSize.Small}
              weight={FontWeight.Light}
            >
              {t(translations.GENERIC.NO_DATA_FOUND)}
            </Text>
          </div>
        )}

        <PopUp
          modal
          position="bottom right"
          open={showViewModal}
          onClose={closeModal}
          closeOnDocumentClick={false}
        >
          <ViewServiceProvider
            providerDetails={currentState}
            projectId={projectId}
            closeModal={closeModal}
            spId={currentState._id}
          />
        </PopUp>
      </PageContainer>
    );
  }
}
