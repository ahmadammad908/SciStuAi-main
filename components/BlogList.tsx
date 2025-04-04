import Link from 'next/link';
import {Post} from '@/types/post'
export default function BlogList({ posts }: { posts: Post[] }) {
    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <article
                    key={post.slug}
                    className="border p-4 rounded-lg hover:shadow-lg transition-shadow"
                >
                    <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600">
                            {post.title}
                        </h2>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString()}
                        </time>
                        {post.readingTime && <span>• {post.readingTime}</span>}
                    </div>
                    <p className="text-gray-800">{post.excerpt}</p>
                </article>
            ))}
        </div>
    );
}