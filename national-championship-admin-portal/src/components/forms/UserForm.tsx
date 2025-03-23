import React, { useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

interface UserFormProps {
    initialValues?: any;
    onSuccess: () => void;
    mode: 'create' | 'edit';
}

const UserForm: React.FC<UserFormProps> = ({ initialValues, onSuccess, mode }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                password: '', // Don't show password in edit mode
            });
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const onFinish = async (values: any) => {
        try {
            if (mode === 'create') {
                await axios.post(`/api/v1/users`, values);
                message.success('User created successfully');
            } else {
                // Don't send password if it's empty
                if (!values.password) {
                    delete values.password;
                }
                await axios.put(`/api/v1/users/${initialValues.id}`, values);
                message.success('User updated successfully');
            }
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error('Error saving user:', error);
            message.error(error.response?.data?.message || 'Failed to save user');
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ role: 'USER' }}
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter a name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Please enter an email' },
                    { type: 'email', message: 'Please enter a valid email' }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[
                    {
                        required: mode === 'create',
                        message: 'Please enter a password'
                    },
                    {
                        min: 6,
                        message: 'Password must be at least 6 characters'
                    }
                ]}
            >
                <Input.Password placeholder={mode === 'edit' ? 'Leave blank to keep current password' : ''} />
            </Form.Item>

            <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select a role' }]}
            >
                <Select>
                    <Option value="USER">User</Option>
                    <Option value="ADMIN">Admin</Option>
                    <Option value="REFEREE">Referee</Option>
                    <Option value="ADMIN">Organizer</Option>

                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    {mode === 'create' ? 'Create User' : 'Update User'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UserForm; 