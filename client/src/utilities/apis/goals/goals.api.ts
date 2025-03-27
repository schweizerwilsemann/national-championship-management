import { instance } from "@/utilities/customize/axios.customize";

export const getTopScorers = async (params?: {
  tournamentId?: string;
  page?: number;
  pageSize?: number;
}) => {
  const url = `/goals/top-scorers`;
  try {
    const response = await instance.get(url, {
      params: {
        tournamentId: params?.tournamentId,
        page: params?.page || 1,
        limit: params?.pageSize || 10,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching top scorers:", error);
    throw error;
  }
};
