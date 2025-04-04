"use client";
import { ArrowRight, BookOpenText, Newspaper, BrainCircuit, Briefcase, Sparkles, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/playground?tab=homework&query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const features = [
    { icon: BookOpenText, label: "Homework Helper", href: "/playground?tab=homework" },
    { icon: Newspaper, label: "Article Reader", href: "/playground?tab=article" },
    { icon: BrainCircuit, label: "Humanize AI", href: "/playground?tab=humanize" },
    { icon: Briefcase, label: "Resume Analyzer", href: "/playground?tab=resume" },
  ];

  return (
    <section className="relative flex flex-col items-center justify-center py-20" aria-label="SciStuAI Hero">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 dark:bg-blue-500 opacity-20 blur-[100px]"></div>
      </div>

      <div className="space-y-6 text-center max-w-4xl px-4">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-fit rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30 px-4 py-1 mb-6"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Learning Assistant</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white animate-gradient-x pb-2"
        >
          Your Personal <br className="hidden sm:block" />
          Learning Companion
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          Transform your learning experience with AI-powered study assistance, personalized tutoring, and intelligent academic support.
        </motion.p>

        {/* Feature Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-3 pt-2"
        >
          {features.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <Button
                variant="secondary"
                className="h-10 rounded-full px-4 py-2 border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <feature.icon className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-300" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  {feature.label}
                </span>
              </Button>
            </Link>
          ))}
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-2xl mx-auto"
        >
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-800 rounded-full px-4 py-1 focus-within:border-blue-500 transition-colors">
            <Search className="h-5 w-5 text-gray-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask any question or paste your homework..."
              className="flex-1 bg-transparent outline-none px-2 py-4 text-gray-900 dark:text-white text-base"
            />
            <Button
              type="submit"
              size="lg"
              className="rounded-full bg-blue-600 hover:bg-blue-500 text-white p-3 h-12 w-12"
              aria-label="Solve Now"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}