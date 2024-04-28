import { Api } from "network";
import { dashboardKeys } from "network/apiKeys";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

export enum ServerConstantKeys {
  internationalPresence = "internationalPresence",
  projectBriefingDescription = "projectBriefingDescription",
  countries = "countries",
  chinaCities = "chinaCities",
  maritalStatus = "maritalStatus",
  gender = "gender",
  deviceType = "deviceType",
  locationsInChina = "locationsInChina",
  userRole = "userRole",
  userType = "userType",
  mediaTypes = "mediaTypes",
  companyTypes = "companyTypes",
  mainSpecialities = "mainSpecialities",
  distributorType = "distributorType",
  industryExperience = "industryExperience",
  businessModel = "businessModel",
  businessSize = "businessSize",
  companyRegistrationTypes = "companyRegistrationTypes",
  segmentExperience = "segmentExperience",
  annualTurnover = "annualTurnover",
  staffSize = "staffSize",
  foundingHistory = "foundingHistory",
  experienceInChina = "experienceInChina",
  projectBriefingTypes = "projectBriefingTypes",
  wayOfOperations = "wayOfOperations",
  projectObjectives = "projectObjectives",
  requiredExperience = "requiredExperience",
  languageSpoken = "languageSpoken",
  teamSizeRequirements = "teamSizeRequirements",
  projectStartingFee_USD = "projectStartingFee_USD",
  budgetTypes = "budgetTypes",
  startingTimeline = "startingTimeline",
  queryStatus = "queryStatus",
  serviceProviderTypes = "serviceProviderTypes",
  chinaProvinces = "chinaProvinces"

}
interface ILabel {
  show: string[];
  server: any;
}
export interface IDropdown {
  label: string;
  value: any;
}

const labelMapper = (list: ILabel) => {
  let data: IDropdown[] = [];
  for (let i = 0; i < list?.show.length; i++) {
    data.push({
      label: list.show[i],
      value: list.server[i],
    });
  }
  return data;
};

export const getConstants = atom(async () => {
  const response = await Api.get(dashboardKeys.getConstants());
  return response;
});



export function useServerConstantsExtraData(constantKey) {
  const [constants] = useAtom(getConstants);

  if (constants['extraData']) {
    return [constants['extraData'][constantKey]];
  } else {
    return [null];
  }

}

export const getServerConstants = atom((get) => {
  const allValues = get(getConstants);
  return allValues;
});





export function useServerConstants(constantKey) {
  const [constants] = useAtom(getServerConstants);
  const [list, setList] = useState<IDropdown[]>([]);

  useEffect(() => {
    if (constantKey) {
      const serverList = labelMapper(constants[constantKey]);
      setList(serverList);
    }
  }, [constants, constantKey]);

  return [list];
}

export function getConstantLabel(
  constantValue: any,
  serverConstants: IDropdown[]
) {
  const constantItem = serverConstants?.filter(
    (item) => item.value === constantValue
  )[0];
  return constantItem?.label;
}

export function useServerLabels(constantKey, constantValue) {
  const [constants] = useAtom(getServerConstants);
  const [label, setLabel] = useState<any>();

  useEffect(() => {
    if (constantKey && constantValue) {
      const serverLabel = labelMapper(constants[constantKey])?.filter(
        (item) => item.value === constantValue
      )[0]?.label;
      setLabel(serverLabel);
    }
  }, [constants, constantKey, constantValue]);

  return label;
}
