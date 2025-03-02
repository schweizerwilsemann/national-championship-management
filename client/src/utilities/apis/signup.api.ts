import axios from "axios";
import instance from "@/utilities/customize/axios.customize";

const url = `/auth/register`;

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
