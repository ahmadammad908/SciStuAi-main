import React from 'react';
import Header from '@/components/wrapper/navbar';
import Footer from '@/components/wrapper/footer';

export default function AboutUs() {
    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto px-6 mt-[100px]">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold ">About Us</h1>
                    <p className="mt-4 text-lg  max-w-2xl mx-auto">
                        We are dedicated to providing top-quality services with a focus on innovation, excellence, and customer satisfaction.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div className='m-[30px]'>
                        <h2 className="text-2xl font-semibold ">Our Mission</h2>
                        <p className="mt-4 ">
                            Our mission is to revolutionize the industry by offering unique solutions that drive growth and success for our clients.
                        </p>
                        <h2 className="text-2xl font-semibold  mt-6">Why Choose Us?</h2>
                        <ul className="mt-4 space-y-2 ">
                            <li>✅ Expertise in our field</li>
                            <li>✅ Customer-centric approach</li>
                            <li>✅ Innovative solutions</li>
                            <li>✅ Reliable and efficient services</li>
                        </ul>
                    </div>
                   
                </div>
            </div>
            <Footer />
        </>
    );
}