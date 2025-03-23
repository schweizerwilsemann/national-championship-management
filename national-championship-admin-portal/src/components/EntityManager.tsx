import React, { useState, useEffect, ReactNode } from 'react';
import { Tabs, Table, Button, Space, Modal, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useOngoingTour } from '@/context/ongoing.tournament.context';

interface EntityManagerProps {
    entities: {
        key: string;
        name: string;
        endpoint: string;
        columns: any[];
        createForm?: ReactNode | (() => ReactNode);
        editForm?: ReactNode | ((record: any) => ReactNode);
        usePagination?: boolean; // Add this flag to enable pagination for specific entities
    }[];
}
interface ICollapse { }

// Helper function to ensure data is always an array
const ensureArray = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    // If it's an object with values that are arrays (like match data)
    if (typeof data === 'object' && !Array.isArray(data) && Object.values(data).some(Array.isArray)) {
        return Object.values(data).flat();
    }
    // Single object case
    if (typeof data === 'object') return [data];
    return [];
};

const EntityManager: React.FC<EntityManagerProps> = ({ entities }) => {
    const [activeKey, setActiveKey] = useState(entities[0]?.key || '');
    const [data, setData] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'edit'>('create');
    const [currentRecord, setCurrentRecord] = useState<any>(null);
    const [deletedData, setDeletedData] = useState<Record<string, any[]>>({});
    const [formContent, setFormContent] = useState<ReactNode | null>(null);
    const { ongoingTournament } = useOngoingTour();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState(false);

    // Pagination states
    const [pagination, setPagination] = useState<Record<string, { current: number, pageSize: number, total: number }>>({});

    // Initialize loading states
    useEffect(() => {
        const initialLoadingState: Record<string, boolean> = {};
        const initialDataState: Record<string, any[]> = {};
        const initialDeletedDataState: Record<string, any[]> = {};
        const initialPaginationState: Record<string, { current: number, pageSize: number, total: number }> = {};

        entities.forEach(entity => {
            initialLoadingState[entity.key] = false;
            initialDataState[entity.key] = [];
            initialDeletedDataState[entity.key] = [];
            initialPaginationState[entity.key] = { current: 1, pageSize: 10, total: 0 };
        });

        setLoading(initialLoadingState);
        setData(initialDataState);
        setDeletedData(initialDeletedDataState);
        setPagination(initialPaginationState);
    }, [entities]);

    // Update form content when modal visibility or type changes
    useEffect(() => {
        if (isModalVisible) {
            try {
                const entity = entities.find(e => e.key === activeKey);
                if (!entity) return;

                if (modalType === 'create') {
                    if (typeof entity.createForm === 'function') {
                        setFormContent(entity.createForm());
                    } else {
                        setFormContent(entity.createForm);
                    }
                } else {
                    if (typeof entity.editForm === 'function') {
                        setFormContent(entity.editForm(currentRecord));
                    } else {
                        setFormContent(entity.editForm);
                    }
                }
            } catch (error) {
                console.error('Error rendering form:', error);
                message.error('Failed to load form. Please try again.');
                setIsModalVisible(false);
            }
        } else {
            setFormContent(null);
        }
    }, [isModalVisible, modalType, currentRecord, activeKey, entities]);

    const fetchData = async (entityKey: string, page = 1, pageSize = 10) => {
        const entity = entities.find(e => e.key === entityKey);
        if (!entity) return;

        setLoading(prev => ({ ...prev, [entityKey]: true }));
        try {
            let response;
            if (activeKey === "matches" && ongoingTournament?.id) {
                // Include pagination parameters for matches
                response = await axios.get(`/api/v1/${entity.endpoint}/${ongoingTournament.id}`, {
                    params: {
                        page,
                        limit: pageSize // Note: backend uses 'limit' instead of 'pageSize'
                    }
                });
            } else if (activeKey === "matches") {
                response = { data: { data: {}, meta: { total: 0 } } };
            } else if (entity.usePagination) {
                response = await axios.get(`/api/v1/${entity.endpoint}`, {
                    params: {
                        page,
                        pageSize
                    }
                });
            } else {
                response = await axios.get(`/api/v1/${entity.endpoint}`);
            }

            // Special handling for matches which come as grouped objects
            let dataArray;
            if (entity.key === 'matches' && typeof response?.data?.data === 'object' && !Array.isArray(response?.data?.data)) {
                // Extract matches from nested structure (grouped by date)
                dataArray = Object.values(response?.data?.data || {}).flat();
            } else {
                // Normal array handling for other entities
                dataArray = ensureArray(response?.data?.data || response?.data || []);
            }

            setData(prev => {
                // Nếu dữ liệu mới giống dữ liệu cũ, giữ nguyên state để tránh render lại
                if (JSON.stringify(prev[entityKey]) === JSON.stringify(dataArray)) {
                    return prev;
                }
                return { ...prev, [entityKey]: dataArray };
            });

            // Update pagination state if we have meta information
            if (response?.data?.meta) {
                setPagination(prev => ({
                    ...prev,
                    [entityKey]: {
                        current: page,
                        pageSize,
                        total: response.data.meta.total || 0
                    }
                }));
            }
        } catch (error) {
            console.error(`Error fetching ${entity.name}:`, error);
            message.error(`Failed to load ${entity.name.toLowerCase()}`);
            if (!isEditing) {
                setData(prev => ({ ...prev, [entityKey]: [] }));
            }
        } finally {
            setLoading(prev => ({ ...prev, [entityKey]: false }));
        }
    };

    const fetchDeletedData = async (entityKey: string) => {
        const entity = entities.find(e => e.key === entityKey);
        if (!entity || !entity.endpoint.includes('users')) return; // Only users have soft delete

        setLoading(prev => ({ ...prev, [entityKey]: true }));
        try {
            const response = await axios.get(`/api/v1/${entity.endpoint}/deleted/all`);
            // Ensure data is always an array
            const dataArray = ensureArray(response.data);
            setDeletedData(prev => ({ ...prev, [entityKey]: dataArray }));
        } catch (error) {
            console.error(`Error fetching deleted ${entity.name}:`, error);
            setDeletedData(prev => ({ ...prev, [entityKey]: [] }));
        } finally {
            setLoading(prev => ({ ...prev, [entityKey]: false }));
        }
    };

    useEffect(() => {
        if (activeKey) {
            const currentPagination = pagination[activeKey] || { current: 1, pageSize: 10 };
            fetchData(activeKey, currentPagination.current, currentPagination.pageSize);
            fetchDeletedData(activeKey);
        }
    }, [activeKey, isEditing, isCreating])


    const handleTabChange = (key: string) => {
        setActiveKey(key);
    };

    const handleCreate = (entityKey: string) => {
        setIsCreating(true);
        setModalType('create');
        setCurrentRecord(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record: any, entityKey: string) => {
        setIsEditing(true);
        setModalType('edit');
        setCurrentRecord(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string, entityKey: string) => {
        const entity = entities.find(e => e.key === entityKey);
        if (!entity) return;

        try {
            await axios.delete(`/api/v1/${entity.endpoint}/${id}`);
            message.success(`${entity.name} deleted successfully`);

            // After deletion, refresh data with current pagination
            const currentPagination = pagination[entityKey] || { current: 1, pageSize: 10 };
            fetchData(entityKey, currentPagination.current, currentPagination.pageSize);

            if (entity.key === 'users') {
                fetchDeletedData(entityKey);
            }
        } catch (error) {
            console.error(`Error deleting ${entity.name}:`, error);
            message.error(`Failed to delete ${entity.name.toLowerCase()}`);
        }
    };

    const handleRestore = async (id: string, entityKey: string) => {
        const entity = entities.find(e => e.key === entityKey);
        if (!entity) return;

        try {
            await axios.post(`/api/v1/${entity.endpoint}/${id}/restore`);
            message.success(`${entity.name} restored successfully`);

            // After restoration, refresh data with current pagination
            const currentPagination = pagination[entityKey] || { current: 1, pageSize: 10 };
            fetchData(entityKey, currentPagination.current, currentPagination.pageSize);
            fetchDeletedData(entityKey);
        } catch (error) {
            console.error(`Error restoring ${entity.name}:`, error);
            message.error(`Failed to restore ${entity.name.toLowerCase()}`);
        }
    };

    const handleHardDelete = async (id: string, entityKey: string) => {
        const entity = entities.find(e => e.key === entityKey);
        if (!entity) return;

        try {
            await axios.delete(`/api/v1/${entity.endpoint}/${id}/hard`);
            message.success(`${entity.name} permanently deleted`);
            fetchDeletedData(entityKey);
        } catch (error) {
            console.error(`Error permanently deleting ${entity.name}:`, error);
            message.error(`Failed to permanently delete ${entity.name.toLowerCase()}`);
        }
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
        setIsEditing(false);

        // Refresh data with current pagination after modal action
        const currentPagination = pagination[activeKey] || { current: 1, pageSize: 10 };
        fetchData(activeKey, currentPagination.current, currentPagination.pageSize);
        setIsCreating(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setIsEditing(false);
        setIsCreating(false);
    };

    const handleTableChange = (tablePagination: any, entityKey: string) => {
        const { current, pageSize } = tablePagination;
        fetchData(entityKey, current, pageSize);
    };

    const getActionColumn = (entityKey: string) => ({
        title: 'Actions',
        key: 'actions',
        render: (text: string, record: any) => (
            <Space size="small">
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => handleEdit(record, entityKey)}
                />
                <Popconfirm
                    title={`Are you sure you want to delete this ${entities.find(e => e.key === entityKey)?.name.toLowerCase()}?`}
                    onConfirm={() => handleDelete(record.id, entityKey)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                    />
                </Popconfirm>
            </Space>
        ),
    });

    const getDeletedActionColumn = (entityKey: string) => ({
        title: 'Actions',
        key: 'actions',
        render: (text: string, record: any) => (
            <Space size="small">
                <Button
                    type="primary"
                    icon={<UndoOutlined />}
                    size="small"
                    onClick={() => handleRestore(record.id, entityKey)}
                />
                <Popconfirm
                    title={`Are you sure you want to permanently delete this ${entities.find(e => e.key === entityKey)?.name.toLowerCase()}?`}
                    onConfirm={() => handleHardDelete(record.id, entityKey)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                    />
                </Popconfirm>
            </Space>
        ),
    });

    const renderTabContent = (entity: any) => {
        // Ensure we have arrays for data
        const entityData = ensureArray(data[entity.key] || []);
        const entityDeletedData = ensureArray(deletedData[entity.key] || []);
        const entityPagination = pagination[entity.key];

        return (
            <div>
                <div className="mb-4 flex justify-between">
                    <h2 className="text-2xl font-bold">{entity.name} Management</h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleCreate(entity.key)}
                    >
                        Add {entity.name}
                    </Button>
                </div>

                <Table
                    columns={[...entity.columns, getActionColumn(entity.key)]}
                    dataSource={entityData}
                    rowKey="id"
                    loading={loading[entity.key]}
                    pagination={entity.usePagination ? {
                        current: entityPagination?.current || 1,
                        pageSize: entityPagination?.pageSize || 10,
                        total: entityPagination?.total || 0,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100', '1000'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                    } : false}
                    onChange={(pagination) => handleTableChange(pagination, entity.key)}
                />

                {entity.key === 'users' && entityDeletedData.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">Deleted {entity.name}</h3>
                        <Table
                            columns={[...entity.columns, getDeletedActionColumn(entity.key)]}
                            dataSource={entityDeletedData}
                            rowKey="id"
                            loading={loading[entity.key]}
                            pagination={{ pageSize: 5 }}
                        />
                    </div>
                )}
            </div>
        );
    };

    // Ensure tabItems is always an array
    const tabItems = entities.map(entity => ({
        key: entity.key,
        label: entity.name,
        children: renderTabContent(entity),
    }));

    return (
        <div>
            <Tabs activeKey={activeKey} onChange={handleTabChange} items={tabItems} />

            <Modal
                title={`${modalType === 'create' ? 'Create' : 'Edit'} ${entities.find(e => e.key === activeKey)?.name}`}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                footer={null}
            >
                {formContent}
            </Modal>
        </div>
    );
};

export default EntityManager;