import React from 'react'
import PremierLeagueLayout from '@/components/layouts/PremierLeagueLayout'
import TournamentDropdown from '@/components/tournaments/tournament.dropdownlist'

const ResultsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <PremierLeagueLayout>
            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-4 justify-center items-center mt-4">
                <select className="p-2 border border-gray-300 rounded">
                    <option value="premier-league">Premier League</option>
                </select>
                <select className="p-2 border border-gray-300 rounded">
                    <option value="2024/25">2024/25</option>
                </select>
                <select className="p-2 border border-gray-300 rounded">
                    <option value="all">All Matchweeks</option>
                </select>
                <select className="p-2 border border-gray-300 rounded">
                    <option value="all">All Matches</option>
                </select>
                <button className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-100">RESET FILTERS</button>
            </div>
            {children}
        </PremierLeagueLayout>
    )
}


export default ResultsLayout