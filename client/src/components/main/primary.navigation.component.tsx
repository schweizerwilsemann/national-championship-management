import Link from 'next/link'
import React from 'react'


const PrimaryNavigation = () => {
    return (
        <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className=" font-medium flex items-center">
                <p className='text-white hover:text-purple-300'>Premier League</p>
            </Link>

            <Link href="/about" className="hover:text-purple-300 font-medium flex items-center">
                <p className='text-white hover:text-purple-300'>About</p>

            </Link>
            <Link href="/more" className="hover:text-purple-300 font-medium flex items-center">
                <p className='text-white hover:text-purple-300'>More</p>

            </Link>
        </nav>
    )
}

PrimaryNavigation.propTypes = {}

export default PrimaryNavigation