import { IFileType } from "app/modules/profile/createProfile/brandForm";
import { Api } from "network";
import { projectKeys } from "network/apiKeys";
import { profileBriefingKeys } from "network/apiKeys";
export interface IProjectRequirement {
  industryExperience: string[];
  segmentExperience: string[];
  languageSpoken: string[];
  teamSize: string;
  experience: string;
  chinaOfficeLocation: string[];
}

export interface IProjectFormFields {
  name: string;
  briefType: string;
  brandOverview: string;
  wayOfOperation?: string[];
  objective: string[];
  requirements: IProjectRequirement;
  budgetTypes: string[];
  budget: {
    retainerBased: string | null | undefined;
    projectBased: string | null | undefined;
  };
  startingTimeline: string;
  isPublished?: boolean;
  hideBrandDetails: boolean;
  notes?: string;
  docs: IFileType[];
}

export const publishProjectApi = async (id: string) => {
  let response = await Api.put(profileBriefingKeys.publishedBrief(id), {
    isPublished: true,
  });

  return response;
};

export const editProjectApi = async (
  id: string,
  formFields: IProjectFormFields
) => {
  formFields["_id"] = undefined;
  formFields["brandId"] = undefined;
  formFields["proposalsReceived"] = undefined;
  formFields["isDeleted"] = undefined;
  formFields["createdAt"] = undefined;
  formFields["updatedAt"] = undefined;
  formFields["__v"] = undefined;
  formFields["hiringDate"] = undefined;
  formFields["isHiringDone"] = undefined;


  let response = await Api.put(
    profileBriefingKeys.publishedBrief(id),
    formFields
  );
  return response;
};

export const createProjectApi = async (formFields: IProjectFormFields) => {
  if (!formFields.budget.projectBased) {
    formFields.budget.projectBased = undefined;
  }
  if (!formFields.budget.retainerBased) {
    formFields.budget.retainerBased = undefined;
  }
  formFields.isPublished = undefined;
  formFields.wayOfOperation = undefined;

  let response = await Api.post(projectKeys.createProject(), formFields);

  return response;
};

export const getProjectBriefList = async () => {
  return await Api.get(profileBriefingKeys.getProjectBriefList());
};

export const deleteProjectBriefList = async (id: string) => {
  return await Api.delete(profileBriefingKeys.publishedBrief(id));
};

export const getProjectData = async (id: string) => {
  return await Api.get(profileBriefingKeys.publishedBrief(id));
};

export const putProjectData = async (id: string, formFields: any) => {
  return await Api.put(profileBriefingKeys.publishedBrief(id), formFields);
};

export const searchServiceProvider = async (id: string, params?: any) => {
  return await Api.get(profileBriefingKeys.searchServiceProvider(id), params);
};

export const shortlistServiceProvider = async (param: any) => {
  return await Api.post(
    profileBriefingKeys.shortlistedServiceProviders(),
    param
  );
};

export const removeShortlistedServiceProvider = async (
  pId: string,
  spId: string
) => {
  return await Api.delete(profileBriefingKeys.removeShortlistedSp(pId, spId));
};

export const contactExpanter = async (param) => {
  return await Api.post(profileBriefingKeys.expanterContact(), param);
};
