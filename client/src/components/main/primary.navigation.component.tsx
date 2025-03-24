import Link from 'next/link'
import React from 'react'

const navigationItems = [
    { value: "/more", label: "About the author" },
    { value: "/about", label: "More about the project" }
];

const PrimaryNavigation = () => {
    return (
        <nav className="hidden lg:flex items-start space-x-8">
            {navigationItems.map((item) => (
                <Link key={item.value} href={item.value} className="relative group">
                    <p className="text-white text-lg font-medium transition-all duration-300 
                                  group-hover:text-purple-300 group-hover:scale-110">
                        {item.label}
                    </p>
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-300 transition-all 
                                    duration-300 group-hover:w-full"></span>
                </Link>
            ))}
        </nav>
    )
}

export default PrimaryNavigation
