import React from 'react'
import PremierLeagueLayout from '@/app/PremierLeagueLayout'
const FixturesLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <PremierLeagueLayout>
            {children}

        </PremierLeagueLayout>
    )
}

export default FixturesLayout