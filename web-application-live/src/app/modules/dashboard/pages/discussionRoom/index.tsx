import React, { ReactElement, useEffect, useState } from "react";
import {
  Text,
  FontFamily,
  FontSize,
  FontWeight,
} from "app/components/atoms/text";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { StyledContainer, UserLogo, StyledDivider } from "./style";
import Notify from "utils/notification";
import { getAllChats } from "apiCalls/discussionRoom";
import Loader from "utils/loader";
import { IFileType } from "app/modules/profile/createProfile/brandForm";
import { Person } from "@styled-icons/bootstrap";
import { colorList } from "consts/color";
import PopUp from "app/components/atoms/popup";
import ViewServiceProvider from "../search/ViewServiceProvider";
import { initialSPState, IServiceProviderData } from "../search";
import { getUserProfileDetailById } from "apiCalls/profile";
import { getFromLocalStorage } from "localStorage";
import { timeSince } from "utils/dateTimeFormat";
import ChatScreen from "../chatScreen";
import { useParams } from "react-router";
import { SearchField } from "app/components/molecules/searchField";
import ReactTooltip from "react-tooltip";
export interface IChatList {
  id: string;
  name: string;
  isPublic: boolean;
  description: string;
  time: string;
  location: string;
  serviceProviderName: string;
  brandName: string;
  brandLogo: IFileType;
  serviceProviderLogo: IFileType;
  brandId: string;
  serviceProviderId: string;
  twilioConversationSid: string;
  currentProjectId: string;
  isShortlisted: boolean;
  lastMsgBy?: string;
  askedForProposal?: boolean;
  proposalSent?: boolean;
  proposalId?: string;
}

export default function DiscussionRoom(): ReactElement {
  const { t } = useTranslation();
  const { id }: any = useParams();

  const [chatListData, setChatListData] = useState<IChatList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showViewModal, setViewModal] = useState<boolean>(false);
  const [currentState, setCurrentState] =
    useState<IServiceProviderData>(initialSPState);
  const [currentProjectId, setCurrentProjectId] = useState<string>("");
  const [currentSpId, setCurrentSptId] = useState<string>("");
  const [currentUserId, setCurentUserId] = useState<string>("");
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [lastMessageDetails, setLastMessageDetails] = useState({
    lastMsg: "",
    lastMsgBy: "",
  });
  const [searchedchatListData, setSearchedChatListData] = useState<IChatList[]>(
    []
  );

  const closeModal = () => {
    setViewModal(false);
  };

  const handleModal = async (item: IChatList) => {
    try {
      const response = await getUserProfileDetailById(
        item.serviceProviderId,
        item.currentProjectId
      );
      setViewModal(!showViewModal);
      setCurrentState(response);
      setCurrentSptId(item.serviceProviderId);
      setCurrentProjectId(item.currentProjectId);
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.PROJECT_DETAILS),
        message: error + "",
        type: "danger",
      });
    }
  };

  const getAllDiscussionsList = async () => {
    setLoading(true);

    try {
      const response = await getAllChats();
      let list: IChatList[] = [];
      response?.map((i) => {
        list.push({
          id: i?._id,
          name: i?.title,
          isPublic: i?.projectId?.isPublished,
          currentProjectId: i?.projectId?._id,
          description: i?.lastMessage,
          time: timeSince(i?.createdAt),
          location: t(translations.DISCUSSION_ROOM.FROM) + i?.initSource,
          serviceProviderName: i?.serviceProviderId?.businessName,
          brandName: i?.brandId?.businessName,
          brandLogo: i?.brandId?.logo,
          serviceProviderLogo: i?.serviceProviderId?.logo,
          brandId: i?.brandId?._id,
          serviceProviderId: i?.serviceProviderId?._id,
          twilioConversationSid: i?.twilioChatSid,
          isShortlisted: i?.isShortlisted,
          lastMsgBy:
            i?.lastMessageBy === i?.brandId?._id
              ? `${i?.brandId?.businessName || ""}`
              : `${i?.serviceProviderId?.businessName || ""}`,
        });
      });
      setChatListData(list);
      setSearchedChatListData(list);
      if (id !== ":id") setCurrentChatId(id);
      else setCurrentChatId(list[0]?.id);
      setLoading(false);
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.DISCUSSION_ROOM),
        message: error + "",
        type: "danger",
      });
      setChatListData([]);
      setSearchedChatListData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDiscussionsList();

    const user: string = getFromLocalStorage("userId");
    setCurentUserId(user);
  }, []);

  const handleChatView = (id: string) => {
    setCurrentChatId(id);
  };

  const handleDiscussionFunction = (id: string) => {
    closeModal();
    setCurrentChatId(id);
  };

  const showLogo = (logo?: string) => {
    return logo ? (
      <UserLogo src={logo} />
    ) : (
      <div className="logo-container">
        <Person color={colorList.black1} size={55} />
      </div>
    );
  };

  const showChatCard = (item: IChatList) => {
    return (
      <div
        className={`chat-card ${item.id === currentChatId ? "activeChat" : "inactiveChat"
          }`}
        key={item.id}
      >
        <div className="row cursor" onClick={() => handleChatView(item.id)}>
          <Text
            family={FontFamily.Inter}
            size={FontSize.ExtraRegular}
            weight={FontWeight.SemiBold}
            color={colorList.blue7}
          >
            {item.name}
          </Text>

          <div className="tag">
            <Text family={FontFamily.Inter} size={FontSize.Mini}>
              {item.isPublic
                ? t(translations.DISCUSSION_ROOM.PUBLIC)
                : t(translations.DISCUSSION_ROOM.PRIVATE)}
            </Text>
          </div>
        </div>
        <div className="row border-divider">
          <div className="row-start">
            {currentUserId === item.brandId
              ? showLogo(item?.serviceProviderLogo?.thumbnail)
              : showLogo(item?.brandLogo?.thumbnail)}

            <div className="column">
              {currentUserId === item.brandId ? (
                <div className="cursor" onClick={() => handleModal(item)}>
                  <Text
                    family={FontFamily.Inter}
                    weight={FontWeight.Bold}
                    color={colorList.blue7}
                  >
                    {currentUserId === item.brandId
                      ? <>
                        <a className="subtitle" data-tip="View service provider"> {item.serviceProviderName}</a>
                        <ReactTooltip place="top" type="dark" effect="float" />
                      </>
                      : item.brandName}
                  </Text>
                </div>
              ) : (
                <Text
                  family={FontFamily.Inter}
                  weight={FontWeight.Bold}
                  color={colorList.blue7}
                >
                  {currentUserId === item.brandId
                    ? item.serviceProviderName
                    : item.brandName}
                </Text>
              )}
              <div className="tag">
                <Text family={FontFamily.Inter} size={FontSize.Mini}>
                  {item.location}
                </Text>
              </div>
              {((item.description && item.lastMsgBy) ||
                (lastMessageDetails.lastMsgBy &&
                  lastMessageDetails.lastMsg)) && (
                  <Text
                    family={FontFamily.Inter}
                    size={FontSize.Mini}
                    color={colorList.grey3}
                  >
                    <span className="ellipsis-text">
                      <span className="weight">
                        {(item.id === currentChatId &&
                          lastMessageDetails.lastMsgBy) ||
                          item.lastMsgBy}
                      </span>
                      :{" "}
                      {(item.id === currentChatId &&
                        lastMessageDetails.lastMsg) ||
                        item.description}
                    </span>
                  </Text>
                )}
              <Text
                family={FontFamily.Inter}
                size={FontSize.Mini}
                color={colorList.grey3}
              >
                {item.time}
              </Text>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSearch = (items: IChatList[]) => {
    setSearchedChatListData(items);
    setCurrentChatId(items[0]?.id);
  };

  if (loading) {
    return <Loader />;
  } else {
    return (
      <StyledContainer>
        <Text
          family={FontFamily.Inter}
          size={FontSize.ExtraRegular}
          weight={FontWeight.Light}
        >
          {t(translations.DISCUSSION_ROOM.DISCUSSION_ROOM)}
        </Text>

        {chatListData.length > 0 && (
          <SearchField
            searchArray={chatListData}
            searchKeys={["name"]}
            handleSearch={handleSearch}
          />
        )}

        <div className="listContainer">
          <div className="chatList">
            {searchedchatListData.length > 0 ? (
              searchedchatListData.map((item) => showChatCard(item))
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
          </div>
          {searchedchatListData.length > 0 && (
            <div>
              <ChatScreen
                id={currentChatId}
                setLastMessageDetails={setLastMessageDetails}
              />
            </div>
          )}
        </div>

        <PopUp
          modal
          position="bottom right"
          open={showViewModal}
          onClose={closeModal}
          closeOnDocumentClick={false}
        >
          <ViewServiceProvider
            providerDetails={currentState}
            projectId={currentProjectId}
            closeModal={closeModal}
            spId={currentSpId}
            handleDiscussionFunction={handleDiscussionFunction}
          />
        </PopUp>
      </StyledContainer>
    );
  }
}
