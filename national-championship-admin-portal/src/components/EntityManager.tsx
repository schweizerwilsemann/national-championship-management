import React, { useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { Tabs, Table, Button, Space, Modal, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined, SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useOngoingTour } from '@/context/ongoing.tournament.context';
import { useSeason } from '@/context/season.context';

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

interface EntityManagerProps {
    entities: {
        key: string;
        name: string;
        endpoint: string;
        columns: any[];
        createForm?: ReactNode | (() => ReactNode);
        editForm?: ReactNode | ((record: any) => ReactNode);
        usePagination?: boolean;
        extraParams?: Record<string, any>;
        title?: string;
    }[];
}

// Helper function to ensure data is always an array
const ensureArray = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    // If it's an object with values that are arrays (like match data)
    if (typeof data === 'object' && !Array.isArray(data) && Object.values(data).some(Array.isArray)) {
        return Object.values(data).flat().filter(Boolean);
    }
    // Single object case
    if (typeof data === 'object') return [data];
    return [];
};

// Create interface for match to fix type issues
interface MatchData {
    id: string;
    date?: string | Date;
    homeTeam?: { name?: string; logo?: string };
    awayTeam?: { name?: string; logo?: string };
    status?: string;
    homeScore?: number;
    awayScore?: number;
    [key: string]: any; // Allow for other properties
}

// Specialized function to process matches data which has a different structure
const processMatchesData = (data: any): MatchData[] => {
    if (!data) return [];

    // Handle grouped by date format (coming from matches endpoint)
    if (typeof data?.data === 'object' && !Array.isArray(data.data)) {
        const matchArrays = Object.values(data.data || {});
        return matchArrays.flat().filter(Boolean).map((match: any) => ({
            ...match,
            // Add these properties to standardize with other entities
            homeTeamName: match.homeTeam?.name || 'Unknown',
            awayTeamName: match.awayTeam?.name || 'Unknown',
            // Use a consistent date format for display
            matchDate: match.date ? new Date(match.date).toLocaleDateString() : 'TBD'
        }));
    }

    // Handle regular array format
    if (data?.data && Array.isArray(data.data)) {
        return data.data.map((match: MatchData) => ({
            ...match,
            homeTeamName: match.homeTeam?.name || 'Unknown',
            awayTeamName: match.awayTeam?.name || 'Unknown',
            matchDate: match.date ? new Date(match.date.toString()).toLocaleDateString() : 'TBD'
        }));
    }

    // If data itself is an array
    if (Array.isArray(data)) {
        return data.map((match: MatchData) => ({
            ...match,
            homeTeamName: match.homeTeam?.name || 'Unknown',
            awayTeamName: match.awayTeam?.name || 'Unknown',
            matchDate: match.date ? new Date(match.date.toString()).toLocaleDateString() : 'TBD'
        }));
    }

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
    const { currentSeason } = useSeason();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState(false);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const dataFetchTimestampRef = useRef<Record<string, number>>({});
    const refreshKeyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastRefreshTimeRef = useRef<number>(0);

    // Debounce refreshKey to avoid multiple rapid API calls
    const debouncedRefreshKey = useDebounce(refreshKey, 300);

    // Pagination states
    const [pagination, setPagination] = useState<Record<string, { current: number, pageSize: number, total: number }>>({});

    // Prevent multiple rapid changes to refreshKey
    const safeRefresh = useCallback(() => {
        const now = Date.now();
        // Only allow a refresh every 2 seconds to prevent excessive API calls
        if (now - lastRefreshTimeRef.current > 2000) {
            if (refreshKeyTimeoutRef.current) {
                clearTimeout(refreshKeyTimeoutRef.current);
            }
            refreshKeyTimeoutRef.current = setTimeout(() => {
                setRefreshKey(prev => prev + 1);
                lastRefreshTimeRef.current = now;
            }, 300);
        }
    }, []);

    // Initialize loading states when entities change
    useEffect(() => {
        const initialLoadingState: Record<string, boolean> = {};
        const initialDataState: Record<string, any[]> = {};
        const initialDeletedDataState: Record<string, any[]> = {};
        const initialPaginationState: Record<string, { current: number, pageSize: number, total: number }> = {};
        const initialTimestamps: Record<string, number> = {};

        entities.forEach(entity => {
            initialLoadingState[entity.key] = false;
            initialDataState[entity.key] = [];
            initialDeletedDataState[entity.key] = [];
            initialPaginationState[entity.key] = { current: 1, pageSize: 10, total: 0 };
            initialTimestamps[entity.key] = 0;
        });

        setLoading(initialLoadingState);
        setData(initialDataState);
        setDeletedData(initialDeletedDataState);
        setPagination(initialPaginationState);
        dataFetchTimestampRef.current = initialTimestamps;
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

    const fetchData = useCallback(async (entityKey: string, page = 1, pageSize = 10) => {
        const entity = entities.find(e => e.key === entityKey);
        if (!entity) return;

        // Generate a cache key based on all request parameters
        // Include page and pageSize in the cache key to separate different pages
        const cacheKey = `${entityKey}_${page}_${pageSize}_${JSON.stringify(entity.extraParams || {})}_${currentSeason?.id || ''}`;

        // Check if this exact request was made recently (within last 3 seconds)
        const now = Date.now();
        const lastFetchTime = dataFetchTimestampRef.current[cacheKey] || 0;
        if (now - lastFetchTime < 3000) {
            console.log(`Skipping duplicate request for ${entityKey} - too soon`);
            return;
        }

        // Update timestamp for this specific request
        dataFetchTimestampRef.current[cacheKey] = now;

        // Special handling for matches - no need to fetch if no tournament is selected
        if (entityKey === 'matches') {
            const tournamentId = entity.extraParams?.tournamentId || ongoingTournament?.id;
            if (!tournamentId) {
                console.log('No tournament selected for matches, skipping fetch');
                setData(prev => ({ ...prev, [entityKey]: [] }));
                setLoading(prev => ({ ...prev, [entityKey]: false }));
                return;
            }

            // Update extraParams with the current tournament ID if needed
            if (ongoingTournament?.id && !entity.extraParams?.tournamentId) {
                entity.extraParams = {
                    ...(entity.extraParams || {}),
                    tournamentId: ongoingTournament.id
                };
            }
        }

        // Special case for matches endpoint - check if already called
        if (entityKey === 'matches') {
            // Generate a more specific cache key for matches
            const matchesCacheKey = `${entityKey}_${page}_${pageSize}_${JSON.stringify(entity.extraParams || {})}_${currentSeason?.id || ''}`;

            // Check if this exact request was made recently
            if (now - lastFetchTime < 5000) { // Use a longer timeout for matches (5 seconds)
                console.log('Skipping duplicate matches request - too soon');
                return;
            }
        }

        try {
            // Try to get data from localStorage cache first
            try {
                const cachedData = localStorage.getItem(cacheKey);
                const cachedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

                if (cachedData && cachedTimestamp) {
                    const parsedData = JSON.parse(cachedData);
                    const timestamp = parseInt(cachedTimestamp, 10);
                    const now = Date.now();

                    // Cache valid for 2 minutes (120000 ms)
                    if (now - timestamp < 120000 && Array.isArray(parsedData) && parsedData.length > 0) {
                        // Use cached data
                        console.log(`Using cached data for ${entityKey}`);
                        setData(prev => ({ ...prev, [entityKey]: parsedData }));

                        // Update pagination state even when using cached data
                        setPagination(prev => ({
                            ...prev,
                            [entityKey]: {
                                current: page,
                                pageSize,
                                total: parsedData.length
                            }
                        }));

                        // Return early to skip the API call
                        setLoading(prev => ({ ...prev, [entityKey]: false }));
                        return;
                    }
                }
            } catch (error) {
                console.error('Error reading from cache:', error);
                // Continue with API request if cache fails
            }

            // Check if data was recently fetched (within last 2 seconds)
            const now = Date.now();
            const lastFetchTime = dataFetchTimestampRef.current[entityKey] || 0;
            if (now - lastFetchTime < 2000 && data[entityKey]?.length > 0) {
                // Skip fetch if data is recent and exists
                console.log(`Skipping fetch for ${entityKey} - data is recent`);
                return;
            }

            // Update timestamp
            dataFetchTimestampRef.current[entityKey] = now;

            setLoading(prev => ({ ...prev, [entityKey]: true }));
            try {
                let response;
                const params = {
                    page,
                    limit: pageSize,
                    ...(entity.extraParams || {})
                };

                // Special case for matches endpoint - use tournamentId in the URL path
                let url = `/api/v1/${entity.endpoint}`;
                if (entityKey === 'matches' && entity.extraParams?.tournamentId) {
                    const tournamentId = entity.extraParams.tournamentId;
                    const matchStatus = entity.extraParams?.status || 'scheduled';

                    // Different endpoints based on match status
                    switch (matchStatus) {
                        case 'LIVE':
                            url = `/api/v1/matches/${tournamentId}/live`;
                            break;
                        case 'FINISHED':
                            url = `/api/v1/matches/${tournamentId}/finished`;
                            break;
                        case 'POSTPONED':
                            url = `/api/v1/matches/${tournamentId}/postponed`;
                            break;
                        default:
                            url = `/api/v1/matches/${tournamentId}/scheduled`;
                    }

                    // Create a new params object without tournamentId and status
                    const newParams: Record<string, any> = {
                        page,
                        limit: pageSize
                    };

                    // Copy any other params except tournamentId and status
                    if (params && typeof params === 'object') {
                        Object.entries(params).forEach(([key, value]) => {
                            if (key !== 'tournamentId' && key !== 'status') {
                                newParams[key] = value;
                            }
                        });
                    }

                    // Replace params with the new object
                    Object.assign(params, newParams);

                    console.log(`Constructed matches URL: ${url} with params:`, newParams);
                }

                console.log(`Fetching ${entity.name} with params:`, params);
                console.log(`Using URL: ${url}`);
                response = await axios.get(url, { params });
                console.log(`Response for ${entity.name}:`, response.data);

                // Process data based on entity type
                let dataArray;
                if (entityKey === 'matches') {
                    dataArray = processMatchesData(response.data);
                    console.log('Processed matches data:', dataArray);
                } else {
                    dataArray = ensureArray(response?.data?.data || response?.data || []);
                }

                // Only set data if we actually have matches (fix for empty response issue)
                if (entityKey === 'matches' && dataArray.length === 0 && response?.data?.data &&
                    Object.keys(response.data.data).length === 0) {
                    console.log('No matches found, setting empty array');
                    setData(prev => ({ ...prev, [entityKey]: [] }));
                } else {
                    // Always set data, even if empty - this will show proper empty state
                    setData(prev => ({ ...prev, [entityKey]: dataArray }));
                }

                // Save to cache if we have data
                if (dataArray.length > 0) {
                    try {
                        localStorage.setItem(cacheKey, JSON.stringify(dataArray));
                        localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
                    } catch (e) {
                        console.error('Error saving to cache:', e);
                    }
                }

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
            } catch (error: any) {
                console.error(`Error fetching ${entity.name}:`, error);

                let errorMessage = `Failed to load ${entity.name.toLowerCase()}s`;

                // Extract more useful error information
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    if (error.response.status === 404) {
                        errorMessage = `No ${entity.name.toLowerCase()}s found`;
                        // Set empty data for 404 to show empty state
                        setData(prev => ({ ...prev, [entityKey]: [] }));
                    } else if (error.response.data?.message) {
                        errorMessage = `Error: ${error.response.data.message}`;
                    } else {
                        errorMessage = `Server error (${error.response.status}): Failed to load ${entity.name.toLowerCase()}s`;
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    errorMessage = 'Network error: No response from server';
                }

                message.error(errorMessage);

                // Clear the data to avoid showing stale information
                if (!isEditing) {
                    setData(prev => ({ ...prev, [entityKey]: [] }));
                }
            } finally {
                setLoading(prev => ({ ...prev, [entityKey]: false }));
            }
        } catch (error: any) {
            console.error(`Error fetching ${entity.name}:`, error);

            let errorMessage = `Failed to load ${entity.name.toLowerCase()}s`;

            // Extract more useful error information
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 404) {
                    errorMessage = `No ${entity.name.toLowerCase()}s found`;
                    // Set empty data for 404 to show empty state
                    setData(prev => ({ ...prev, [entityKey]: [] }));
                } else if (error.response.data?.message) {
                    errorMessage = `Error: ${error.response.data.message}`;
                } else {
                    errorMessage = `Server error (${error.response.status}): Failed to load ${entity.name.toLowerCase()}s`;
                }
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = 'Network error: No response from server';
            }

            message.error(errorMessage);

            // Clear the data to avoid showing stale information
            if (!isEditing) {
                setData(prev => ({ ...prev, [entityKey]: [] }));
            }
        }
    }, [entities, isEditing, currentSeason, ongoingTournament]);

    const fetchDeletedData = useCallback(async (entityKey: string) => {
        const entity = entities.find(e => e.key === entityKey);
        if (!entity || !entity.endpoint.includes('users')) return; // Only users have soft delete

        // Skip if data was recently fetched
        const now = Date.now();
        const lastFetchTime = dataFetchTimestampRef.current[`${entityKey}_deleted`] || 0;
        if (now - lastFetchTime < 2000 && deletedData[entityKey]?.length > 0) {
            return;
        }

        // Update timestamp
        dataFetchTimestampRef.current[`${entityKey}_deleted`] = now;

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
    }, [entities]);

    // Refresh data when debounced refreshKey or activeKey changes
    useEffect(() => {
        if (activeKey) {
            const currentPagination = pagination[activeKey] || { current: 1, pageSize: 10 };

            // Generate a cache key for this specific useEffect call
            const effectCacheKey = `effect_${activeKey}_${debouncedRefreshKey}_${currentPagination.current}_${currentPagination.pageSize}`;
            const now = Date.now();
            const lastEffectTime = dataFetchTimestampRef.current[effectCacheKey] || 0;

            // Only fetch if it's been more than 2 seconds since the last fetch from this effect
            if (now - lastEffectTime > 2000) {
                dataFetchTimestampRef.current[effectCacheKey] = now;

                // Check if we're already loading this data
                if (!loading[activeKey]) {
                    fetchData(activeKey, currentPagination.current, currentPagination.pageSize);
                    fetchDeletedData(activeKey);
                }
            }
        }
    }, [activeKey, debouncedRefreshKey, fetchData, fetchDeletedData, pagination, loading]);

    // Force a refresh when currentSeason changes, but with debounce
    useEffect(() => {
        // Use the safe refresh method to avoid excessive refreshes
        safeRefresh();
        return () => {
            if (refreshKeyTimeoutRef.current) {
                clearTimeout(refreshKeyTimeoutRef.current);
            }
        };
    }, [currentSeason, safeRefresh]);

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
            // Re-fetch data to update the table
            const currentPagination = pagination[entityKey] || { current: 1, pageSize: 10 };
            fetchData(entityKey, currentPagination.current, currentPagination.pageSize);
        } catch (error) {
            console.error(`Error deleting ${entity.name}:`, error);
            message.error(`Failed to delete ${entity.name.toLowerCase()}`);
        }
    };

    const handleRefresh = () => {
        safeRefresh();
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
        setIsEditing(false);
        setIsCreating(false);

        // Refresh data with current pagination after modal action
        const currentPagination = pagination[activeKey] || { current: 1, pageSize: 10 };
        fetchData(activeKey, currentPagination.current, currentPagination.pageSize);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setIsEditing(false);
        setIsCreating(false);
    };

    const handleTableChange = (tablePagination: any, entityKey: string) => {
        console.log(`Table pagination changed: page=${tablePagination.current}, size=${tablePagination.pageSize}`);

        // Update the pagination state immediately for a responsive UI feel
        setPagination(prev => ({
            ...prev,
            [entityKey]: {
                ...prev[entityKey],
                current: tablePagination.current,
                pageSize: tablePagination.pageSize
            }
        }));

        // Then fetch the data for this page
        fetchData(entityKey, tablePagination.current, tablePagination.pageSize);
    };

    const getActionColumn = (entityKey: string) => ({
        title: 'Actions',
        key: 'action',
        width: 150,
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
        key: 'action',
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

    const handleRestore = async (id: string, entityKey: string) => {
        const entity = entities.find(e => e.key === entityKey);
        if (!entity) return;

        try {
            await axios.post(`/api/v1/${entity.endpoint}/${id}/restore`);
            message.success(`${entity.name} restored successfully`);

            // After restoration, refresh data
            fetchDeletedData(entityKey);
            safeRefresh();
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

    // Define the emptyText function before it's used in renderTabContent
    const emptyText = (entityKey: string) => {
        const entity = entities.find(e => e.key === entityKey);
        if (!entity) return 'No data';

        const entityName = entity.name.toLowerCase();
        const seasonInfo = entity.extraParams?.tournamentId ? ` for the selected season` : '';

        // Special case for matches
        if (entityKey === 'matches') {
            // If no tournament is selected, show a different message
            if (!ongoingTournament && !entity.extraParams?.tournamentId) {
                return (
                    <div className="text-center p-6">
                        <div className="text-gray-500 mb-4">Please select a tournament to view matches.</div>
                    </div>
                );
            }

            return (
                <div className="text-center p-6">
                    <div className="text-gray-500 mb-4">No matches found for the current tournament. They may need to be scheduled.</div>
                    <Button
                        type="primary"
                        onClick={() => handleCreate(entityKey)}
                    >
                        Schedule Match
                    </Button>
                </div>
            );
        }

        return (
            <div className="text-center p-6">
                <div className="text-gray-500 mb-4">No {entityName}s found{seasonInfo}</div>
                <Button
                    type="primary"
                    onClick={() => handleCreate(entityKey)}
                >
                    Add {entity.name}
                </Button>
            </div>
        );
    };

    const renderTabContent = (entity: any) => {
        // Add refresh button in the top right of the table
        const title = () => (
            <div className="flex justify-between items-center">
                <div>{entity.title || `${entity.name} Management`}</div>
                <Button
                    type="text"
                    icon={<SyncOutlined />}
                    onClick={() => {
                        // Force refresh the data and clear cache for this entity
                        console.log(`Force refreshing ${entity.key}`);

                        // Clear cached timestamps for this entity to force a refetch
                        Object.keys(dataFetchTimestampRef.current).forEach(key => {
                            if (key.startsWith(entity.key)) {
                                dataFetchTimestampRef.current[key] = 0;
                            }
                        });

                        // Reset pagination to page 1
                        setPagination(prev => ({
                            ...prev,
                            [entity.key]: {
                                ...prev[entity.key],
                                current: 1
                            }
                        }));

                        // Clear localStorage cache
                        try {
                            const keysToRemove = [];
                            for (let i = 0; i < localStorage.length; i++) {
                                const key = localStorage.key(i);
                                if (key && key.startsWith(`${entity.key}_`)) {
                                    keysToRemove.push(key);
                                }
                            }
                            keysToRemove.forEach(key => localStorage.removeItem(key));
                        } catch (error) {
                            console.error('Error clearing cache:', error);
                        }

                        // Force a refresh
                        setRefreshKey(prev => prev + 1);
                    }}
                    title="Refresh data"
                />
            </div>
        );

        return (
            <div>
                <Table
                    title={title}
                    dataSource={data[entity.key] || []}
                    columns={[...entity.columns, getActionColumn(entity.key)]}
                    rowKey="id"
                    loading={loading[entity.key]}
                    locale={{
                        emptyText: emptyText(entity.key)
                    }}
                    pagination={
                        entity.usePagination
                            ? {
                                current: pagination[entity.key]?.current || 1,
                                pageSize: pagination[entity.key]?.pageSize || 10,
                                total: pagination[entity.key]?.total || (data[entity.key]?.length || 0),
                                onChange: (page, pageSize) => {
                                    console.log(`Changing page to ${page}, size: ${pageSize} for ${entity.key}`);
                                    handleTableChange({ current: page, pageSize }, entity.key);
                                },
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '50', '100']
                            }
                            : false
                    }
                />

                {entity.key === 'users' && (
                    <>
                        <h3 className="mt-8">Deleted {entity.name}s</h3>
                        <Table
                            dataSource={deletedData[entity.key] || []}
                            columns={[...entity.columns, getDeletedActionColumn(entity.key)]}
                            rowKey="id"
                            locale={{
                                emptyText: `No deleted ${entity.name.toLowerCase()}s found`
                            }}
                        />
                    </>
                )}

                <Modal
                    title={modalType === 'create' ? `Create New ${entity.name}` : `Edit ${entity.name}`}
                    open={isModalVisible && activeKey === entity.key}
                    onCancel={handleModalCancel}
                    footer={null} // Let the form handle submit/cancel
                    width={800}
                    destroyOnClose
                >
                    {formContent}
                </Modal>
            </div>
        );
    };

    // Build tab items
    const tabItems = entities.map(entity => ({
        label: entity.title || entity.name,
        key: entity.key,
        children: renderTabContent(entity)
    }));

    return (
        <div>
            <div className="mb-4 flex justify-between">
                {activeKey && (
                    <>
                        <h2 className="text-2xl font-bold">
                            {entities.find(e => e.key === activeKey)?.title ||
                                `${entities.find(e => e.key === activeKey)?.name} Management`}
                        </h2>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => handleCreate(activeKey)}
                        >
                            Add {entities.find(e => e.key === activeKey)?.name}
                        </Button>
                    </>
                )}
            </div>

            <Tabs activeKey={activeKey} onChange={handleTabChange} items={tabItems} />
        </div>
    );
};

export default EntityManager;