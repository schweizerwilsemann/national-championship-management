import React from 'react'
import PremierLeagueLayout from '@/app/PremierLeagueLayout'
const ClubsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <PremierLeagueLayout>
            {children}

        </PremierLeagueLayout>
    )
}

export default ClubsLayout