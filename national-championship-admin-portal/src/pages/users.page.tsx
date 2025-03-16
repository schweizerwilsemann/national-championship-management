import { Typography, Table, Button, Space, Tag, Select, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;
const { Option } = Select;

const UsersPage = () => {
    const [selectedRole, setSelectedRole] = useState('all');
    const [searchText, setSearchText] = useState('');

    // Sample data - in a real app, this would come from an API
    const users = [
        {
            id: '1',
            name: 'John Admin',
            email: 'john.admin@example.com',
            role: 'ADMIN',
            createdAt: '2023-01-15',
        },
        {
            id: '2',
            name: 'Sarah Organizer',
            email: 'sarah.organizer@example.com',
            role: 'ORGANIZER',
            createdAt: '2023-02-20',
        },
        {
            id: '3',
            name: 'Mike Referee',
            email: 'mike.referee@example.com',
            role: 'REFEREE',
            createdAt: '2023-03-10',
        },
        {
            id: '4',
            name: 'Lisa Referee',
            email: 'lisa.referee@example.com',
            role: 'REFEREE',
            createdAt: '2023-04-05',
        },
        {
            id: '5',
            name: 'Tom User',
            email: 'tom.user@example.com',
            role: 'USER',
            createdAt: '2023-05-12',
        },
    ];

    // Filter users based on selected role and search text
    const filteredUsers = users.filter(user => {
        if (selectedRole !== 'all' && user.role !== selectedRole) {
            return false;
        }
        if (
            searchText &&
            !user.name.toLowerCase().includes(searchText.toLowerCase()) &&
            !user.email.toLowerCase().includes(searchText.toLowerCase())
        ) {
            return false;
        }
        return true;
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => <a>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => {
                let color = 'default';
                switch (role) {
                    case 'ADMIN':
                        color = 'red';
                        break;
                    case 'ORGANIZER':
                        color = 'green';
                        break;
                    case 'REFEREE':
                        color = 'blue';
                        break;
                    case 'USER':
                        color = 'default';
                        break;
                }
                return <Tag color={color}>{role}</Tag>;
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <a>View</a>
                    <a>Edit</a>
                    {record.role !== 'ADMIN' && <a>Delete</a>}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <Title level={2}>Users</Title>
                <Button type="primary" icon={<PlusOutlined />}>
                    Add User
                </Button>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
                <div>
                    <span className="mr-2">Role:</span>
                    <Select
                        value={selectedRole}
                        onChange={setSelectedRole}
                        style={{ width: 150 }}
                    >
                        <Option value="all">All Roles</Option>
                        <Option value="ADMIN">Admin</Option>
                        <Option value="ORGANIZER">Organizer</Option>
                        <Option value="REFEREE">Referee</Option>
                        <Option value="USER">User</Option>
                    </Select>
                </div>

                <div className="flex-grow">
                    <Input
                        placeholder="Search by name or email"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ maxWidth: 300 }}
                    />
                </div>
            </div>

            <Table columns={columns} dataSource={filteredUsers} rowKey="id" />
        </div>
    );
};

export default UsersPage; 