import { IBrandProfileFormField } from "app/modules/profile/createProfile/brandForm";
import { IServiceProfileFormField } from "app/modules/profile/createProfile/serviceForm";
import { Api } from "network";
import { profileKeys } from "network/apiKeys";

const brandSchemaMapper = (resp: any): IBrandProfileFormField => {
  return {
    email: resp?.email || "",
    businessName: resp?.businessName || "",
    description: resp?.description || "",
    logo: resp?.logo || {},
    linkedinUrl: resp?.linkedinUrl || "",
    annualTurnover: resp?.annualTurnover || "",
    segmentExperience: resp?.segmentExperience || [],
    docs: resp?.docs || [],
    staffSize: resp?.staffSize || "",
    website: resp?.website || "",
    languagesSpoken: resp?.languagesSpoken || [],
    hqLocation: resp?.hqLocation || "",
    industryExperience: resp?.industryExperience || [],
    foundingHistory: resp?.foundingHistory || "",
    internationalPresence: resp?.internationalPresence || [],
    presenceInChina:
      resp?.presenceInChina === false
        ? "no"
        : resp?.presenceInChina === true
          ? "yes"
          : "",
    experienceInChina: resp?.experienceInChina || "",
  };
};

const serviceSchemaMapper = (resp: any): IServiceProfileFormField => {

  return {
    email: resp?.email || "",
    businessName: resp?.businessName || "",
    description: resp?.description || "",
    linkedinUrl: resp?.linkedinUrl || "",
    logo: resp?.logo || {},
    mainSpecialities: resp?.mainSpecialities || [],
    additionalCapacities: resp?.additionalCapacities || [],
    industryExperience: resp?.industryExperience || [],
    internationalPresence: resp?.internationalPresence || [],
    staffSize: resp?.staffSize || "",
    website: resp?.website || "",
    hqLocation: resp?.hqLocation || "",
    languagesSpoken: resp?.languagesSpoken || [],
    locationsInChina: resp?.locationsInChina || [],
    foundingHistory: resp?.foundingHistory || "",
    companyRegistrationType: resp?.companyRegistrationType || "",
    docs: resp?.docs || [],
    otherDetails: resp?.otherDetails || "",
    annualTurnover: resp?.annualTurnover || "",
    services: resp?.services || "",
    notableClients: resp?.notableClients || "",
    projectBasedFeeUSD: resp?.projectBasedFeeUSD || "",
    retainerBasedFeeUSD: resp?.retainerBasedFeeUSD || "",
    bankAccDetails: resp?.bankAccDetails
  };
};

export const getUserProfileDetail = async (accountType: string) => {
  const userId = localStorage.getItem("userId") || "";

  let response = await Api.get(profileKeys.getUserById(userId));

  if (accountType === "brand") {
    return brandSchemaMapper(response as IBrandProfileFormField);
  } else {
    return serviceSchemaMapper(response as IServiceProfileFormField);
  }
};

export const createProfileApi = async (
  formFields: IServiceProfileFormField | IBrandProfileFormField
) => {
  const userId = localStorage.getItem("userId") || "";

  let response = await Api.put(profileKeys.getUserById(userId), formFields);

  return response;
};

export const fileUploadApi = async (file: File) => {
  let postFormData = new FormData();
  postFormData.append("file", file);
  let response = await Api.post(profileKeys.fileUpload(), postFormData);
  return response;
};

export const getUserProfileDetailById = async (id: string, pId?: string) => {
  let response = await Api.get(profileKeys.getUserById(id), {
    projectId: pId,
  });

  return response;
};