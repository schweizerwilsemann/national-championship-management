// app/news/[slug]/page.tsx

import React from 'react';
import Image from 'next/image';
import { getNews } from '@/utilities/apis/socials/news/news.api';
import Link from 'next/link';

export default async function NewsDetailPage({
    params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
    try {
        const { slug } = await params; // Đợi params resolve trước khi dùng
        const response = await getNews({ slug });
        const post = response.posts[0]; // Assuming the API returns the specific post

        if (!post) {
            return (
                <div className="container mx-auto px-4 py-8">
                    <p className="text-red-500">News article not found</p>
                    <Link href="/news" className="text-green-600 hover:underline mt-4 inline-block">
                        Back to News
                    </Link>
                </div>
            );
        }

        const formattedDate = new Date(post.createdAt).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        return (
            <div className="bg-white min-h-screen">
                <div className="container mx-auto px-4 py-8">

                    <article className="max-w-4xl mx-auto">
                        <Link href="/news" className="inline-flex items-center text-green-600 mb-6 hover:underline">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to News
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            {post.title}
                        </h1>

                        <div className="text-gray-500 mb-6">
                            {formattedDate} • {post.category || 'Football'}
                        </div>

                        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                priority
                            />
                        </div>

                        <div
                            className="prose prose-lg max-w-none prose-headings:text-green-800 prose-a:text-green-600 prose-strong:font-bold prose-img:rounded-lg"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </article>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Failed to fetch news details:", error);
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-red-500">Failed to load news details. Please try again later.</p>
                <Link href="/news" className="text-green-600 hover:underline mt-4 inline-block">
                    Back to News
                </Link>
            </div>
        );
    }
}