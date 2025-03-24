"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Post {
    _id: string;
    title: string;
    image: string;
    content: string;
    slug: string;
    createdAt: string;
    category?: string;
    updatedAt: string;
}

interface NewsCardProps {
    post: Post;
}

const NewsCard: React.FC<NewsCardProps> = ({ post }) => {
    const router = useRouter();
    const date = new Date(post.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const handleCardClick = () => {
        router.push(`/news/${post.slug}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
        >
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="absolute bottom-2 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-sm uppercase">
                    {post.category || 'Football'}
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-green-700 transition-colors duration-300">
                    {post.title}
                </h3>
                <div
                    className="mt-2 text-sm text-gray-600 line-clamp-2"
                    dangerouslySetInnerHTML={{
                        __html: post.content.replace(/<[^>]*>/g, ' ').substring(0, 120) + '...'
                    }}
                />
                <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">{date}</span>
                    <span className="text-sm font-medium text-green-600 group-hover:text-green-800 transition-colors duration-300 flex items-center">
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NewsCard;