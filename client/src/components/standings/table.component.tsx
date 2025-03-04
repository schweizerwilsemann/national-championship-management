"use client"
import React, { useEffect, useState } from 'react';
import { fetchStanding } from '@/utilities/apis/standings/get.standing';

interface Team {
    id: string;
    position: number;
    team: { name: string };
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
        return null; // Return null instead of undefined
    }
    const [tableData, setTableData] = useState<Team[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchStanding(id);
                const data: Team[] = response || []; // Ensure data is an array
                setTableData(data);
                console.log(">>> check table data: ", data)
            } catch (error) {
                console.error('Error fetching data:', error);
                return;
            }
        };

        fetchData();
    }, [id]);
    return (
        <div className="container mx-auto p-4 bg-gray-100">
            <h1 className="text-2xl font-bold text-blue-500 text-center mb-4">Tables</h1>
            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-4 justify-center items-center">
                <select className="p-2 border border-gray-300 rounded">
                    <option value="premier-league">Premier League</option>
                </select>
                <select className="p-2 border border-gray-300 rounded">
                    <option value="2024/25">2024/25</option>
                </select>
                <select className="p-2 border border-gray-300 rounded">
                    <option value="all">All Matchweeks</option>
                </select>
                <select className="p-2 border border-gray-300 rounded">
                    <option value="all">All Matches</option>
                </select>
                <button className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-100">RESET FILTERS</button>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md">
                    <thead>
                        <tr className="bg-blue-50">
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
                            <th className="p-3 text-left font-semibold">Next</th>
                            <th className="p-3 text-left font-semibold">More</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.length > 0 ? (
                            tableData.map((team) => (
                                <tr key={team.position} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-3">{team.position}.</td>
                                    <td className="p-3">{team.team.name}</td>
                                    <td className="p-3">{team.played}</td>
                                    <td className="p-3">{team.won}</td>
                                    <td className="p-3">{team.drawn}</td>
                                    <td className="p-3">{team.lost}</td>
                                    <td className="p-3">{team.goalsFor}</td>
                                    <td className="p-3">{team.goalsAgainst}</td>
                                    <td className="p-3">{team.goalDifference}</td>
                                    <td className="p-3">{team.points}</td>
                                    <td className="p-3">
                                        <div className="flex gap-1">
                                            {team.form.split('').map((result, index) => (
                                                <span
                                                    key={index}
                                                    className={
                                                        result === 'W' ? 'text-green-500' :
                                                            result === 'D' ? 'text-blue-500' :
                                                                'text-red-500'
                                                    }
                                                >
                                                    {result}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-3">▼</td>
                                    <td className="p-3">▼</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={13} className="p-3 text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PremierLeagueTable;