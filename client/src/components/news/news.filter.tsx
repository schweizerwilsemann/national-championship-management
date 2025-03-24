// NewsFilters.tsx
import React from 'react';

// News filters component props
interface NewsFiltersProps {
    currentCategory: string;
    currentSort: 'asc' | 'desc';
    currentSearchTerm: string;
    categoryOptions: Array<{ value: string; label: string }>;
}

// News filters component with search, category, and sort options
export default function NewsFilters({ 
    currentCategory, 
    currentSort, 
    currentSearchTerm, 
    categoryOptions 
}: NewsFiltersProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <form action="/news" method="get" className="space-y-4">
                {/* Search input */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow">
                        <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
                            Search
                        </label>
                        <input
                            type="text"
                            id="searchTerm"
                            name="searchTerm"
                            defaultValue={currentSearchTerm}
                            placeholder="Search for news..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div className="sm:w-1/4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            defaultValue={currentCategory}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        >
                            {categoryOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:w-1/6">
                        <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                            Sort
                        </label>
                        <select
                            id="sort"
                            name="sort"
                            defaultValue={currentSort}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="desc">Newest</option>
                            <option value="asc">Oldest</option>
                        </select>
                    </div>
                </div>

                {/* Hidden fields to preserve other params */}
                <input type="hidden" name="limit" value="12" />

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </form>

            {/* Active filters display */}
            {(currentCategory || currentSearchTerm || currentSort !== 'desc') && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-gray-600">Active filters:</span>

                        {currentCategory && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                Category: {categoryOptions.find(opt => opt.value === currentCategory)?.label || currentCategory}
                                <a href={`/news?${new URLSearchParams({
                                    ...(currentSearchTerm && { searchTerm: currentSearchTerm }),
                                    ...(currentSort !== 'desc' && { sort: currentSort })
                                }).toString()}`} className="ml-2 text-green-600 hover:text-green-900">
                                    &times;
                                </a>
                            </span>
                        )}

                        {currentSearchTerm && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                Search: {currentSearchTerm}
                                <a href={`/news?${new URLSearchParams({
                                    ...(currentCategory && { category: currentCategory }),
                                    ...(currentSort !== 'desc' && { sort: currentSort })
                                }).toString()}`} className="ml-2 text-green-600 hover:text-green-900">
                                    &times;
                                </a>
                            </span>
                        )}

                        {currentSort !== 'desc' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                Sort: Oldest first
                                <a href={`/news?${new URLSearchParams({
                                    ...(currentCategory && { category: currentCategory }),
                                    ...(currentSearchTerm && { searchTerm: currentSearchTerm })
                                }).toString()}`} className="ml-2 text-green-600 hover:text-green-900">
                                    &times;
                                </a>
                            </span>
                        )}

                        <a href="/news" className="text-sm text-green-600 hover:text-green-900 ml-auto">
                            Clear all filters
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}