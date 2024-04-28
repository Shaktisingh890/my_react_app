import { IAuthFields } from "app/modules/iam/pages/changePwd";
import {
  IBrandFormField,
  IServiceFormField,
} from "app/modules/iam/pages/createAccount";
import { Iemail } from "app/modules/iam/pages/forgotPwd";
import { Ilogin } from "app/modules/iam/pages/login";
import { IAskToExpertValues } from "app/modules/dashboard/pages/talkToExpert";
import { IContactUs } from "app/modules/dashboard/pages/contactUs";

import { Api } from "network";
import { iamKeys, talkToExperts, contactThem } from "network/apiKeys";

export const createAccountApi = async (
  formFields: any,
  accountType: string
) => {
  if (accountType === "brand") {
    return await Api.post(iamKeys.brandRegister(), formFields);
  } else {
    return await Api.post(iamKeys.serviceRegister(), formFields);
  }
};

export const login = async (formFields: Ilogin) => {
  return await Api.post(iamKeys.login(), formFields);
};

export const forgotPassword = async (formFields: Iemail) => {
  return await Api.get(iamKeys.forgotPassword(), formFields);
};

export const verifyToken = async (formFields: IAuthFields) => {
  return await Api.get(iamKeys.verifyIdToken(), formFields);
};

export const changePassword = async (formFields: IAuthFields) => {
  return await Api.put(iamKeys.changeUserPassword(), formFields);
};

export const talkToExpert = async (formfields: IAskToExpertValues) => {
  return await Api.post(talkToExperts.talkToExpert(), formfields);
};

export const contactTeam = async (formfields: IContactUs) => {
  return await Api.post(contactThem.contactUs(), formfields);
};

export const verifyEmail = async (token: string) => {
  return await Api.put(iamKeys.emailVerification(token), {});
};
