import {
  instance,
  socialInstance,
} from "@/utilities/customize/axios.customize";

const url = `/auth/login`;
const socialUrl = "/auth/signin";

export const login = async (email: string, password: string) => {
  try {
    const response = await instance.post<IBackendRes<IUserSignIn>>(url, {
      email,
      password,
    });
    return response; // Return the response data (e.g., access token)
  } catch (error: any) {
    // Specify the type of error
    throw error.response ? error.response.data : new Error("Login failed");
  }
};

export const socialLogin = async (email: string, password: string) => {
  try {
    const response = await socialInstance.post<IBackendRes<IUserSignIn>>(
      socialUrl,
      {
        email,
        password,
      }
    );
    return response; // Return the response data (e.g., access token)
  } catch (error: any) {
    // Specify the type of error
    throw error.response ? error.response.data : new Error("Login failed");
  }
};
