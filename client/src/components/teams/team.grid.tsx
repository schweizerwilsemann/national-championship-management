"use client"
import { JSX, useEffect, useState } from "react";
import TeamCard from "./team.card";
import { fetchAllTeams, Team } from "@/utilities/apis/teams/teams.api";

export default function TeamGrid(): JSX.Element {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTeams = async (): Promise<void> => {
            try {
                setLoading(true);
                const response = await fetchAllTeams();
                setTeams(response || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to load teams');
                setLoading(false);
            }
        };

        loadTeams();
    }, []);

    if (loading) return <div className="text-center py-10">Loading teams...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Premier League Teams</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {teams.map(team => (
                    <TeamCard key={team.id} team={team} />
                ))}
            </div>
        </div>
    );
}