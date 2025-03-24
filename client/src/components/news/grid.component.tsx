import React from 'react';
import NewsCard from '@/components/news/card.component';

interface Post {
    _id: string;
    title: string;
    image: string;
    content: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    category?: string;
}

interface NewsGridProps {
    posts: Post[];
}

const NewsGrid: React.FC<NewsGridProps> = ({ posts }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
                <NewsCard key={post._id} post={post} />
            ))}
        </div>
    );
};

export default NewsGrid;