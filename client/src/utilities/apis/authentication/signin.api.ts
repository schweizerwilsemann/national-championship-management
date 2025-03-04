import instance from "@/utilities/customize/axios.customize";

const url = `/auth/login`;

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
