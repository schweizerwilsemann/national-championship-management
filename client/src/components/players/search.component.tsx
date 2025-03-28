import React, { useState } from 'react';

interface SearchPlayerComponentProps {
    nameFilter: string;
    setNameFilter: (value: string) => void;
    handleSearch: (e?: React.FormEvent<HTMLFormElement>, searchTerm?: string) => void;
}

const SearchPlayerComponent: React.FC<SearchPlayerComponentProps> = ({
    nameFilter,
    setNameFilter,
    handleSearch
}) => {
    const [inputValue, setInputValue] = useState(nameFilter);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // Handle form submit (Enter or click)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedValue = inputValue.trim();

        // First update the parent's nameFilter state
        setNameFilter(trimmedValue);

        // Then pass the same value directly to handleSearch
        // This way we don't depend on the parent state update to be reflected
        handleSearch(e, trimmedValue);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-5xl font-bold text-white">Players</h1>
            <form onSubmit={handleSubmit} className="w-full md:w-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for a Player"
                        className="w-full md:w-96 py-3 px-4 pr-12 rounded-lg text-white placeholder-white border border-white bg-transparent focus:outline-none"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <button
                        type="submit"
                        className="hover:cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-400 hover:text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchPlayerComponent;