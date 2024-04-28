import {
  CloudArrowUp,
  FileEarmarkPdf,
  Paperclip,
} from "@styled-icons/bootstrap";
import { Person } from "@styled-icons/bootstrap/Person";
import {
  getDiscussionDetails,
  getTwillioToken,
  proposalInvite,
  sentProjectBriefs,
  updateChat,
} from "apiCalls/discussionRoom";
import { Button } from "app/components/atoms/mybutton";
import {
  Text,
  FontFamily,
  FontSize,
  FontWeight,
} from "app/components/atoms/text";
import { colorList } from "consts/color";
import { translations } from "locales/translations";
import { getFromLocalStorage } from "localStorage";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Client } from "twilio-chat";
import Loader from "utils/loader";
import Notify from "utils/notification";
import { IChatList } from "../discussionRoom";
import {
  ChatWrapper,
  StyledContainer,
  StyledTextArea,
  UserSmallLogo,
} from "./style";
import { generatePath, useHistory } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "@emotion/css";
import {
  removeShortlistedServiceProvider,
  shortlistServiceProvider,
} from "apiCalls/projectBriefing";
import { timeSince } from "utils/dateTimeFormat";
import { images } from "assets/images";
import { privatePaths } from "consts/paths";
import ProposelCoverLetter from "../proposalManagement/proposelCoverLetter";
import PopUp from "app/components/atoms/popup";
import EditProposelCoverLetter from "../proposalManagement/editProposalCoverLetter";
import ReactTooltip from "react-tooltip";

const ROOT_CSS = css({
  height: "52vh",
  width: "100%",
});

let uniqueChannelName = "";

export default function ChatScreen(props): ReactElement {
  const [msgs, setMsgs] = useState<any>([]);
  const [channel, setChannel] = useState<any>();
  const [chatListData, setChatListData] = useState<IChatList>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUserId, setCurentUserId] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [shortlistLoading, setShortlistLoading] = useState<boolean>(false);
  const [isShortlistedSp, setIsShortlistedSp] = useState<boolean>(false);
  const [proposalloading, setProposalLoading] = useState<boolean>(false);
  const [showProposalModel, setShowProposalModel] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string>("");

  const { id, setLastMessageDetails } = props;
  const { t } = useTranslation();
  const history = useHistory();

  const handleLastMessageUpdate = async (message, _currentUserId) => {
    setLastMessageDetails({
      lastMsg: message.body,
      lastMsgBy:
        chatListData?.serviceProviderId === message.author
          ? chatListData?.serviceProviderName
          : chatListData?.brandName,
    });

    if (message.author === _currentUserId) {
      try {
        await updateChat(id, {
          lastMessage: message.body,
        });
      } catch (error) {
        Notify({
          title: t(translations.ERROR_NOTIFY.CHAT_UPDATE),
          message: error + "",
          type: "danger",
        });
      }
    }
  };

  const sendMessage = () => {
    if (text && String(text).trim()) {
      channel && channel.sendMessage(text);
      setText("");
    }
  };

  const handleMessageAdded = async (message, _currentUserId) => {
    setMsgs((p) => [...p, message]);
    if (message.type !== "media") {
      handleLastMessageUpdate(message,_currentUserId);
    } else {
      handleLastMessageUpdate({
        body: t(translations.DISCUSSION_ROOM.SENT_A_FILE),
      },_currentUserId);
    }
  };

  const joinChannel = async (channel) => {
    if (channel.channelState.status !== "joined") {
      await channel.join();
    }
    channel.on("messageAdded", (m) => handleMessageAdded(m, currentUserId));
  };

  const getToken = async (chatId: string) => {
    setLoading(true);
    let token = "";
    try {
      const response = await getTwillioToken(chatId);
      token = response.token;
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.CHAT_TOKEN),
        message: "",
        type: "danger",
      });
    }

    const client = await Client.create(token);

    client.on("tokenAboutToExpire", async () => {
      const response = await getTwillioToken(chatId);
      token = response.token;
      client.updateToken(token);
    });

    client.on("tokenExpired", async () => {
      const response = await getTwillioToken(chatId);
      token = response.token;
      client.updateToken(token);
    });

    client.on("channelJoined", async (channel) => {
      if (channel.uniqueName === uniqueChannelName) {
        const messages = await channel?.getMessages();
        setMsgs(messages?.items || []);
      }
    });

    try {
      const channel = await client.getChannelByUniqueName(uniqueChannelName);
      await joinChannel(channel);
      if (channel.uniqueName === uniqueChannelName) {
        const messages = await channel?.getMessages();
        setMsgs(messages?.items || []);
      }
      setChannel(channel);
      setLoading(false);
    } catch (err) {
      try {
        const channel = await client.createChannel({
          uniqueName: uniqueChannelName,
          friendlyName: uniqueChannelName,
        });
        await joinChannel(channel);
        if (channel.uniqueName === uniqueChannelName) {
          const messages = await channel?.getMessages();
          setMsgs(messages?.items || []);
        }
        setChannel(channel);
        setLoading(false);
      } catch (error) {
        Notify({
          title: t(translations.ERROR_NOTIFY.CHAT_TOKEN),
          message: "",
          type: "danger",
        });
        setLoading(false);
      }
    }
  };

  const handleDetails = async (chatId: string) => {
    try {
      const response = await getDiscussionDetails(chatId);
      uniqueChannelName = `${response?.projectId?._id}#${response?.brandId?._id}#${response?.serviceProviderId?._id}`;
      getToken(chatId);
      setChatListData({
        id: response?._id,
        name: response?.title,
        isPublic: response?.projectId?.isPublished,
        currentProjectId: response?.projectId?._id,
        description: response?.projectId?.description,
        time: timeSince(response?.createdAt),
        location:
          t(translations.DISCUSSION_ROOM.FROM) +
          response?.initSource.toUpperCase(),
        serviceProviderName: response?.serviceProviderId?.businessName,
        brandName: response?.brandId?.businessName,
        brandLogo: response?.brandId?.logo,
        serviceProviderLogo: response?.serviceProviderId?.logo,
        brandId: response?.brandId?._id,
        serviceProviderId: response?.serviceProviderId?._id,
        twilioConversationSid: response?.twilioChatSid,
        isShortlisted: response?.isShortlisted || false,
        askedForProposal: response?.askedForProposal || false,
        proposalSent: response?.proposalSent || false,
        proposalId: response?.proposalId || null,
      });
      setIsShortlistedSp(response?.isShortlisted || false);
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.CHAT_TOKEN),
        message: "",
        type: "danger",
      });
    }
  };

  useEffect(() => {
    if (id && currentUserId) {
      handleDetails(id);
      setChatId(id)
    }
  }, [id, currentUserId]);

  useEffect(() => {
    const user: string = getFromLocalStorage("userId");
    setCurentUserId(user);
  }, [id]);

  const handleShortlistApi = async () => {
    setShortlistLoading(true);
    try {
      if (isShortlistedSp) {
        await removeShortlistedServiceProvider(
          chatListData?.currentProjectId || "",
          chatListData?.serviceProviderId || ""
        );
        setIsShortlistedSp(false);
      } else {
        await shortlistServiceProvider({
          projectId: chatListData?.currentProjectId,
          serviceProviderId: chatListData?.serviceProviderId,
        });
        setIsShortlistedSp(true);
      }
      setShortlistLoading(false);
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.SHORTLIST_SP),
        message: error + "",
        type: "danger",
      });
      setShortlistLoading(false);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput-chatScreen")?.click();
  };

  const handleProposalAsk = async () => {
    setProposalLoading(true);
    try {
      await proposalInvite(
        chatListData?.currentProjectId || "",
        chatListData?.serviceProviderId || ""
      );
      channel &&
        channel.sendMessage(
          chatListData?.brandName +
          t(translations.DISCUSSION_ROOM.ASKING_PROPSOAL)
        );
      setProposalLoading(false);
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.PROPOSAL),
        message: error + "",
        type: "danger",
      });
      setProposalLoading(false);
    }
  };

  const handleFileChange = (event: any) => {
    const { files } = event.target;

    const formData = new FormData();
    formData.append("file", files[0]);
    channel.sendMessage(formData);
  };

  const handleFileTrigger = async () => {
    triggerFileInput();
     try {
       await sentProjectBriefs(chatId);
     } catch (error) {
       Notify({
         title: t(translations.ERROR_NOTIFY.SEND_PROJECT_BRIEFS),
         message: error + "",
         type: "danger",
       });
     }
  };

  const handleBreifingAsk = () => {
    channel &&
      channel.sendMessage(
        chatListData?.serviceProviderName +
        t(translations.DISCUSSION_ROOM.ASKING_PROJECT_BRIEFING)
      );
  };

  const showSmallLogo = (logo?: string) => {
    return logo ? (
      <UserSmallLogo src={logo} />
    ) : (
      <div className="small-logo-container">
        <Person color={colorList.black1} size={15} />
      </div>
    );
  };

  const showReceiverMedia = (message: any) => {
    return (
      <div className="media-container" onClick={() => handleFileOpen(message)}>
        <FileEarmarkPdf color={colorList.black1} size={20} />
        <Text
          family={FontFamily.Inter}
          size={FontSize.ExtraSmall}
          weight={FontWeight.Medium}
          color={colorList.black1}
        >
          {message.media.state.filename}
        </Text>
      </div>
    );
  };

  const receiverChatItem = (message: any) => {
    return (
      <ChatWrapper isSender={false}>
        {chatListData?.serviceProviderId === message.author
          ? showSmallLogo(chatListData?.serviceProviderLogo?.thumbnail)
          : showSmallLogo(chatListData?.brandLogo.thumbnail)}

        <div className="receiver">
          {message.type === "media" ? (
            <>{showReceiverMedia(message)}</>
          ) : (
            <Text
              family={FontFamily.Inter}
              size={FontSize.ExtraSmall}
              weight={FontWeight.Medium}
              color={colorList.black1}
            >
              {message.body}
            </Text>
          )}
        </div>
      </ChatWrapper>
    );
  };

  const handleFileOpen = (message) => {
    message.media.getContentTemporaryUrl().then(function (url) {
      window.open(url, "_blank");
    });
  };

  const showSenderMedia = (message: any) => {
    return (
      <div className="media-container" onClick={() => handleFileOpen(message)}>
        <Text
          family={FontFamily.Inter}
          size={FontSize.ExtraSmall}
          weight={FontWeight.Medium}
          color={colorList.white1}
        > 
          {message.media.state.filename}
        </Text>
        <FileEarmarkPdf color={colorList.white1} size={20} />
      </div>
    );
  };

  const senderChatItem = (message: any) => {
    return (
      <ChatWrapper isSender={true}>
        {message.type === "media" ? (
          <div className={"sender"}>{showSenderMedia(message)}</div>
        ) : (
          <div className={"sender"}>
            <Text
              family={FontFamily.Inter}
              size={FontSize.ExtraSmall}
              weight={FontWeight.Medium}
              color={colorList.white1}
            >
              {message.body}
            </Text>
          </div>
        )}

        {chatListData?.serviceProviderId === message.author
          ? showSmallLogo(chatListData?.serviceProviderLogo?.thumbnail)
          : showSmallLogo(chatListData?.brandLogo.thumbnail)}
      </ChatWrapper>
    );
  };

  const onTextChange = (e) => {
    setText(e.target.value);
  };

  const handleProposalModalOpen = () => {
    setShowProposalModel((p) => !p);
  };

  const handleProposalModalClose = () => {
    setShowProposalModel(false);
  };
  const renderProfileDetailPage = (id: any) => {
    return () => {
      history.push(
        generatePath(privatePaths.viewProject, { screenName: "marketplace", id })
      );
    }

  };

  return (
    <StyledContainer>
      <div className="chat-card">
        <div className="row">
          <div className="row-name">
            <Text
              family={FontFamily.Inter}
              size={FontSize.Small}
              weight={FontWeight.Bold}
              color={colorList.blue7}
            >
              <>
                <a className="show-underline" data-tip="View project" onClick={renderProfileDetailPage(chatListData?.currentProjectId)}> {chatListData?.name}</a>
                <ReactTooltip place="top" type="dark" effect="float" />
              </>
            </Text>
            <Text
              family={FontFamily.Inter}
              weight={FontWeight.Medium}
              size={FontSize.ExtraSmall}
              color={colorList.blue7}
            >
              {currentUserId === chatListData?.brandId
                ? chatListData?.serviceProviderName
                : chatListData?.brandName}
            </Text>
          </div>
          {currentUserId === chatListData?.brandId && (
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
              borderRadius={"2rem"}
              loading={shortlistLoading}
              loaderColor={isShortlistedSp ? colorList.red1 : colorList.blue1}
              paddingHorizontal={isShortlistedSp ? "1.5rem" : "3rem"}
              fontSize={FontSize.Mini}
            />
          )}
        </div>

        <div className="button-container border-divider">
          {currentUserId === chatListData?.brandId ? (
            <Button
              text={t(translations.BUTTONS.SEND_PROJECT_BRIEFING)}
              textColor={colorList.blue1}
              borderColor={colorList.blue1}
              color={colorList.white1}
              onClick={handleFileTrigger}
              borderRadius={"2rem"}
              fontSize={FontSize.Mini}
            >
              <CloudArrowUp
                color={colorList.blue1}
                size={18}
                className="cloudArrowUpIcon"
              />
            </Button>
          ) : (
            <Button
              text={t(translations.BUTTONS.ASK_FOR_PROJECT_BREIFING)}
              textColor={colorList.blue1}
              borderColor={colorList.blue1}
              color={colorList.white1}
              onClick={handleBreifingAsk}
              borderRadius={"2rem"}
              fontSize={FontSize.Mini}
            />
          )}
          {currentUserId === chatListData?.brandId ? (
            <Button
              text={
                chatListData?.askedForProposal
                  ? t(translations.BUTTONS.ASKED_FOR_PROPOSAL)
                  : t(translations.BUTTONS.ASK_FOR_PROPOSAL)
              }
              textColor={colorList.blue1}
              borderColor={colorList.blue1}
              color={colorList.white1}
              borderRadius={"2rem"}
              onClick={handleProposalAsk}
              disabled={chatListData?.askedForProposal}
              loading={proposalloading}
              fontSize={FontSize.Mini}
            />
          ) : (
            <Button
              text={
                chatListData?.proposalSent
                  ? t(translations.BUTTONS.UPDATE_PROPOSAL)
                  : t(translations.BUTTONS.SEND_PROPOSAL)
              }
              textColor={colorList.blue1}
              borderColor={colorList.blue1}
              color={colorList.white1}
              borderRadius={"2rem"}
              fontSize={FontSize.Mini}
              onClick={handleProposalModalOpen}
            />
          )}
        </div>

        <div className="chat-container border-divider">
          <div className="chat-wrapper">
            {loading ? (
              <Loader />
            ) : (
              <ScrollToBottom className={ROOT_CSS}>
                {msgs?.map((message: any, index: number) => (
                  <div
                    key={index}
                    className={
                      message.author === currentUserId
                        ? "sender-wrapper"
                        : "receiver-wrapper"
                    }
                  >
                    {message.author === currentUserId
                      ? senderChatItem(message)
                      : receiverChatItem(message)}
                  </div>
                ))}
              </ScrollToBottom>
            )}
          </div>
          <div className="text-wrapper border-divider">
            <div className="text-area">
              <StyledTextArea
                value={text}
                onChange={onTextChange}
                placeholder={t(translations.GENERIC.START_TYPING)}
              />
            </div>

            <Paperclip
              size={35}
              color={colorList.blue1}
              className="paperclip"
              onClick={triggerFileInput}
            />
            <img
              src={images.sendIcon}
              onClick={sendMessage}
              className="cursor"
            />
          </div>
        </div>
        <input
          type="file"
          onChange={handleFileChange}
          id="fileInput-chatScreen"
          accept="application/pdf"
          className="hideDisplay"
        />

        <PopUp
          modal
          position="bottom right"
          open={showProposalModel}
          onClose={handleProposalModalClose}
          closeOnDocumentClick={false}
        >
          {!!chatListData && !!chatListData.proposalId ? (
            <EditProposelCoverLetter
              onClose={handleProposalModalClose}
              id={chatListData?.proposalId}
              isNavigate={false}
              status={""}
              showInvoice={""}
            />
          ) : (
            <ProposelCoverLetter
              projectId={chatListData?.currentProjectId || ""}
              onClose={handleProposalModalClose}
            />
          )}
        </PopUp>
      </div>
    </StyledContainer>
  );
}
