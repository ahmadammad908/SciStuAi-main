import React from 'react';
import Header from '@/components/wrapper/navbar'
import Footer from '@/components/wrapper/footer'
export default function ContactPage() {
    return (
       <>
        <div className="max-w-6xl mx-auto px-4 py-8 mt-[20px]">
            <Header />
            <h1 className="text-3xl font-bold mt-8">Contact Us</h1>
            <p className="mt-4">This is the Contact page. ...contact information and form...</p>
           
        </div>
         <Footer />
       </>
    );
}