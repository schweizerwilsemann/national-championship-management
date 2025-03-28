// VideosPage.tsx
import { useState, useEffect, FC } from 'react';
import {
    Table, Button, Modal, Form, Input, Space, Tag, Popconfirm,
    message, Card, Typography, Row, Col
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    EyeOutlined, SearchOutlined, ReloadOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { VideoData, VideoResponse, categoryFilters } from '@/types/types';
import VideoForm from '@/components/forms/VideoForm';
import { ColumnsType } from 'antd/es/table';



const { Title } = Typography;

const VideosPage: FC = () => {
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState<string>('');
    const [totalVideos, setTotalVideos] = useState<number>(0);

    // Fetch videos
    const fetchVideos = async () => {
        setLoading(true);
        try {
            const res = await axios.get<VideoResponse>('/api/video');
            setVideos(res.data.videos || []);
            setTotalVideos(res.data.totalVideos || res.data.videos.length);
        } catch (error) {
            message.error('Failed to fetch videos');
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);
    useEffect(() => {
        console.log(">>>> modal visible: ", modalVisible)
    }, [modalVisible])
    // Handle form submission
    const handleSubmit = async (values: any) => {
        try {
            if (currentVideo) {
                // Update video
                await axios.put(`/api/video/${currentVideo._id}`, values);
                message.success('Video updated successfully');
            } else {
                // Create new video
                await axios.post('/api/video', values);
                message.success('Video created successfully');
            }
            // Close modal first
            setModalVisible(false);
            // Then reset video and form
            setCurrentVideo(null);
            form.resetFields();
            // Refetch videos
            fetchVideos();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Operation failed');
            console.error('Error:', error);
        }
    };

    // Handle edit video
    const handleEdit = (record: VideoData) => {
        setCurrentVideo(record);
        setModalTitle('Edit Video');
        form.setFieldsValue({
            title: record.title,
            description: record.description,
            videoId: record.videoId,
            embedUrl: record.embedUrl,
            category: record.category,
            tags: record.tags,
            thumbnail: record.thumbnail,
        });
        setModalVisible(true);
    };

    // Handle delete video
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/video/${id}`);
            message.success('Video deleted successfully');
            fetchVideos();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Failed to delete video');
            console.error('Error deleting video:', error);
        }
    };

    // Open modal for new video
    const handleAddNew = () => {
        form.resetFields(); // Reset form ngay lập tức
        setCurrentVideo(null); // Đặt currentVideo thành null trước khi mở modal
        setModalTitle('Add New Video');
        setTimeout(() => setModalVisible(true), 0); // Đợi state cập nhật trước khi hiển thị modal
    };


    // Handle search
    const handleSearch = async () => {
        if (!searchText) {
            fetchVideos();
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get<VideoResponse>(`/api/video?search=${searchText}`);
            setVideos(res.data.videos || []);
        } catch (error) {
            message.error('Search failed');
        } finally {
            setLoading(false);
        }
    };
    const handleModalClose = () => {
        setModalVisible(false);
        form.resetFields();
        setCurrentVideo(null);
    };

    // Table columns
    const columns: ColumnsType<VideoData> = [
        {
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            width: 120,
            render: (text: string) => (
                <img
                    src={text || 'https://via.placeholder.com/120x68'}
                    alt="thumbnail"
                    style={{ width: 120, height: 68, objectFit: 'cover' }}
                />
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: VideoData) => (
                <a href={record.embedUrl} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
            sorter: (a: VideoData, b: VideoData) => a.title.localeCompare(b.title),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: 120,
            filters: categoryFilters,
            onFilter: (value: React.Key | boolean, record: VideoData) =>
                record.category === value.toString(),
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            width: 250,
            render: (tags: string[]) => (
                <span>
                    {(tags || []).map((tag) => (
                        <Tag color="blue" key={tag}>
                            {tag}
                        </Tag>
                    ))}
                </span>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 170,
            render: (text: string) => new Date(text).toLocaleString(),
            sorter: (a: VideoData, b: VideoData) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        },
        {
            title: 'Actions',
            key: 'action',
            width: 150,
            render: (_: any, record: VideoData) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        href={`/video/${record._id}`}
                        target="_blank"
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this video?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="videos-page" style={{ padding: '20px' }}>
            <Row gutter={16} align="middle" style={{ marginBottom: '20px' }}>
                <Col flex="auto">
                    <Title level={2}>Video Management</Title>
                </Col>
                <Col>
                    <Input
                        placeholder="Search videos..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        onPressEnter={handleSearch}
                        style={{ width: 250 }}
                        prefix={<SearchOutlined />}
                        suffix={
                            <Button
                                type="text"
                                icon={<ReloadOutlined />}
                                onClick={fetchVideos}
                                size="small"
                            />
                        }
                    />
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddNew}
                    >
                        Add Video
                    </Button>
                </Col>
            </Row>

            <Card>
                <Table
                    columns={columns}
                    dataSource={videos}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        total: totalVideos,
                        showTotal: (total) => `Total ${total} videos`,
                    }}
                />
            </Card>

            <Modal
                title={modalTitle}
                open={modalVisible}
                onCancel={() => handleModalClose()}
                footer={[
                    <Button key="cancel" onClick={handleModalClose}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={form.submit}>
                        Save
                    </Button>,
                ]}
                width={800}
            >
                <VideoForm
                    form={form}
                    initialData={currentVideo}
                    handleSubmit={handleSubmit}
                />
            </Modal>
        </div>
    );
};

export default VideosPage;