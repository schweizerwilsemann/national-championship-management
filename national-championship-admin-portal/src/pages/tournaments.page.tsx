import React, { useState, useCallback } from 'react';
import EntityManager from '@/components/EntityManager';
import TournamentForm from '@/components/forms/TournamentForm';

const TournamentsPage: React.FC = () => {
    const [currentTournament, setCurrentTournament] = useState<any>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

    const handleCreateForm = useCallback(() => {
        setCurrentTournament(null);
        setFormMode('create');
        return (
            <TournamentForm
                mode="create"
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, []);

    const handleEditForm = useCallback((record: any) => {
        setCurrentTournament(record);
        setFormMode('edit');
        return (
            <TournamentForm
                mode="edit"
                initialValues={record}
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, []);

    const tournamentColumns = [
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
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
    ];

    const entities = [
        {
            key: 'tournaments',
            name: 'Tournament',
            endpoint: 'tournaments',
            columns: tournamentColumns,
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

export default TournamentsPage; 