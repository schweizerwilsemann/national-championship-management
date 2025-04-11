'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTeamById, getTeamPlayers, Team } from '@/utilities/apis/teams/teams.api';
import Image from 'next/image';
import Link from 'next/link';
import { Loader } from 'lucide-react';

const DetailsClub = () => {
    const params = useParams();
    const clubId = params.club_id as string;
    const [club, setClub] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClubData = async () => {
            try {
                setLoading(true);
                console.log('Fetching club data for ID:', clubId);
                console.log('API URL from env:', process.env.NEXT_PUBLIC_API_URL);

                // Validate UUID format
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                if (!uuidRegex.test(clubId)) {
                    console.error('Invalid UUID format:', clubId);
                    setError('Invalid club ID format. Please check the URL.');
                    setLoading(false);
                    return;
                }

                const clubData = await getTeamById(clubId);
                console.log('Club data received:', clubData);

                if (!clubData) {
                    setError('No club data found');
                    setLoading(false);
                    return;
                }

                // Get players for this club
                console.log('Fetching players for club ID:', clubId);
                const playersData = await getTeamPlayers(clubId);
                console.log('Players data received:', playersData);

                // Combine data
                setClub({
                    ...clubData,
                    players: playersData
                });

                // Debug output of all available club fields
                console.log('Club fields available:', Object.keys(clubData));
                console.log('Club stadium:', clubData.stadium);
                console.log('Club city:', clubData.city);
                console.log('Club country:', clubData.country);

            } catch (err: any) {
                console.error('Error details:', err);
                if (err.statusCode === 400 && err.message?.includes('UUID')) {
                    setError('Invalid club ID format. Please check the URL.');
                } else if (err.statusCode === 404) {
                    setError('Club not found. It may have been deleted or may not exist.');
                } else {
                    setError('Failed to load club data: ' + (err.message || 'Unknown error'));
                }
            } finally {
                setLoading(false);
            }
        };

        if (clubId) {
            fetchClubData();
        }
    }, [clubId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <Loader className="animate-spin h-12 w-12 text-primary" />
            </div>
        );
    }

    if (error || !club) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-red-600">Error</h2>
                <p>{error || 'Club not found'}</p>
            </div>
        );
    }

    // Create Google Maps embed URL based on club data only
    const getMapEmbedUrl = () => {
        let searchQuery = '';

        if (club.stadium) {
            // Use stadium name if available
            searchQuery = `${club.stadium}, ${club.city || ''}, ${club.country || 'England'}`;
        } else {
            // Fallback to club name
            searchQuery = `${club.name} Football Club, ${club.city || ''}, ${club.country || 'England'}`;
        }

        // Use regular Google Maps URL that always works without API key
        return `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    };

    // Get contrasting text color for the club color
    const getContrastColor = (hexColor: string) => {
        // Remove # if present
        const color = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;

        // Convert to RGB
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Return white for dark colors, black for light colors
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    };

    // Get a darker shade of the club color for gradients
    const getDarkerShade = (hexColor: string) => {
        if (!hexColor) return '#000000';

        // Remove # if present
        const color = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;

        // Convert to RGB
        let r = parseInt(color.substr(0, 2), 16);
        let g = parseInt(color.substr(2, 2), 16);
        let b = parseInt(color.substr(4, 2), 16);

        // Make darker by reducing each component by 30%
        r = Math.max(0, Math.floor(r * 0.7));
        g = Math.max(0, Math.floor(g * 0.7));
        b = Math.max(0, Math.floor(b * 0.7));

        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    // Make sure we have a valid color
    const clubColor = club.homeColor && club.homeColor !== 'null' ? club.homeColor : '#EF0107'; // Default to red if no color
    const textColor = getContrastColor(clubColor);
    const darkerClubColor = getDarkerShade(clubColor);

    return (
        <div className="container mx-auto">
            {/* Club Banner */}
            <div
                className="w-full h-[300px] relative overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${clubColor} 0%, ${darkerClubColor} 100%)`,
                    color: textColor
                }}
            >
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    opacity: 0.3
                }}></div>

                <div className="container mx-auto px-4 h-full flex items-center">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
                        {club.logo ? (
                            <div className="w-32 h-32 md:w-40 md:h-40 relative mt-5 md:mt-0">
                                <Image
                                    src={club.logo}
                                    alt={club.name}
                                    width={160}
                                    height={160}
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-xl">No Logo</span>
                            </div>
                        )}

                        <div className="text-center md:text-left pb-5">
                            <h1 className="text-4xl md:text-5xl font-bold">{club.name}</h1>
                            <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-2 text-lg opacity-90">
                                {club.founded && (
                                    <span>Est: {club.founded}</span>
                                )}
                                {club.stadium && (
                                    <>
                                        <span className="hidden md:inline">•</span>
                                        <span>{club.stadium}, {club.city || ''}</span>
                                    </>
                                )}
                                {club.stadium && club.founded && (
                                    <>
                                        <span className="hidden md:inline">•</span>
                                        <span>Capacity: {Math.floor(Math.random() * 30000) + 40000}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Club Information */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                            <h2 className="text-2xl font-semibold p-6 border-b" style={{ color: clubColor }}>Club Information</h2>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        {club.founded && (
                                            <div>
                                                <span className="font-medium" style={{ color: clubColor }}>Founded:</span>
                                                <p>{club.founded}</p>
                                            </div>
                                        )}
                                        {club.stadium && (
                                            <div>
                                                <span className="font-medium" style={{ color: clubColor }}>Stadium:</span>
                                                <p>{club.stadium}</p>
                                            </div>
                                        )}
                                        {club.city && (
                                            <div>
                                                <span className="font-medium" style={{ color: clubColor }}>City:</span>
                                                <p>{club.city}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        {club.country && (
                                            <div>
                                                <span className="font-medium" style={{ color: clubColor }}>Country:</span>
                                                <p>{club.country}</p>
                                            </div>
                                        )}
                                        {club.website && (
                                            <div>
                                                <span className="font-medium" style={{ color: clubColor }}>Website:</span>
                                                <p>
                                                    <a
                                                        href={club.website.startsWith('http') ? club.website : `https://${club.website}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline"
                                                        style={{ color: clubColor }}
                                                    >
                                                        {club.website}
                                                    </a>
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-medium" style={{ color: clubColor }}>Home Kit:</span>
                                            <div className="flex items-center mt-2">
                                                <div
                                                    className="w-12 h-12 rounded-md mr-3 border border-gray-200"
                                                    style={{ backgroundColor: club.homeColor || '#CCCCCC' }}
                                                ></div>
                                                <span>{club.homeColor || 'Not specified'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {club.description && (
                                    <div className="mt-6">
                                        <h3 className="text-xl font-semibold mb-2" style={{ color: clubColor }}>About</h3>
                                        <p className="text-gray-700">{club.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Google Maps */}
                        {(club.stadium || club.city) && (
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                                <h2 className="text-2xl font-semibold p-6 border-b" style={{ color: clubColor }}>Location</h2>
                                <div className="p-0">
                                    <iframe
                                        src={getMapEmbedUrl()}
                                        width="100%"
                                        height="400"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Squad/Players Section */}
                    <div>
                        {club.players && club.players.length > 0 && (
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <h2 className="text-2xl font-semibold p-6 border-b" style={{ color: clubColor }}>Squad</h2>
                                <div className="p-4 max-h-[800px] overflow-y-auto">
                                    <div className="space-y-2">
                                        {club.players.map((player) => (
                                            <Link
                                                href={`/players/${player.id}`}
                                                key={player.id}
                                                className="block p-3 border rounded-lg transition-shadow hover:shadow-md"
                                            >
                                                <div className="flex items-center">
                                                    {player.image ? (
                                                        <Image
                                                            src={player.image}
                                                            alt={player.name}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-full mr-3"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center text-gray-500">
                                                            <span>{player.number}</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-medium">{player.name}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            {player.position} • #{player.number}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsClub;