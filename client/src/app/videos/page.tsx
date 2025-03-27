'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllVideos } from '@/utilities/apis/socials/videos/videos.api';
import { Video, GetVideosParams } from '@/types/video';
import VideoCard from '@/components/video/video.card';

const VideosPage = () => {
    const searchParams = useSearchParams();
    const initialSearchTerm = searchParams?.get('search') || '';

    const [videos, setVideos] = useState<Video[]>([]);
    const [totalVideos, setTotalVideos] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<GetVideosParams>({
        sortBy: 'newest',
        limit: 12,
        startIndex: 0,
        searchTerm: initialSearchTerm // Pre-fill search term if passed
    });

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const data = await getAllVideos(params);
                setVideos(data.videos);
                setTotalVideos(data.totalVideos);
            } catch (err) {
                setError('Failed to load videos. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [params]);

    const handleCategoryChange = (category: string | undefined) => {
        setParams(prev => ({ ...prev, category, startIndex: 0 }));
    };

    const handleSearch = (searchTerm: string) => {
        setParams(prev => ({ ...prev, searchTerm, startIndex: 0 }));
    };

    const handleSort = (sortBy: "newest" | "oldest") => {
        setParams(prev => ({ ...prev, sortBy }));
    };

    const loadMore = () => {
        setParams(prev => ({ ...prev, startIndex: (prev.startIndex || 0) + (prev.limit || 12) }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Videos</h1>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        id="category"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        onChange={(e) => handleCategoryChange(e.target.value || undefined)}
                    >
                        <option value="">All Categories</option>
                        <option value="premierLeagueNews">Premier League News</option>
                        <option value="premierLeagueInjuries">Premier League Injuries</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700">Sort By</label>
                    <select
                        id="sort"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        onChange={(e) => handleSort(e.target.value as "newest" | "oldest")}
                        value={params.sortBy}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>

                <div className="flex-grow">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="text"
                            id="search"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Search videos..."
                            value={params.searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Videos List */}
            <div className="space-y-4">
                {videos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>

            {/* Empty State */}
            {videos.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-lg text-gray-600">No videos found</p>
                </div>
            )}

            {/* Load More Button */}
            {videos.length < totalVideos && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={loadMore}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideosPage;