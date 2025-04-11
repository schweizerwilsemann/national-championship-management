import { instance } from "@/utilities/customize/axios.customize";

export interface Player {
  id: string;
  name: string;
  number: number;
  position: 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'FORWARD';
  birthDate: string;
  nationality: string;
  image?: string;
  height?: number;
  weight?: number;
  preferredFoot?: 'LEFT' | 'RIGHT' | 'BOTH';
  biography?: string;
  isActive: boolean;
  teamId: string;
  team?: {
    id: string;
    name: string;
    logo?: string;
  };
}

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
    console.error("Error fetching players:", error);
    throw error;
  }
};

export const getPlayerById = async (id: string): Promise<Player> => {
  const url = `/players/${id}`;
  try {
    const response = await instance.get(url);
    console.log('Raw API response from getPlayerById:', response);

    // The axios interceptor already extracts response.data for us
    return response;
  } catch (error) {
    console.error("Error fetching player details:", error);
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
