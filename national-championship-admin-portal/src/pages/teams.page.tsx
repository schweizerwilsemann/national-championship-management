import { Typography, Table, Button, Space, Avatar, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;
const { Option } = Select;

const TeamsPage = () => {
    const [selectedTournament, setSelectedTournament] = useState('all');

    // Sample data - in a real app, this would come from an API
    const tournaments = [
        { id: '1', name: 'National Championship 2023' },
        { id: '2', name: 'National Championship 2024' },
        { id: '3', name: 'Winter Cup 2024' },
    ];

    const teams = [
        {
            id: '1',
            name: 'Red Dragons',
            shortName: 'RDG',
            logo: 'https://placehold.co/100x100?text=RDG',
            homeColor: 'red',
            tournamentId: '2',
            tournamentName: 'National Championship 2024',
        },
        {
            id: '2',
            name: 'Blue Eagles',
            shortName: 'BEA',
            logo: 'https://placehold.co/100x100?text=BEA',
            homeColor: 'blue',
            tournamentId: '2',
            tournamentName: 'National Championship 2024',
        },
        {
            id: '3',
            name: 'Green Lions',
            shortName: 'GLI',
            logo: 'https://placehold.co/100x100?text=GLI',
            homeColor: 'green',
            tournamentId: '2',
            tournamentName: 'National Championship 2024',
        },
        {
            id: '4',
            name: 'Yellow Tigers',
            shortName: 'YTG',
            logo: 'https://placehold.co/100x100?text=YTG',
            homeColor: 'yellow',
            tournamentId: '1',
            tournamentName: 'National Championship 2023',
        },
        {
            id: '5',
            name: 'Purple Hawks',
            shortName: 'PHK',
            logo: 'https://placehold.co/100x100?text=PHK',
            homeColor: 'purple',
            tournamentId: '3',
            tournamentName: 'Winter Cup 2024',
        },
    ];

    const filteredTeams = selectedTournament === 'all'
        ? teams
        : teams.filter(team => team.tournamentId === selectedTournament);

    const columns = [
        {
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo',
            render: (logo: string) => <Avatar src={logo} size={40} />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => <a>{text}</a>,
        },
        {
            title: 'Short Name',
            dataIndex: 'shortName',
            key: 'shortName',
        },
        {
            title: 'Home Color',
            dataIndex: 'homeColor',
            key: 'homeColor',
            render: (color: string) => (
                <div
                    style={{
                        backgroundColor: color,
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px'
                    }}
                />
            ),
        },
        {
            title: 'Tournament',
            dataIndex: 'tournamentName',
            key: 'tournamentName',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <a>View Players</a>
                    <a>Edit</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <Title level={2}>Teams</Title>
                <Button type="primary" icon={<PlusOutlined />}>
                    Add Team
                </Button>
            </div>

            <div className="mb-4">
                <span className="mr-2">Filter by Tournament:</span>
                <Select
                    value={selectedTournament}
                    onChange={setSelectedTournament}
                    style={{ width: 300 }}
                >
                    <Option value="all">All Tournaments</Option>
                    {tournaments.map(tournament => (
                        <Option key={tournament.id} value={tournament.id}>
                            {tournament.name}
                        </Option>
                    ))}
                </Select>
            </div>

            <Table columns={columns} dataSource={filteredTeams} rowKey="id" />
        </div>
    );
};

export default TeamsPage; 