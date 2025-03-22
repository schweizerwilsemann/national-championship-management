import React, { useEffect, useState } from 'react';
import { Form, Button, Select, InputNumber, Checkbox, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

interface GoalFormProps {
    initialValues?: any;
    onSuccess: () => void;
    mode: 'create' | 'edit';
}

const GoalForm: React.FC<GoalFormProps> = ({ initialValues, onSuccess, mode }) => {
    const [form] = Form.useForm();
    const [matches, setMatches] = useState<any[]>([]);
    const [players, setPlayers] = useState<any[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMatches();
    }, []);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                isOwnGoal: initialValues.isOwnGoal || false,
                isPenalty: initialValues.isPenalty || false,
            });

            if (initialValues.matchId) {
                setSelectedMatch(initialValues.matchId);
                fetchPlayersByMatch(initialValues.matchId);
            }
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const fetchMatches = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/v1/matches`);
            setMatches(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching matches:', error);
            message.error('Failed to load matches');
            setMatches([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlayersByMatch = async (matchId: string) => {
        if (!matchId) return;

        try {
            setLoading(true);
            const response = await axios.get(`/api/v1/matches/${matchId}/players`);
            setPlayers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching players:', error);
            message.error('Failed to load players');
            setPlayers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMatchChange = (value: string) => {
        setSelectedMatch(value);
        form.setFieldsValue({ scorerId: undefined });
        fetchPlayersByMatch(value);
    };

    const onFinish = async (values: any) => {
        try {
            if (mode === 'create') {
                await axios.post(`/api/v1/goals`, values);
                message.success('Goal created successfully');
            } else {
                await axios.put(`/api/v1/goals/${initialValues.id}`, values);
                message.success('Goal updated successfully');
            }
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error('Error saving goal:', error);
            message.error(error.response?.data?.message || 'Failed to save goal');
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ type: 'NORMAL', isOwnGoal: false, isPenalty: false }}
        >
            <Form.Item
                name="matchId"
                label="Match"
                rules={[{ required: true, message: 'Please select a match' }]}
            >
                <Select
                    loading={loading}
                    onChange={handleMatchChange}
                    disabled={mode === 'edit'}
                    showSearch
                    optionFilterProp="children"
                >
                    {Array.isArray(matches) && matches.map(match => (
                        <Option key={match.id} value={match.id}>
                            {match.homeTeam?.name} vs {match.awayTeam?.name} ({new Date(match.date).toLocaleDateString()})
                        </Option>
                    ))}
                </Select>
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
                <Select
                    loading={loading}
                    disabled={!selectedMatch}
                    showSearch
                    optionFilterProp="children"
                >
                    {Array.isArray(players) && players.map(player => (
                        <Option key={player.id} value={player.id}>
                            {player.name} ({player.team?.name})
                        </Option>
                    ))}
                </Select>
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
    );
};

export default GoalForm; 