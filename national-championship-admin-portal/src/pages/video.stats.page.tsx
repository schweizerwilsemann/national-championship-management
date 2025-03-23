// pages/VideoStatsPage.tsx
import React, { useState, useEffect } from 'react';
import { Spin, message } from 'antd';
import axios from 'axios';
import VideoStatsDashboardComponent from '@/components/videos/video.stats';
import { VideoStats } from '@/types/types';


const VideoStatsPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [stats, setStats] = useState<VideoStats>({
        totalVideos: 0,
        lastMonthVideos: 0,
        topVideos: [],
        videosByCategory: []
    });

    useEffect(() => {
        fetchVideoStats();
    }, []);

    const fetchVideoStats = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await axios.get<VideoStats>('/api/video/stats');
            setStats(response.data);
        } catch (error) {
            message.error('Failed to load video statistics');
            console.error('Error loading video stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return <VideoStatsDashboardComponent stats={stats} />;
};

export default VideoStatsPage;