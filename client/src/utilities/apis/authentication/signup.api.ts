import {
  instance,
  socialInstance,
} from "@/utilities/customize/axios.customize";

const url = `/auth/register`;
const socialUrl = `/auth/signup`;
export const signup = async (email: string, password: string, name: string) => {
  try {
    const response = await instance.post<IBackendRes<IUserSignUp>>(url, {
      email,
      password,
      name,
    });
    return response; // Return the response data (e.g., user info)
  } catch (error: any) {
    throw error.response ? error.response.data : new Error("Signup failed");
  }
};

export const socialSignUp = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const response = await socialInstance.post<IBackendRes<IUserSignUp>>(
      socialUrl,
      {
        email,
        password,
        username,
      }
    );
    return response;
  } catch (error: any) {
    throw error.response
      ? error.response.data
      : new Error("Signup failed for social");
  }
};
