"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';

const SingleForumDetailsPage = ({ params: paramsPromise }) => {
    const params = use(paramsPromise);
    const id = params.id;
    const router = useRouter();

    const { data: sessionData, isPending } = useSession();
    const user = sessionData?.user;

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");

    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");

    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editReplyText, setEditReplyText] = useState("");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/public/forum-posts/${id}`);
                const data = await res.json();
                if (data.success) {
                    setPost(data.post);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchPostDetails();
    }, [id]);

    // Like & Dislike Handler
    const handleVote = async (voteType) => {
        if (!user || !user.email) return;
        try {
            const res = await fetch(`${baseUrl}/api/user/forum-posts/${id}/vote`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: user.email, voteType })
            });
            const data = await res.json();
            if (data.success) {
                setPost({ ...post, upVotes: data.upVotes, downVotes: data.downVotes });
            }
        } catch (error) {
            console.error("Voting error:", error);
        }
    };

    // Comment Submit handler
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !user || !user.email) return;

        try {
            const res = await fetch(`${baseUrl}/api/user/forum-posts/${id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail: user.email,
                    userName: user.name || "Anonymous",
                    userImage: user.image || "",
                    text: commentText
                })
            });
            const data = await res.json();
            if (data.success) {
                setPost({ ...post, comments: [...(post.comments || []), data.comment] });
                setCommentText("");
            }
        } catch (error) {
            console.error("Comment submission error:", error);
        }
    };

    // Comment Edit Submit
    const handleEditSubmit = async (commentId, commentOwnerEmail) => {
        if (!user || user.email !== commentOwnerEmail) {
            toast.warning("You can only edit your own comments!");
            return;
        }
        if (!editText.trim()) return;

        try {
            const res = await fetch(`${baseUrl}/api/user/forum-posts/${id}/comments/${commentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: editText, userEmail: user.email })
            });
            const data = await res.json();
            if (data.success) {
                const updatedComments = post.comments.map(c =>
                    c.commentId === commentId ? { ...c, text: editText } : c
                );
                setPost({ ...post, comments: updatedComments });
                setEditingCommentId(null);
            } else {
                toast.error(data.message || "Unauthorized");
            }
        } catch (error) {
            console.error("Comment update error:", error);
        }
    };

    // Comment Delete Handler
    const handleCommentDelete = async (commentId, commentOwnerEmail) => {
        if (!user || user.email !== commentOwnerEmail) {
            toast.warning("You can only delete your own comments!");
            return;
        }
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            const res = await fetch(`${baseUrl}/api/user/forum-posts/${id}/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: user.email })
            });
            const data = await res.json();
            if (data.success) {
                setPost({ ...post, comments: post.comments.filter(c => c.commentId !== commentId) });
            } else {
                toast.error(data.message || "Unauthorized");
            }
        } catch (error) {
            console.error("Comment delete error:", error);
        }
    };

    // Comment Reply handler 
    const handleReplySubmit = async (commentId) => {
        if (!replyText.trim()) return;
        try {
            const res = await fetch(`${baseUrl}/api/user/forum-posts/${id}/comments/${commentId}/replies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: user.email, userName: user.name, userImage: user.image, text: replyText })
            });
            const data = await res.json();
            if (data.success) {
                const updatedComments = post.comments.map(c =>
                    c.commentId === commentId ? { ...c, replies: [...(c.replies || []), data.reply] } : c
                );
                setPost({ ...post, comments: updatedComments });
                setReplyText("");
                setReplyingTo(null);
            }
        } catch (error) { toast.error("Failed to post reply"); }
    };

    // Comment Reply delete handler
    const handleReplyDelete = async (commentId, replyId) => {
        try {
            const res = await fetch(`${baseUrl}/api/user/forum-posts/${id}/comments/${commentId}/replies/${replyId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: user.email })
            });
            const data = await res.json();
            if (data.success) {
                const updatedComments = post.comments.map(c =>
                    c.commentId === commentId ? { ...c, replies: c.replies.filter(r => r.replyId !== replyId) } : c
                );
                setPost({ ...post, comments: updatedComments });
            }
        } catch (error) { toast.error("Failed to delete"); }
    };

    // Comment Reply Edit handler
    const handleReplyEdit = async (commentId, replyId, newText) => {
        try {
            const res = await fetch(`${baseUrl}/api/user/forum-posts/${id}/comments/${commentId}/replies/${replyId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText, userEmail: user.email })
            });
            const data = await res.json();
            if (data.success) {
                const updatedComments = post.comments.map(c =>
                    c.commentId === commentId ? { ...c, replies: c.replies.map(r => r.replyId === replyId ? { ...r, text: newText } : r) } : c
                );
                setPost({ ...post, comments: updatedComments });
                setEditingReplyId(null);
            }
        } catch (error) { toast.error("Failed to update"); }
    };

    if (loading || isPending) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-transparent border-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col items-center justify-center">
                <p className="text-[#a1a1aa] mb-4">Post not found or has been removed.</p>
                <Link href="/forum" className="px-4 py-2 bg-[#18181b] border border-[#27272a] rounded-lg text-xs">Back to Forum</Link>
            </div>
        );
    }

    const likesCount = post.upVotes?.length || 0;
    const dislikesCount = post.downVotes?.length || 0;
    const hasLiked = post.upVotes?.includes(user?.email);
    const hasDisliked = post.downVotes?.includes(user?.email);

    return (
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] py-16 px-4 sm:px-6 lg:px-8 font-sans antialiased">
            <div className="max-w-4xl mx-auto">

                {/* Back Button */}
                <Link href="/forum" className="inline-flex items-center text-xs text-[#a1a1aa] hover:text-white mb-6 transition-colors">
                    ← Back to Community Forum
                </Link>

                {/* Article Header */}
                <div className="mb-6">
                    <span className="text-xs text-emerald-500 font-medium tracking-wider uppercase">
                        Author: {post.author || "Trainer/Admin"}
                    </span>
                    <h1 className="text-3xl font-bold text-[#f4f4f5] tracking-tight sm:text-4xl mt-1">
                        {post.title}
                    </h1>
                </div>

                {/* Full Article Image */}
                <div className="h-96 w-full bg-[#18181b] rounded-xl border border-[#27272a] overflow-hidden relative mb-8">
                    <img
                        src={post.image || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200"}
                        alt={post.title}
                        className="w-full h-full object-cover opacity-90"
                    />
                </div>

                {/* Article Description */}
                <div className="prose prose-invert max-w-none mb-10 border-b border-[#27272a] pb-8">
                    <p className="text-[#e4e4e7] text-sm sm:text-base leading-relaxed whitespace-pre-line">
                        {post.description}
                    </p>
                </div>

                {/* Interaction Section */}
                <div className="flex items-center gap-4 border-b border-[#27272a] pb-8 mb-10">
                    <button
                        onClick={() => handleVote('like')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium transition-all ${hasLiked
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                            : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46]'
                            }`}
                    >
                        👍 Upvote ({likesCount})
                    </button>

                    <button
                        onClick={() => handleVote('dislike')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium transition-all ${hasDisliked
                            ? 'bg-rose-500/10 border-rose-500 text-rose-500'
                            : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46]'
                            }`}
                    >
                        👎 Downvote ({dislikesCount})
                    </button>
                </div>

                {/* Comments Section */}
                <div>
                    <h2 className="text-lg font-semibold text-[#f4f4f5] mb-6">
                        Discussion ({post.comments?.length || 0})
                    </h2>

                    <form onSubmit={handleCommentSubmit} className="mb-8">
                        <textarea
                            rows="3"
                            placeholder="Share your thoughts on this article..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full bg-[#09090b] text-[#f4f4f5] p-4 rounded-xl border border-[#27272a] focus:outline-none focus:border-[#a1a1aa] focus:ring-1 focus:ring-[#a1a1aa] transition-all text-sm placeholder-[#52525b]"
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                type="submit"
                                className="px-5 py-2 bg-[#fafafa] hover:bg-[#e4e4e7] text-[#09090b] font-medium text-xs rounded-lg transition-colors duration-200"
                            >
                                Post Comment
                            </button>
                        </div>
                    </form>

                    <div className="space-y-4">
                        {(!post.comments || post.comments.length === 0) ? (
                            <p className="text-xs text-[#52525b] text-center py-6">No comments yet. Start the conversation!</p>
                        ) : (
                            post.comments.map((comment) => (
                                <div key={comment.commentId} className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl flex gap-3">
                                    <img
                                        src={comment.userImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"}
                                        alt={comment.userName}
                                        className="w-8 h-8 rounded-full bg-[#09090b] object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-[#f4f4f5]">{comment.userName}</span>
                                            <span className="text-[10px] text-[#52525b]">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {editingCommentId === comment.commentId ? (
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    className="w-full bg-[#09090b] text-sm border border-[#3f3f46] rounded px-3 py-1.5 text-[#f4f4f5] focus:outline-none"
                                                />
                                                <div className="flex gap-2 mt-2 justify-end">
                                                    <button
                                                        onClick={() => setEditingCommentId(null)}
                                                        className="text-[11px] px-2 py-1 bg-[#27272a] rounded text-[#a1a1aa]"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditSubmit(comment.commentId, comment.userEmail)}
                                                        className="text-[11px] px-2 py-1 bg-[#fafafa] text-black rounded font-medium"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-[#a1a1aa] leading-relaxed">{comment.text}</p>
                                        )}

                                        {/* Reply Trigger */}
                                        <button onClick={() => setReplyingTo(comment.commentId)} className="text-[10px] text-emerald-500 mt-2 block">Reply</button>

                                        {/* Replies List */}
                                        <div className="ml-8 mt-4 space-y-3">
                                            {comment.replies?.map(rep => (
                                                <div key={rep.replyId} className="bg-[#09090b] p-3 rounded-lg border border-[#27272a]">
                                                    {editingReplyId === rep.replyId ? (
                                                        <div>
                                                            <input value={editReplyText} onChange={(e) => setEditReplyText(e.target.value)} className="w-full bg-[#18181b] p-2 text-xs rounded text-white border border-[#3f3f46]" />
                                                            <div className="flex gap-2 mt-2">
                                                                <button onClick={() => handleReplyEdit(comment.commentId, rep.replyId, editReplyText)} className="text-[9px] bg-white text-black px-2 py-1 rounded">Save</button>
                                                                <button onClick={() => setEditingReplyId(null)} className="text-[9px] bg-[#27272a] px-2 py-1 rounded text-white">Cancel</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="text-[10px] font-bold text-emerald-400">{rep.userName}</p>
                                                            <p className="text-xs text-[#a1a1aa]">{rep.text}</p>
                                                            {user?.email === rep.userEmail && (
                                                                <div className="flex gap-3 mt-2">
                                                                    <button onClick={() => { setEditingReplyId(rep.replyId); setEditReplyText(rep.text); }} className="text-[9px] text-[#71717a] hover:text-white">Edit</button>
                                                                    <button onClick={() => handleReplyDelete(comment.commentId, rep.replyId)} className="text-[9px] text-rose-500/70 hover:text-rose-500">Delete</button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Reply Input Box */}
                                        {replyingTo === comment.commentId && (
                                            <div className="mt-4 ml-8">
                                                <input className="w-full bg-[#09090b] border border-[#27272a] p-2 text-xs rounded text-white" placeholder="Write a reply..." onChange={(e) => setReplyText(e.target.value)} />
                                                <div className="flex gap-2 mt-2">
                                                    <button onClick={() => handleReplySubmit(comment.commentId)} className="px-3 py-1 bg-white text-black text-[10px] rounded">Submit</button>
                                                    <button onClick={() => setReplyingTo(null)} className="px-3 py-1 bg-[#27272a] text-white text-[10px] rounded">Cancel</button>
                                                </div>
                                            </div>
                                        )}

                                        {user && user.email === comment.userEmail && editingCommentId !== comment.commentId && (
                                            <div className="flex gap-3 mt-3 pt-2 border-t border-[#27272a]/40">
                                                <button
                                                    onClick={() => { setEditingCommentId(comment.commentId); setEditText(comment.text); }}
                                                    className="text-[10px] text-[#71717a] hover:text-white transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleCommentDelete(comment.commentId, comment.userEmail)}
                                                    className="text-[10px] text-rose-500/70 hover:text-rose-500 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleForumDetailsPage;