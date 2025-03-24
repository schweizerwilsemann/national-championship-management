import React from 'react'
import PremierLeagueLayout from '@/components/layouts/PremierLeagueLayout'
import TournamentDropdown from '@/components/tournaments/tournament.dropdownlist'

const VideoLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <PremierLeagueLayout>
            {/* Filters Section */}

            {children}
        </PremierLeagueLayout>
    )
}


export default VideoLayout