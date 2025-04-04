'use client';

import { useState } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link'; // ✅ Import Next.js Link
import { Post } from '@/types/post';

export default function Search({ posts }: { posts: Post[] }) {
    const [query, setQuery] = useState('');

    const fuse = new Fuse(posts, {
        keys: ['title', 'excerpt', 'content'],
        threshold: 0.3,
        includeMatches: true,
    });

    const results = query ? fuse.search(query).map(({ item }) => item) : posts;

    return (
        <div className="mb-8">
            {/* Search Input */}
            <input
                type="text"
                placeholder="Search posts..."
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {/* Search Results Count */}
            <div className="mt-2 text-sm text-gray-600">
                {query ? `Showing ${results.length} results` : "Type to search posts"}
            </div>

            {/* Search Results - Clickable Blog Links */}
            <div className="mt-4 space-y-4">
                {results.length > 0 ? (
                    results.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} passHref>
                            <div className="p-4 shadow rounded-lg border cursor-pointer  transition">
                                <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600">{post.excerpt}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    query && <p className="text-gray-500">No matching posts found.</p>
                )}
            </div>
        </div>
    );
}
