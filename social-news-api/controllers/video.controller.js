import YoutubeVideo from "../models/video.model.js";
import { errorHandler } from "../utils/error.js";

export const createVideo = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isOrganizer) {
    return next(errorHandler(403, "You are not allowed to create videos"));
  }

  try {
    const { title, description, videoId, embedUrl, category, tags, thumbnail } =
      req.body;

    if (!title || !videoId || !embedUrl) {
      return next(
        errorHandler(400, "Title, videoId and embedUrl are required")
      );
    }

    const newVideo = new YoutubeVideo({
      title,
      description,
      videoId,
      embedUrl,
      userId: req.user.id,
      category: category || "uncategorized",
      tags: tags || [],
      thumbnail: thumbnail || "",
    });

    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await YoutubeVideo.findById(req.params.id);

    if (!video) {
      return next(errorHandler(404, "Video not found"));
    }

    if (video.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to update this video")
      );
    }

    const updatedVideo = await YoutubeVideo.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          embedUrl: req.body.embedUrl,
          videoId: req.body.videoId,
          category: req.body.category,
          tags: req.body.tags,
          thumbnail: req.body.thumbnail,
          active: req.body.active,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedVideo);
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await YoutubeVideo.findById(req.params.id);

    if (!video) {
      return next(errorHandler(404, "Video not found"));
    }

    if (video.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to delete this video")
      );
    }

    await YoutubeVideo.findByIdAndDelete(req.params.id);
    res.status(200).json("The video has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await YoutubeVideo.findById(req.params.id);

    if (!video) {
      return next(errorHandler(404, "Video not found"));
    }

    // Increment views count
    await YoutubeVideo.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};

export const getVideos = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const sortBy = req.query.sortBy === "oldest" ? "createdAt" : "-createdAt";

    const category = req.query.category;
    const userId = req.query.userId;
    const searchTerm = req.query.searchTerm;

    const query = { active: true };

    if (category) {
      query.category = category;
    }

    if (userId) {
      query.userId = userId;
    }

    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // If admin/organizer, include inactive videos when querying their own videos
    if (
      req.user &&
      (req.user.isAdmin || req.user.isOrganizer) &&
      userId === req.user.id
    ) {
      delete query.active;
    }

    const videos = await YoutubeVideo.find(query)
      .sort(sortBy)
      .skip(startIndex)
      .limit(limit);

    const totalVideos = await YoutubeVideo.countDocuments(query);

    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

    const lastMonthVideos = await YoutubeVideo.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      videos,
      totalVideos,
      lastMonthVideos,
    });
  } catch (error) {
    next(error);
  }
};

// Admin/Organizer dashboard statistics
export const getVideoStats = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isOrganizer) {
    return next(
      errorHandler(403, "You are not allowed to see video statistics")
    );
  }

  try {
    const totalVideos = await YoutubeVideo.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

    const lastMonthVideos = await YoutubeVideo.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Find top videos by views
    const topVideos = await YoutubeVideo.find()
      .sort({ views: -1 })
      .limit(5)
      .select("title views createdAt");

    // Count videos by category
    const videosByCategory = await YoutubeVideo.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      totalVideos,
      lastMonthVideos,
      topVideos,
      videosByCategory,
    });
  } catch (error) {
    next(error);
  }
};
