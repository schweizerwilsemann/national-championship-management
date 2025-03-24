import { instance } from "@/utilities/customize/axios.customize";

export const getFinishedMatches = async (
  id: string,
  params?: { page?: number; limit?: number }
) => {
  const url = `/matches/${id}/finished`;
  try {
    const response = await instance.get(url, {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
};
