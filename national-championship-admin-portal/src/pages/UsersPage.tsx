import React, { useState, useCallback } from 'react';
import EntityManager from '../components/EntityManager';
import UserForm from '../components/forms/UserForm';

const UsersPage: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

    const handleCreateForm = useCallback(() => {
        setCurrentUser(null);
        setFormMode('create');
        return (
            <UserForm
                mode="create"
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, []);

    const handleEditForm = useCallback((record: any) => {
        setCurrentUser(record);
        setFormMode('edit');
        return (
            <UserForm
                mode="edit"
                initialValues={record}
                onSuccess={() => {
                    // Modal will be closed by the EntityManager component
                }}
            />
        );
    }, []);

    const userColumns = [
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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
    ];

    const entities = [
        {
            key: 'users',
            name: 'User',
            endpoint: 'users',
            columns: userColumns,
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

export default UsersPage; 