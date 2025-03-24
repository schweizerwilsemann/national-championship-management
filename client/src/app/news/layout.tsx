import React from 'react'
import PremierLeagueLayout from '@/components/layouts/PremierLeagueLayout'

const NewsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <PremierLeagueLayout>
            {/* Filters Section */}

            {children}
        </PremierLeagueLayout>
    )
}


export default NewsLayout