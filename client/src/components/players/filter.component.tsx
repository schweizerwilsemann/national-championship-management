import React, { useEffect, useState } from 'react';
import { fetchAllTeams } from '@/utilities/apis/teams/teams.api';

interface Team {
    id: string;
    name: string;
}

interface FilterComponentProps {
    club: string;
    setSeason: (value: string) => void;
    setClub: (value: string) => void;
    handleResetFilters: () => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
    club,
    setClub,
    handleResetFilters,
}) => {
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetchAllTeams(); // Giả định API trả về mảng các đội bóng
                setTeams(response);
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        };

        fetchTeams();
    }, []);

    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">

                <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Club</label>
                    <div className="relative">
                        <select
                            value={club}
                            onChange={(e) => setClub(e.target.value)}
                            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Clubs</option>
                            {teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <button
                onClick={handleResetFilters}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
                RESET FILTERS
            </button>
        </div>
    );
};

export default FilterComponent;
