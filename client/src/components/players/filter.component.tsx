import React from 'react';

interface FilterComponentProps {
    season: string;
    club: string;
    setSeason: (value: string) => void;
    setClub: (value: string) => void;
    handleResetFilters: () => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
    season,
    club,
    setSeason,
    setClub,
    handleResetFilters,
}) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Season</label>
                    <div className="relative">
                        <select
                            value={season}
                            onChange={(e) => setSeason(e.target.value)}
                            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="2024/25">2024/25</option>
                            <option value="2023/24">2023/24</option>
                            <option value="2022/23">2022/23</option>
                        </select>
                    </div>
                </div>

                <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Club</label>
                    <div className="relative">
                        <select
                            value={club}
                            onChange={(e) => setClub(e.target.value)}
                            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="All Clubs">All Clubs</option>
                            <option value="1">Manchester United</option>
                            <option value="2">Liverpool</option>
                            <option value="3">Arsenal</option>
                            {/* Add more clubs as needed */}
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
