import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, TimePicker, InputNumber, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

interface MatchFormProps {
    initialValues?: any;
    onSuccess: () => void;
    mode: 'create' | 'edit';
}

const MatchForm: React.FC<MatchFormProps> = ({ initialValues, onSuccess, mode }) => {
    const [form] = Form.useForm();
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [selectedTournament, setSelectedTournament] = useState<string>('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        fetchTournaments();
    }, []);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                date: initialValues.date ? dayjs(initialValues.date) : null,
                time: initialValues.time ? dayjs(initialValues.time, 'HH:mm') : null,
            });

            if (initialValues.tournamentId) {
                setSelectedTournament(initialValues.tournamentId);
                fetchTeamsByTournament(initialValues.tournamentId);
            }
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const fetchTournaments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/v1/tournaments`);
            setTournaments(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching tournaments:', error);
            message.error('Failed to load tournaments');
            setTournaments([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeamsByTournament = async (tournamentId: string) => {
        if (!tournamentId) return;

        try {
            setLoading(true);
            const response = await axios.get(`/api/v1/teams/tournament/${tournamentId}`);
            setTeams(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching teams:', error);
            message.error('Failed to load teams');
            setTeams([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTournamentChange = (value: string) => {
        setSelectedTournament(value);
        form.setFieldsValue({ homeTeamId: undefined, awayTeamId: undefined });
        fetchTeamsByTournament(value);
    };

    const onFinish = async (values: any) => {
        try {
            const formattedValues = {
                ...values,
                date: values.date ? values.date.format('YYYY-MM-DD') : null,
                time: values.time ? values.time.format('HH:mm') : null,
            };

            if (mode === 'create') {
                await axios.post(`/api/v1/matches`, formattedValues);
                message.success('Match created successfully');
            } else {
                await axios.put(`/api/v1/matches/${initialValues.id}`, formattedValues);
                message.success('Match updated successfully');
            }
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error('Error saving match:', error);
            message.error(error.response?.data?.message || 'Failed to save match');
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ status: 'SCHEDULED' }}
        >
            <Form.Item
                name="tournamentId"
                label="Tournament"
                rules={[{ required: true, message: 'Please select a tournament' }]}
            >
                <Select
                    loading={loading}
                    onChange={handleTournamentChange}
                    disabled={mode === 'edit'}
                >
                    {Array.isArray(tournaments) && tournaments.map(tournament => (
                        <Option key={tournament.id} value={tournament.id}>
                            {tournament.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="matchday"
                label="Matchday"
                rules={[{ required: true, message: 'Please enter a matchday' }]}
            >
                <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="homeTeamId"
                label="Home Team"
                rules={[{ required: true, message: 'Please select a home team' }]}
            >
                <Select
                    loading={loading}
                    disabled={!selectedTournament}
                >
                    {Array.isArray(teams) && teams.map(team => (
                        <Option key={team.id} value={team.id}>
                            {team.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="awayTeamId"
                label="Away Team"
                rules={[
                    { required: true, message: 'Please select an away team' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('homeTeamId') !== value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Home and away teams cannot be the same'));
                        },
                    }),
                ]}
            >
                <Select
                    loading={loading}
                    disabled={!selectedTournament}
                >
                    {Array.isArray(teams) && teams.map(team => (
                        <Option key={team.id} value={team.id}>
                            {team.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="date"
                label="Match Date"
                rules={[{ required: true, message: 'Please select a date' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="time"
                label="Match Time"
                rules={[{ required: true, message: 'Please select a time' }]}
            >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="status"
                label="Match Status"
                rules={[{ required: true, message: 'Please select a status' }]}
            >
                <Select>
                    <Option value="SCHEDULED">Scheduled</Option>
                    <Option value="LIVE">Live</Option>
                    <Option value="FINISHED">Finished</Option>
                    <Option value="POSTPONED">Postponed</Option>
                    <Option value="CANCELLED">Cancelled</Option>
                </Select>
            </Form.Item>

            {mode === 'edit' && (
                <>
                    <Form.Item
                        name="homeScore"
                        label="Home Score"
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="awayScore"
                        label="Away Score"
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="highlights"
                        label="Highlights URL"
                    >
                        <Input placeholder="https://example.com/video" />
                    </Form.Item>
                </>
            )}

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    {mode === 'create' ? 'Create Match' : 'Update Match'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default MatchForm; 