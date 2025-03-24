import axios, { AxiosInstance } from "axios";
import { getCookie } from "cookies-next";

const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
const socialBackendURL = `${process.env.NEXT_PUBLIC_SOCIAL_API_URL}/api`; // API Express

const instance: AxiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});

const socialInstance: AxiosInstance = axios.create({
  baseURL: socialBackendURL,
  withCredentials: true,
});

const setupInterceptors = (instance: AxiosInstance, tokenKey: string) => {
  instance.interceptors.request.use(
    async function (config) {
      let accessToken: string | undefined;

      if (typeof window !== "undefined") {
        // Ép kiểu về string hoặc undefined
        accessToken = getCookie(tokenKey) as string | undefined;
      }

      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    function (response) {
      if (response.data) {
        return response.data;
      }
      return response;
    },
    function (error) {
      if (error?.response?.data) {
        return error?.response?.data;
      }
      return Promise.reject(error);
    }
  );
};

setupInterceptors(instance, "access_token");
setupInterceptors(socialInstance, "access_token_social");

export { instance, socialInstance };
