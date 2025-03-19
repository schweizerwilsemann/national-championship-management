import React, { useState, useCallback } from 'react';
import EntityManager from '@/components/EntityManager';
import GoalForm from '@/components/forms/GoalForm';
import { Tag } from 'antd';

const GoalsPage: React.FC = () => {
    const [currentGoal, setCurrentGoal] = useState<any>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

    const handleCreateForm = useCallback(() => {
        setCurrentGoal(null);
        setFormMode('create');
        return (
            <GoalForm
                mode="create"
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, []);

    const handleEditForm = useCallback((record: any) => {
        console.log("Edit form data:", record);
        setCurrentGoal(record);
        setFormMode('edit');
        return (
            <GoalForm
                mode="edit"
                initialValues={record}
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, []);

    const getGoalTypeColor = (type: string) => {
        switch (type) {
            case 'NORMAL':
                return 'blue';
            case 'OWN_GOAL':
                return 'red';
            case 'PENALTY':
                return 'green';
            case 'FREE_KICK':
                return 'purple';
            case 'HEADER':
                return 'orange';
            default:
                return 'default';
        }
    };

    const formatGoalType = (type: string) => {
        switch (type) {
            case 'NORMAL':
                return 'Normal';
            case 'OWN_GOAL':
                return 'Own Goal';
            case 'PENALTY':
                return 'Penalty';
            case 'FREE_KICK':
                return 'Free Kick';
            case 'HEADER':
                return 'Header';
            default:
                return type;
        }
    };

    const goalColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Match',
            key: 'match',
            render: (text: string, record: any) => {
                const match = record.match;
                if (!match) return 'N/A';
                return `${match.homeTeam?.name} vs ${match.awayTeam?.name}`;
            },
        },
        {
            title: 'Minute',
            dataIndex: 'minute',
            key: 'minute',
            width: 80,
        },
        {
            title: 'Scorer',
            key: 'scorer',
            render: (text: string, record: any) => {
                const scorer = record.scorer;
                if (!scorer) return 'N/A';
                return `${scorer.name} (${scorer.team?.name})`;
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => (
                <Tag color={getGoalTypeColor(type)}>
                    {formatGoalType(type)}
                </Tag>
            ),
        },
        {
            title: 'Own Goal',
            dataIndex: 'isOwnGoal',
            key: 'isOwnGoal',
            render: (isOwnGoal: boolean) => isOwnGoal ? 'Yes' : 'No',
        },
        {
            title: 'Penalty',
            dataIndex: 'isPenalty',
            key: 'isPenalty',
            render: (isPenalty: boolean) => isPenalty ? 'Yes' : 'No',
        },
    ];

    const entities = [
        {
            key: 'goals',
            name: 'Goal',
            endpoint: 'goals',
            columns: goalColumns,
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

export default GoalsPage; 