import { instance } from "@/utilities/customize/axios.customize";

// Replace 'yourTournamentId' with the actual tournament ID

export const fetchStanding = async (tournamentId: string) => {
  const url = `/standings/tournament/${tournamentId}`;
  try {
    const response = await instance.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
};
