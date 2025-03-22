import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { UploadFile } from 'antd/es/upload/interface';

const { Option } = Select;

interface TeamFormProps {
    initialValues?: any;
    onSuccess: () => void;
    mode: 'create' | 'edit';
}

const TeamForm: React.FC<TeamFormProps> = ({ initialValues, onSuccess, mode }) => {
    const [form] = Form.useForm();
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        fetchTournaments();
    }, []);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
            });

            // Set file list if logo is available
            if (initialValues.logo) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'logo.png',
                        status: 'done',
                        url: initialValues.logo,
                    },
                ]);
            }
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [initialValues, form]);

    const fetchTournaments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/v1/tournaments`);
            // Ensure tournaments is always an array
            setTournaments(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching tournaments:', error);
            message.error('Failed to load tournaments');
            setTournaments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
    };

    const onFinish = async (values: any) => {
        try {
            const formattedValues = { ...values };

            // Handle file upload
            if (fileList.length > 0 && fileList[0].originFileObj) {
                const formData = new FormData();
                formData.append('file', fileList[0].originFileObj);

                // First upload the file
                const uploadResponse = await axios.post(`/api/v1/upload`, formData);

                // Then add the logo URL to the formattedValues
                if (uploadResponse.data && uploadResponse.data.url) {
                    formattedValues.logo = uploadResponse.data.url;
                }
            }

            if (mode === 'create') {
                await axios.post(`/api/v1/teams`, formattedValues);
                message.success('Team created successfully');
            } else {
                await axios.put(`/api/v1/teams/${initialValues.id}`, formattedValues);
                message.success('Team updated successfully');
            }
            form.resetFields();
            setFileList([]);
            onSuccess();
        } catch (error: any) {
            console.error('Error saving team:', error);
            message.error(error.response?.data?.message || 'Failed to save team');
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item
                name="name"
                label="Team Name"
                rules={[{ required: true, message: 'Please enter a team name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="shortName"
                label="Short Name"
                rules={[{ required: true, message: 'Please enter a short name' }]}
            >
                <Input maxLength={3} />
            </Form.Item>

            <Form.Item
                name="tournamentId"
                label="Tournament"
                rules={[{ required: true, message: 'Please select a tournament' }]}
            >
                <Select loading={loading}>
                    {Array.isArray(tournaments) && tournaments.map(tournament => (
                        <Option key={tournament.id} value={tournament.id}>
                            {tournament.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="logo"
                label="Team Logo"
            >
                <Upload
                    name="logo"
                    listType="picture"
                    maxCount={1}
                    beforeUpload={() => false}
                    fileList={fileList}
                    onChange={handleFileChange}
                >
                    <Button icon={<UploadOutlined />}>Upload Logo</Button>
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    {mode === 'create' ? 'Create Team' : 'Update Team'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default TeamForm;

