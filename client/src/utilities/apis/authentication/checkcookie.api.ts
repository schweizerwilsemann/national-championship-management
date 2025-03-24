import { instance } from "@/utilities/customize/axios.customize";

export const checkCookie = async () => {
  try {
    const response = await instance.get("/auth/check-cookie");
    return response; // Return the cookie status
  } catch (error) {
    console.error("Error checking cookie:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
