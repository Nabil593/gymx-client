"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, Trash2, Inbox, Calendar, User, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

const ForumManagePage = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // 🔄 Fetch All Community Forum Posts
    const fetchPosts = useCallback(async () => {
        try {
            const response = await fetch(`${baseUrl}/api/admin/forums`);
            const data = await response.json();
            if (data.success) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error("Error fetching forum posts:", error);
        } finally {
            setIsLoading(false);
        }
    }, [baseUrl]);

    useEffect(() => {
        posts;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPosts();
    }, [fetchPosts]);

    // 🗑️ Handle Delete Forum Post
    const handleDeletePost = async (id) => {
        if (!confirm("Are you sure you want to delete this community post permanently? This action cannot be undone.")) return;

        setActionLoadingId(id);
        try {
            const response = await fetch(`${baseUrl}/api/admin/forums/delete/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setPosts(prev => prev.filter(post => post._id !== id));
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        } finally {
            setActionLoadingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[50vh] w-full flex items-center justify-center bg-black">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 text-zinc-300 font-sans select-none space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Manage Forum Posts</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Moderate community contributions, review user discussions, or delete inappropriate content.</p>
            </div>

            {/* 📊 Forum Posts Table */}
            {posts.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500">
                        <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-400">No forum posts found</p>
                        <p className="text-xs text-zinc-600 max-w-xs mt-0.5">When users or trainers publish posts in the community tab, they will appear here for moderation.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-900 bg-zinc-900/20 text-xs font-semibold text-zinc-400 tracking-wider">
                                    <th className="p-4">Post Info</th>
                                    <th className="p-4">Author Details</th>
                                    <th className="p-4">Stats</th>
                                    <th className="p-4">Published At</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-zinc-900">
                                {posts.map((post) => {
                                    const rawDate = post.createdAt;
                                    const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    }) : "N/A";

                                    const upvotesCount = post.upvotes || post.likes || 0;
                                    const downvotesCount = post.downvotes || post.dislikes || 0;

                                    return (
                                        <tr key={post._id} className="hover:bg-zinc-900/10 transition-colors">

                                            {/* Title & Cover Thumbnail */}
                                            <td className="p-4 max-w-[240px]">
                                                <div className="flex items-center gap-3">
                                                    {post.image && (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={post.image}
                                                            alt="Cover"
                                                            className="w-10 h-10 object-cover rounded bg-zinc-900 border border-zinc-800 flex-shrink-0"
                                                        />
                                                    )}
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-semibold text-zinc-100 truncate" title={post.title}>
                                                            {post.title}
                                                        </span>
                                                        <span className="text-[11px] text-zinc-500 mt-0.5 truncate max-w-[180px]">
                                                            {post.description}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Author Info */}
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-zinc-300 flex items-center gap-1">
                                                        <User className="h-3 w-3 text-zinc-600" /> {post.authorName || "Anonymous"}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-500 mt-0.5">
                                                        {post.authorEmail || post.authorRole || "User"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Engagement Stats (Upvotes / Downvotes) */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3 text-zinc-500">
                                                    <span className="flex items-center gap-1">
                                                        <ThumbsUp className="h-3 w-3 text-emerald-600" /> {upvotesCount}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <ThumbsDown className="h-3 w-3 text-rose-600" /> {downvotesCount}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Published Date */}
                                            <td className="p-4 text-zinc-400 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-zinc-600" />
                                                    <span>{formattedDate}</span>
                                                </div>
                                            </td>

                                            {/* Moderation Actions */}
                                            <td className="p-4 text-right">
                                                <button
                                                    disabled={actionLoadingId === post._id}
                                                    onClick={() => handleDeletePost(post._id)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 hover:bg-rose-950/20 border border-zinc-800 hover:border-rose-900/50 text-zinc-400 hover:text-rose-400 font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                                    title="Delete Post Permanently"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    <span>Delete</span>
                                                </button>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForumManagePage;