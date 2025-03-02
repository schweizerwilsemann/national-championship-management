import axios from "axios";

const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
const instance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});
instance.interceptors.request.use(
  async function (config) {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];

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
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    if (error?.response?.data) {
      return error?.response?.data;
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default instance;
