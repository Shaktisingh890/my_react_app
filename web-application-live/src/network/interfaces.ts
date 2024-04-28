export interface IApiClient {
  get(url: string, params?: {}): Promise<any>;
  post(url: string, data?: {}, params?: {}): Promise<any>;
  put(url: string, data?: {}, params?: {}): Promise<any>;
  patch(url: string, data?: {}, params?: {}): Promise<any>;
  delete(url: string, params?: {}): Promise<any>;
}
export interface IAuthHelper {
  getAccessToken(): Promise<string>;
  refreshTokens(): Promise<void>;
}
