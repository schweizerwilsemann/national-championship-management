import { instance } from "@/utilities/customize/axios.customize";
import { GetServerSideProps } from "next";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  homeColor: string;
  founded?: number;
  stadium?: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  tournamentId: string;
  players?: Array<{
    id: string;
    name: string;
    number: number;
    position: string;
    nationality: string;
    image?: string;
  }>;
}

export interface TeamsPageProps {
  teams: Team[];
  error?: string;
}

export interface ApiResponse {
  data: Team[];
}

export const fetchAllTeams = async () => {
  const url = "/teams";
  try {
    const response = await instance.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};

export const getTeamById = async (id: string): Promise<Team> => {
  const url = `/teams/${id}`;
  try {
    const response = await instance.get(url, {
      params: { include: 'players' }
    });

    console.log('Raw API response from getTeamById:', response);

    // The axios interceptor already extracts response.data for us
    // So we're getting the data directly here
    return response;
  } catch (error) {
    console.error("Error fetching team details:", error);
    throw error;
  }
};

export const getTeamPlayers = async (teamId: string) => {
  const url = `/teams/${teamId}/players`;
  try {
    const response = await instance.get(url);
    console.log('Raw API response from getTeamPlayers:', response);

    // The axios interceptor already extracts response.data for us
    return response;
  } catch (error) {
    console.error("Error fetching team players:", error);
    throw error;
  }
};

export const getServerSideProps: GetServerSideProps<
  TeamsPageProps
> = async () => {
  try {
    const response = await fetchAllTeams();
    return {
      props: {
        teams: response || [],
      },
    };
  } catch (error) {
    console.error("Error fetching teams in getServerSideProps:", error);
    return {
      props: {
        teams: [],
        error: "Failed to load teams data",
      },
    };
  }
};
