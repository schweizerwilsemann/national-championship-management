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
            </button>
            {isMenuOpen && (
                <div className="lg:hidden bg-[#37003c] text-white">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex flex-col space-y-4">
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
                    </div>
                </div>
            )}
        </>
    )
}

MenuToggle.propTypes = {}

export default MenuToggle