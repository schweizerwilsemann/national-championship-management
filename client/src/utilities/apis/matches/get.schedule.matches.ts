import { instance } from "@/utilities/customize/axios.customize";

export const getScheduledMatches = async (
  id: string,
  params?: { page?: number; limit?: number }
) => {
  const url = `/matches/${id}/scheduled`;
  try {
    const response = await instance.get(url, {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
      },
    });

    // Ensure we return only the necessary data structure
    // Assuming the API returns { data: {...}, meta: {...} }
    return response;
  } catch (error) {
    console.error("Error fetching scheduled matches:", error);
    throw error;
  }
};
