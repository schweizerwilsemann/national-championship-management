import { clubs } from "@/data/clubs";
import Image from "next/image";
import Link from "next/link";

import React from 'react'

const ClubSiteComponent = () => {
    return (
        <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-2 flex items-center">
                <span className="text-sm text-gray-600 mr-2">Club sites</span>
                <div className="flex overflow-x-auto space-x-4 py-1">
                    {clubs.map((club) => (
                        <Link href={club.clubSite} key={club.id} className="flex-shrink-0" target="_blank" rel="noopener noreferrer">
                            <div className="w-6 h-6 relative">
                                <div className="flex items-center justify-center bg-gray-100 rounded-full overflow-hidden">
                                    <Image src={club.logo} alt={`${club.name} logo`} width={24} height={24} className="transition-transform duration-200 transform hover:scale-110" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

ClubSiteComponent.propTypes = {}

export default ClubSiteComponent