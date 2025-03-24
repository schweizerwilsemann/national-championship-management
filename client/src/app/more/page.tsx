import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const MorePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            {/* Header */}
            <header className="py-6 px-4 md:px-8 lg:px-16">
                <h1 className="text-3xl md:text-4xl font-bold text-center">About the Author</h1>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    {/* Profile Section */}
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                        <div className="relative w-64 h-64 rounded-full overflow-hidden mb-6 border-4 border-blue-500">
                            <Image
                                src="https://pbs.twimg.com/profile_images/1895024075816476672/o3TCQ3Kf_400x400.jpg"
                                alt="Nguyễn Đức Khoa"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Nguyễn Đức Khoa</h2>
                        <p className="text-gray-300 text-center mb-6">Full Stack Developer</p>

                        {/* Social Links */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="https://github.com/schweizerwilsemann" className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded-full">
                                <Github size={20} />
                                <span>GitHub</span>
                            </Link>
                            <Link href="https://www.facebook.com/akira.kiyoshi.16144" className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 transition px-4 py-2 rounded-full">
                                <Facebook size={20} />
                                <span>Facebook</span>
                            </Link>
                            <Link href="https://www.instagram.com/_schweizerwilsemann/" className="flex items-center gap-2 bg-pink-700 hover:bg-pink-600 transition px-4 py-2 rounded-full">
                                <Instagram size={20} />
                                <span>Instagram</span>
                            </Link>
                            <Link href="https://x.com/schweizer_wilse" className="flex items-center gap-2 bg-black hover:bg-gray-800 transition px-4 py-2 rounded-full">
                                <Twitter size={20} />
                                <span>Twitter/X</span>
                            </Link>
                            <Link href="https://www.linkedin.com/in/khoa-nguyen-016280323/" className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 transition px-4 py-2 rounded-full">
                                <Linkedin size={20} />
                                <span>LinkedIn</span>
                            </Link>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="w-full md:w-2/3 bg-gray-800 p-8 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4 text-blue-400">Biography</h3>
                        <p className="mb-4">
                            I'm a passionate full-stack developer with expertise in modern web technologies including React, Next.js, Node.js, and NestJS.
                            My journey in software development has led me to work on various projects ranging from e-commerce platforms to content management systems.
                        </p>
                        <p className="mb-4">
                            With a strong foundation in both frontend and backend development, I enjoy creating seamless user experiences while ensuring robust and scalable architecture.
                        </p>
                        <p>
                            When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge with the developer community.
                        </p>

                        <div className="mt-8">
                            <h3 className="text-xl font-bold mb-4 text-blue-400">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'NestJS', 'Tailwind CSS', 'MongoDB', 'PostgreSQL', 'Docker', 'Git'].map((skill) => (
                                    <span key={skill} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MorePage;