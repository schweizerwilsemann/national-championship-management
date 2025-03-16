import { Typography, Table, Button, Space, Tag, Select, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const MatchesPage = () => {
    const [selectedTournament, setSelectedTournament] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Sample data - in a real app, this would come from an API
    const tournaments = [
        { id: '1', name: 'National Championship 2023' },
        { id: '2', name: 'National Championship 2024' },
        { id: '3', name: 'Winter Cup 2024' },
    ];

    const matches = [
        {
            id: '1',
            matchday: 1,
            date: '2024-06-01',
            time: '18:00',
            status: 'FINISHED',
            homeTeam: 'Red Dragons',
            awayTeam: 'Blue Eagles',
            homeScore: 2,
            awayScore: 1,
            tournamentId: '2',
            tournamentName: 'National Championship 2024',
        },
        {
            id: '2',
            matchday: 1,
            date: '2024-06-01',
            time: '20:00',
            status: 'FINISHED',
            homeTeam: 'Green Lions',
            awayTeam: 'Yellow Tigers',
            homeScore: 0,
            awayScore: 0,
            tournamentId: '2',
            tournamentName: 'National Championship 2024',
        },
        {
            id: '3',
            matchday: 2,
            date: '2024-06-08',
            time: '18:00',
            status: 'SCHEDULED',
            homeTeam: 'Blue Eagles',
            awayTeam: 'Green Lions',
            homeScore: null,
            awayScore: null,
            tournamentId: '2',
            tournamentName: 'National Championship 2024',
        },
        {
            id: '4',
            matchday: 2,
            date: '2024-06-08',
            time: '20:00',
            status: 'SCHEDULED',
            homeTeam: 'Red Dragons',
            awayTeam: 'Yellow Tigers',
            homeScore: null,
            awayScore: null,
            tournamentId: '2',
            tournamentName: 'National Championship 2024',
        },
        {
            id: '5',
            matchday: 1,
            date: '2024-01-15',
            time: '19:00',
            status: 'FINISHED',
            homeTeam: 'Purple Hawks',
            awayTeam: 'Orange Foxes',
            homeScore: 3,
            awayScore: 2,
            tournamentId: '3',
            tournamentName: 'Winter Cup 2024',
        },
    ];

    // Filter matches based on selected tournament and status
    const filteredMatches = matches.filter(match => {
        if (selectedTournament !== 'all' && match.tournamentId !== selectedTournament) {
            return false;
        }
        if (selectedStatus !== 'all' && match.status !== selectedStatus) {
            return false;
        }
        return true;
    });

    const columns = [
        {
            title: 'Matchday',
            dataIndex: 'matchday',
            key: 'matchday',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Home Team',
            dataIndex: 'homeTeam',
            key: 'homeTeam',
        },
        {
            title: 'Score',
            key: 'score',
            render: (_: any, record: any) => {
                if (record.status === 'SCHEDULED' || record.status === 'POSTPONED') {
                    return 'vs';
                }
                return `${record.homeScore} - ${record.awayScore}`;
            },
        },
        {
            title: 'Away Team',
            dataIndex: 'awayTeam',
            key: 'awayTeam',
        },
        {
            title: 'Tournament',
            dataIndex: 'tournamentName',
            key: 'tournamentName',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                switch (status) {
                    case 'SCHEDULED':
                        color = 'blue';
                        break;
                    case 'LIVE':
                        color = 'green';
                        break;
                    case 'FINISHED':
                        color = 'gray';
                        break;
                    case 'POSTPONED':
                        color = 'orange';
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
                    {record.status === 'SCHEDULED' && <a>Start Match</a>}
                    {record.status === 'LIVE' && <a>End Match</a>}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <Title level={2}>Matches</Title>
                <Button type="primary" icon={<PlusOutlined />}>
                    Add Match
                </Button>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
                <div>
                    <span className="mr-2">Tournament:</span>
                    <Select
                        value={selectedTournament}
                        onChange={setSelectedTournament}
                        style={{ width: 250 }}
                    >
                        <Option value="all">All Tournaments</Option>
                        {tournaments.map(tournament => (
                            <Option key={tournament.id} value={tournament.id}>
                                {tournament.name}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div>
                    <span className="mr-2">Status:</span>
                    <Select
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        style={{ width: 150 }}
                    >
                        <Option value="all">All Statuses</Option>
                        <Option value="SCHEDULED">Scheduled</Option>
                        <Option value="LIVE">Live</Option>
                        <Option value="FINISHED">Finished</Option>
                        <Option value="POSTPONED">Postponed</Option>
                        <Option value="CANCELLED">Cancelled</Option>
                    </Select>
                </div>

                <div>
                    <span className="mr-2">Date Range:</span>
                    <RangePicker />
                </div>
            </div>

            <Table columns={columns} dataSource={filteredMatches} rowKey="id" />
        </div>
    );
};

export default MatchesPage; 