"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getFinishedMatches } from '@/utilities/apis/matches/get.finished.matches';
import { useOngoingTour } from '@/context/ongoing.tour.context';

interface Match {
    id: string;
    matchday: number;
    date: string;
    time: string;
    status: string;
    homeScore: number;
    awayScore: number;
    tournamentId: string;
    homeTeam: {
        name: string;
        logo?: string;
    };
    awayTeam: {
        name: string;
        logo?: string;
    };
}

interface GroupedMatches {
    [date: string]: Match[];
}

const FootballResultsPage = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [groupedMatches, setGroupedMatches] = useState<GroupedMatches>({});
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const { ongoingTournament, loading, error } = useOngoingTour();

    const fetchMatches = useCallback(async () => {
        if (!ongoingTournament?.id || !hasMore || isLoading) return;

        setIsLoading(true);
        try {
            // Delay the API call
            await new Promise(resolve => setTimeout(resolve, 700));

            const response = await getFinishedMatches(ongoingTournament.id, {
                page,
                limit: 10
            });

            // Extract matches from the response
            const newMatches: Match[] = (Object.values(response || {}).flat() as Match[]);

            if (newMatches.length === 0) {
                setHasMore(false);
            } else {
                // Merge new matches, avoiding duplicates
                setMatches(prevMatches => {
                    const combinedMatches = [...prevMatches, ...newMatches];
                    // Remove duplicates based on match ID
                    return Array.from(new Map(combinedMatches.map(m => [m.id, m])).values());
                });
                setPage(prevPage => prevPage + 1);
            }
        } catch (error) {
            console.error('Error fetching matches:', error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [page, hasMore, isLoading, ongoingTournament?.id]);

    // Group matches by date whenever the matches array changes
    useEffect(() => {
        const grouped = matches.reduce((groups: GroupedMatches, match) => {
            // Format the date for grouping
            const formattedDate = formatDateHeader(match.date);

            if (!groups[formattedDate]) {
                groups[formattedDate] = [];
            }

            groups[formattedDate].push(match);
            return groups;
        }, {});

        // Sort matches within each group by time
        Object.keys(grouped).forEach(date => {
            grouped[date].sort((a, b) => a.time.localeCompare(b.time));
        });

        setGroupedMatches(grouped);
    }, [matches]);

    // Intersection Observer to trigger loading more matches
    const lastMatchElementRef = useCallback((node: HTMLElement | null) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchMatches();
            }
        });

        if (node) observer.current.observe(node);
    }, [fetchMatches, hasMore, isLoading]);

    // Initial data fetch
    useEffect(() => {
        // Reset page and matches when tournament changes
        setPage(1);
        setMatches([]);
        setGroupedMatches({});
        setHasMore(true);

        // Only fetch if tournament ID exists
        if (ongoingTournament?.id) {
            fetchMatches();
        }
    }, [ongoingTournament?.id]);

    // Format date for display in header (day of week, day month year)
    const formatDateHeader = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return <div className="text-center py-4">Loading tournament data...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">Error loading tournament data</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6 text-center">
                {ongoingTournament?.name || 'Football'} Match Results
            </h1>

            {!ongoingTournament?.id ? (
                <div className="text-center py-4">No ongoing tournament found</div>
            ) : (
                <div className="space-y-8">
                    {Object.keys(groupedMatches).length === 0 && !isLoading ? (
                        <div className="text-center py-4">No matches found</div>
                    ) : (
                        Object.entries(groupedMatches).map(([date, dateMatches], dateIndex) => (
                            <div key={date} className="mb-6">
                                {/* Date header */}
                                <h2 className="text-xl font-bold text-purple-900 mb-2">{date}</h2>

                                {/* Divider line */}
                                <div className="border-b border-gray-200 mb-4"></div>

                                {/* Matches for this date */}
                                <div className="space-y-3">
                                    {dateMatches.map((match, matchIndex) => {
                                        const isLastElement =
                                            dateIndex === Object.keys(groupedMatches).length - 1 &&
                                            matchIndex === dateMatches.length - 1;

                                        return (
                                            <div
                                                ref={isLastElement ? lastMatchElementRef : null}
                                                key={match.id}
                                                className="flex items-center justify-between py-2"
                                            >
                                                {/* Home team */}
                                                <div className="flex items-center justify-end w-2/5 text-right">
                                                    <span className="font-semibold text-lg mr-3">{match.homeTeam.name}</span>
                                                    {match.homeTeam.logo && (
                                                        <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="h-8 w-8" />
                                                    )}
                                                </div>

                                                {/* Score */}
                                                <div className="flex-shrink-0 mx-2">
                                                    <div className="bg-purple-900 text-white font-bold px-4 py-1 rounded text-center min-w-16">
                                                        {match.homeScore} - {match.awayScore}
                                                    </div>
                                                </div>

                                                {/* Away team */}
                                                <div className="flex items-center w-2/5">
                                                    {match.awayTeam.logo && (
                                                        <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="h-8 w-8 mr-3" />
                                                    )}
                                                    <span className="font-semibold text-lg">{match.awayTeam.name}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Divider after each date group */}
                                <div className="border-b border-gray-200 mt-4"></div>
                            </div>
                        ))
                    )}

                    {isLoading && (
                        <div className="text-center py-4 text-zinc-500/50">
                            <p>Loading more contents...</p>
                        </div>
                    )}

                    {!hasMore && matches.length > 0 && (
                        <div className="text-center py-4 text-gray-500">
                            <p>No more matches to load</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FootballResultsPage;