"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getScheduledMatches } from '@/utilities/apis/matches/get.schedule.matches';
import { useOngoingTour } from '@/context/ongoing.tour.context';
import FixturesFilter from './fixtures.filter';// Update the import path as needed
import MatchListItem from './match.list.item';
// Types
interface Team {
    id: string;
    name: string;
    logo: string;
}

interface Match {
    id: string;
    matchday: number;
    date: string;
    time: string;
    status: string;
    homeScore: number | null;
    awayScore: number | null;
    highlights: string | null;
    tournamentId: string;
    homeTeamId: string;
    awayTeamId: string;
    homeTeam: {
        name: string;
        logo: string;
    };
    awayTeam: {
        name: string;
        logo: string;
    };
}

type GroupedMatches = Record<string, Match[]>;

// Format date for display
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
};

const MatchesSchedulePage = () => {
    const [matches, setMatches] = useState<GroupedMatches>({});
    const [filteredMatches, setFilteredMatches] = useState<GroupedMatches>({});
    const [selectedTeam, setSelectedTeam] = useState<string>('All Clubs');
    const [loading, setLoading] = useState<boolean>(true);
    const [teams, setTeams] = useState<string[]>(['All Clubs']);
    const [selectedTournament, setSelectedTournament] = useState<string>('Premier League');

    const { ongoingTournament } = useOngoingTour()

    // Fetch matches data
    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            try {
                const data: GroupedMatches = await getScheduledMatches(ongoingTournament?.id as string);

                setMatches(data);
                setFilteredMatches(data);

                // Extract team names for the filter
                const teamSet = new Set<string>(['All Clubs']);
                Object.values(data).flat().forEach(match => {
                    teamSet.add(match.homeTeam.name);
                    teamSet.add(match.awayTeam.name);
                });

                setTeams(Array.from(teamSet));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching matches:', error);
                setLoading(false);
            }
        };

        fetchMatches();
    }, [ongoingTournament?.id]);

    // Filter matches when team selection changes
    useEffect(() => {
        if (selectedTeam === 'All Clubs') {
            setFilteredMatches(matches);
            return;
        }

        const filtered: GroupedMatches = {};

        Object.entries(matches).forEach(([date, matchesList]) => {
            const filteredList = matchesList.filter(match =>
                match.homeTeam.name === selectedTeam || match.awayTeam.name === selectedTeam
            );

            if (filteredList.length > 0) {
                filtered[date] = filteredList;
            }
        });

        setFilteredMatches(filtered);
    }, [selectedTeam, matches]);

    // Reset filters handler
    const handleResetFilters = () => {
        setSelectedTeam('All Clubs');
        setSelectedTournament('Premier League');
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Head>
                <title>Football Matches Schedule</title>
                <meta name="description" content="Upcoming football matches schedule" />
            </Head>

            {/* Filters Component */}
            <FixturesFilter
                selectedTournament={selectedTournament}
                setSelectedTournament={setSelectedTournament}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
                teams={teams}
                handleResetFilters={handleResetFilters}
            />

            {/* Matches List */}
            {loading ? (
                <div className="text-center py-10">Loading matches...</div>
            ) : Object.keys(filteredMatches).length === 0 ? (
                <div className="text-center py-10">No matches found for the selected filters.</div>
            ) : (
                Object.entries(filteredMatches)
                    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                    .map(([date, matchesList]) => (
                        <div key={date} className="mb-10">
                            <h2 className="text-2xl font-bold text-purple-900 mb-6">{formatDate(date)}</h2>

                            <div className="space-y-4">
                                {matchesList.map(match => (
                                    <MatchListItem key={match.id} match={match} />
                                ))}
                            </div>
                        </div>
                    ))
            )}
        </div>
    );
};

export default MatchesSchedulePage;