import React, { useEffect, useState } from 'react';
import { Form, Button, Select, InputNumber, Input, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

interface StandingFormProps {
    initialValues?: any;
    onSuccess: () => void;
    mode: 'create' | 'edit';
}

const StandingForm: React.FC<StandingFormProps> = ({ initialValues, onSuccess, mode }) => {
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
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/tournaments`);
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
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/teams/tournament/${tournamentId}`);
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
        form.setFieldsValue({ teamId: undefined });
        fetchTeamsByTournament(value);
    };

    const onFinish = async (values: any) => {
        try {
            // Calculate goal difference
            values.goalDifference = values.goalsFor - values.goalsAgainst;

            // Calculate points (3 for win, 1 for draw, 0 for loss)
            values.points = (values.won * 3) + values.drawn;

            if (mode === 'create') {
                await axios.post(`${import.meta.env.VITE_API_URL}/standings`, values);
                message.success('Standing created successfully');
            } else {
                await axios.put(`${import.meta.env.VITE_API_URL}/standings/${initialValues.id}`, values);
                message.success('Standing updated successfully');
            }
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error('Error saving standing:', error);
            message.error(error.response?.data?.message || 'Failed to save standing');
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                position: 1,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0,
                form: ''
            }}
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
                name="teamId"
                label="Team"
                rules={[{ required: true, message: 'Please select a team' }]}
            >
                <Select
                    loading={loading}
                    disabled={!selectedTournament || mode === 'edit'}
                >
                    {Array.isArray(teams) && teams.map(team => (
                        <Option key={team.id} value={team.id}>
                            {team.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="position"
                label="Position"
                rules={[{ required: true, message: 'Please enter a position' }]}
            >
                <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="played"
                label="Played"
                rules={[{ required: true, message: 'Please enter matches played' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="won"
                label="Won"
                rules={[{ required: true, message: 'Please enter matches won' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="drawn"
                label="Drawn"
                rules={[{ required: true, message: 'Please enter matches drawn' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="lost"
                label="Lost"
                rules={[{ required: true, message: 'Please enter matches lost' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="goalsFor"
                label="Goals For"
                rules={[{ required: true, message: 'Please enter goals for' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="goalsAgainst"
                label="Goals Against"
                rules={[{ required: true, message: 'Please enter goals against' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="form"
                label="Form (e.g., WDLWW)"
                rules={[{ pattern: /^[WDL]*$/, message: 'Form must contain only W, D, or L characters' }]}
            >
                <Input maxLength={5} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    {mode === 'create' ? 'Create Standing' : 'Update Standing'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default StandingForm; 