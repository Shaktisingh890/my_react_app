import { Api } from "network";
import { proposalManagementKeys } from "network/apiKeys";

export const getServiceProvidersList = async () => {
    return await Api.get(proposalManagementKeys.getServiceProvider());
};

export const brandProjectList = async () => {
    return await Api.get(proposalManagementKeys.getBrandProjects());
};

export const brandShowProposals = async (formFields: any) => {
    return await Api.get(proposalManagementKeys.proposalsBrand(), formFields);
};

export const viewProposal = async (id: string) => {
    return await Api.get(proposalManagementKeys.viewPropos(id));
};

export const sendProposal = async (formFields: any) => {
    return await Api.post(proposalManagementKeys.sendPropos(), formFields);
};

export const editProposal = async (id: string, formFields: any) => {
    return await Api.put(proposalManagementKeys.editPropos(id), formFields);
};

export const hire = async (formFields: any) => {
    return await Api.post(proposalManagementKeys.hireButton(), formFields);
};

export const inVoice = async (formFields: any) => {
    return await Api.post(proposalManagementKeys.sendInvoice(), formFields);
};

export const statusComplete = async (id: string, formFields: any) => {
    return await Api.put(proposalManagementKeys.complete(id), formFields);
};
