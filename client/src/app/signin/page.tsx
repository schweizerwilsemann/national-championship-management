"use client"
import React, { useState } from 'react';
import PremierLeagueLayout from '@/components/layouts/PremierLeagueLayout';
import Link from 'next/link';
import { login, socialLogin } from '@/utilities/apis/authentication/signin.api'; // Import the login function
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { message } from 'antd'; // Import Ant Design message

export default function SignIn() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter(); // Initialize useRouter

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await login(email, password);
            await socialLogin(email, password);
            if (response?.statusCode === 200) {
                message.success('Login successful!'); // Display success message
                router.push('/'); // Navigate to home page
            } // Call the login API
            else {
                message.error("Login fail!")
            }
        } catch (err: any) {
            message.error(err.message || 'Login failed'); // Display error message
        }
    };

    return (
        <PremierLeagueLayout>
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-8">
                        <h2 className="text-2xl font-bold text-center text-[#37003c] mb-8">Sign In</h2>

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
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="password" className="text-gray-700 text-sm font-medium">
                                        Password
                                    </label>
                                    <a href="#" className="text-sm text-[#37003c] hover:text-purple-700">
                                        Forgot Password?
                                    </a>
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

                            <div className="mb-6">
                                <label className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 text-[#37003c] border-gray-300 rounded" />
                                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#37003c] text-white py-2 px-4 rounded-md 
                                hover:bg-purple-900 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link href="/signup" className="text-[#37003c] hover:text-purple-700 font-medium">
                                    Create one
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