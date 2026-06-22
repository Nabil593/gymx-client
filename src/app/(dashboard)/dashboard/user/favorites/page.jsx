"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from '@/lib/auth-client';
import { Loader2, Heart, HeartOff, Dumbbell } from 'lucide-react';
import Image from 'next/image';

const FavoritesPage = () => {
    const { data: sessionData } = useSession();
    const user = sessionData?.user;

    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const userEmail = user?.email;

    //  Fetch Favorite Classes
    const fetchFavorites = useCallback(async () => {
        if (!userEmail) return;
        try {
            const response = await fetch(`${baseUrl}/api/my-favorites/${userEmail}`);
            const data = await response.json();
            if (data.success) {
                setFavorites(data.favorites);
            }
        } catch (error) {
            console.error("Error fetching favorite classes:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userEmail, baseUrl]);

    useEffect(() => {
        if (userEmail) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchFavorites();
        }
    }, [userEmail, fetchFavorites]);

    // Remove From Favorites Handler
    const handleRemoveFavorite = async (classId) => {
        try {
            const response = await fetch(`${baseUrl}/api/favorites?userEmail=${userEmail}&classId=${classId}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                setFavorites(prev => prev.filter(item => item.classId !== classId));
            } else {
                alert(data.message || "Failed to remove.");
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
            alert("Something went wrong. Try again.");
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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-zinc-100">Favorite Classes</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Quickly access or manage the fitness programs you bookmarked.</p>
                </div>
                <div className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-400 font-medium flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500/10" /> Saved: <span className="text-zinc-100 font-bold">{favorites.length}</span>
                </div>
            </div>

            {/* Favorites Grid */}
            {favorites.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500">
                        <HeartOff className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-400">Your wishlist is empty</p>
                        <p className="text-xs text-zinc-600 max-w-xs mt-0.5">Click the heart icon on any training session page to save your preferred classes here.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {favorites.map((item) => (
                        <div key={item._id} className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col justify-between p-3 space-y-3 hover:border-zinc-800 transition-colors group">

                            <div className="space-y-2.5">
                                {/* Class Image Card */}
                                <div className="h-36 w-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-900 relative">
                                    <Image
                                        src={item.image || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400"}
                                        alt={item.className || "Class Cover"}
                                        fill
                                        sizes="(max-w-768px) 100vw, 33vw"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        unoptimized
                                    />
                                </div>

                                {/* Class Title */}
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 shrink-0">
                                        <Dumbbell className="h-3.5 w-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-zinc-100 tracking-tight line-clamp-1">
                                        {item.className || "Fitness Session"}
                                    </h3>
                                </div>
                            </div>

                            {/* Action Row */}
                            <div className="pt-2 border-t border-zinc-900">
                                <button
                                    onClick={() => handleRemoveFavorite(item.classId)}
                                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-rose-950/20 border border-zinc-800 hover:border-rose-900 rounded-lg text-zinc-400 hover:text-rose-400 text-xs font-semibold transition-colors"
                                >
                                    <HeartOff className="h-3 w-3" /> Remove Favorite
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default FavoritesPage;