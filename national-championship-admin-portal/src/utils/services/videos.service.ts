// videoService.ts
import axios from "axios";
import { VideoData, VideoResponse, VideoFormData } from "@/types/types";

export const VideoService = {
  getVideos: async (searchQuery?: string): Promise<VideoResponse> => {
    const url = searchQuery
      ? `/api/video?search=${encodeURIComponent(searchQuery)}`
      : "/api/video";

    const response = await axios.get<VideoResponse>(url);
    return response.data;
  },

  getVideo: async (id: string): Promise<VideoData> => {
    const response = await axios.get<VideoData>(`/api/video/${id}`);
    return response.data;
  },

  createVideo: async (videoData: VideoFormData): Promise<VideoData> => {
    const response = await axios.post<VideoData>("/api/video", videoData);
    return response.data;
  },

  updateVideo: async (
    id: string,
    videoData: VideoFormData
  ): Promise<VideoData> => {
    const response = await axios.put<VideoData>(`/api/video/${id}`, videoData);
    return response.data;
  },

  deleteVideo: async (id: string): Promise<void> => {
    await axios.delete(`/api/video/${id}`);
  },
};

export default VideoService;
