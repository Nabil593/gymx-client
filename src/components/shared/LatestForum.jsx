"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ArrowUpRight, User, Calendar, ArrowRight } from 'lucide-react';

const LatestForum = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/public/latest-forums`);
                const data = await res.json();
                if (data.success) {
                    setPosts(data.posts);
                }
            } catch (error) {
                console.error("Failed to fetch latest forum posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestPosts();
    }, [baseUrl]);

    // Framer Motion Container & Card Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    if (loading) {
        return (
            <div className="py-20 w-full flex items-center justify-center bg-[#09090b]">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (posts.length === 0) return null;

    return (
        <section className="bg-[#09090b] text-[#fafafa] py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <span className="text-xs font-semibold text-emerald-500 tracking-widest uppercase">
                            Knowledge Sharing
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl mt-1">
                            Latest Forum Posts
                        </h2>
                        <p className="text-sm text-zinc-500 mt-2 max-w-xl">
                            Stay updated with the latest articles, fitness tips, and professional advice written directly by our certified trainers and admins.
                        </p>
                    </div>
                    <div>
                        <Link
                            href="/forum"
                            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-200 group border-b border-zinc-800 pb-1"
                        >
                            Explore Community Forum
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>
                </div>

                {/* Forum Cards Grid with Framer Motion */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {posts.map((post) => {
                        const formattedDate = post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : "Recent";

                        return (
                            <motion.div
                                key={post._id}
                                variants={cardVariants}
                                className="group bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-800/80 transition-all duration-300"
                            >
                                {/* Post Image */}
                                <div className="relative h-52 w-full bg-zinc-900 overflow-hidden border-b border-zinc-900">
                                    <img
                                        src={post.image || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600"}
                                        alt={post.title}
                                        className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-102 transition-all duration-500"
                                    />
                                </div>

                                {/* Content Body */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        {/* Meta Info (Author & Date) */}
                                        <div className="flex items-center gap-4 text-[11px] text-zinc-500 mb-3">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3 text-emerald-500/70" />
                                                <span className="truncate max-w-[120px]">{post.authorName || post.author || "Admin"}</span>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> {formattedDate}
                                            </span>
                                        </div>

                                        {/* Post Title */}
                                        <h3 className="text-base font-bold text-zinc-200 group-hover:text-white transition-colors line-clamp-2 tracking-tight leading-snug">
                                            {post.title}
                                        </h3>

                                        {/* Truncated Description */}
                                        <p className="text-xs text-zinc-500 mt-2.5 line-clamp-3 leading-relaxed">
                                            {post.description}
                                        </p>
                                    </div>

                                    {/* Read More Action Link */}
                                    <div className="mt-6 pt-4 border-t border-zinc-900/60 flex items-center justify-end">
                                        <Link
                                            href={`/forum/${post._id}`}
                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 group-hover:text-emerald-400 transition-colors duration-200"
                                        >
                                            Read More
                                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default LatestForum;