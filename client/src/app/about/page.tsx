import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Html from 'lucide-react'

const AboutPage = () => {
    // Tech stack categories
    const techStack = {
        frontend: [
            { name: 'React', description: 'A JavaScript library for building user interfaces', icon: '/api/placeholder/60/60' },
            { name: 'Next.js', description: 'The React framework for production', icon: '/api/placeholder/60/60' },
            { name: 'Tailwind CSS', description: 'A utility-first CSS framework', icon: '/api/placeholder/60/60' },
            { name: 'TypeScript', description: 'Typed JavaScript at any scale', icon: '/api/placeholder/60/60' },
            { name: 'Ant Design', description: 'A design system for enterprise-level products', icon: '/api/placeholder/60/60' }
        ],
        backend: [
            { name: 'Node.js', description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine', icon: '/api/placeholder/60/60' },
            { name: 'NestJS', description: 'A progressive Node.js framework', icon: '/api/placeholder/60/60' },
            { name: 'Express', description: 'Fast, unopinionated, minimalist web framework for Node.js', icon: '/api/placeholder/60/60' }
        ],
        database: [
            { name: 'MongoDB', description: 'The application data platform', icon: '/api/placeholder/60/60' },
            { name: 'PostgreSQL', description: 'The world\'s most advanced open source database', icon: '/api/placeholder/60/60' },
            { name: 'Prisma', description: 'Next-generation Node.js and TypeScript ORM', icon: '/api/placeholder/60/60' }
        ],
        devTools: [
            { name: 'Docker', description: 'Develop, ship, and run applications inside containers', icon: '/api/placeholder/60/60' },
            { name: 'Git', description: 'Distributed version control system', icon: '/api/placeholder/60/60' },
            { name: 'ESLint', description: 'Pluggable JavaScript linter', icon: '/api/placeholder/60/60' },
            { name: 'Vite', description: 'Next generation frontend tooling', icon: '/api/placeholder/60/60' }
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            {/* Header */}
            <header className="py-12 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">About The Project</h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    A comprehensive overview of the technologies and tools used to build this project
                </p>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-8 py-12">
                {/* Project Overview */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6 text-blue-400">Project Overview</h2>
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                        <p className="mb-4">
                            This project is a multi-faceted web application built with modern technologies to provide a seamless user experience.
                            It consists of multiple interconnected applications including an API server, client interface, and admin portal.
                        </p>
                        <p>
                            The architecture follows best practices for scalability, maintainability, and performance, leveraging the power of
                            JavaScript/TypeScript ecosystem along with robust databases and deployment tools.
                        </p>
                    </div>
                </section>

                {/* Technology Stack */}
                <section>
                    <h2 className="text-3xl font-bold mb-6 text-blue-400">Technology Stack</h2>

                    {/* Frontend */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-semibold mb-6 text-blue-300">Frontend Technologies</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {techStack.frontend.map((tech) => (
                                <div key={tech.name} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 mr-4 relative">
                                            <Image src={tech.icon} alt={tech.name} fill className="rounded-md" />
                                        </div>
                                        <h4 className="text-xl font-semibold">{tech.name}</h4>
                                    </div>
                                    <p className="text-gray-300">{tech.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Backend */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-semibold mb-6 text-blue-300">Backend Technologies</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {techStack.backend.map((tech) => (
                                <div key={tech.name} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 mr-4 relative">
                                            <Image src={tech.icon} alt={tech.name} fill className="rounded-md" />
                                        </div>
                                        <h4 className="text-xl font-semibold">{tech.name}</h4>
                                    </div>
                                    <p className="text-gray-300">{tech.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Database */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-semibold mb-6 text-blue-300">Database Technologies</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {techStack.database.map((tech) => (
                                <div key={tech.name} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 mr-4 relative">
                                            <Image src={tech.icon} alt={tech.name} fill className="rounded-md" />
                                        </div>
                                        <h4 className="text-xl font-semibold">{tech.name}</h4>
                                    </div>
                                    <p className="text-gray-300">{tech.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Development Tools */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-blue-300">Development Tools</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {techStack.devTools.map((tech) => (
                                <div key={tech.name} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 mr-4 relative">
                                            <Image src={tech.icon} alt={tech.name} fill className="rounded-md" />
                                        </div>
                                        <h4 className="text-xl font-semibold">{tech.name}</h4>
                                    </div>
                                    <p className="text-gray-300">{tech.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Project Structure */}
                <section className="mt-16">
                    <h2 className="text-3xl font-bold mb-6 text-blue-400">Project Structure</h2>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3 text-blue-300">API (NestJS)</h3>
                            <p className="mb-2 text-gray-300">RESTful API built with NestJS, Prisma, and PostgreSQL.</p>
                            <pre className="bg-gray-900 p-4 rounded-md text-gray-300 overflow-x-auto">
                                national-championship-api/
                            </pre>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3 text-blue-300">Client (Next.js)</h3>
                            <p className="mb-2 text-gray-300">Client-side application built with Next.js and Tailwind CSS.</p>
                            <pre className="bg-gray-900 p-4 rounded-md text-gray-300 overflow-x-auto">
                                client-copyright-by-khoa/
                            </pre>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3 text-blue-300">Admin Portal (React + Vite)</h3>
                            <p className="mb-2 text-gray-300">Admin dashboard built with React, Vite, and Ant Design.</p>
                            <pre className="bg-gray-900 p-4 rounded-md text-gray-300 overflow-x-auto">
                                national-championship-admin-portal/
                            </pre>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="text-center py-8 bg-gray-900">
                <p>© 2025 Nguyễn Đức Khoa. All rights reserved.</p>
                <Link href="https://github.com/schweizerwilsemann" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
                    View on GitHub
                </Link>
            </footer>
        </div>
    );
};

export default AboutPage;