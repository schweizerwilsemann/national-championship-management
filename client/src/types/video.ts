// types/video.ts

export interface Video {
  _id: string;
  title: string;
  description: string;
  videoId: string;
  embedUrl: string;
  userId: string;
  category: string;
  tags: string[];
  thumbnail: string;
  active: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface VideoResponse {
  videos: Video[];
  totalVideos: number;
  lastMonthVideos: number;
}

export interface GetVideosParams {
  category?: string;
  searchTerm?: string;
  sortBy?: "newest" | "oldest";
  limit?: number;
  startIndex?: number;
}
