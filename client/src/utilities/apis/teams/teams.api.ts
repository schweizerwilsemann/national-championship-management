import instance from "@/utilities/customize/axios.customize";
import { GetServerSideProps } from "next";
export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  homeColor: string;
  createdAt: string;
  updatedAt: string;
  tournamentId: string;
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
    console.error("Error fetching standings:", error);
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
