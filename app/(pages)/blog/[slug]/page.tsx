
import BlogPost from "@/components/BlogPost";
import ReadingProgress from "@/components/ReadingProgress";
import SEO from "@/components/SEO"
import { getPostBySlug, getPosts } from '@/lib/posts';
import Footer from '@/components/wrapper/footer';
import Header from '@/components/wrapper/navbar';




interface PageProps {
    params: { slug: string };
}
  
  
export default async function PostPage({ params }: PageProps) {
    const { slug } = await params

    const post = await getPostBySlug(slug);
    if(!slug) {
        return "no found"
      }

    

    return (
       <>
        <div className="max-w-4xl mx-auto py-8 px-4">
            <Header />
            <ReadingProgress />
            <SEO post={post} />
            <BlogPost post={post} />
            
        </div>
        <Footer />
       </>
    );
}