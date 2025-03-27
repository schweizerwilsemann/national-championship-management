"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Video } from "@/types/video";

interface VideoCardProps {
    video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="group flex items-start gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100 hover:bg-gray-50">
            {/* Thumbnail */}
            <div className="relative w-60 h-36 overflow-hidden rounded-lg">
                <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {video.category}
                </div>
            </div>

            {/* Nội dung */}
            <div className="flex-1">
                <Link href={`/videos/${video._id}`} className="no-underline">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {video.title}
                    </h3>
                </Link>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {video.description}
                </p>

                {/* Thông tin thêm */}
                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <span>{formatDate(video.createdAt)}</span>
                    <span>{video.views} views</span>
                </div>

                {/* Tags */}
                {video.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                        {video.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoCard;
