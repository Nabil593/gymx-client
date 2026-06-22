"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from '@/lib/auth-client';
import { Loader2, Trash2, Calendar, ThumbsUp, ThumbsDown, FileText } from 'lucide-react';
import Image from 'next/image';

const MyForumPost = () => {
    const { data: sessionData } = useSession();
    const user = sessionData?.user;

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const userEmail = user?.email;

    // 🔄 Trainer Post Load Function
    const fetchMyPosts = useCallback(async () => {
        if (!userEmail) return;
        try {
            const response = await fetch(`${baseUrl}/api/my-forums/${userEmail}`);
            const data = await response.json();
            if (data.success) {
                setPosts(data.forums);
            }
        } catch (error) {
            console.error("Error fetching forum posts:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userEmail, baseUrl]);

    useEffect(() => {
        if (userEmail) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchMyPosts();
        }
    }, [userEmail, fetchMyPosts]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this forum post?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${baseUrl}/api/forums/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                alert("Forum post deleted successfully.");
                setPosts(prev => prev.filter(post => post._id !== id));
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete the post. Try again.");
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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-zinc-100">My Forum Posts</h2>
                    <p className="text-xs text-zinc-500">Review, manage, or delete articles you contributed to the community forum.</p>
                </div>
                <div className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-400 font-medium">
                    Total Posts: <span className="text-zinc-100 font-bold">{posts.length}</span>
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-400">No posts published yet</p>
                        <p className="text-xs text-zinc-600 max-w-xs mt-0.5">Any fitness tips or articles you publish through the creation page will show up here.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts.map((post) => (
                        <div key={post._id} className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col justify-between p-4 space-y-4 hover:border-zinc-800 transition-colors">
                            <div className="space-y-3">
                                {post?.image && (
                                    <div className="h-40 w-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-900 relative">
                                        <Image
                                            src={post.image}
                                            alt={post?.title || "Post Cover"}
                                            fill
                                            sizes="(max-w-768px) 100vw, 50vw"
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}
                                <div className="space-y-1.5">
                                    <h3 className="text-sm font-bold text-zinc-100 tracking-tight line-clamp-1">{post?.title}</h3>
                                    <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">{post?.description}</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1 text-zinc-400">
                                        <ThumbsUp className="h-3 w-3 text-zinc-500" /> {post?.upvotes || 0}
                                    </span>
                                    <span className="flex items-center gap-1 text-zinc-400">
                                        <ThumbsDown className="h-3 w-3 text-zinc-500" /> {post?.downvotes || 0}
                                    </span>
                                    <span className="flex items-center gap-1 text-zinc-600 hidden sm:inline-flex">
                                        <Calendar className="h-3 w-3" /> {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(post._id)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 hover:bg-red-950/30 border border-zinc-800 hover:border-red-900 rounded text-zinc-400 hover:text-red-400 font-medium transition-colors"
                                >
                                    <Trash2 className="h-3 w-3" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyForumPost;