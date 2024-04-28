import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  Text,
  FontFamily,
  FontSize,
  FontWeight,
} from "app/components/atoms/text";
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";
import { PopupContainer, StyledCard, StyledContainer } from "./style";
import { Button } from "app/components/atoms/mybutton";
import { colorList } from "consts/color";
import {
  deleteProjectBriefList,
  getProjectBriefList,
} from "apiCalls/projectBriefing";
import Loader from "utils/loader";
import Notify from "utils/notification";
import { generatePath, useHistory } from "react-router-dom";
import { privatePaths } from "consts/paths";
import {
  getConstantLabel,
  ServerConstantKeys,
  useServerConstants,
} from "apiCalls/dashboard";
import { showConfirmBox } from "utils/confirmBox";
import { ThreeDotsVertical } from "@styled-icons/bootstrap";
import PopUp from "app/components/atoms/popup";

interface IProjectBrief {
  _id: string;
  name: string;
  briefType: string;
  isPublished: boolean;
}

export default function ProjectBriefing(): ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [allBriefs, setAllBriefs] = useState<IProjectBrief[]>([]);
  const [serverConstants] = useServerConstants(
    ServerConstantKeys.projectBriefingTypes
  );
  const history = useHistory();
  const { t } = useTranslation();
  const popupRef = useRef<any>();

  const handleCreateNewBrief = () => {
    history.push(privatePaths.selectNewBrief);
  };

  const handleViewBrief = (id: string) => {
    history.push(
      generatePath(privatePaths.viewProject, {
        screenName: "projectBriefing",
        id,
      })
    );
  };

  const handleDeleteApiCall = (item: IProjectBrief) => {
    setLoading(true);
    deleteProjectBriefList(item._id)
      .then(() => {
        setAllBriefs(allBriefs.filter((el) => el._id !== item._id));
        setLoading(false);
      })
      .catch((error) => {
        Notify({
          title: t(translations.ERROR_NOTIFY.DELETE_PROJECT_BRIEFS),
          message: error,
          type: "danger",
        });
        setLoading(false);
      });
  };

  const handleDeleteBrief = (item: IProjectBrief) => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();

      showConfirmBox({
        title: t(translations.CONFIRM_BOX.DELETING) + item.name,
        message: t(translations.CONFIRM_BOX.DELETE_PROJECT),
        handleYesClick: () => handleDeleteApiCall(item),
      });
    }
  };

  const handleSearch = (id: string) => {
    // Notify({
    //   title: "Search service provider feature coming soon",
    //   message: "",
    //   type: "success",
    // });
    history.push(
      generatePath(privatePaths.dashboardSearch, {
        id,
        screenName: "projectBriefing"
      })
    );
  };

  useEffect(() => {
    setLoading(true);
    getProjectBriefList()
      .then((resp: any) => {
        setAllBriefs(resp);
        setLoading(false);
      })
      .catch((error) => {
        Notify({
          title: t(translations.ERROR_NOTIFY.PROJECT_BRIEFS),
          message: error,
          type: "danger",
        });
        setAllBriefs([]);
        setLoading(false);
      });
  }, []);

  const showBriefCard = (item: IProjectBrief) => {
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
          <div className="divider" />
          <Text
            family={FontFamily.Inter}
            size={FontSize.Mini}
            color={colorList.grey3}
          >
            {getConstantLabel(item.briefType, serverConstants)}
          </Text>
        </div>
        <div className="second-container">
          <Button
            text={t(translations.BUTTONS.VIEW)}
            textColor={colorList.white1}
            borderColor={colorList.blue1}
            onClick={() => handleViewBrief(item._id)}
            color={colorList.blue1}
            paddingHorizontal={"1.5rem"}
          />
          <div className="left-divider" />
          <Button
            text={t(translations.BUTTONS.SEARCH_SERVICE_PROVIDER)}
            textColor={colorList.white1}
            borderColor={colorList.blue1}
            onClick={() => handleSearch(item._id)}
            color={colorList.blue1}
            disabled={item.isPublished}
          />
          <div className="left-divider" />
          <PopUp
            position="bottom right"
            innerRef={popupRef}
            trigger={
              <ThreeDotsVertical
                size={20}
                color={colorList.blue1}
                className="cursor"
              />
            }
          >
            <PopupContainer>
              <div onClick={() => handleDeleteBrief(item)}>
                <Text
                  family={FontFamily.Inter}
                  styles={defaultStyle.cursorStyle}
                >
                  {t(translations.GENERIC.REMOVE)}
                </Text>
              </div>
            </PopupContainer>
          </PopUp>
        </div>
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
            {t(translations.PROJECT_BRIEFING.YOUR_PROJECT_BRIEFING)}
          </Text>
          <Button
            text={t(translations.BUTTONS.CREATE_NEW_BRIEFING)}
            textColor={colorList.blue1}
            borderColor={colorList.blue1}
            onClick={handleCreateNewBrief}
            color="transparent"
          />
        </div>
        <div className="column-container divider">
          {allBriefs?.length > 0 ? (
            allBriefs?.map((item) => showBriefCard(item))
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

const defaultStyle = {
  cursorStyle: "cursor: pointer",
};
