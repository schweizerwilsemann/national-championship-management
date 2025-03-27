import React, { useEffect, useState } from 'react';
import { Form, Button, Select, InputNumber, Checkbox, message, Modal, Input, Pagination, Empty } from 'antd';
import axios from 'axios';
import { useOngoingTour } from '@/context/ongoing.tournament.context';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

interface GoalFormProps {
    initialValues?: any;
    onSuccess: () => void;
    mode: 'create' | 'edit';
}

const GoalForm: React.FC<GoalFormProps> = ({ initialValues, onSuccess, mode }) => {
    const [form] = Form.useForm();
    const [selectedMatch, setSelectedMatch] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [searchType, setSearchType] = useState<'match' | 'player'>('match');
    const { ongoingTournament } = useOngoingTour();

    // Search state
    const [searchName, setSearchName] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        if (initialValues) {
            const matchDisplay = initialValues.match
                ? `${initialValues.match.homeTeam?.name} vs ${initialValues.match.awayTeam?.name}`
                : '';
            const scorerDisplay = initialValues.scorer
                ? `${initialValues.scorer.name} (${initialValues.scorer.team?.name})`
                : '';

            form.setFieldsValue({
                ...initialValues,
                matchId: initialValues.matchId,
                scorerId: initialValues.scorerId,
                matchDisplay: matchDisplay,
                scorerDisplay: scorerDisplay,
                isOwnGoal: initialValues.isOwnGoal || false,
                isPenalty: initialValues.isPenalty || false,
            });

            if (initialValues.matchId) {
                setSelectedMatch(initialValues.matchId);
            }
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);


    const openSearchModal = (type: 'match' | 'player') => {
        setSearchType(type);
        setSearchModalVisible(true);
        setSearchResults([]);
        setSearchName('');
        setCurrentPage(1);
        setTotalResults(0);
    };

    const performSearch = async (page = 1) => {
        if (!searchName.trim()) {
            message.error(`Please enter a ${searchType === 'match' ? 'match' : 'player'} name to search`);
            return;
        }

        try {
            setLoading(true);
            let response;
            if (searchType === 'match') {
                response = await axios.get('/api/v1/matches/search', {
                    params: {
                        searchTerm: searchName,
                        tournamentId: ongoingTournament?.id,
                        page: page,
                        limit: pageSize
                    }
                });
                setSearchResults(response.data.data || []);
                setTotalResults(response.data.meta?.total || 0);
            } else {
                // Simplified scorer search
                response = await axios.get('/api/v1/players/filter-players', {
                    params: {
                        name: searchName,
                        tournamentId: ongoingTournament?.id,
                        page: page,
                        limit: pageSize
                    }
                });
                setSearchResults(response.data || []);
                setTotalResults(response.data.meta?.total || 0);
            }
            setCurrentPage(page);
        } catch (error: any) {
            console.error('Search error:', error);
            message.error('Failed to perform search. Please try again.');
            setSearchResults([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    };
    const handleSearchResultSelect = (result: any) => {
        if (searchType === 'match') {
            const matchDisplay = `${result.homeTeam?.name} vs ${result.awayTeam?.name} (${new Date(result.date).toLocaleDateString()})`;
            form.setFieldsValue({
                matchId: result.id,
                matchDisplay: matchDisplay
            });
            setSelectedMatch(result.id);
        } else {
            const scorerDisplay = `${result.name} (${result.team?.name})`;
            form.setFieldsValue({
                scorerId: result.id,
                scorerDisplay: scorerDisplay
            });
        }
        setSearchModalVisible(false);
    };

    const onFinish = async (values: any) => {
        const submissionValues = { ...values };
        delete submissionValues.matchDisplay;
        delete submissionValues.scorerDisplay;

        try {
            if (mode === 'create') {
                await axios.post(`/api/v1/goals`, submissionValues);
                message.success('Goal created successfully');
            } else {
                await axios.put(`/api/v1/goals/${initialValues.id}`, submissionValues);
                message.success('Goal updated successfully');
            }
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error('Error saving goal:', error);
            message.error(error.response?.data?.message || 'Failed to save goal');
        }
    };

    const handlePageChange = (page: number, newPageSize: number) => {
        setPageSize(newPageSize);
        performSearch(page);
    };

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    type: 'NORMAL',
                    isOwnGoal: false,
                    isPenalty: false
                }}
            >
                <Form.Item
                    name="matchId"
                    label="Match"
                    rules={[{ required: true, message: 'Please select a match' }]}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Item
                            name="matchDisplay"
                            noStyle
                            rules={[{ required: true, message: 'Please select a match' }]}
                        >
                            <Input
                                style={{ width: 'calc(100% - 40px)' }}
                                placeholder="Select Match"
                                readOnly
                            />
                        </Form.Item>
                        <Button
                            icon={<SearchOutlined />}
                            onClick={() => openSearchModal('match')}
                            style={{ marginLeft: 8 }}
                        />
                    </div>
                </Form.Item>

                <Form.Item
                    name="minute"
                    label="Minute"
                    rules={[{ required: true, message: 'Please enter the minute' }]}
                >
                    <InputNumber min={1} max={120} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="scorerId"
                    label="Scorer"
                    rules={[{ required: true, message: 'Please select a scorer' }]}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Item
                            name="scorerDisplay"
                            noStyle
                            rules={[{ required: true, message: 'Please select a scorer' }]}
                        >
                            <Input
                                style={{ width: 'calc(100% - 40px)' }}
                                placeholder="Select Scorer"
                                readOnly
                            />
                        </Form.Item>
                        <Button
                            icon={<SearchOutlined />}
                            onClick={() => openSearchModal('player')}
                            style={{ marginLeft: 8 }}
                            disabled={!form.getFieldValue('matchId')}
                        />
                    </div>
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Goal Type"
                    rules={[{ required: true, message: 'Please select a goal type' }]}
                >
                    <Select>
                        <Option value="NORMAL">Normal</Option>
                        <Option value="OWN_GOAL">Own Goal</Option>
                        <Option value="PENALTY">Penalty</Option>
                        <Option value="FREE_KICK">Free Kick</Option>
                        <Option value="HEADER">Header</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="isOwnGoal" valuePropName="checked">
                    <Checkbox>Own Goal</Checkbox>
                </Form.Item>

                <Form.Item name="isPenalty" valuePropName="checked">
                    <Checkbox>Penalty</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        {mode === 'create' ? 'Create Goal' : 'Update Goal'}
                    </Button>
                </Form.Item>
            </Form>

            <Modal
                title={`Search ${searchType === 'match' ? 'Matches' : 'Players'}`}
                visible={searchModalVisible}
                onCancel={() => setSearchModalVisible(false)}
                footer={null}
                width={600}
            >
                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', marginBottom: 16 }}>
                        <Form.Item style={{ flex: 1, marginRight: 8 }}>
                            <Input
                                placeholder={`Search ${searchType === 'match' ? 'Match' : 'Player'} Name`}
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                onPressEnter={() => performSearch(1)}
                            />
                        </Form.Item>
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={() => performSearch(1)}
                            disabled={!searchName.trim()}
                            loading={loading}
                        >
                            Search
                        </Button>
                    </div>

                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                        {searchResults.length > 0 ? (
                            searchResults.map((result) => (
                                <div
                                    key={result.id}
                                    style={{
                                        padding: 8,
                                        borderBottom: '1px solid #f0f0f0',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleSearchResultSelect(result)}
                                >
                                    {searchType === 'match' ? (
                                        `${result.homeTeam?.name} vs ${result.awayTeam?.name} (${new Date(result.date).toLocaleDateString()})`
                                    ) : (
                                        `${result.name} (${result.team?.name})`
                                    )}
                                </div>
                            ))
                        ) : (
                            <Empty description="No results found" />
                        )}
                    </div>

                    {totalResults > 0 && (
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={totalResults}
                            onChange={handlePageChange}
                            style={{ marginTop: 16, textAlign: 'right' }}
                            showSizeChanger
                            pageSizeOptions={['10', '20', '50']}
                        />
                    )}
                </div>
            </Modal>
        </>
    );
};

export default GoalForm;