import { instance } from "@/utilities/customize/axios.customize";

const url = `/tournaments`;

export const getAllTournaments = async () => {
  try {
    const response = await instance.get(url);
    return response;
  } catch (error: any) {
    throw error.response
      ? error.response.data
      : new Error("Can not get the tournaments");
  }
};
