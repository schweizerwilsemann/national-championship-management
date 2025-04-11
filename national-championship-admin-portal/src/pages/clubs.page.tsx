import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Input, Modal, Form, Upload, message, Space, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useSeason } from '@/context/season.context';

// Premier League club is actually a Team entity in the database
interface Club {
    id: string;
    name: string;
    shortName?: string;
    logo?: string;
    founded?: number;
    stadium?: string;
    address?: string;
    city?: string;
    country: string;
    latitude?: number;
    longitude?: number;
    website?: string;
    description?: string;
    homeColor?: string;
    tournamentId: string;
    createdAt: string;
    updatedAt: string;
}

interface Tournament {
    id: string;
    name: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ClubsPage = () => {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentClub, setCurrentClub] = useState<Club | null>(null);
    const [form] = Form.useForm();
    const { currentSeason } = useSeason();

    const fetchTournaments = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/tournaments`);
            setTournaments(data);
        } catch (error) {
            console.error('Error fetching tournaments:', error);
            message.error('Failed to fetch tournaments');
        }
    };

    const fetchClubs = async () => {
        setLoading(true);
        try {
            let endpoint = `${API_URL}/teams`;
            if (currentSeason?.id) {
                endpoint = `${API_URL}/teams/tournament/${currentSeason.id}`;
            }
            const { data } = await axios.get(endpoint);
            setClubs(data);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            message.error('Failed to fetch clubs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTournaments();
        fetchClubs();
    }, [currentSeason]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/teams`, {
                params: { search: searchQuery }
            });
            setClubs(data);
        } catch (error) {
            console.error('Error searching clubs:', error);
            message.error('Failed to search clubs');
        } finally {
            setLoading(false);
        }
    };

    const showCreateModal = () => {
        setIsEditMode(false);
        setCurrentClub(null);
        form.resetFields();
        if (currentSeason?.id) {
            form.setFieldsValue({ tournamentId: currentSeason.id });
        }
        setIsModalVisible(true);
    };

    const showEditModal = (club: Club) => {
        setIsEditMode(true);
        setCurrentClub(club);
        form.setFieldsValue({
            name: club.name,
            shortName: club.shortName,
            logo: club.logo,
            founded: club.founded,
            stadium: club.stadium,
            address: club.address,
            city: club.city,
            country: club.country,
            latitude: club.latitude,
            longitude: club.longitude,
            website: club.website,
            description: club.description,
            homeColor: club.homeColor,
            tournamentId: club.tournamentId
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = async (values: any) => {
        try {
            if (isEditMode && currentClub) {
                await axios.patch(`${API_URL}/teams/${currentClub.id}`, values);
                message.success('Club updated successfully');
            } else {
                await axios.post(`${API_URL}/teams`, values);
                message.success('Club created successfully');
            }
            setIsModalVisible(false);
            fetchClubs();
        } catch (error) {
            console.error('Error saving club:', error);
            message.error('Failed to save club');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/teams/${id}`);
            message.success('Club deleted successfully');
            fetchClubs();
        } catch (error) {
            console.error('Error deleting club:', error);
            message.error('Failed to delete club');
        }
    };

    const uploadProps: UploadProps = {
        name: 'file',
        action: `${API_URL}/upload`,
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                form.setFieldsValue({ logo: info.file.response.url });
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const columns = [
        {
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo',
            render: (logo: string) => logo ?
                <img src={logo} alt="Club logo" style={{ width: 50, height: 50, objectFit: 'contain' }} /> :
                <div style={{ width: 50, height: 50, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Logo</div>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Club, b: Club) => a.name.localeCompare(b.name),
        },
        {
            title: 'Short Name',
            dataIndex: 'shortName',
            key: 'shortName',
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: 'Stadium',
            dataIndex: 'stadium',
            key: 'stadium',
        },
        {
            title: 'Founded',
            dataIndex: 'founded',
            key: 'founded',
            sorter: (a: Club, b: Club) => {
                if (!a.founded) return -1;
                if (!b.founded) return 1;
                return a.founded - b.founded;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Club) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                        type="primary"
                        ghost
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                        danger
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Premier League Clubs</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showCreateModal}
                >
                    Add New Club
                </Button>
            </div>

            <div className="mb-6 flex">
                <Input
                    placeholder="Search clubs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onPressEnter={handleSearch}
                    prefix={<SearchOutlined />}
                    className="mr-2"
                />
                <Button type="primary" onClick={handleSearch}>
                    Search
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={clubs}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={isEditMode ? 'Edit Club' : 'Add New Club'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Club Name"
                        rules={[{ required: true, message: 'Please enter club name' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="shortName"
                        label="Short Name"
                    >
                        <Input maxLength={10} />
                    </Form.Item>

                    <Form.Item
                        name="logo"
                        label="Logo URL"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="logoUpload"
                        label="Upload Logo"
                    >
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="founded"
                        label="Founded Year"
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        name="stadium"
                        label="Stadium"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Address"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="city"
                        label="City"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="country"
                        label="Country"
                        initialValue="England"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="homeColor"
                        label="Home Kit Color"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="latitude"
                        label="Latitude (for Google Maps)"
                    >
                        <Input type="number" step="0.000001" />
                    </Form.Item>

                    <Form.Item
                        name="longitude"
                        label="Longitude (for Google Maps)"
                    >
                        <Input type="number" step="0.000001" />
                    </Form.Item>

                    <Form.Item
                        name="website"
                        label="Website"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="tournamentId"
                        label="Tournament"
                        rules={[{ required: true, message: 'Please select a tournament' }]}
                    >
                        <Select>
                            {tournaments.map(tournament => (
                                <Select.Option key={tournament.id} value={tournament.id}>
                                    {tournament.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <div className="flex justify-end">
                            <Button onClick={handleCancel} className="mr-2">
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {isEditMode ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ClubsPage;

