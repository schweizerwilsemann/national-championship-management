'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPlayerById, Player } from '@/utilities/apis/players/players.api';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Loader } from 'lucide-react';

const positionMap = {
    GOALKEEPER: 'Goalkeeper',
    DEFENDER: 'Defender',
    MIDFIELDER: 'Midfielder',
    FORWARD: 'Forward'
};

const footMap = {
    LEFT: 'Left',
    RIGHT: 'Right',
    BOTH: 'Both'
};

const DetailPlayer = () => {
    const params = useParams();
    const playerId = params.player_id as string;
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                setLoading(true);
                console.log('Fetching player data for ID:', playerId);

                // Validate UUID format
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                if (!uuidRegex.test(playerId)) {
                    console.error('Invalid UUID format:', playerId);
                    setError('Invalid player ID format. Please check the URL.');
                    setLoading(false);
                    return;
                }

                const data = await getPlayerById(playerId);
                console.log('Player data received:', data);

                if (!data) {
                    setError('No player data found');
                    setLoading(false);
                    return;
                }

                setPlayer(data);

                // Debug output of available player fields
                console.log('Player fields available:', Object.keys(data));
            } catch (err: any) {
                console.error('Error details:', err);
                if (err.statusCode === 400 && err.message?.includes('UUID')) {
                    setError('Invalid player ID format. Please check the URL.');
                } else if (err.statusCode === 404) {
                    setError('Player not found. They may have been deleted or may not exist.');
                } else {
                    setError('Failed to load player data: ' + (err.message || 'Unknown error'));
                }
            } finally {
                setLoading(false);
            }
        };

        if (playerId) {
            fetchPlayerData();
        }
    }, [playerId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <Loader className="animate-spin h-12 w-12 text-primary" />
            </div>
        );
    }

    if (error || !player) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-red-600">Error</h2>
                <p>{error || 'Player not found'}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    {/* Player Image Section */}
                    <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-8">
                        <div className="relative w-64 h-64 overflow-hidden rounded-full border-4 border-primary">
                            {player.image ? (
                                <Image
                                    src={player.image}
                                    alt={player.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                                    No Image
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Player Info Section */}
                    <div className="md:w-2/3 p-8">
                        <div className="flex items-center mb-4">
                            <h1 className="text-3xl font-bold">{player.name}</h1>
                            <span className="ml-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                                #{player.number}
                            </span>
                        </div>

                        {player.team && (
                            <Link href={`/clubs/${player.team.id}`} className="inline-block mb-6">
                                <div className="flex items-center text-primary hover:underline">
                                    {player.team.logo && (
                                        <Image
                                            src={player.team.logo}
                                            alt={player.team.name}
                                            width={24}
                                            height={24}
                                            className="mr-2"
                                        />
                                    )}
                                    <span>{player.team.name}</span>
                                </div>
                            </Link>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Player Information</h2>
                                <ul className="space-y-2">
                                    <li className="flex justify-between">
                                        <span className="font-medium text-gray-600">Position:</span>
                                        <span>{positionMap[player.position]}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="font-medium text-gray-600">Nationality:</span>
                                        <span>{player.nationality}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="font-medium text-gray-600">Date of Birth:</span>
                                        <span>{format(new Date(player.birthDate), 'dd MMM yyyy')}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="font-medium text-gray-600">Age:</span>
                                        <span>{calculateAge(player.birthDate)} years</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-4">Physical Attributes</h2>
                                <ul className="space-y-2">
                                    {player.height && (
                                        <li className="flex justify-between">
                                            <span className="font-medium text-gray-600">Height:</span>
                                            <span>{player.height} cm</span>
                                        </li>
                                    )}
                                    {player.weight && (
                                        <li className="flex justify-between">
                                            <span className="font-medium text-gray-600">Weight:</span>
                                            <span>{player.weight} kg</span>
                                        </li>
                                    )}
                                    {player.preferredFoot && (
                                        <li className="flex justify-between">
                                            <span className="font-medium text-gray-600">Preferred Foot:</span>
                                            <span>{footMap[player.preferredFoot]}</span>
                                        </li>
                                    )}
                                    <li className="flex justify-between">
                                        <span className="font-medium text-gray-600">Status:</span>
                                        <span className={player.isActive ? "text-green-600" : "text-red-600"}>
                                            {player.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {player.biography && (
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold mb-2">Biography</h2>
                                <p className="text-gray-700">{player.biography}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function to calculate age from birthdate
function calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

export default DetailPlayer;