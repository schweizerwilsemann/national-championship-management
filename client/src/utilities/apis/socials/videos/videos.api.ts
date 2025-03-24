import { socialInstance } from "@/utilities/customize/axios.customize";
import { GetVideosParams, VideoResponse, Video } from "@/types/video";

const url = `/video`;

export const getAllVideos = async (
  params?: GetVideosParams
): Promise<VideoResponse> => {
  try {
    const response = await socialInstance.get(url, { params });
    return response;
  } catch (error: any) {
    throw error.response ? error.response : new Error("Cannot fetch videos");
  }
};

export const getVideoById = async (id: string): Promise<Video> => {
  try {
    const response = await socialInstance.get(`${url}/find/${id}`);
    return response;
  } catch (error: any) {
    throw error.response
      ? error.response
      : new Error("Cannot fetch video details");
  }
};
