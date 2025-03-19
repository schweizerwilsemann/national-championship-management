import React, { useState, useCallback } from 'react';
import EntityManager from '../components/EntityManager';
import MatchForm from '../components/forms/MatchForm';
import { Tag } from 'antd';

const MatchesPage: React.FC = () => {
    const [currentMatch, setCurrentMatch] = useState<any>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

    const handleCreateForm = useCallback(() => {
        setCurrentMatch(null);
        setFormMode('create');
        return (
            <MatchForm
                mode="create"
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, []);

    const handleEditForm = useCallback((record: any) => {
        setCurrentMatch(record);
        setFormMode('edit');
        return (
            <MatchForm
                mode="edit"
                initialValues={record}
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SCHEDULED':
                return 'blue';
            case 'LIVE':
                return 'green';
            case 'FINISHED':
                return 'gray';
            case 'POSTPONED':
                return 'orange';
            case 'CANCELLED':
                return 'red';
            default:
                return 'default';
        }
    };

    const formatDateTime = (date: string, time: string) => {
        if (!date) return 'TBD';
        const formattedDate = new Date(date).toLocaleDateString();
        return time ? `${formattedDate}, ${time}` : formattedDate;
    };

    const matchColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Tournament',
            dataIndex: 'tournament',
            key: 'tournament',
            render: (tournament: any) => tournament?.name || 'N/A',
        },
        {
            title: 'Matchday',
            dataIndex: 'matchday',
            key: 'matchday',
            width: 100,
        },
        {
            title: 'Home Team',
            dataIndex: 'homeTeam',
            key: 'homeTeam',
            render: (homeTeam: any) => homeTeam?.name || 'N/A',
        },
        {
            title: 'Away Team',
            dataIndex: 'awayTeam',
            key: 'awayTeam',
            render: (awayTeam: any) => awayTeam?.name || 'N/A',
        },
        {
            title: 'Score',
            key: 'score',
            render: (text: string, record: any) => {
                if (record.status === 'SCHEDULED' || record.status === 'POSTPONED' || record.status === 'CANCELLED') {
                    return 'vs';
                }
                return `${record.homeScore || 0} - ${record.awayScore || 0}`;
            },
        },
        {
            title: 'Date & Time',
            key: 'datetime',
            render: (text: string, record: any) => formatDateTime(record.date, record.time),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                </Tag>
            ),
        },
    ];

    const entities = [
        {
            key: 'matches',
            name: 'Match',
            endpoint: 'matches',
            columns: matchColumns,
            createForm: handleCreateForm,
            editForm: handleEditForm,
            usePagination: true,
        },
    ];

    return (
        <div className="p-6">
            <EntityManager entities={entities} />
        </div>
    );
};

export default MatchesPage; 