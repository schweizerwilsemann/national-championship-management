import { socialInstance } from "@/utilities/customize/axios.customize";

const url = `/post/getposts`;

export interface GetNewsParams {
  startIndex?: number;
  limit?: number;
  sort?: "asc" | "desc";
  userId?: string;
  category?: string;
  slug?: string;
  postId?: string;
  searchTerm?: string;
}

export const getNews = async (params?: GetNewsParams) => {
  try {
    const response = await socialInstance.get(url, {
      params,
    });
    return response;
  } catch (error: any) {
    throw error ? error : new Error("Can not get posts");
  }
};
