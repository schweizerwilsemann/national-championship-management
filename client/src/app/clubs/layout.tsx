import React from 'react'
import PremierLeagueLayout from '@/components/layouts/PremierLeagueLayout'
const ClubsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <PremierLeagueLayout>
            {children}

        </PremierLeagueLayout>
    )
}

export default ClubsLayout