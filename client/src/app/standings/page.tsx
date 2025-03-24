import React from 'react'
import PremierLeagueLayout from '@/components/layouts/PremierLeagueLayout'
import TournamentDropdown from '@/components/tournaments/tournament.dropdownlist'
const StandingsPage = () => {
    return (
        <PremierLeagueLayout>
            <TournamentDropdown />

        </PremierLeagueLayout>
    )
}


export default StandingsPage