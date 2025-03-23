// types.ts
export interface VideoStats {
  totalVideos: number;
  lastMonthVideos: number;
  topVideos: TopVideo[];
  videosByCategory: CategoryCount[];
}

export interface TopVideo {
  _id: string;
  title: string;
  views: number;
  createdAt: string;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export const categoryColors: Record<string, string> = {
  premierLeague: "#1E90FF", // English Premier League
  premierLeagueNews: "#FFD700", // News related to Premier League
  premierLeagueInjuries: "#FF4500", // Injury updates
  premierLeagueTransfers: "#32CD32", // Transfer news and rumors
  premierLeagueGossip: "#8A2BE2", // Off-field news and gossip
  premierLeagueStats: "#4B0082", // Statistics and analysis
  others: "#faad14", // Other football-related categories
};
// types.ts
export interface VideoData {
  _id: string;
  title: string;
  description?: string;
  videoId: string;
  embedUrl: string;
  category: VideoCategory;
  tags?: string[];
  thumbnail?: string;
  createdAt: string;
}

export type VideoFormData = Omit<VideoData, "_id" | "createdAt">;

export type VideoCategory =
  | "premierLeague"
  | "premierLeagueNews"
  | "premierLeagueInjuries"
  | "premierLeagueTransfers"
  | "premierLeagueGossip"
  | "premierLeagueStats";

export const categoryFilters = [
  { text: "Premier League", value: "premierLeague" },
  { text: "News", value: "premierLeagueNews" },
  { text: "Injuries", value: "premierLeagueInjuries" },
  { text: "Transfers", value: "premierLeagueTransfers" },
  { text: "Gossip", value: "premierLeagueGossip" },
  { text: "Statistics", value: "premierLeagueStats" },
];

export interface VideoResponse {
  videos: VideoData[];
  totalVideos: number;
}
