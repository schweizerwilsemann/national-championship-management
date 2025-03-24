'use client'; // Mark this as a Client Component

import React from 'react';
import { useRouter } from 'next/navigation';

interface PaginationControlsProps {
    startIndex: number;
    postsLength: number;
    limit: number;
    currentCategory: string;
    currentSort: 'asc' | 'desc';
    currentSearchTerm: string;
}

export default function PaginationControls({
    startIndex,
    postsLength,
    limit,
    currentCategory,
    currentSort,
    currentSearchTerm
}: PaginationControlsProps) {
    const router = useRouter();

    // Function to navigate to previous page
    const goToPreviousPage = () => {
        if (startIndex === 0) return;

        const newStartIndex = Math.max(0, startIndex - limit);
        const params = new URLSearchParams({
            ...(currentCategory && { category: currentCategory }),
            ...(currentSort !== 'desc' && { sort: currentSort }),
            ...(currentSearchTerm && { searchTerm: currentSearchTerm }),
            limit: limit.toString(),
            startIndex: newStartIndex.toString()
        });

        router.push(`/news?${params.toString()}`);
    };

    // Function to navigate to next page
    const goToNextPage = () => {
        if (postsLength < limit) return;

        const newStartIndex = startIndex + limit;
        const params = new URLSearchParams({
            ...(currentCategory && { category: currentCategory }),
            ...(currentSort !== 'desc' && { sort: currentSort }),
            ...(currentSearchTerm && { searchTerm: currentSearchTerm }),
            limit: limit.toString(),
            startIndex: newStartIndex.toString()
        });

        router.push(`/news?${params.toString()}`);
    };

    return (
        <div className="flex justify-between items-center">
            <button
                disabled={startIndex === 0}
                onClick={goToPreviousPage}
                className={`px-4 py-2 rounded font-medium ${startIndex === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
            >
                Previous
            </button>

            <span className="text-gray-600">
                Showing {startIndex + 1} to {startIndex + postsLength}
            </span>

            <button
                disabled={postsLength < limit}
                onClick={goToNextPage}
                className={`px-4 py-2 rounded font-medium ${postsLength < limit
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
            >
                Next
            </button>
        </div>
    );
}