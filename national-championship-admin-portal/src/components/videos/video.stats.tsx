// components/VideoStatsDashboard.tsx
import React from 'react';
import { Row, Col, Card, Statistic, Table, Empty, Tag, Divider, Typography } from 'antd';
import { VideoCameraAddOutlined, CalendarOutlined } from '@ant-design/icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie as PieChart } from 'react-chartjs-2';
import { categoryColors, TopVideo, VideoStats } from '@/types/types';

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title } = Typography;

interface VideoStatsDashboardProps {
    stats: VideoStats;
    loading?: boolean;
}

const VideoStatsDashboardComponent: React.FC<VideoStatsDashboardProps> = ({ stats }) => {
    // Prepare data for pie chart
    const pieData = {
        labels: stats.videosByCategory.map(item => item.category),
        datasets: [
            {
                label: 'Videos by Category',
                data: stats.videosByCategory.map(item => item.count),
                backgroundColor: stats.videosByCategory.map(
                    item => categoryColors[item.category] || categoryColors.others
                ),
                borderWidth: 1,
            },
        ],
    };

    // Options for pie chart
    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: true,
                text: 'Videos by Category',
            },
        },
    };

    // Columns for top videos table
    const topVideosColumns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Views',
            dataIndex: 'views',
            key: 'views',
            render: (views: number) => <strong>{views.toLocaleString()}</strong>,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
    ];

    return (
        <div className="video-stats-dashboard" style={{ padding: '20px' }}>
            <Title level={2}>Video Statistics Dashboard</Title>
            <Divider />

            {/* Stats Cards */}
            <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col xs={24} sm={12} lg={12}>
                    <Card>
                        <Statistic
                            title="Total Videos"
                            value={stats.totalVideos}
                            prefix={<VideoCameraAddOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={12}>
                    <Card>
                        <Statistic
                            title="Videos Added (Last 30 Days)"
                            value={stats.lastMonthVideos}
                            prefix={<CalendarOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Category Chart and Top Videos */}
            <Row gutter={16}>
                <Col xs={24} lg={12} style={{ marginBottom: '20px' }}>
                    <Card title="Videos by Category" style={{ height: '400px' }}>
                        {stats.videosByCategory.length === 0 ? (
                            <Empty description="No category data available" />
                        ) : (
                            <div style={{ height: 300 }}>
                                <PieChart data={pieData} options={pieOptions} />
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Top Videos by Views" style={{ height: '400px', overflow: 'auto' }}>
                        {stats.topVideos.length === 0 ? (
                            <Empty description="No videos available" />
                        ) : (
                            <Table<TopVideo>
                                dataSource={stats.topVideos}
                                columns={topVideosColumns}
                                pagination={false}
                                rowKey="_id"
                            />
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Categories List */}
            <Row style={{ marginTop: '20px' }}>
                <Col span={24}>
                    <Card title="Video Categories">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {stats.videosByCategory.map(category => (
                                <Tag
                                    color={categoryColors[category.category] || categoryColors.others}
                                    key={category.category}
                                    style={{ fontSize: '14px', padding: '5px 10px' }}
                                >
                                    {category.category}: {category.count} videos
                                </Tag>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default VideoStatsDashboardComponent;