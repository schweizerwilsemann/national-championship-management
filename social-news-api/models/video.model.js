import mongoose from "mongoose";

const youtubeVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    videoId: {
      type: String,
      required: true,
      unique: true,
    },
    embedUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    tags: {
      type: Array,
      default: [],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const YoutubeVideo = mongoose.model("YoutubeVideo", youtubeVideoSchema);
export default YoutubeVideo;
