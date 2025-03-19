import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

interface PlayerFormProps {
    initialValues?: any;
    onSuccess: () => void;
    mode: 'create' | 'edit';
}

const PlayerForm: React.FC<PlayerFormProps> = ({ initialValues, onSuccess, mode }) => {
    const [form] = Form.useForm();
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTeams();
    }, []);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                birthDate: initialValues.birthDate ? dayjs(initialValues.birthDate) : null,
            });
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/teams`);
            // Ensure teams is always an array
            setTeams(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching teams:', error);
            message.error('Failed to load teams');
            // Initialize with empty array on error
            setTeams([]);
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values: any) => {
        try {
            const formattedValues = {
                ...values,
                birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
            };

            // Handle file upload if present
            if (values.image && values.image.fileList && values.image.fileList.length > 0) {
                const file = values.image.fileList[0].originFileObj;
                const formData = new FormData();
                formData.append('image', file);

                // You might need to handle the image upload separately
                // This is just a placeholder for the image handling logic
            }

            if (mode === 'create') {
                await axios.post(`${import.meta.env.VITE_API_URL}/players`, formattedValues);
                message.success('Player created successfully');
            } else {
                await axios.put(`${import.meta.env.VITE_API_URL}/players/${initialValues.id}`, formattedValues);
                message.success('Player updated successfully');
            }
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error('Error saving player:', error);
            message.error(error.response?.data?.message || 'Failed to save player');
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ position: 'MIDFIELDER', isActive: true }}
        >
            <Form.Item
                name="name"
                label="Player Name"
                rules={[{ required: true, message: 'Please enter a player name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="number"
                label="Jersey Number"
                rules={[{ required: true, message: 'Please enter a jersey number' }]}
            >
                <InputNumber min={1} max={99} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="position"
                label="Position"
                rules={[{ required: true, message: 'Please select a position' }]}
            >
                <Select>
                    <Option value="GOALKEEPER">Goalkeeper</Option>
                    <Option value="DEFENDER">Defender</Option>
                    <Option value="MIDFIELDER">Midfielder</Option>
                    <Option value="FORWARD">Forward</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="birthDate"
                label="Birth Date"
                rules={[{ required: true, message: 'Please select a birth date' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="nationality"
                label="Nationality"
                rules={[{ required: true, message: 'Please enter a nationality' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="teamId"
                label="Team"
                rules={[{ required: true, message: 'Please select a team' }]}
            >
                <Select loading={loading}>
                    {Array.isArray(teams) && teams.map(team => (
                        <Option key={team.id} value={team.id}>
                            {team.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="isActive"
                label="Status"
                rules={[{ required: true, message: 'Please select a status' }]}
            >
                <Select>
                    <Option value={true}>Active</Option>
                    <Option value={false}>Inactive</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="image"
                label="Player Image"
                valuePropName="fileList"
                getValueFromEvent={e => {
                    if (Array.isArray(e)) {
                        return e;
                    }
                    return e?.fileList;
                }}
            >
                <Upload
                    listType="picture"
                    maxCount={1}
                    beforeUpload={() => false}
                >
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    {mode === 'create' ? 'Create Player' : 'Update Player'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default PlayerForm;