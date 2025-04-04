import BlogList from '@/components/BlogList';
import { getPosts } from '@/lib/posts';
import Header from '@/components/wrapper/navbar';
import Search from '@/components/Search'
// Changed Footer import
import Footer from '@/components/wrapper/footer';

export default async function BlogPage() {
    const posts = await getPosts();

    return (
       <>
        <div className="max-w-4xl mx-auto py-8 px-4">
            <Header />
            <h1 className="text-4xl font-bold mb-8">Blog</h1>
            <Search posts={posts} />
        
        </div>
         <Footer />
       </>
    );
}