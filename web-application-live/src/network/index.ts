import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import qs from "qs";
import {
  bearerTokenReqInterceptor,
  successHandler,
  successFileHandler,
  errorHandler,
} from "./functionHandlers";
import { IApiClient } from "./interfaces";

const getAxiosInstance = (baseUrl: string): AxiosInstance => {
  let axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 120000,
    headers: {
      "Content-Type": "application/json",
    },
  });
  axiosInstance = bearerTokenReqInterceptor(axiosInstance);
  return axiosInstance;
};

class ApiClient implements IApiClient {
  private client: AxiosInstance;
  constructor(baseUrl: string) {
    this.client = getAxiosInstance(baseUrl);
  }
  private async request(config: AxiosRequestConfig) {
    try {
      let response = await this.client.request(config);
      let handledResponse = await successHandler(response);
      return Promise.resolve(handledResponse);
    } catch (error: any) {
      let handledError = await errorHandler(error);
      return Promise.reject(handledError);
    }
  }
  private async requestFile(config: AxiosRequestConfig) {
    try {
      let response = await this.client.request(config);
      let handledResponse = await successFileHandler(response);
      return Promise.resolve(handledResponse);
    } catch (error: any) {
      let handledError = await errorHandler(error);
      return Promise.reject(handledError);
    }
  }
  public async get(url: string, params?: Object) {
    return this.request({
      method: "GET",
      url,
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "brackets" });
      },
    });
  }
  public async getFile(url: string, params?: Object) {
    return this.requestFile({
      method: "GET",
      url,
      params,
      responseType: "arraybuffer",
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "brackets" });
      },
    });
  }

  public async put(url?: string, data?: Object, params?: Object) {
    return this.request({ method: "PUT", url, data, params });
  }
  public async post(url: string, data: Object, params?: Object) {
    return this.request({ method: "POST", url, data, params });
  }
  public async delete(url: string, data?: Object, params?: Object) {
    return this.request({ method: "DELETE", url, data, params });
  }
  public async patch(url: string, data: Object, params?: Object) {
    return this.request({ method: "PATCH", url, data, params });
  }
}

const api_version = "/v1";
const baseURL = process.env.REACT_APP_BE_URL + api_version;

const apiClient = new ApiClient(baseURL);
export { apiClient as Api };
