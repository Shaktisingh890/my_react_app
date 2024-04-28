import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  Text,
  FontFamily,
  FontSize,
  FontWeight,
} from "app/components/atoms/text";
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";
import { StyledCard, StyledContainer, ViewButton, UserLogo } from "./style";
import { colorList } from "consts/color";
import Loader from "utils/loader";
import Notify from "utils/notification";
import { Check2 } from "@styled-icons/bootstrap/Check2";
import { generatePath, useHistory } from "react-router-dom";
import { privatePaths } from "consts/paths";
import {
  getConstantLabel,
  ServerConstantKeys,
  useServerConstants,
} from "apiCalls/dashboard";
import { showConfirmBox } from "utils/confirmBox";
import {
  deleteMarketPlaceProjectList,
  getMarketPlaceProjectList,
} from "apiCalls/marketplace";
import { getFromLocalStorage } from "localStorage";
import { timeSince } from "utils/dateTimeFormat";
import { SearchField } from "app/components/molecules/searchField";
import { IFileType } from "app/modules/profile/createProfile/brandForm";
interface IProjectBrief {
  _id: string;
  name: string;
  briefType: string;
  proposalsReceived: number;
  brandId: {
    businessName: string;
    logo: IFileType;
  };
  requirements: {
    industryExperience: string[];
  };
  createdAt: string;
}

export default function Marketplace(): ReactElement {
  const popupRef = useRef<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isServiceProvider, setServiceProvider] = useState<boolean>(false);
  const [allMarketPlaces, setAllMarketPlaces] = useState<IProjectBrief[]>([]);
  const [searchedMarketPlaces, setSearchedMarketPlaces] = useState<
    IProjectBrief[]
  >([]);
  const [serverConstants] = useServerConstants(
    ServerConstantKeys.projectBriefingTypes
  );
  const history = useHistory();
  const { t } = useTranslation();

  const handleCreateNewMarketPlace = () => {
    history.push(privatePaths.selectNewBrief);
  };

  const handleViewMarketPlace = (id: string) => {
    history.push(
      generatePath(privatePaths.viewProject, { screenName: "marketplace", id })
    );
  };

  const handleDeleteApiCall = (item: IProjectBrief) => {
    setLoading(true);
    deleteMarketPlaceProjectList(item._id)
      .then(() => {
        setAllMarketPlaces(allMarketPlaces.filter((el) => el._id !== item._id));
        setLoading(false);
      })
      .catch((error) => {
        Notify({
          title: t(translations.ERROR_NOTIFY.DELETE_PROJECT),
          message: error,
          type: "danger",
        });
        setLoading(false);
      });
  };

  const handleDeleteProject = (item: IProjectBrief) => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();

      showConfirmBox({
        title: t(translations.CONFIRM_BOX.DELETING) + item.name,
        message: t(translations.CONFIRM_BOX.DELETE_PROJECT),
        handleYesClick: () => handleDeleteApiCall(item),
      });
    }
  };

  useEffect(() => {
    const role = getFromLocalStorage("userRole");
    setServiceProvider(role === "serviceProvider");
    setLoading(true);
    getMarketPlaceProjectList()
      .then((resp: any) => {
        setAllMarketPlaces(resp);
        setSearchedMarketPlaces(resp);
        setLoading(false);
      })
      .catch((error) => {
        Notify({
          title: t(translations.ERROR_NOTIFY.PROJECTS),
          message: error,
          type: "danger",
        });
        setAllMarketPlaces([]);
        setSearchedMarketPlaces([]);
        setLoading(false);
      });
  }, []);

  const handleSearch = (items: IProjectBrief[]) => {
    setSearchedMarketPlaces(items);
  };

  const showLogo = (logo?: string) => {
    return logo && <UserLogo src={logo} />;
  };

  const showLabelTag = (values: string[], logo?: string) => {
    return (
      <div className={`label-container  ${logo && "space"}`}>
        {values?.length > 0 &&
          values.map((el, i) => (
            <div className="tag" key={i}>
              <Text
                family={FontFamily.Inter}
                color={colorList.blue7}
                weight={FontWeight.SemiBold}
                size={FontSize.ExtraSmall}
                useServerLabel={ServerConstantKeys.industryExperience}
                value={el}
              />
            </div>
          ))}
      </div>
    );
  };

  const showProjectCard = (item: IProjectBrief) => {
    return (
      <StyledCard key={item._id}>
        <div className="first-container">
          <Text
            family={FontFamily.Inter}
            size={FontSize.ExtraRegular}
            weight={FontWeight.SemiBold}
            color={colorList.blue7}
          >
            {item.name}
          </Text>

          <ViewButton onClick={() => handleViewMarketPlace(item._id)}>
            <Text
              family={FontFamily.Inter}
              size={FontSize.ExtraSmall}
              color={colorList.white1}
              weight={FontWeight.Bold}
            >
              {t(translations.BUTTONS.VIEW)}
            </Text>
          </ViewButton>
        </div>

        <div className="pink-divider" />

        <div className="briefType">
          <Text
            family={FontFamily.Inter}
            size={FontSize.ExtraSmall}
            color={colorList.grey3}
          >
            {getConstantLabel(item.briefType, serverConstants)}
          </Text>
        </div>

        <div className="second-container">
          <div className="row-container">
            <div className="logo">
              {showLogo(item?.brandId?.logo?.thumbnail)}
            </div>

            <div className="container">
              <div className="divider" />
              <Text
                family={FontFamily.Inter}
                size={FontSize.Mini}
                color={colorList.grey3}
              >
                {item.brandId.businessName}
              </Text>
              <div className="divider" />
              <Text
                family={FontFamily.Inter}
                size={FontSize.Mini}
                weight={FontWeight.Light}
                color={colorList.grey3}
              >
                {timeSince(item.createdAt)}
              </Text>
            </div>
          </div>

          <div className="rowContainer">
            {!isServiceProvider && (
              <>
                {item.proposalsReceived > 0 && (
                  <Check2 size={20} color={colorList.blue1} />
                )}

                <div className="right-divider" />
                <Text
                  family={FontFamily.Inter}
                  size={FontSize.ExtraSmall}
                  color={
                    item.proposalsReceived > 0
                      ? colorList.blue1
                      : colorList.black1
                  }
                  weight={FontWeight.Medium}
                >
                  {t(translations.MARKETPLACE.PROPOSAL_RECEIVED) +
                    (item.proposalsReceived || "0")}
                </Text>
              </>
            )}
          </div>
        </div>
        {showLabelTag(
          item.requirements.industryExperience,
          item?.brandId?.logo?.thumbnail
        )}
      </StyledCard>
    );
  };

  if (loading) {
    return <Loader />;
  } else {
    return (
      <StyledContainer>
        <div className="row-container">
          <Text
            family={FontFamily.Inter}
            size={FontSize.ExtraRegular}
            weight={FontWeight.Light}
          >
            {t(translations.MARKETPLACE.PROJECTS)}
          </Text>

        </div>

        {allMarketPlaces.length > 0 && (
          <SearchField
            searchArray={allMarketPlaces}
            searchKeys={["name", "brandId.businessName", "briefType"]}
            handleSearch={handleSearch}
          />
        )}

        <div className="column-container divider">
          {searchedMarketPlaces?.length > 0 ? (
            <div className="marketPlaceCards">
              {searchedMarketPlaces?.map((item) => showProjectCard(item))}
            </div>
          ) : (
            <Text
              family={FontFamily.Inter}
              size={FontSize.Small}
              weight={FontWeight.Light}
            >
              {t(translations.GENERIC.NO_DATA_FOUND)}
            </Text>
          )}
        </div>
      </StyledContainer>
    );
  }
}
