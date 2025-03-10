"use client"
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface MatchProps {
    match: {
        id: string;
        time: string;
        homeTeam: {
            name: string;
            logo: string;
        };
        awayTeam: {
            name: string;
            logo: string;
        };
    };
}

const MatchListItem: React.FC<MatchProps> = ({ match }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="flex items-center justify-between border-b pb-4 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Left side content - Teams and match time */}
            <div className="flex items-center flex-1">
                {/* Home team */}
                <div className="flex items-center gap-2 mr-4">
                    <span className="font-bold text-lg text-right w-32 truncate">{match.homeTeam.name}</span>
                    <div className="w-8 h-8 relative">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <img
                                src={match.homeTeam.logo}
                                alt={match.homeTeam.name}
                                className="max-w-full max-h-full p-1"
                            />
                        </div>
                    </div>
                </div>

                {/* Match time */}
                <div className="px-4 py-1 bg-gray-100 text-center min-w-20 mx-2">
                    {match.time}
                </div>

                {/* Away team */}
                <div className="flex items-center gap-2 ml-4">
                    <div className="w-8 h-8 relative">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <img
                                src={match.awayTeam.logo}
                                alt={match.awayTeam.name}
                                className="max-w-full max-h-full p-1"
                            />
                        </div>
                    </div>
                    <span className="font-bold text-lg w-32 truncate">{match.awayTeam.name}</span>
                </div>
            </div>

            {/* Right side - Quick View button */}
            <div className="ml-4">
                <button
                    className={`flex items-center justify-center px-4 py-2 rounded-md ${isHovered ? 'bg-purple-700 text-white hover:cursor-pointer' : 'bg-emerald-200/50 text-purple-800'
                        } transition-colors duration-200`}
                >
                    <span className="mr-2">Quick View</span>
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default MatchListItem;