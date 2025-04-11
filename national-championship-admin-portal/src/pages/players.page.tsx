import React, { useState, useCallback, useEffect } from 'react';
import EntityManager from '@/components/EntityManager';
import PlayerForm from '@/components/forms/PlayerForm';
import { Tag } from 'antd';
import { useSeason } from '@/context/season.context';

const PlayersPage: React.FC = () => {
    const [currentPlayer, setCurrentPlayer] = useState<any>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const { currentSeason } = useSeason();
    const [endpointKey, setEndpointKey] = useState<string>('players');

    // Fixed: Use the proper API endpoint format that combines tournament filtering with pagination
    useEffect(() => {
        if (currentSeason) {
            // This is the correct endpoint format that supports pagination
            setEndpointKey('players');
        } else {
            setEndpointKey('players');
        }
    }, [currentSeason]);

    const handleCreateForm = useCallback(() => {
        setCurrentPlayer(null);
        setFormMode('create');
        return (
            <PlayerForm
                mode="create"
                initialValues={{ teamId: '', teamTournamentId: currentSeason?.id }}
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, [currentSeason]);

    const handleEditForm = useCallback((record: any) => {
        setCurrentPlayer(record);
        setFormMode('edit');
        return (
            <PlayerForm
                mode="edit"
                initialValues={record}
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, []);

    const getPositionColor = (position: string) => {
        switch (position) {
            case 'GOALKEEPER':
                return 'gold';
            case 'DEFENDER':
                return 'blue';
            case 'MIDFIELDER':
                return 'green';
            case 'FORWARD':
                return 'red';
            default:
                return 'default';
        }
    };

    const playerColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '#',
            dataIndex: 'number',
            key: 'number',
            width: 60,
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            render: (position: string) => (
                <Tag color={getPositionColor(position)}>
                    {position.charAt(0) + position.slice(1).toLowerCase()}
                </Tag>
            ),
        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
        },
        {
            title: 'Birth Date',
            dataIndex: 'birthDate',
            key: 'birthDate',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Team',
            dataIndex: 'team',
            key: 'team',
            render: (team: any) => team?.name || 'N/A',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
    ];

    const entities = [
        {
            key: 'players',
            name: 'Player',
            endpoint: endpointKey,
            columns: playerColumns,
            createForm: handleCreateForm,
            editForm: handleEditForm,
            usePagination: true,
            extraParams: currentSeason ? { tournamentId: currentSeason.id } : undefined,
            title: currentSeason ? `Players - ${currentSeason.name}` : 'Players',
        },
    ];

    return (
        <div className="p-6">
            <EntityManager entities={entities} />
        </div>
    );
};

export default PlayersPage;