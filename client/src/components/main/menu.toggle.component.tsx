"use client"
import Link from 'next/link'
import React, { useState } from 'react'

const MenuToggle = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    return (
        <>
            <button
                className="lg:hidden text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
            {isMenuOpen && (
                <div className="lg:hidden bg-[#37003c] text-white">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex flex-col space-y-4">
                            <Link href="/" className=" font-medium flex items-center">
                                <p className='text-white hover:text-purple-300'>Premier League</p>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-white hover:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </Link>
                            <Link href="/football-and-community" className="font-medium flex items-center">
                                <p className='text-white hover:text-purple-300'>Football & Community</p>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-white hover:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </Link>
                            <Link href="/about" className="hover:text-purple-300 font-medium flex items-center">
                                <p className='text-white hover:text-purple-300'>About</p>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-white hover:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </Link>
                            <Link href="/more" className="hover:text-purple-300 font-medium flex items-center">
                                <p className='text-white hover:text-purple-300'>More</p>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-white hover:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </>
    )
}

MenuToggle.propTypes = {}

export default MenuToggle