import React from 'react'
import PremierLeagueLayout from '@/app/PremierLeagueLayout'
const PlayerLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <PremierLeagueLayout>
            {children}

        </PremierLeagueLayout>
    )
}

export default PlayerLayout