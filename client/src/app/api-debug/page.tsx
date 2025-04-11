'use client';

import React, { useEffect, useState } from 'react';
import { instance } from '@/utilities/customize/axios.customize';

const ApiDebugPage = () => {
    const [envVariables, setEnvVariables] = useState<Record<string, string>>({});
    const [apiResponse, setApiResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Collect environment variables
        setEnvVariables({
            'NEXT_PUBLIC_API_URL': process.env.NEXT_PUBLIC_API_URL || 'Not set',
            'NEXT_PUBLIC_SOCIAL_API_URL': process.env.NEXT_PUBLIC_SOCIAL_API_URL || 'Not set',
            'baseURL': instance.defaults.baseURL || 'Not set',
        });
    }, []);

    const testEndpoint = async (endpoint: string) => {
        setLoading(true);
        setError(null);
        setApiResponse(null);

        try {
            const response = await instance.get(endpoint);
            setApiResponse(response);
        } catch (err: any) {
            console.error('Error testing endpoint:', err);
            setError(err.message || 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">API Debug Page</h1>

            <div className="mb-8 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify(envVariables, null, 2)}
                </pre>
            </div>

            <div className="mb-8 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Test API Endpoints</h2>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => testEndpoint('/teams')}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        Test /teams
                    </button>
                    <button
                        onClick={() => testEndpoint('/teams/550e8400-e29b-41d4-a716-446655440000')}
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        Test /teams/:id (valid UUID format)
                    </button>
                    <button
                        onClick={() => {
                            const teamIdInput = prompt('Enter a valid team UUID:');
                            if (teamIdInput) testEndpoint(`/teams/${teamIdInput}`);
                        }}
                        disabled={loading}
                        className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 disabled:opacity-50"
                    >
                        Test with custom team ID
                    </button>
                    <button
                        onClick={() => testEndpoint('/players')}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                    >
                        Test /players
                    </button>
                    <button
                        onClick={() => {
                            const playerIdInput = prompt('Enter a valid player UUID:');
                            if (playerIdInput) testEndpoint(`/players/${playerIdInput}`);
                        }}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 disabled:opacity-50"
                    >
                        Test with custom player ID
                    </button>
                </div>

                {loading && <p className="mt-4">Loading...</p>}

                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                        <h3 className="font-semibold">Error:</h3>
                        <p>{error}</p>
                    </div>
                )}

                {apiResponse && (
                    <div className="mt-4">
                        <h3 className="font-semibold">Response:</h3>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto mt-2">
                            {JSON.stringify(apiResponse, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Troubleshooting Tips</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Make sure your backend server is running and accessible</li>
                    <li>Check that the port in NEXT_PUBLIC_API_URL matches your backend port</li>
                    <li>Ensure the API endpoints are correctly implemented on the backend</li>
                    <li>Check that .env is being loaded correctly (not overridden by .env.local)</li>
                    <li>Verify that CORS is properly configured on your backend</li>
                </ul>
            </div>
        </div>
    );
};

export default ApiDebugPage; 