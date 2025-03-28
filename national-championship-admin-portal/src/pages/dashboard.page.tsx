import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Button } from 'antd';
import {
    DashboardOutlined,
    TeamOutlined,
    TrophyOutlined,
    CalendarOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AimOutlined,
    TableOutlined,
    VideoCameraAddOutlined,
    VideoCameraFilled
} from '@ant-design/icons';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import Chart from 'chart.js/auto';
import axios from 'axios';

// Import types for better type safety
import {
    Tournament,
    Team,
    Match,
    Player,
    User,
    DashboardStats
} from '@/types/models';

// Import page components with type safety
import TournamentsPage from './tournaments.page';
import TeamsPage from './teams.page';
import PlayersPage from './players.page';
import MatchesPage from './matches.page';
import GoalsPage from './goals.page';
import StandingsPage from './standings.page';
import UsersPage from './users.page';
import { useAuth } from '@/context/auth.context';
import ProfilePage from './profile.page';
import VideosStatsPage from './video.stats.page';
import VideosPage from './video.page';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// Dashboard Home Component
const DashboardHome: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        tournaments: 0,
        teams: 0,
        matches: 0,
        players: 0
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [playersData, setPlayersData] = useState<Player[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all tournaments
                const tournamentsRes = await axios.get<Tournament[]>('/api/v1/tournaments');
                const tournaments = tournamentsRes.data;

                // Get ongoing tournament (assuming we want the first ongoing one)
                const ongoingTournament = tournaments.find(t => t.status === 'ONGOING') || tournaments[0];

                if (ongoingTournament) {
                    // Fetch related data for the ongoing tournament
                    const [teamsRes, matchesRes, playersRes] = await Promise.all([
                        axios.get<Team[]>(`/api/v1/teams/tournament/${ongoingTournament?.id}`),
                        axios.get<{ data: Match[], meta: { total: number } }>(`/api/v1/matches/${ongoingTournament?.id}/scheduled`),
                        axios.get<{ data: Player[], meta: { total: number } }>('/api/v1/players', {
                            params: { page: 1, pageSize: 1000 }
                        })
                    ]);

                    // Store players data for chart
                    setPlayersData(playersRes.data.data || []);

                    // Ensure matchesRes.data.meta.total exists, default to 0 if not
                    const matchesTotal = matchesRes.data?.meta?.total ?? 0;

                    setStats({
                        tournaments: tournaments.length,
                        teams: teamsRes.data.length,
                        matches: matchesTotal,
                        players: playersRes.data?.meta?.total ?? 0
                    });

                    initializeCharts(teamsRes.data, playersRes.data.data || []);
                } else {
                    // If no ongoing tournament, set default stats
                    setStats({
                        tournaments: tournaments.length,
                        teams: 0,
                        matches: 0,
                        players: 0
                    });
                }
            } catch (error: any) {
                console.error('Error fetching dashboard data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const initializeCharts = (teams: Team[], players: Player[]) => {
        // Team Distribution Chart
        const teamChartCtx = document.getElementById('teamChart') as HTMLCanvasElement | null;
        if (teamChartCtx) {
            new Chart(teamChartCtx.getContext('2d')!, {
                type: 'pie',
                data: {
                    labels: teams.map(t => t.name),
                    datasets: [{
                        data: teams.map(() => 1),
                        backgroundColor: teams.map(() => `hsl(${Math.random() * 360}, 70%, 50%)`)
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'right' },
                        title: { display: true, text: 'Teams Distribution' }
                    }
                }
            });
        }

        // Player Age Distribution Chart
        const playerChartCtx = document.getElementById('playerChart') as HTMLCanvasElement | null;
        if (playerChartCtx && players.length > 0) {
            // Group players by age ranges
            const ageRanges: Record<string, number> = {
                'Under 20': 0,
                '20-25': 0,
                '26-30': 0,
                '31-35': 0,
                'Over 35': 0
            };

            players.forEach(player => {
                const age = player.age || 0;
                if (age < 20) ageRanges['Under 20']++;
                else if (age >= 20 && age < 26) ageRanges['20-25']++;
                else if (age >= 26 && age < 31) ageRanges['26-30']++;
                else if (age >= 31 && age < 36) ageRanges['31-35']++;
                else if (age >= 36) ageRanges['Over 35']++;
            });

            new Chart(playerChartCtx.getContext('2d')!, {
                type: 'bar',
                data: {
                    labels: Object.keys(ageRanges),
                    datasets: [{
                        label: 'Players by Age Group',
                        data: Object.values(ageRanges),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Players'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Player Age Distribution'
                        }
                    }
                }
            });
        }
    };

    // Error handling in the render
    if (error) {
        return (
            <div>
                <Title level={2}>Dashboard Error</Title>
                <p>Unable to load dashboard data: {error}</p>
            </div>
        );
    }

    return (
        <>
            <Title level={2}>Dashboard</Title>
            {loading ? (
                <p>Loading dashboard data...</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                            <div className="text-blue-500 text-xl mb-2">Total Tournaments</div>
                            <div className="text-3xl font-bold">{stats.tournaments}</div>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                            <div className="text-green-500 text-xl mb-2">Active Teams</div>
                            <div className="text-3xl font-bold">{stats.teams}</div>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
                            <div className="text-purple-500 text-xl mb-2">Scheduled Matches</div>
                            <div className="text-3xl font-bold">{stats.matches}</div>
                        </div>
                        <div className="bg-orange-50 p-6 rounded-lg shadow-sm">
                            <div className="text-orange-500 text-xl mb-2">Total Players</div>
                            <div className="text-3xl font-bold">{stats.players}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <Title level={4}>Team Distribution</Title>
                            <canvas id="teamChart" height="200"></canvas>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <Title level={4}>Player Age Distribution</Title>
                            <canvas id="playerChart" height="200"></canvas>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

// Dashboard Page Component
const DashboardPage: React.FC = () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

    const getActiveTab = (): string => {
        const path = location.pathname;
        if (path.includes('/tournaments')) return 'tournaments';
        if (path.includes('/teams')) return 'teams';
        if (path.includes('/players')) return 'players';
        if (path.includes('/matches')) return 'matches';
        if (path.includes('/goals')) return 'goals';
        if (path.includes('/standings')) return 'standings';
        if (path.includes('/users')) return 'users';
        if (path.includes('/videos-page')) return 'videos-page';
        if (path.includes('/videos-stats')) return 'videos-stats';
        return 'dashboard';
    };

    const toggleCollapsed = useCallback(() => {
        setCollapsed(prev => !prev);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleMenuClick = (key: string) => {
        if (key === 'dashboard') {
            navigate('/dashboard');
        } else {
            navigate(`/dashboard/${key}`);
        }
    };

    const handleNavigateToProfile = () => {
        navigate('/dashboard/profile');
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
            onClick: handleNavigateToProfile,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="dark"
                width={250}
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    overflow: 'hidden'
                }}
            >
                <div className="p-4 flex items-center justify-center">
                    <img
                        src="/src/assets/Premier-League-Logo.png"
                        alt="Championship Logo"
                        className={`
                        transition-all duration-500 ease-in-out
                        ${collapsed ? 'w-8 rotate-180 scale-90' : 'w-32 hover:scale-110'}
                        filter drop-shadow-lg hover:drop-shadow-2xl
                        cursor-pointer
                        rounded-lg
                        hover:brightness-110
                        transform hover:-translate-y-1
                        bg-teal-100
                    `}
                    />
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[getActiveTab()]}
                    onClick={({ key }) => handleMenuClick(key as string)}
                    items={[
                        { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
                        { key: 'tournaments', icon: <TrophyOutlined />, label: 'Tournaments' },
                        { key: 'teams', icon: <TeamOutlined />, label: 'Teams' },
                        { key: 'players', icon: <UserOutlined />, label: 'Players' },
                        { key: 'matches', icon: <CalendarOutlined />, label: 'Matches' },
                        { key: 'goals', icon: <AimOutlined />, label: 'Goals' },
                        { key: 'standings', icon: <TableOutlined />, label: 'Standings' },
                        { key: 'users', icon: <UserOutlined />, label: 'Users' },
                        { key: 'videos-page', icon: <VideoCameraFilled />, label: 'Videos' },
                        { key: 'videos-stats', icon: <VideoCameraAddOutlined />, label: 'Videos Statistics' },
                    ]}
                />
            </Sider>
            <Layout>
                <Header className="bg-white p-0 flex justify-between items-center px-4 shadow-sm">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={toggleCollapsed}
                        className="text-xl"
                    />
                    <div className="flex items-center">
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <div className="flex items-center cursor-pointer">
                                <span className="mr-3 hidden md:inline">{user?.name || 'Admin User'}</span>
                                <Avatar icon={<UserOutlined />} />
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                <Content className="m-6 p-6 bg-white rounded-lg">
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="tournaments" element={<TournamentsPage />} />
                        <Route path="teams" element={<TeamsPage />} />
                        <Route path="players" element={<PlayersPage />} />
                        <Route path="matches" element={<MatchesPage />} />
                        <Route path="goals" element={<GoalsPage />} />
                        <Route path="standings" element={<StandingsPage />} />
                        <Route path="users" element={<UsersPage />} />
                        <Route path='profile' element={<ProfilePage />} />
                        <Route path='videos-stats' element={<VideosStatsPage />} />
                        <Route path='videos-page' element={<VideosPage />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardPage;   