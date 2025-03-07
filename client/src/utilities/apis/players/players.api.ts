import instance from "@/utilities/customize/axios.customize";

export const getPlayersPagination = async (params?: {
  page?: number;
  pageSize?: number;
}) => {
  const url = `/players`;
  try {
    const response = await instance.get(url, {
      params: {
        page: params?.page || 1,
        limit: params?.pageSize || 10,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
};

export const filterPlayers = async (params?: {
  name?: string;
  teamId?: string;
  nationality?: string;
  isActive?: boolean;
}) => {
  const url = `/players/filter-players`;
  try {
    const response = await instance.get(url, {
      params: {
        name: params?.name,
        teamId: params?.teamId,
        nationality: params?.nationality,
        isActive: params?.isActive,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching filtered players:", error);
    throw error;
  }
};
