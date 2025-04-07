"use client"
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";

export default function BlogPost({ post }: { post: any }) {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollPercent(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
        <meta name="author" content="Your Name" />
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "author": {
                "@type": "Person",
                "name": "Your Name",
                "url": "https://yourwebsite.com/author-profile"
              },
              "datePublished": post.date,
              "dateModified": post.date,
              "image": post.image || "https://yourwebsite.com/default-image.jpg",
              "url": "https://yourwebsite.com/your-blog-post-url",
              "publisher": {
                "@type": "Organization",
                "name": "Your Website Name",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://yourwebsite.com/logo.png"
                }
              },
              "description": post.excerpt
            })
          }}
        />
      </Head>

      <div className="relative min-h-screen px-4 py-8 mt-[50px]">
        {/* Scroll Progress Bar */}
        <div
          className={`fixed top-0 left-0 w-full h-1 bg-blue-500`}
          style={{ transform: `translateX(${scrollPercent - 100}%)` }}
        />

        <article className="max-w-3xl mx-auto">
          {/* Blog Title */}
          <div className="bg-[#F59E0B] text-white text-[12px] font-bold px-4 py-2  rounded-lg shadow-md  shadow-none inline-block">
            Thoughts
          </div>
          <h1 className="text-3xl font-bold mb-4 mt-[20px]">{post.title}</h1>
          <h1 className="text-1xl font-bold mb-4 ">Date Published :   <span className="text-gray-500 font-bold">{post.datePublished}</span></h1>
          <h1 className="text-1xl font-bold mb-4 ">Author Name :   <span className="text-gray-500 font-bold">{post.name}</span></h1>
          <a href={post.url} className="text-1xl font-bold mb-4">Author url :   <span className="text-gray-500 font-bold">Author Profile Url</span></a>

          <h1 className="text-1xl font-bold mb-4 mt-[15px] ">Author Headline :   <span className="text-gray-500 font-bold">{post.headline}</span></h1>

          <Image src={post.image} alt={post.title} className="w-9 h-9 rounded-full object-cover mt-[50px]"
          />
          {/* Meta Information */}

          {/* Blog Content */}
          <p className="text-sm mb-6">{post.para}</p>

          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>
    </>
  );
}
