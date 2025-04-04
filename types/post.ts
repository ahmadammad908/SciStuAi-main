
export interface Post {
    slug: string;
    title: string;
    author: string;
    name:string;
    url:string;
    headline:string;
    image:string;
    datePublished: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    tags?: string[];
    readingTime?: string;
}

export interface PostMeta extends Omit<Post, 'content'> { }