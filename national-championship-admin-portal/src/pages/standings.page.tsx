import React, { useState, useCallback, useEffect } from 'react';
import EntityManager from '@/components/EntityManager';
import StandingForm from '@/components/forms/StandingForm';
import { useSeason } from '@/context/season.context';

const StandingsPage: React.FC = () => {
    const [currentStanding, setCurrentStanding] = useState<any>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const { currentSeason } = useSeason();
    const [endpointKey, setEndpointKey] = useState<string>('standings');

    // Fixed: Use the proper API endpoint format with query parameters
    useEffect(() => {
        // Use the base endpoint and provide tournament ID as a parameter
        setEndpointKey('standings');
    }, [currentSeason]);

    const handleCreateForm = useCallback(() => {
        setCurrentStanding(null);
        setFormMode('create');
        return (
            <StandingForm
                mode="create"
                initialValues={{ tournamentId: currentSeason?.id }}
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, [currentSeason]);

    const handleEditForm = useCallback((record: any) => {
        setCurrentStanding(record);
        setFormMode('edit');
        return (
            <StandingForm
                mode="edit"
                initialValues={record}
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, []);

    const standingColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Tournament',
            key: 'tournament',
            dataIndex: ['team', 'tournament', 'name'],
            render: (text: string, record: any) => record.team?.tournament?.name || 'N/A',
        },
        {
            title: 'Team',
            key: 'team',
            dataIndex: ['team', 'name'],
            render: (text: string, record: any) => record.team?.name || 'N/A',
        },
        {
            title: 'Pos',
            dataIndex: 'position',
            key: 'position',
            width: 60,
        },
        {
            title: 'P',
            dataIndex: 'played',
            key: 'played',
            width: 60,
        },
        {
            title: 'W',
            dataIndex: 'won',
            key: 'won',
            width: 60,
        },
        {
            title: 'D',
            dataIndex: 'drawn',
            key: 'drawn',
            width: 60,
        },
        {
            title: 'L',
            dataIndex: 'lost',
            key: 'lost',
            width: 60,
        },
        {
            title: 'GF',
            dataIndex: 'goalsFor',
            key: 'goalsFor',
            width: 60,
        },
        {
            title: 'GA',
            dataIndex: 'goalsAgainst',
            key: 'goalsAgainst',
            width: 60,
        },
        {
            title: 'GD',
            dataIndex: 'goalDifference',
            key: 'goalDifference',
            width: 60,
        },
        {
            title: 'Pts',
            dataIndex: 'points',
            key: 'points',
            width: 60,
        },
        {
            title: 'Form',
            dataIndex: 'form',
            key: 'form',
            width: 100,
            render: (form: string) => form || 'N/A',
        },
    ];

    const entities = [
        {
            key: 'standings',
            name: 'Standing',
            endpoint: endpointKey,
            columns: standingColumns,
            createForm: handleCreateForm,
            editForm: handleEditForm,
            usePagination: true,
            extraParams: currentSeason ? { tournamentId: currentSeason.id } : undefined,
            title: currentSeason ? `Standings - ${currentSeason.name}` : 'Standings',
        },
    ];

    return (
        <div className="p-6">
            <EntityManager entities={entities} />
        </div>
    );
};

export default StandingsPage; 