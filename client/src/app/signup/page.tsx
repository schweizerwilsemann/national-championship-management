"use client"
import React, { useState } from 'react';
import PremierLeagueLayout from '@/app/PremierLeagueLayout';
import Link from 'next/link';
import { signup } from '@/utilities/apis/authentication/signup.api'; // Import the signup function
import { message } from 'antd'; // Import Ant Design message
import { useRouter } from 'next/navigation'; // Change import to useRouter from next/navigation

export default function SignUpPage() {
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter(); // Initialize useRouter

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await signup(email, password, name);
            if (response.statusCode === 201) {
                message.success(`${response.message}! Please sign in to continue`); // Display success message
                // Clear input fields
                setEmail('');
                setName('');
                setPassword('');
                // Redirect to signin page
                router.push('/signin');
            }
            else {
                message.error(response.message)
            }
        } catch (err: any) {
            message.error(err.message || 'Signup failed'); // Display error message
        }
    };

    return (
        <PremierLeagueLayout>
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-8">
                        <h2 className="text-2xl font-bold text-center text-[#37003c] mb-8">Sign Up</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Yours"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="password" className="text-gray-700 text-sm font-medium">
                                        Password
                                    </label>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#37003c] text-white py-2 px-4 rounded-md 
                                hover:bg-purple-900 hover:cursor-pointer focus:outline-none focus:ring-2 
                                focus:ring-purple-500 focus:ring-offset-2"
                            >
                                Sign Up
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/signin" className="text-[#37003c] hover:text-purple-700 font-medium">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t">
                        <div className="text-center">
                            <p className="text-xs text-gray-600">
                                By signing in, you agree to our{' '}
                                <a href="#" className="text-[#37003c] hover:underline">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-[#37003c] hover:underline">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PremierLeagueLayout>
    );
}