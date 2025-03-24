import { FC, useState } from 'react';
import { Form, Input, Select, Row, Col, Typography } from 'antd';
import { VideoData } from '@/types/types';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface VideoFormProps {
    form: any; // Form instance from antd
    initialData?: VideoData | null;
    handleSubmit: (values: any) => Promise<void>;
}

const VideoForm: FC<VideoFormProps> = ({ form, initialData, handleSubmit }) => {
    const [urlError, setUrlError] = useState<string | null>(null);

    // Handle form for tags (converting string to array)
    const normalizeTags = (value: string | string[]): string[] => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        return value.split(',').map(tag => tag.trim());
    };

    // Extract YouTube video ID from various YouTube URL formats
    const extractYoutubeId = (url: string): string | null => {
        if (!url) return null;

        // Try to match different YouTube URL patterns
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/]+)/i,
            /youtube\.com\/shorts\/([^&?\/]+)/i
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    };

    // Handle YouTube URL paste
    const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value.trim();
        setUrlError(null);

        if (!url) return;

        const videoId = extractYoutubeId(url);

        if (videoId) {
            form.setFieldsValue({
                videoId,
                embedUrl: `https://www.youtube.com/embed/${videoId}?si=Kf1P4fzLzTR_gLOy`,
                thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
            });
        } else {
            setUrlError('Could not extract YouTube video ID from this URL');
        }
    };

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={initialData || { category: 'premierLeague' }}
        >
            <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter video title' }]}
            >
                <Input placeholder="Video title" />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
            >
                <TextArea
                    rows={4}
                    placeholder="Video description"
                />
            </Form.Item>

            <Form.Item
                name="youtubeUrl"
                label="YouTube URL"
                help={urlError ? <Text type="danger">{urlError}</Text> : "Paste a YouTube URL to automatically extract the video ID"}
                validateStatus={urlError ? "error" : ""}
            >
                <Input
                    placeholder="https://www.youtube.com/watch?v=9EygzJQXqVk"
                    onChange={handleYoutubeUrlChange}
                />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="videoId"
                        label="YouTube Video ID"
                        rules={[{ required: true, message: 'Please enter YouTube video ID' }]}
                    >
                        <Input
                            placeholder="e.g. puJsFlc0p9A"
                            onChange={(e) => {
                                const videoId = e.target.value.trim();
                                if (videoId) {
                                    form.setFieldsValue({
                                        embedUrl: `https://www.youtube.com/embed/${videoId}?si=Kf1P4fzLzTR_gLOy`,
                                        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
                                    });
                                }
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select category' }]}
                    >
                        <Select placeholder="Select category">
                            <Option value="premierLeague">Premier League</Option>
                            <Option value="premierLeagueNews">News</Option>
                            <Option value="premierLeagueInjuries">Injuries</Option>
                            <Option value="premierLeagueTransfers">Transfers</Option>
                            <Option value="premierLeagueGossip">Gossip</Option>
                            <Option value="premierLeagueStats">Statistics</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="tags"
                label="Tags"
                getValueFromEvent={normalizeTags}
                getValueProps={(value) => ({ value: Array.isArray(value) ? value.join(', ') : value })}
            >
                <Input placeholder="Enter tags separated by commas" />
            </Form.Item>

            <Form.Item
                name="embedUrl"
                label="Embed URL"
                rules={[{ required: true, message: 'Please enter embed URL' }]}
            >
                <Input placeholder="YouTube embed URL" />
            </Form.Item>

            <Form.Item
                name="thumbnail"
                label="Thumbnail URL"
            >
                <Input placeholder="Thumbnail URL" />
            </Form.Item>
        </Form>
    );
};

export default VideoForm;