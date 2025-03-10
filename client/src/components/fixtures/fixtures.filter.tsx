"use client"
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface FixturesFilterProps {
    selectedTournament: string;
    setSelectedTournament: (tournament: string) => void;
    selectedTeam: string;
    setSelectedTeam: (team: string) => void;
    teams: string[];
    handleResetFilters: () => void;
}

const FixturesFilter: React.FC<FixturesFilterProps> = ({
    selectedTournament,
    setSelectedTournament,
    selectedTeam,
    setSelectedTeam,
    teams,
    handleResetFilters
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Filter by Competition</label>
                    <select
                        className="border border-gray-300 rounded p-2 min-w-48"
                        value={selectedTournament}
                        onChange={(e) => setSelectedTournament(e.target.value)}
                    >
                        <option>Premier League</option>
                        {/* Add more tournaments as needed */}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Filter by Club</label>
                    <select
                        className="border border-gray-300 rounded p-2 min-w-48"
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                    >
                        {teams.map(team => (
                            <option key={team} value={team}>{team}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                onClick={handleResetFilters}
                className="flex items-center text-purple-800 hover:text-purple-600 hover:cursor-pointer"
            >
                <RefreshCw size={16} className="mr-2" />
                RESET FILTERS
            </button>
        </div>
    );
};

export default FixturesFilter;