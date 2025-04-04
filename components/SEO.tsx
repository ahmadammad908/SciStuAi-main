import { Post } from '@/types/post';

export default function SEO({ post }: { post: Post }) {
    const meta = {
        title: `${post.title} | Your Blog Name`,
        description: post.excerpt,
        image: post.coverImage || '/default-og.jpg',
        type: 'article',
        publishedTime: post.datePublished,
        author: 'Your Name',
    };

    return (
        <>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description} />

            {/* Open Graph */}
            <meta property="og:title" content={meta.title} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:image" content={meta.image} />
            <meta property="og:type" content={meta.type} />
            <meta property="og:published_time" content={meta.publishedTime} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={meta.title} />
            <meta name="twitter:description" content={meta.description} />
            <meta name="twitter:image" content={meta.image} />

            {/* Schema.org */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": meta.title,
                    "datePublished": meta.publishedTime,
                    "description": meta.description,
                    "image": meta.image,
                    "author": {
                        "@type": "Person",
                        "name": meta.author
                    }
                })}
            </script>
        </>
    );
}