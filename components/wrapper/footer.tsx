"use client"
import { ArrowRight, MessageSquare, Linkedin, Twitter, Facebook, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function Footer() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data: any) => {
        // Handle newsletter submission
        console.log(data);
        reset();
    };

    const links = {
        company: [
            { name: 'About', href: '/about' },
            { name: 'Blog', href: '/blog' },
            { name: 'Article', href: '/article-reader' },
            { name: 'Contact', href: '/contact' },
            { name: 'Feedback', href: '/feedback' },
        ],
        legal: [
            { name: 'Legal', href: '/legal' },
            { name: 'Privacy Policy', href: '/privacy-policy' },
            { name: 'Terms of Service', href: '/terms-of-service' },
            { name: 'DMCA Compliance Policy', href: '/dmca' },
        ],
        resources: [
            { name: 'Study Tools', href: '/tools' },
            { name: 'Help Center', href: '/support' },
            { name: 'Student Resources', href: '/resources' },
        ]
    };

    return (
        <footer className="border-t bg-white dark:bg-black">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            <span className="font-semibold">SciStuAI</span>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                            Empowering students with AI-powered scientific learning tools and resources.
                            Study smarter, learn faster, and achieve more with SciStuAI.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="https://discord.gg/68dKp8S8" target="_blank">
                                <Button variant="ghost" size="icon">
                                    <MessageSquare className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="https://twitter.com" target="_blank">
                                <Button variant="ghost" size="icon">
                                    <Twitter className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="https://linkedin.com" target="_blank">
                                <Button variant="ghost" size="icon">
                                    <Linkedin className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="https://facebook.com" target="_blank">
                                <Button variant="ghost" size="icon">
                                    <Facebook className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            {/* Company Links */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Company</h3>
                                <ul className="mt-4 space-y-4">
                                    {links.company.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Resources Links */}
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Resources</h3>
                                <ul className="mt-4 space-y-4">
                                    {links.resources.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Newsletter and Legal */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Stay Updated</h3>
                            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                Subscribe to our newsletter for updates, tips, and special offers.
                            </p>
                            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 sm:flex sm:max-w-md">
                                <div className="flex-1">
                                    <Input
                                        {...register('email', { required: true })}
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full min-w-0 rounded-full border-gray-300"
                                    />
                                </div>
                                <div className="mt-3 sm:ml-3 sm:mt-0">
                                    <Button type="submit" className="w-full rounded-full bg-blue-600 hover:bg-blue-500 text-white">
                                        Subscribe
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </form>

                            {/* Legal Links */}
                            <div className="mt-8">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Legal</h3>
                                <ul className="mt-4 space-y-4">
                                    {links.legal.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        &copy; {new Date().getFullYear()} SciStuAI. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}