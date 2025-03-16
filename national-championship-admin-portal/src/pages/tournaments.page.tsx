import { Typography, Table, Button, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const TournamentsPage = () => {
    // Sample data - in a real app, this would come from an API
    const tournaments = [
        {
            id: '1',
            name: 'National Championship 2023',
            year: 2023,
            startDate: '2023-06-01',
            endDate: '2023-07-15',
            status: 'COMPLETED',
        },
        {
            id: '2',
            name: 'National Championship 2024',
            year: 2024,
            startDate: '2024-06-01',
            endDate: '2024-07-15',
            status: 'ONGOING',
        },
        {
            id: '3',
            name: 'Winter Cup 2024',
            year: 2024,
            startDate: '2024-01-10',
            endDate: '2024-02-28',
            status: 'COMPLETED',
        },
        {
            id: '4',
            name: 'Summer Tournament 2024',
            year: 2024,
            startDate: '2024-08-01',
            endDate: '2024-08-30',
            status: 'PREPARING',
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => <a>{text}</a>,
        },
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                switch (status) {
                    case 'PREPARING':
                        color = 'blue';
                        break;
                    case 'ONGOING':
                        color = 'green';
                        break;
                    case 'COMPLETED':
                        color = 'gray';
                        break;
                    case 'CANCELLED':
                        color = 'red';
                        break;
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <a>View</a>
                    <a>Edit</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <Title level={2}>Tournaments</Title>
                <Button type="primary" icon={<PlusOutlined />}>
                    Add Tournament
                </Button>
            </div>
            <Table columns={columns} dataSource={tournaments} rowKey="id" />
        </div>
    );
};

export default TournamentsPage; 