import { Api } from "network";
import { marketplaceKeys } from "network/apiKeys";

export const getMarketPlaceProjectList = async () => {
  return await Api.get(marketplaceKeys.getMarketPlaceProjectList());
};

export const deleteMarketPlaceProjectList = async (id: string) => {
  return await Api.delete(marketplaceKeys.marketPlaceProject(id));
};

export const shareFunction = async (id: string) => {
  return await Api.getFile(marketplaceKeys.shareButton(id));
};