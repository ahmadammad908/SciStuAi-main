"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const FeaturesData = [
  {
    id: 1,
    name: "Smart Study Assistant",
    description: "AI-powered study companion that helps you understand complex topics and concepts with ease.",
    color: "from-[#000000] to-[#3B3B3B]",
  },
  {
    id: 2,
    name: "Personalized Learning",
    description: "Adaptive learning paths tailored to your individual needs and learning style.",
    color: "from-[#007ACC] to-[#2F74C0]",
  },
  {
    id: 3,
    name: "24/7 Support",
    description: "Get instant help with your questions and assignments any time, day or night.",
    color: "from-[#38BDF8] to-[#818CF8]",
  },
  {
    id: 4,
    name: "Progress Tracking",
    description: "Monitor your learning progress and identify areas for improvement with detailed analytics.",
    color: "from-[#000000] to-[#3B3B3B]",
  },
  {
    id: 5,
    name: "Subject Expertise",
    description: "Comprehensive coverage across multiple academic subjects and disciplines.",
    color: "from-[#6C47FF] to-[#4F37C8]",
  },
  {
    id: 6,
    name: "Interactive Learning",
    description: "Engage with dynamic content and interactive exercises for better understanding.",
    color: "from-[#FF4F00] to-[#FF8A00]",
  }
];

export default function Features() {
  return (
    <section className="py-24 px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white pb-2">
          Features That Make Learning Easier
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
          Discover how SciStuAI transforms your learning experience with powerful AI-driven features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {FeaturesData.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                <div
                  className={`h-full w-full bg-gradient-to-br ${feature.color}`}
                ></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <div
                      className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
                    />
                  </div>
                  <Link
                    href="#"
                    target="_blank"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </Link>
                </div>

                <Link href="#" target="_blank" className="block">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
