import { Api } from "network";
import { paymentsKeys } from "network/apiKeys";

export const sendInvoice = async (formfields: any) => {
    return await Api.post(paymentsKeys.sendInvoice(), formfields);
};

export const updateInvoice = async (id: string, formfields: any) => {
    return await Api.put(paymentsKeys.updateInvoice(id), formfields);
};

export const brandInvoiceList = async (id: any) => {
    return await Api.get(paymentsKeys.brandInvoiceList(), { proposalId: id });
};

export const serviceProviderInvoiceList = async (id: any) => {
    return await Api.get(paymentsKeys.serviceProviderInvoiceList(), { proposalId: id });
};

export const downloadInvoice = async (id: string) => {
    return await Api.getFile(paymentsKeys.downloadInvoice(id));
};

export const getExpanterBankAccounts = async () => {
    return await Api.get(paymentsKeys.getExpanterBankAccounts());
};
export const payViaBankTransfer = async (id: string, formfields:any) => {
    return await Api.put(paymentsKeys.payViaBankTransfer(id), formfields);
};