"use client"
import React, { useEffect, useState } from 'react'
import MenuToggle from './menu.toggle.component'
import Link from 'next/link'
import { checkCookie } from '@/utilities/apis/authentication/checkcookie.api'
import { signOut, socialSignOut } from '@/utilities/apis/authentication/signout.api'
import PrimaryNavigation from './primary.navigation.component'

const RightSideComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const verifyCookie = async () => {
            try {
                const cookieStatus = await checkCookie();
                if (cookieStatus !== "No cookie found") {
                    setIsLoggedIn(true);
                    return;
                }
                else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error verifying cookie:', error);
            }
        };
        verifyCookie();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(); // Xóa cookie access_token
            await socialSignOut();
            setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };
    return (
        <div className="flex items-center space-x-4">

            <span className="hidden lg:inline-block text-sm">More than a game</span>
            {isLoggedIn ? (
                <button onClick={handleSignOut} className="bg-transparent text-[#37003c] px-4 py-2 rounded-md text-sm font-medium hover:cursor-pointer">
                    <p className='text-white hover:text-purple-300'>Sign Out</p>
                </button>
            ) : (
                <Link href="/signin" className=" text-[#37003c] px-4 py-2 rounded-md text-sm font-medium">
                    <p className='text-white hover:text-purple-300'>Sign In</p>
                </Link>
            )}
            <button className="hidden md:block text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
            <MenuToggle />
        </div>
    )
}

RightSideComponent.propTypes = {}

export default RightSideComponent