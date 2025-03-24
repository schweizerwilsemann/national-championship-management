"use client"
import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { getScheduledMatches } from '@/utilities/apis/matches/get.schedule.matches';
import { useOngoingTour } from '@/context/ongoing.tour.context';
import FixturesFilter from './fixtures.filter';
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

interface MatchesResponse {
    data: Record<string, Match[]>;
    meta: {
        total: number;
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
    const [matches, setMatches] = useState<Match[]>([]);
    const [groupedMatches, setGroupedMatches] = useState<GroupedMatches>({});
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [totalMatches, setTotalMatches] = useState<number>(0);
    const [teams, setTeams] = useState<string[]>(['All Clubs']);
    const [selectedTeam, setSelectedTeam] = useState<string>('All Clubs');
    const [selectedTournament, setSelectedTournament] = useState<string>('Premier League');
    const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);
    const [manualLoadTriggered, setManualLoadTriggered] = useState<boolean>(false);
    const [loadingTimerId, setLoadingTimerId] = useState<NodeJS.Timeout | null>(null);

    const loadMoreRef = useRef<HTMLDivElement>(null);
    const { ongoingTournament } = useOngoingTour();

    const PAGE_SIZE = 10;

    // Enhanced fetch matches function with throttling
    const fetchMatches = useCallback(async () => {
        if (!ongoingTournament?.id || !hasMore || isLoading) return;

        setIsLoading(true);
        console.log("Fetching more matches, page:", page);

        // Add a simulated delay to show loading indicator for at least 1 second
        const timer = setTimeout(async () => {
            try {
                const response: MatchesResponse = await getScheduledMatches(
                    ongoingTournament.id,
                    { page, limit: PAGE_SIZE }
                );

                const newMatches = Object.values(response.data).flat();
                setTotalMatches(response.meta.total);

                // Check if there are more records to load
                setHasMore((page * PAGE_SIZE) < response.meta.total);

                if (newMatches.length === 0) {
                    setHasMore(false);
                } else {
                    // Important: Add new matches to the END of the existing array
                    setMatches(prevMatches => [...prevMatches, ...newMatches.filter(m => !prevMatches.some(pm => pm.id === m.id))]);


                    // Increment page for next fetch
                    setPage(prevPage => prevPage + 1);
                }

                // Only get team list on first fetch
                if (page === 1) {
                    const teamSet = new Set<string>(['All Clubs']);
                    newMatches.forEach(match => {
                        teamSet.add(match.homeTeam.name);
                        teamSet.add(match.awayTeam.name);
                    });
                    setTeams(Array.from(teamSet));
                    setInitialLoadComplete(true);
                }
            } catch (error) {
                console.error('Error fetching matches:', error);
                setHasMore(false);
            } finally {
                setIsLoading(false);
                setManualLoadTriggered(false);
            }
        }, 1000); // 1 second delay to show loading indicator

        setLoadingTimerId(timer);

        return () => {
            if (loadingTimerId) {
                clearTimeout(loadingTimerId);
            }
        };
    }, [page, hasMore, isLoading, ongoingTournament?.id, loadingTimerId]);

    // Handle manual load more button click
    const handleManualLoadMore = () => {
        if (!isLoading && hasMore) {
            setManualLoadTriggered(true);
            fetchMatches();
        }
    };

    // Group and filter matches whenever the matches array changes
    useEffect(() => {
        // Filter matches by team
        let filteredMatches = [...matches];
        if (selectedTeam !== 'All Clubs') {
            filteredMatches = filteredMatches.filter(match =>
                match.homeTeam.name === selectedTeam || match.awayTeam.name === selectedTeam
            );
        }

        // Group by date
        const grouped = filteredMatches.reduce((groups: GroupedMatches, match) => {
            const date = match.date;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(match);
            return groups;
        }, {});

        // Sort matches within each group by time
        Object.keys(grouped).forEach(date => {
            grouped[date].sort((a, b) => a.time.localeCompare(b.time));
        });

        setGroupedMatches(grouped);
    }, [matches, selectedTeam]);

    // Reset filters handler
    const handleResetFilters = () => {
        setSelectedTeam('All Clubs');
        setSelectedTournament('Premier League');
    };

    // Improved Intersection Observer setup
    useEffect(() => {
        if (!loadMoreRef.current || isLoading || !hasMore || manualLoadTriggered) return;

        console.log("Setting up IntersectionObserver for loadMoreRef");

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            console.log("Intersection observed:", entry.isIntersecting);

            if (entry.isIntersecting && hasMore && initialLoadComplete && !isLoading) {
                console.log("Triggering fetch from intersection");
                fetchMatches();
            }
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1,
            rootMargin: '0px 0px 200px 0px' // Expanded area below viewport to trigger earlier
        });

        observer.observe(loadMoreRef.current);

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
                console.log("IntersectionObserver disconnected");
            }
        };
    }, [fetchMatches, hasMore, isLoading, initialLoadComplete, manualLoadTriggered]);

    // Initial data fetch when tournament changes
    useEffect(() => {
        // Reset everything when tournament changes
        setPage(1);
        setMatches([]);
        setGroupedMatches({});
        setHasMore(true);
        setSelectedTeam('All Clubs');
        setInitialLoadComplete(false);

        // Only fetch if tournament ID exists
        if (ongoingTournament?.id) {
            fetchMatches();
        }

        // Clean up any pending timers when component unmounts or tournament changes
        return () => {
            if (loadingTimerId) {
                clearTimeout(loadingTimerId);
            }
        };
    }, [ongoingTournament?.id]);

    // Calculate displayed matches count
    const displayedMatchesCount = Object.values(groupedMatches).flat().length;

    // Enhanced scroll event to trigger loading more matches
    useEffect(() => {
        if (!hasMore || isLoading || manualLoadTriggered) return;

        const handleScroll = () => {
            // Only process after initial data has loaded
            if (!initialLoadComplete) return;

            // Check if user has scrolled near the bottom of the page
            const scrollPosition = window.innerHeight + window.scrollY;
            const documentHeight = document.documentElement.offsetHeight;
            const scrollThreshold = documentHeight - 200; // 200px from the bottom

            if (scrollPosition >= scrollThreshold && hasMore && !isLoading) {
                console.log("Scroll near bottom detected, triggering fetch");
                fetchMatches();
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hasMore, isLoading, initialLoadComplete, fetchMatches, manualLoadTriggered]);

    // Cleanup timer on component unmount
    useEffect(() => {
        return () => {
            if (loadingTimerId) {
                clearTimeout(loadingTimerId);
            }
        };
    }, [loadingTimerId]);

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

            {/* Stats Bar showing match count */}
            <div className="bg-gray-100 rounded-md p-3 mb-6">
                <p className="text-sm text-gray-600">
                    {matches.length === 0 && isLoading ? 'Loading matches...' :
                        `Showing ${displayedMatchesCount} ${selectedTeam !== 'All Clubs' ? `${selectedTeam} ` : ''}match${displayedMatchesCount !== 1 ? 'es' : ''} of ${totalMatches} total`}
                </p>
            </div>

            {/* Matches List */}
            {matches.length === 0 && isLoading ? (
                <div className="flex justify-center py-10">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                    <p className="ml-3 text-gray-600">Loading matches...</p>
                </div>
            ) : Object.keys(groupedMatches).length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No matches found for the selected filters.</p>
                    <button
                        onClick={handleResetFilters}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Display matches in chronological order - oldest first */}
                    {Object.entries(groupedMatches)
                        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                        .map(([date, matchesList]) => (
                            <div key={date} className="mb-10">
                                <h2 className="text-2xl font-bold text-purple-900 mb-6">{formatDate(date)}</h2>

                                <div className="space-y-4">
                                    {matchesList.map((match) => (
                                        <div key={match.id}>
                                            <MatchListItem match={match} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                    {/* Loading indicator - now positioned at the bottom */}
                    {isLoading && (
                        <div className="text-center py-6">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                            <p className="mt-2 text-gray-600">Loading more matches...</p>
                        </div>
                    )}

                    {/* Manual load more button - combined approach */}
                    {hasMore && !isLoading && (
                        <div className="text-center py-6">
                            <button
                                onClick={handleManualLoadMore}
                                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                            >
                                Load more matches
                            </button>
                            <div ref={loadMoreRef} className="h-10 my-4">
                                <p className="text-gray-500">Or scroll down to see more</p>
                            </div>
                        </div>
                    )}

                    {/* End of list message */}
                    {!hasMore && !isLoading && matches.length > 0 && (
                        <div className="text-center py-6 text-gray-500">
                            <p>You've seen all available matches</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MatchesSchedulePage;