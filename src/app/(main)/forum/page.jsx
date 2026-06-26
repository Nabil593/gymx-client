"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ForumPage = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const limit = 6;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchForumPosts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${baseUrl}/api/forum-posts?page=${currentPage}&limit=${limit}`);
                const data = await res.json();

                if (data.success) {
                    setPosts(data.posts);
                    setTotalPages(data.totalPages);
                }
            } catch (error) {
                console.error("Error fetching forum data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchForumPosts();
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] py-16 px-4 sm:px-6 lg:px-8 font-sans antialiased">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-12 border-b border-[#27272a] pb-8">
                    <div className="inline-flex items-center gap-2 bg-[#27272a]/50 text-[#a1a1aa] text-xs font-medium px-3 py-1 rounded-full border border-[#3f3f46] mb-3 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Community Knowledge Base
                    </div>
                    <h1 className="text-3xl font-bold text-[#f4f4f5] tracking-tight sm:text-4xl bg-gradient-to-b from-[#ffffff] to-[#a1a1aa] bg-clip-text text-transparent">
                        Community Forum
                    </h1>
                    <p className="mt-2 text-sm text-[#a1a1aa] max-w-xl mx-auto">
                        Latest insights, expert tips, and fitness knowledge shared by our community.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="bg-[#18181b] rounded-xl p-4 border border-[#27272a] animate-pulse">
                                <div className="bg-[#27272a] h-44 w-full rounded-lg mb-4"></div>
                                <div className="h-4 bg-[#27272a] rounded w-1/3 mb-2"></div>
                                <div className="h-5 bg-[#27272a] rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-[#27272a] rounded w-full mb-4"></div>
                                <div className="h-10 bg-[#27272a] rounded-lg w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-[#18181b] rounded-xl border border-[#27272a]">
                        <p className="text-[#a1a1aa] text-sm">No forum posts found matching your criteria.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <div
                                    key={post._id}
                                    className="bg-[#18181b] rounded-xl border border-[#27272a] overflow-hidden flex flex-col hover:border-[#3f3f46] transition-all duration-300 group"
                                >
                                    {/* Image Container */}
                                    <div className="h-44 w-full bg-[#09090b] relative overflow-hidden">
                                        <img
                                            src={post.image || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600"}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                        />
                                        <span className="absolute bottom-3 left-3 bg-[#09090b]/80 border border-[#27272a] text-[#f4f4f5] text-[11px] font-medium px-2.5 py-0.5 rounded-md backdrop-blur-md">
                                            Article
                                        </span>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <p className="text-xs text-emerald-500 font-medium mb-1 tracking-wider uppercase">
                                            Author: {post.author || "Trainer/Admin"}
                                        </p>
                                        <h3 className="text-lg font-semibold text-[#f4f4f5] mb-2 line-clamp-1 group-hover:text-white transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-[#a1a1aa] text-xs line-clamp-2 mb-5 flex-grow leading-relaxed">
                                            {post.description}
                                        </p>

                                        {/* Action Button */}
                                        <div className="border-t border-[#27272a] pt-4 mt-auto">
                                            <Link
                                                href={`/forum/${post._id}`}
                                                className="block w-full text-center py-2 bg-[#27272a] hover:bg-[#fafafa] text-[#e4e4e7] hover:text-[#09090b] border border-[#3f3f46] hover:border-white text-xs font-medium rounded-lg transition-all duration-200"
                                            >
                                                Read Full Article
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Section */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 mt-12 border-t border-[#27272a] pt-6">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${currentPage === 1
                                            ? 'bg-[#09090b] border-[#27272a] text-[#3f3f46] cursor-not-allowed'
                                            : 'bg-[#18181b] border-[#27272a] hover:bg-[#27272a] text-[#a1a1aa]'
                                        }`}
                                >
                                    Previous
                                </button>

                                <span className="text-xs text-[#71717a] font-medium">
                                    Page <span className="text-[#f4f4f5]">{currentPage}</span> of {totalPages}
                                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${currentPage === totalPages
                                            ? 'bg-[#09090b] border-[#27272a] text-[#3f3f46] cursor-not-allowed'
                                            : 'bg-[#18181b] border-[#27272a] hover:bg-[#27272a] text-[#a1a1aa]'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ForumPage;