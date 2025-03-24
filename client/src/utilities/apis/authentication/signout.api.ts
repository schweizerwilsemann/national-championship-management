import {
  instance,
  socialInstance,
} from "@/utilities/customize/axios.customize";

export const signOut = async () => {
  try {
    const response = await instance.post("/auth/logout");
    return response.data; // Return the cookie status
  } catch (error) {
    console.error("Error checking cookie:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
export const socialSignOut = async () => {
  try {
    const response = await socialInstance.post("/user/signout");
    return response.data; // Return the cookie status
  } catch (error) {
    console.error("Error checking cookie:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
