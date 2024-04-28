import { Api } from "network";
import { discussionRoomKeys } from "network/apiKeys";

export const getAllChats = async () => {
  let response = await Api.get(discussionRoomKeys.getAllChats());

  return response;
};

export const getTwillioToken = async (id: string) => {
  let response = await Api.get(discussionRoomKeys.getToken(id));

  return response;
};

export const initiateChats = async (params) => {
  let response = await Api.post(discussionRoomKeys.getAllChats(), params);

  return response;
};

export const getDiscussionDetails = async (id: string) => {
  let response = await Api.get(discussionRoomKeys.chatDetails(id));

  return response;
};

export const updateChat = async (id: string, param: any) => {
  let response = await Api.put(discussionRoomKeys.chatDetails(id), param);

  return response;
};

export const sentProjectBriefs = async (id: string) => {
  let response = await Api.post(discussionRoomKeys.sentProjectBriefs(), {
    chatId: id
  });

  return response;
};

export const proposalInvite = async (pId: string, sId: string) => {
  let response = await Api.post(discussionRoomKeys.askProposal(), {
    projectId: pId,
    serviceProviderId: sId,
  });

  return response;
};