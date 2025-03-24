// NewsPage.tsx - Server Component
import React from 'react';
import { getNews, GetNewsParams } from '@/utilities/apis/socials/news/news.api';
import NewsGrid from '@/components/news/grid.component';
import NewsFilters from '@/components/news/news.filter';
import PaginationControls from '@/components/news/pagination.control';

interface Post {
    _id: string;
    title: string;
    category: string;
    content: string;
    image: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

interface NewsResponse {
    posts: Post[];
}

interface SearchParams {
    category?: string;
    sort?: 'asc' | 'desc';
    limit?: string;
    startIndex?: string;
    searchTerm?: string;
}

interface NewsPageProps {
    searchParams?: SearchParams;
}

// Pre-defined category options
const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'uncategorized', label: 'Uncategorized' },
    { value: 'news', label: 'News' },
    { value: 'injury-news', label: 'Injury News' },
    { value: 'transfers', label: 'Transfers' },
    { value: 'squads', label: 'Squads' },
    { value: 'matches', label: 'Match Reports' },
    { value: 'tactics', label: 'Tactical Analysis' },
    { value: 'statistics', label: 'Statistics & Records' },
    { value: 'opinion', label: 'Opinion & Editorials' },
    { value: 'fan-zone', label: 'Fan Zone' },
    { value: 'history', label: 'Football History' },
    { value: 'youth', label: 'Youth & Academy' },
    { value: 'international', label: 'International Football' },
    { value: 'domestic', label: 'Domestic Leagues' },
    { value: 'awards', label: 'Awards & Recognitions' }
];

export default async function NewsPage({
    searchParams: searchParamsPromise,
}: Readonly<{ searchParams: Promise<SearchParams> }>) {
    try {
        const searchParams = await searchParamsPromise;
        // Extract all filter parameters from search params
        const category = searchParams?.category || '';
        const sort = (searchParams?.sort as 'asc' | 'desc') || 'desc';
        const limit = searchParams?.limit ? parseInt(searchParams.limit) : 12;
        const startIndex = searchParams?.startIndex ? parseInt(searchParams.startIndex) : 0;
        const searchTerm = searchParams?.searchTerm || '';

        // Pass all parameters to the getNews function
        const response = await getNews({
            category,
            sort,
            limit,
            startIndex,
            searchTerm
        } as GetNewsParams);

        const data = response as NewsResponse;

        // Transform the posts to ensure category is always a string
        const posts = data.posts.map(post => ({
            ...post,
            category: post.category || 'uncategorized'
        }));

        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">
                            Latest Football News
                        </h1>

                        <NewsFilters
                            currentCategory={category}
                            currentSort={sort}
                            currentSearchTerm={searchTerm}
                            categoryOptions={categoryOptions}
                        />
                    </div>

                    {posts.length > 0 ? (
                        <>
                            <NewsGrid posts={posts} />

                            <div className="mt-8">
                                <PaginationControls
                                    startIndex={startIndex}
                                    postsLength={posts.length}
                                    limit={limit}
                                    currentCategory={category}
                                    currentSort={sort}
                                    currentSearchTerm={searchTerm}
                                />
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-600 text-center py-12">No news articles found matching your criteria.</p>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Failed to fetch news:", error);
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-red-500">Failed to load news. Please try again later.</p>
            </div>
        );
    }
}