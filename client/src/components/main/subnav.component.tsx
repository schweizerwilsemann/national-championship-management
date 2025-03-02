import React from 'react'
import { subNavItems } from '@/data/clubs'
import Link from 'next/link'

const SubnavNavigation = () => {
    return (
        <div className="bg-white border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center overflow-x-auto whitespace-nowrap py-2">
                    {subNavItems.map((item, index) => (
                        <Link
                            href={`/${item.toLowerCase().replace(' ', '-')}`}
                            key={index}
                            className="text-gray-700 hover:text-[#37003c] px-4 py-1 text-sm font-medium"
                        >
                            {item}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

SubnavNavigation.propTypes = {}

export default SubnavNavigation