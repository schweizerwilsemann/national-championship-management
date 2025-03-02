import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


const PremierLeagueLogo = () => {
    return (
        <div className="flex items-center">
            <Link href="/" className="mr-8">
                <div className="w-12 h-12 relative">
                    <Image src="/logos/Premier-League-Logo.png" alt="Premier League logo" width={48} height={48} className="rounded-full bg-teal-50" />
                </div>
            </Link>
            <div className="hidden md:block">
                <span className="text-xl font-bold">Premier League</span>
            </div>
        </div>
    )
}


export default PremierLeagueLogo