// app/videos/[id]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getVideoById } from '@/utilities/apis/socials/videos/videos.api';
import { Video } from '@/types/video';
import Link from 'next/link';

const VideoDetailPage = () => {
    const params = useParams();
    const videoId = params.id as string;

    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideoDetails = async () => {
            try {
                setLoading(true);
                const data = await getVideoById(videoId);
                setVideo(data);
            } catch (err) {
                setError('Failed to load video details. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (videoId) {
            fetchVideoDetails();
        }
    }, [videoId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-5 rounded shadow-md" role="alert">
                    <p className="font-bold text-lg mb-2">Unable to Load Video</p>
                    <p>{error || 'Video not found'}</p>
                </div>
                <div className="mt-6">
                    <Link href="/videos" className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to videos
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-5xl mx-auto px-4">
                {/* Navigation */}
                <div className="mb-8">
                    <Link href="/videos" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to videos
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    {/* Header with Title, first */}
                    <div className="p-8 text-center border-b border-gray-100">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{video.title}</h1>

                        {/* Category Badge */}
                        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                            {video.category}
                        </span>

                        {/* Tags */}
                        {video.tags && video.tags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                {video.tags.map((tag, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Video Stats */}
                        <div className="flex justify-center items-center space-x-6 mt-6 text-sm text-gray-500">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatDate(video.createdAt)}</span>
                            </div>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>{video.views.toLocaleString()} views</span>
                            </div>
                        </div>
                    </div>

                    {/* Video Content - moved down */}
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        {/* Video Embed */}
                        <div className="relative pt-[56.25%] rounded-lg overflow-hidden shadow-md">
                            <iframe
                                src={video.embedUrl}
                                className="absolute top-0 left-0 w-full h-full border-0"
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Description */}
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Description</h2>
                            <div className="text-gray-700 space-y-4 leading-relaxed">
                                {video.description.split('\n').map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex">
                                    <span className="text-gray-500 w-32">Video ID:</span>
                                    <span className="text-gray-700 font-mono">{video.videoId}</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-32">Last Updated:</span>
                                    <span className="text-gray-700">{formatDate(video.updatedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoDetailPage;