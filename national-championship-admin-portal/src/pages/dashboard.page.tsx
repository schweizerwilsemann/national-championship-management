import { useState, useEffect } from 'react';
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
    TableOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import TournamentsPage from './tournaments.page';
import TeamsPage from './teams.page';
import PlayersPage from './players.page';
import MatchesPage from './matches.page';
import GoalsPage from './goals.page';
import StandingsPage from './standings.page';
import UsersPage from './UsersPage';
import { useAuth } from '@/context/auth.context';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// Dashboard home content component
const DashboardHome = () => {
    return (
        <>
            <Title level={2}>Dashboard</Title>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                    <div className="text-blue-500 text-xl mb-2">Total Tournaments</div>
                    <div className="text-3xl font-bold">5</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                    <div className="text-green-500 text-xl mb-2">Active Teams</div>
                    <div className="text-3xl font-bold">24</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
                    <div className="text-purple-500 text-xl mb-2">Upcoming Matches</div>
                    <div className="text-3xl font-bold">12</div>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg shadow-sm">
                    <div className="text-orange-500 text-xl mb-2">Total Players</div>
                    <div className="text-3xl font-bold">352</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <Title level={4}>Recent Tournaments</Title>
                    <p className="text-gray-500">No tournaments found</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <Title level={4}>Upcoming Matches</Title>
                    <p className="text-gray-500">No upcoming matches</p>
                </div>
            </div>
        </>
    );
};

const DashboardPage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

    // Get the current active tab from the URL
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/tournaments')) return 'tournaments';
        if (path.includes('/teams')) return 'teams';
        if (path.includes('/players')) return 'players';
        if (path.includes('/matches')) return 'matches';
        if (path.includes('/goals')) return 'goals';
        if (path.includes('/standings')) return 'standings';
        if (path.includes('/users')) return 'users';
        return 'dashboard';
    };

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

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

    // Set the active tab based on the URL when the component mounts
    useEffect(() => {
        // No need to redirect
    }, []);  // Empty dependency array means this only runs once on mount

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
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
                    position: 'sticky',  // Giữ cố định khi cuộn
                    top: 0,              // Cố định ở đầu trang
                    height: '100vh',     // Chiều cao full màn hình
                    overflow: 'hidden'   // Không cho phép cuộn trong sider
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
                        {
                            key: 'dashboard',
                            icon: <DashboardOutlined />,
                            label: 'Dashboard',
                        },
                        {
                            key: 'tournaments',
                            icon: <TrophyOutlined />,
                            label: 'Tournaments',
                        },
                        {
                            key: 'teams',
                            icon: <TeamOutlined />,
                            label: 'Teams',
                        },
                        {
                            key: 'players',
                            icon: <UserOutlined />,
                            label: 'Players',
                        },
                        {
                            key: 'matches',
                            icon: <CalendarOutlined />,
                            label: 'Matches',
                        },
                        {
                            key: 'goals',
                            icon: <AimOutlined />,
                            label: 'Goals',
                        },
                        {
                            key: 'standings',
                            icon: <TableOutlined />,
                            label: 'Standings',
                        },
                        {
                            key: 'users',
                            icon: <UserOutlined />,
                            label: 'Users',
                        },
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
                        <Route path="*" element={<Navigate to="" replace />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardPage; 