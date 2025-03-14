"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getPlayersPagination, filterPlayers } from '@/utilities/apis/players/players.api';
import SearchPlayerComponent from './search.component';
import FilterComponent from './filter.component';

// Types
interface Player {
    id: string;
    name: string;
    position: string;
    nationality: string;
    imageUrl?: string;
}

interface PlayerTableProps {
    initialPlayers?: Player[];
    initialMeta?: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}

const PlayerTable: React.FC<PlayerTableProps> = ({
    initialPlayers = [],
    initialMeta = {
        totalItems: 0,
        itemCount: 0,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1
    }
}) => {
    const router = useRouter();
    const [players, setPlayers] = useState<Player[]>(initialPlayers);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(initialMeta.currentPage);
    const [pageSize] = useState<number>(initialMeta.itemsPerPage);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const observer = useRef<IntersectionObserver | null>(null);

    // Filter states
    const [nameFilter, setNameFilter] = useState<string>('');
    const [season, setSeason] = useState<string>("2024/25");
    const [club, setClub] = useState<string>("All Clubs");
    const [teamFilter, setTeamFilter] = useState<string>('');
    const [nationalityFilter, setNationalityFilter] = useState<string>('');

    // Fetch players based on current filters and pagination
    const fetchPlayers = useCallback(async (resetPage: boolean = false, searchTerm?: string) => {
        if (loading || (!hasMore && !resetPage)) return;

        setLoading(true);
        try {
            const currentPage = resetPage ? 1 : page;

            await new Promise(resolve => setTimeout(resolve, 500));
            let response;
            const currentNameFilter = searchTerm !== undefined ? searchTerm : nameFilter;
            if (currentNameFilter) {
                response = await filterPlayers({ name: currentNameFilter });
            }
            if (nameFilter) {
                response = await filterPlayers({ name: nameFilter });
            } else if (club === "All Clubs") {
                response = await getPlayersPagination({ page: currentPage, pageSize });
            } else {
                response = await filterPlayers({
                    teamId: club,
                    name: nameFilter,
                    nationality: nationalityFilter,
                });
            }

            // ✅ Kiểm tra response trước khi sử dụng
            if (!response || typeof response !== "object") {
                console.error("Invalid response:", response);
                setPlayers(resetPage ? [] : prevPlayers => [...prevPlayers]);
                setHasMore(false);
                return;
            }

            const playerData = Array.isArray(response) ? response : response.data || [];

            if (!Array.isArray(playerData)) {
                console.error("Unexpected response structure:", response);
                setPlayers(resetPage ? [] : prevPlayers => [...prevPlayers]);
                setHasMore(false);
                return;
            }

            if (playerData.length === 0) {
                setHasMore(false);
            } else {
                setPlayers(prevPlayers => resetPage ? playerData : [...prevPlayers, ...playerData]);
                setHasMore(playerData.length === pageSize);
                setPage(resetPage ? 2 : page + 1);
            }
        } catch (error) {
            console.error("Error fetching players:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, nameFilter, club, nationalityFilter, loading, hasMore]);

    // Intersection Observer to trigger loading more players
    const lastPlayerElementRef = useCallback((node: HTMLTableRowElement | null) => {
        if (loading) return;

        // Disconnect the previous observer
        if (observer.current) observer.current.disconnect();

        // Create a new observer
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchPlayers();
            }
        });

        // Observe the new node
        if (node) observer.current.observe(node);
    }, [loading, hasMore, fetchPlayers]);

    // Initial data fetch and when filters change
    useEffect(() => {
        setHasMore(true);
        fetchPlayers(true);
    }, [season, club]);


    // Reset filters
    const handleResetFilters = () => {
        setNameFilter('');
        setTeamFilter('');
        setNationalityFilter('');
        setSeason("2024/25");
        setClub("All Clubs");
        setHasMore(true);
        setPage(1);
    };

    // Handle search input
    const handleSearch = (e?: React.FormEvent<HTMLFormElement>, searchValue?: string) => {
        if (e) e.preventDefault();
        setPage(1);
        setHasMore(true);

        // Use the passed value if provided, otherwise use the state
        const searchTerm = searchValue !== undefined ? searchValue : nameFilter;
        fetchPlayers(true, searchTerm);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-8 rounded-t-lg">
                <SearchPlayerComponent
                    nameFilter={nameFilter}
                    setNameFilter={setNameFilter}
                    handleSearch={handleSearch}
                />
            </div>

            <div className="bg-white p-6 rounded-b-lg shadow-md">
                <FilterComponent
                    club={club}
                    setSeason={setSeason}
                    setClub={setClub}
                    handleResetFilters={handleResetFilters}
                />
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                                    Player
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                                    Position
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                                    Nationality
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {players.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-center">
                                        No players found
                                    </td>
                                </tr>
                            ) : (
                                players.map((player, index) => (
                                    <tr
                                        key={player.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => router.push(`/players/${player.id}`)}
                                        ref={index === players.length - 1 ? lastPlayerElementRef : null}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 relative">
                                                    {player.imageUrl ? (
                                                        <Image
                                                            src={player.imageUrl}
                                                            alt={player.name}
                                                            width={48}
                                                            height={48}
                                                            className="rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-500 text-sm">
                                                                {player.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-md font-medium text-purple-900">
                                                        {player.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                                            {player.position}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-md">
                                            <div className="flex items-center">
                                                {player.nationality === "England" && (
                                                    <span className="mr-2">
                                                        <svg width="24" height="16" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="24" height="16" fill="#FFFFFF" />
                                                            <rect width="24" height="2" y="7" fill="#CE1124" />
                                                            <rect width="2" height="16" x="11" fill="#CE1124" />
                                                        </svg>
                                                    </span>
                                                )}
                                                <span>{player.nationality}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="text-center py-4 text-gray-500">
                        <p>Loading more players...</p>
                    </div>
                )}

                {!hasMore && players.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                        <p>No more players to load</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerTable;