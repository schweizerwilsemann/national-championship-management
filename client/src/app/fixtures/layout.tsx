import React from 'react'
import PremierLeagueLayout from '@/components/layouts/PremierLeagueLayout'
const FixturesLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <PremierLeagueLayout>
            {children}

        </PremierLeagueLayout>
    )
}

export default FixturesLayout