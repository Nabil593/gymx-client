"use client";

import React, { useState } from 'react';
import { Loader2, ImagePlus, Send, X, FileText } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const AddForumPostPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "d3e4bc27d418ba7d094aa1df32884888";

    // Handle Image Upload to Imgbb
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.success) {
                setImageUrl(data.data.url);
            } else {
                setMessage({ type: 'error', text: 'Failed to upload image. Try again.' });
            }
        } catch (error) {
            console.error("Imgbb Upload Error:", error);
            setMessage({ type: 'error', text: 'Image upload failed.' });
        } finally {
            setIsUploading(false);
        }
    };

    // Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !imageUrl || !description) {
            setMessage({ type: 'error', text: 'Please fill in all fields and upload an image.' });
            return;
        }

        setIsSubmitting(true);
        setMessage({ type: '', text: '' });
        const sessionToken = await authClient.token();
        const token = sessionToken?.data?.token;
        try {
            const response = await fetch(`${baseUrl}/api/admin/forum-posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    image: imageUrl,
                    description,
                    author: {
                        name: "Admin Team",
                        image: "https://i.ibb.co/4whpS6gy/Gemini-Generated-Image-tpowc9tpowc9tpow.png"
                    }
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Forum post published successfully!' });
                setTitle('');
                setDescription('');
                setImageUrl('');
            } else {
                setMessage({ type: 'error', text: data.message || 'Something went wrong.' });
            }
        } catch (error) {
            console.error("Error submitting post:", error);
            setMessage({ type: 'error', text: 'Failed to connect to the server.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 text-zinc-300 font-sans select-none space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Create Forum Post</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Share expert insights, tips, or news with the gym community forum.</p>
            </div>

            {/* Notification Toast/Message */}
            {message.text && (
                <div className={`p-3 rounded-lg border text-xs font-semibold ${message.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* 📝 Post Creation Form */}
            <form onSubmit={handleSubmit} className="space-y-5 bg-zinc-950 border border-zinc-900 rounded-xl p-5 sm:p-6">

                {/* Title Input */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">Post Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., 5 Common Mistakes in Deadlift Form"
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-colors"
                        required
                    />
                </div>

                {/* Image Upload Input via Imgbb */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">Cover Image</label>

                    {!imageUrl ? (
                        <label className={`w-full h-32 border border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-zinc-900/20 border-zinc-800 hover:border-zinc-700 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={isUploading}
                            />
                            {isUploading ? (
                                <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
                            ) : (
                                <ImagePlus className="h-5 w-5 text-zinc-500" />
                            )}
                            <span className="text-[11px] text-zinc-500">
                                {isUploading ? 'Uploading to Imgbb...' : 'Click to upload banner'}
                            </span>
                        </label>
                    ) : (
                        <div className="relative w-full h-40 border border-zinc-800 rounded-lg overflow-hidden group bg-zinc-900">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imageUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setImageUrl('')}
                                className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black text-zinc-400 hover:text-zinc-100 rounded-md transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Description Input */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">Article Content</label>
                    <textarea
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write your article description or insights here..."
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-colors resize-none leading-relaxed"
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 text-black text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Send className="h-3.5 w-3.5" />
                        )}
                        {isSubmitting ? 'Publishing...' : 'Publish to Forum'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddForumPostPage;