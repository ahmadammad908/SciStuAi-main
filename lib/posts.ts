import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Post } from '@/types/post';

const postsDirectory = path.join(process.cwd(), 'content');

// Add this function to calculate reading time
function calculateReadingTime(content: string): string {
    const wordsPerMinute = 200; // Average reading speed (words per minute)
    const wordCount = content.split(/\s+/g).length; // Count the words in the content
    return `${Math.ceil(wordCount / wordsPerMinute)} min read`;
}

export async function getPosts(): Promise<Post[]> {
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = await Promise.all(
        fileNames.map(async (fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const filePath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                title: data.title,
                author: data.author,
                name:data.name,
                url:data.url,
                image:data.image,
                datePublished: data.datePublished,
                headline:data.headline,
                excerpt: data.excerpt || '',
                content: await markdownToHtml(content),
                readingTime: calculateReadingTime(content), // Add reading time to the post object
            };
        })
    );

    return posts.sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post> {
    const filePath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        title: data.title,
        author: data.author,
        name:data.name,
        headline:data.headline,
        image:data.image,
        url:data.url,
        datePublished: data.datePublished,
        content: await markdownToHtml(content),
        excerpt: data.excerpt || '',
        readingTime: calculateReadingTime(content), // Add reading time to the post object
    };
}

async function markdownToHtml(markdown: string): Promise<string> {
    const result = await remark().use(html).process(markdown);
    return result.toString();
}
