// pages/teams/index.tsx
import React from 'react';
import { Team } from '@/utilities/apis/teams/teams.api';
import Link from 'next/link';

// Team Card Component
const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
    // Default to a light gray if no team color is provided
    const teamColor = team.homeColor || '#f0f0f0';

    return (
        <Link href={`/clubs/${team.id}`} passHref>
            <div
                className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 w-full cursor-pointer group"
                // Use CSS variables to store the team color and apply it in various places
                style={{
                    '--team-color': teamColor,
                    '--team-color-10': `${teamColor}10`,
                    '--team-color-40': `${teamColor}40`
                } as React.CSSProperties}
            >
                <div className="flex items-center p-4 h-32">
                    <div className="flex-shrink-0 mr-4">
                        <img
                            src={team.logo}
                            alt={`${team.name} logo`}
                            className="w-16 h-16 object-contain"
                        />
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
                        <p className="text-sm text-gray-500">{team.shortName}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <div
                            className="w-8 h-8 flex items-center justify-center rounded-full transform group-hover:scale-110 transition-transform duration-300"
                            style={{ backgroundColor: 'var(--team-color)' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Left border with team color */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-2 transition-all duration-300"
                    style={{ backgroundColor: 'var(--team-color)' }}
                ></div>

                {/* Overlay with team color on hover */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{ backgroundColor: 'var(--team-color)' }}
                ></div>
            </div>
        </Link>
    );
};

export default TeamCard;