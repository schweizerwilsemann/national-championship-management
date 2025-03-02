import React from 'react'
import PremierLeagueLogo from './premierleague.logo'
import PrimaryNavigation from './primary.navigation.component'
import RightSideComponent from './rightside.component'

const MainNavigation = () => {
    return (
        <div className="bg-[#37003c] text-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <PremierLeagueLogo />

                    {/* Primary Navigation */}
                    <PrimaryNavigation />

                    {/* Right side - "More than a game" and Sign In/Out */}
                    <RightSideComponent />
                </div>
            </div>
        </div>
    )
}


export default MainNavigation