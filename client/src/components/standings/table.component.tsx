"use client"
import React, { useEffect, useState } from 'react';
import { fetchStanding } from '@/utilities/apis/standings/get.standing';

interface Team {
    id: string;
    position: number;
    team: {
        name: string;
        logo: string;
    };
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    form: string;
    createdAt: string;
    updatedAt: string;
    teamId: string;
    tournamentId: string;
}

interface IProps {
    id: string;
}

const PremierLeagueTable = (props: IProps) => {
    const { id } = props;
    if (!id) {
        return null;
    }

    const [tableData, setTableData] = useState<Team[]>([]);
    const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchStanding(id);
                const data: Team[] = response || [];
                setTableData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    const toggleExpand = (teamId: string) => {
        setExpandedTeam(expandedTeam === teamId ? null : teamId);
    };

    // Function to determine qualification zone colors
    const getPositionColor = (position: number) => {
        if (position <= 4) return "bg-blue-600"; // Champions League qualification
        if (position <= 6) return "bg-orange-500"; // Europa League qualification
        if (position === 7) return "bg-green-500"; // Conference League qualification
        return "";
    };

    // Function to get result color
    const getResultColor = (result: string) => {
        switch (result) {
            case 'W': return "bg-green-500 text-white";
            case 'D': return "bg-blue-500 text-white";
            case 'L': return "bg-red-500 text-white";
            default: return "bg-gray-300";
        }
    };

    return (
        <div className="container mx-auto p-4 bg-gray-100">
            <div className="flex items-center justify-center gap-2 mb-6">
                <h1 className="text-2xl font-bold text-purple-900 text-center">Premier League</h1>
            </div>

            {/* Legend */}
            <div className="mb-4 flex flex-wrap gap-4 justify-center text-sm">
                <div className="flex items-center">
                    <span className="w-4 h-4 bg-blue-600 inline-block mr-2"></span>
                    <span>Champions League qualification</span>
                </div>
                <div className="flex items-center">
                    <span className="w-4 h-4 bg-orange-500 inline-block mr-2"></span>
                    <span>Europa League qualification</span>
                </div>
                <div className="flex items-center">
                    <span className="w-4 h-4 bg-green-500 inline-block mr-2"></span>
                    <span>Conference League qualification</span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-purple-900 text-white">
                            <th className="p-3 text-left font-semibold">Position</th>
                            <th className="p-3 text-left font-semibold">Club</th>
                            <th className="p-3 text-left font-semibold">Played</th>
                            <th className="p-3 text-left font-semibold">Won</th>
                            <th className="p-3 text-left font-semibold">Drawn</th>
                            <th className="p-3 text-left font-semibold">Lost</th>
                            <th className="p-3 text-left font-semibold">GF</th>
                            <th className="p-3 text-left font-semibold">GA</th>
                            <th className="p-3 text-left font-semibold">GD</th>
                            <th className="p-3 text-left font-semibold">Points</th>
                            <th className="p-3 text-left font-semibold">Form</th>
                            <th className="p-3 text-left font-semibold">More</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.length > 0 ? (
                            tableData.map((team, index) => (
                                <React.Fragment key={team.id}>
                                    <tr className={`border-b border-gray-200 hover:bg-gray-50 ${expandedTeam === team.id ? 'bg-gray-50' : ''}`}>
                                        <td className="p-3 relative">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPositionColor(index + 1)}`}></div>
                                            {index + 1}
                                        </td>
                                        <td className="p-3 flex items-center gap-2">
                                            <img
                                                src={team.team.logo}
                                                alt={team.team.name}
                                                className="w-6 h-6"
                                                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-team.png" }}
                                            />
                                            <span className="font-medium">{team.team.name}</span>
                                        </td>
                                        <td className="p-3">{team.played}</td>
                                        <td className="p-3">{team.won}</td>
                                        <td className="p-3">{team.drawn}</td>
                                        <td className="p-3">{team.lost}</td>
                                        <td className="p-3">{team.goalsFor}</td>
                                        <td className="p-3">{team.goalsAgainst}</td>
                                        <td className="p-3">{team.goalDifference}</td>
                                        <td className="p-3 font-bold">{team.points}</td>
                                        <td className="p-3">
                                            <div className="flex gap-1">
                                                {team.form.split('').map((result, idx) => (
                                                    <span
                                                        key={idx}
                                                        className={`w-6 h-6 rounded-full flex items-center justify-center ${getResultColor(result)}`}
                                                    >
                                                        {result}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-3 cursor-pointer" onClick={() => toggleExpand(team.id)}>
                                            {expandedTeam === team.id ? (
                                                <span className="text-xl">&#9650;</span>
                                            ) : (
                                                <span className="text-xl">&#9660;</span>
                                            )}
                                        </td>
                                    </tr>
                                    {expandedTeam === team.id && (
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <td colSpan={12} className="p-4">
                                                <div className="grid grid-cols-1 gap-4">
                                                    {/* Team Info */}
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={team.team.logo}
                                                            alt={team.team.name}
                                                            className="w-12 h-12"
                                                            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-team.png" }}
                                                        />
                                                        <h3 className="text-xl font-bold">{team.team.name}</h3>
                                                    </div>

                                                    {/* Team Stats Summary */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                                        <div className="bg-white p-3 rounded shadow">
                                                            <h4 className="text-sm font-semibold text-gray-500">Matches Played</h4>
                                                            <p className="text-2xl font-bold">{team.played}</p>
                                                        </div>
                                                        <div className="bg-white p-3 rounded shadow">
                                                            <h4 className="text-sm font-semibold text-gray-500">Total Points</h4>
                                                            <p className="text-2xl font-bold">{team.points}</p>
                                                        </div>
                                                        <div className="bg-white p-3 rounded shadow">
                                                            <h4 className="text-sm font-semibold text-gray-500">Win Rate</h4>
                                                            <p className="text-2xl font-bold">
                                                                {team.played > 0 ? Math.round((team.won / team.played) * 100) : 0}%
                                                            </p>
                                                        </div>
                                                        <div className="bg-white p-3 rounded shadow">
                                                            <h4 className="text-sm font-semibold text-gray-500">Goal Difference</h4>
                                                            <p className="text-2xl font-bold">{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</p>
                                                        </div>
                                                    </div>

                                                    {/* Form Chart */}
                                                    <div className="mt-4">
                                                        <h4 className="text-sm font-semibold mb-2">Form Analysis (Last 5 Games)</h4>
                                                        <div className="bg-white p-4 rounded shadow">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-medium">Recent Form:</span>
                                                                <div className="flex gap-1">
                                                                    {team.form.split('').map((result, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className={`w-6 h-6 rounded-full flex items-center justify-center ${getResultColor(result)}`}
                                                                        >
                                                                            {result}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-medium">Points from last 5 games:</span>
                                                                <span className="font-bold">
                                                                    {team.form.split('').reduce((acc, result) => {
                                                                        if (result === 'W') return acc + 3;
                                                                        if (result === 'D') return acc + 1;
                                                                        return acc;
                                                                    }, 0)} / 15
                                                                </span>
                                                            </div>

                                                            <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                                                                    style={{
                                                                        width: `${(team.form.split('').reduce((acc, result) => {
                                                                            if (result === 'W') return acc + 3;
                                                                            if (result === 'D') return acc + 1;
                                                                            return acc;
                                                                        }, 0) / 15) * 100}%`
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Visit Club Page Button */}
                                                    <div className="mt-4">
                                                        <button className="bg-purple-900 text-white py-2 px-4 rounded-md">
                                                            Visit Club Page
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={12} className="p-3 text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PremierLeagueTable;