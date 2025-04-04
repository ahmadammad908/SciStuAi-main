import BlogList from "@/components/BlogList";
import Pagination from "@/components/Pagination";
import {getPosts} from "@/lib/posts"
import Header from '@/components/wrapper/navbar';
import Footer from '@/components/wrapper/footer';

export async function generateStaticParams() {
    const posts = await getPosts();
    const totalPages = Math.ceil(posts.length / 5);
    return Array.from({ length: totalPages }, (_, i) => ({
        page: (i + 1).toString(),
    }));
}

export const dynamicParams = false;
export const revalidate = 3600; // 1 hour

export default async function BlogPage({
    params,
}: {
    params: { page: string };
}) {
    const posts = await getPosts();
    const currentPage = Number(params.page) || 1;
    const postsPerPage = 5;
    const paginatedPosts = posts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    return (
        <>
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Header />
            <BlogList posts={paginatedPosts} />
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(posts.length / postsPerPage)}
            />
        </div>
        <Footer />
        </>
    );
}