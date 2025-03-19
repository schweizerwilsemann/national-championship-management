import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
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
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
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

    const menuItems = [
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
                    items={menuItems}
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
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout; 