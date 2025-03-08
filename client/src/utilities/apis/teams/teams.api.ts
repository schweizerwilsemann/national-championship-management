import instance from "@/utilities/customize/axios.customize";

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
