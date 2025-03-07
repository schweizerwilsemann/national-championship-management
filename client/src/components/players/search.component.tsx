import React from 'react'

interface SearchPlayerComponentProps {
    nameFilter: string;
    setNameFilter: (value: string) => void;
    handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SearchPlayerComponent: React.FC<SearchPlayerComponentProps> = ({ nameFilter, setNameFilter, handleSearch }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-5xl font-bold text-white">Players</h1>
            <form onSubmit={handleSearch} className="w-full md:w-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for a Player"
                        className="w-full md:w-96 py-3 px-4 pr-12 rounded-lg text-white placeholder-white border border-white"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                    <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SearchPlayerComponent