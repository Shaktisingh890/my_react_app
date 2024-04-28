import { AxiosError, AxiosResponse, AxiosInstance } from "axios";
import { HTTP_STATUS_CODES, serverErrors } from "consts/apiCodes";

export const successHandler = (response: AxiosResponse) => {
  const { data, extraData } = response.data;
  if (!data || response.status === HTTP_STATUS_CODES.noContent) {
    return Promise.resolve({});
  }

  if (data && extraData && typeof data === "object" && !Array.isArray(data)) {
    data.extraData = extraData;
  }

  return Promise.resolve(data);
};

export const successFileHandler = (response: AxiosResponse) => {
  return Promise.resolve(response);
};

export const errorHandler = (error: AxiosError) => {
  let errorMessage = serverErrors.SERVER_ERROR;

  if (error.response) {
    const { data } = error.response;
    if (data) {
      errorMessage = data.message;
    }
  }
  return Promise.resolve(errorMessage);
};

export const getBearerToken = async (): Promise<string> => {
  let accessToken = localStorage.getItem("accessToken");
  if (accessToken && accessToken.length) {
    return Promise.resolve(accessToken);
  } else {
    return Promise.resolve("");
  }
};

export const bearerTokenReqInterceptor = (
  axiosInstance: AxiosInstance
): AxiosInstance => {
  axiosInstance.interceptors.request.use(async function (config: any) {
    try {
      config.headers["Accept-Language"] = "en";
      const token = await getBearerToken();

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  });
  return axiosInstance;
};
