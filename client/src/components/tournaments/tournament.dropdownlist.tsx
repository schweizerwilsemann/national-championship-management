"use client";

import React, { useState, useEffect } from "react";
import { getAllTournaments } from "@/utilities/apis/tournaments/get.tournament.api";
import PremierLeagueTable from "@/components/standings/table.component";
import ResultsComponent from "@/components/results/results.components";

interface Tournament {
    id: string;
    name: string;
    year: number;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    logo: string;
}

const TournamentDropdown = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await getAllTournaments();
                console.log(">>> check res: ", response);
                if (response.length === 0) throw new Error("Failed to fetch tournaments");
                const data: Tournament[] = response;
                setTournaments(data);
            } catch (err) {
                setError("Failed to load tournaments");
            } finally {
                setLoading(false);
            }
        };

        fetchTournaments();
    }, []);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const tournament = tournaments.find((t) => t.id === event.target.value) || null;
        setSelectedTournament(tournament);
    };

    if (loading) return <p>Loading tournaments...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <div className="p-4">
                <label className="block text-lg font-medium text-gray-700">Select a Tournament:</label>
                <select
                    className="mt-2 w-3xs p-2 border border-gray-300 rounded-lg"
                    onChange={handleSelectChange}
                    defaultValue=""
                >
                    <option value="" disabled>Select a tournament</option>
                    {tournaments.map((tournament) => (
                        <option key={tournament.id} value={tournament.id}>
                            {tournament.name}
                        </option>
                    ))}
                </select>

                {selectedTournament && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-xl font-bold">{selectedTournament.name} ({selectedTournament.year})</h2>
                        </div>
                        <p><strong>Status:</strong> {selectedTournament.status}</p>
                        <p><strong>Start:</strong> {new Date(selectedTournament.startDate).toLocaleDateString()}</p>
                        <p><strong>End:</strong> {new Date(selectedTournament.endDate).toLocaleDateString()}</p>
                        <p className="mt-2 text-gray-600">{selectedTournament.description}</p>
                    </div>
                )}
            </div>
            {selectedTournament && <PremierLeagueTable id={selectedTournament.id} />}
        </>
    );
};

export default TournamentDropdown;
