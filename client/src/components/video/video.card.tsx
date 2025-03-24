// components/VideoCard.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Video } from '@/types/video';

interface VideoCardProps {
    video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link href={`/videos/${video._id}`}>
                <div className="relative h-48 w-full">
                    <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {video.category}
                    </div>
                </div>
            </Link>
            <div className="p-4">
                <Link href={`/videos/${video._id}`} className="no-underline">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-blue-600">{video.title}</h3>
                </Link>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{video.description}</p>
                <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">{formatDate(video.createdAt)}</span>
                    <span className="text-xs text-gray-500">{video.views} views</span>
                </div>
                {video.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                        {video.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{tag}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoCard;