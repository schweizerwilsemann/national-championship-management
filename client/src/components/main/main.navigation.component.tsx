import React from 'react'
import PremierLeagueLogo from './premierleague.logo'
import RightSideComponent from './rightside.component'
import PrimaryNavigation from './primary.navigation.component'

const MainNavigation = () => {
    return (
        <div className="bg-[#37003c] text-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <PremierLeagueLogo />
                    <div className="mr-3">
                        <PrimaryNavigation />
                    </div>
                    {/* Right side - "More than a game" and Sign In/Out */}
                    <RightSideComponent />
                </div>
            </div>
        </div>
    )
}


export default MainNavigation