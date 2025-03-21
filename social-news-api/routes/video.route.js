import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createVideo,
  updateVideo,
  deleteVideo,
  getVideo,
  getVideos,
  getVideoStats,
} from "../controllers/video.controller.js";

const videoRouter = express.Router();

// Create video - only admin or organizer
videoRouter.post("/", verifyToken, createVideo);

// Update video - owner or admin
videoRouter.put("/:id", verifyToken, updateVideo);

// Delete video - owner or admin
videoRouter.delete("/:id", verifyToken, deleteVideo);

// Get single video by ID
videoRouter.get("/find/:id", getVideo);

// Get videos with filtering
videoRouter.get("/", getVideos);

// Get video statistics - only admin or organizer
videoRouter.get("/stats", verifyToken, getVideoStats);

export default videoRouter;
