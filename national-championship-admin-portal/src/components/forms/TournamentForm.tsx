import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

interface TournamentFormProps {
    initialValues?: any;
    onSuccess: () => void;
    mode: 'create' | 'edit';
}

const TournamentForm: React.FC<TournamentFormProps> = ({ initialValues, onSuccess, mode }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                startDate: initialValues.startDate ? dayjs(initialValues.startDate) : null,
                endDate: initialValues.endDate ? dayjs(initialValues.endDate) : null,
            });
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const onFinish = async (values: any) => {
        try {
            const formattedValues = {
                ...values,
                startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
                endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
            };

            if (mode === 'create') {
                await axios.post(`${import.meta.env.VITE_API_URL}/tournaments`, formattedValues);
                message.success('Tournament created successfully');
            } else {
                await axios.put(`${import.meta.env.VITE_API_URL}/tournaments/${initialValues.id}`, formattedValues);
                message.success('Tournament updated successfully');
            }
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error('Error saving tournament:', error);
            message.error(error.response?.data?.message || 'Failed to save tournament');
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
                label="Tournament Name"
                rules={[{ required: true, message: 'Please enter a tournament name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter a description' }]}
            >
                <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: 'Please enter a location' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: 'Please select a start date' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: 'Please select an end date' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    {mode === 'create' ? 'Create Tournament' : 'Update Tournament'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default TournamentForm; 