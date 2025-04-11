import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { SeasonSelector } from '@/components/SeasonSelector';
import { useSeason } from '@/context/season.context';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// Debounce function to prevent excessive API calls
const useDebounce = (value: any, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set debouncedValue to value after the specified delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cancel the timeout if value changes within the delay period
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

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
    const { currentSeason } = useSeason();
    const dataFetchTimestampRef = useRef<number>(0);
    const chartsInitializedRef = useRef<boolean>(false);

    // Function to retrieve cached data with expiration check
    const getCachedData = useCallback(() => {
        try {
            const cachedData = localStorage.getItem('dashboardData');
            const cachedTimestamp = localStorage.getItem('dashboardDataTimestamp');

            if (cachedData && cachedTimestamp) {
                const data = JSON.parse(cachedData);
                const timestamp = parseInt(cachedTimestamp, 10);
                const now = Date.now();

                // Cache valid for 5 minutes (300000 ms)
                if (now - timestamp < 300000 && data.stats.tournaments > 0) {
                    return {
                        stats: data.stats,
                        playersData: data.playersData,
                        timestamp: timestamp
                    };
                }
            }
            return null;
        } catch (error) {
            console.error('Error reading from cache:', error);
            return null;
        }
    }, []);

    // Function to save data to cache
    const cacheData = useCallback((data: { stats: DashboardStats, playersData: Player[] }) => {
        try {
            localStorage.setItem('dashboardData', JSON.stringify(data));
            localStorage.setItem('dashboardDataTimestamp', Date.now().toString());
        } catch (error) {
            console.error('Error saving to cache:', error);
        }
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Try to get data from cache first
            const cachedData = getCachedData();

            if (cachedData) {
                setStats(cachedData.stats);
                setPlayersData(cachedData.playersData);
                dataFetchTimestampRef.current = cachedData.timestamp;
                setLoading(false);

                // Initialize charts with cached data
                if (!chartsInitializedRef.current && cachedData.playersData.length > 0) {
                    setTimeout(() => {
                        const teams = Array.isArray(cachedData.stats.teamsData) ? cachedData.stats.teamsData : [];
                        initializeCharts(teams, cachedData.playersData);
                        chartsInitializedRef.current = true;
                    }, 100);
                }
                return;
            }

            // If no valid cached data, fetch from API
            try {
                setLoading(true);
                // Fetch all tournaments
                const tournamentsRes = await axios.get<Tournament[]>('/api/v1/tournaments');
                const tournaments = tournamentsRes.data;

                // Get current season from context or fallback to the first tournament
                const activeTournament = currentSeason ||
                    (tournaments.find(t => t.status === 'ONGOING') || tournaments[0]);

                if (activeTournament) {
                    // Fetch related data for the active tournament
                    const [teamsRes, matchesRes, playersRes] = await Promise.all([
                        axios.get<Team[]>(`/api/v1/teams/tournament/${activeTournament?.id}`),
                        axios.get<{ data: Match[], meta: { total: number } }>(`/api/v1/matches/${activeTournament?.id}/scheduled`),
                        axios.get<{ data: Player[], meta: { total: number } }>('/api/v1/players', {
                            params: { page: 1, pageSize: 1000 }
                        })
                    ]);

                    // Store players data for chart
                    const players = playersRes.data.data || [];
                    setPlayersData(players);

                    // Ensure matchesRes.data.meta.total exists, default to 0 if not
                    const matchesTotal = matchesRes.data?.meta?.total ?? 0;

                    const newStats = {
                        tournaments: tournaments.length,
                        teams: teamsRes.data.length,
                        matches: matchesTotal,
                        players: playersRes.data?.meta?.total ?? 0,
                        teamsData: teamsRes.data // Store teams data for charts
                    };

                    setStats(newStats as DashboardStats);

                    // Cache the fetched data
                    cacheData({ stats: newStats as DashboardStats, playersData: players });

                    // Update timestamp
                    dataFetchTimestampRef.current = Date.now();

                    // Initialize charts once data is loaded
                    if (!chartsInitializedRef.current) {
                        setTimeout(() => {
                            initializeCharts(teamsRes.data, players);
                            chartsInitializedRef.current = true;
                        }, 100);
                    }
                } else {
                    // If no active tournament, set default stats
                    const newStats = {
                        tournaments: tournaments.length,
                        teams: 0,
                        matches: 0,
                        players: 0,
                        teamsData: []
                    };

                    setStats(newStats as DashboardStats);
                    cacheData({ stats: newStats as DashboardStats, playersData: [] });
                }
            } catch (error: any) {
                console.error('Error fetching dashboard data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();

        // Setup refresh interval - refresh data every 5 minutes
        const intervalId = setInterval(() => {
            // Only trigger a refresh if the component is still mounted
            if (document.getElementById('teamChart') || document.getElementById('playerChart')) {
                fetchDashboardData();
            }
        }, 300000); // 5 minutes

        return () => {
            clearInterval(intervalId);
        };
    }, [currentSeason, getCachedData, cacheData]);

    const initializeCharts = (teams: Team[], players: Player[]) => {
        // First destroy any existing charts to prevent memory leaks
        const teamChartCtx = document.getElementById('teamChart') as HTMLCanvasElement | null;
        const playerChartCtx = document.getElementById('playerChart') as HTMLCanvasElement | null;

        if (teamChartCtx) {
            const existingChart = Chart.getChart(teamChartCtx);
            if (existingChart) {
                existingChart.destroy();
            }

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
        if (playerChartCtx && players.length > 0) {
            const existingChart = Chart.getChart(playerChartCtx);
            if (existingChart) {
                existingChart.destroy();
            }

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
    const { currentSeason } = useSeason();
    const toggleCountRef = useRef<number>(0);
    const lastNavigationRef = useRef<string>('');

    // Add state for component refresh trigger
    const [refreshKey, setRefreshKey] = useState<number>(0);

    // Debounce the refresh key to avoid multiple rapid refreshes
    const debouncedRefreshKey = useDebounce(refreshKey, 500);

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
        // Just collapse the sidebar without triggering refreshes
        setCollapsed(prev => !prev);

        // Only trigger a refresh if there's an actual data issue when toggling multiple times
        // This reduces unnecessary API calls
        if (toggleCountRef.current > 5) {
            setRefreshKey(prev => prev + 1);
            toggleCountRef.current = 0;
        } else {
            toggleCountRef.current += 1;
        }
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleMenuClick = (key: string) => {
        // Store the current tab before changing
        const previousTab = getActiveTab();

        // Skip refresh if user clicks the same tab they're already on
        if (previousTab === key && lastNavigationRef.current === key) {
            return;
        }

        // Save the last navigation
        lastNavigationRef.current = key;

        // Navigate to the new tab
        if (key === 'dashboard') {
            navigate('/dashboard');
        } else {
            navigate(`/dashboard/${key}`);
        }

        // Only refresh if changing to a different tab
        if (previousTab !== key) {
            setRefreshKey(prev => prev + 1);
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
        <Layout style={{ minHeight: '100vh' }} key={debouncedRefreshKey}>
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
                <Header className="bg-gradient-to-r from-blue-50 to-white p-0 shadow-sm flex items-center justify-between px-6">
                    <div className="flex items-center">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={toggleCollapsed}
                            className="text-xl mr-2"
                        />

                        {currentSeason && (
                            <div className="ml-8 flex items-center">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 mb-1 font-medium">Current Season</span>
                                    <SeasonSelector />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <div className="flex items-center cursor-pointer">
                                <span className="mr-3 hidden md:inline font-medium">{user?.name || 'Admin User'}</span>
                                <Avatar icon={<UserOutlined />} className="bg-blue-500" />
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
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="videos-page" element={<VideosPage />} />
                        <Route path="videos-stats" element={<VideosStatsPage />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardPage;   