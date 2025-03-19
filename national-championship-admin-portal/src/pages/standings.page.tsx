import React, { useState, useCallback } from 'react';
import EntityManager from '../components/EntityManager';
import StandingForm from '../components/forms/StandingForm';

const StandingsPage: React.FC = () => {
    const [currentStanding, setCurrentStanding] = useState<any>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

    const handleCreateForm = useCallback(() => {
        setCurrentStanding(null);
        setFormMode('create');
        return (
            <StandingForm
                mode="create"
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, []);

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
            endpoint: 'standings',
            columns: standingColumns,
            createForm: handleCreateForm,
            editForm: handleEditForm,
        },
    ];

    return (
        <div className="p-6">
            <EntityManager entities={entities} />
        </div>
    );
};

export default StandingsPage; 