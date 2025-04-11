import React, { useState, useCallback, useEffect } from 'react';
import EntityManager from '@/components/EntityManager';
import TeamForm from '@/components/forms/TeamForm';
import { useSeason } from '@/context/season.context';

const TeamsPage: React.FC = () => {
    const [currentTeam, setCurrentTeam] = useState<any>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const { currentSeason } = useSeason();
    const [endpointKey, setEndpointKey] = useState<string>('teams');

    // Update endpoint when season changes
    useEffect(() => {
        if (currentSeason) {
            setEndpointKey(`teams/tournament/${currentSeason.id}`);
        } else {
            setEndpointKey('teams');
        }
    }, [currentSeason]);

    const handleCreateForm = useCallback(() => {
        setCurrentTeam(null);
        setFormMode('create');
        return (
            <TeamForm
                mode="create"
                initialValues={{ tournamentId: currentSeason?.id }}
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, [currentSeason]);

    const handleEditForm = useCallback((record: any) => {
        setCurrentTeam(record);
        setFormMode('edit');
        return (
            <TeamForm
                mode="edit"
                initialValues={record}
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, []);

    const teamColumns = [
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
            title: 'Short Name',
            dataIndex: 'shortName',
            key: 'shortName',
            width: 100,
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
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
    ];

    const entities = [
        {
            key: 'teams',
            name: 'Team',
            endpoint: endpointKey,
            columns: teamColumns,
            createForm: handleCreateForm,
            editForm: handleEditForm,
            title: currentSeason ? `Teams - ${currentSeason.name}` : 'Teams',
        },
    ];

    return (
        <div className="p-6">
            <EntityManager entities={entities} />
        </div>
    );
};

export default TeamsPage; 