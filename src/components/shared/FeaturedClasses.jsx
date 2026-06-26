"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, ArrowUpRight, Users, Clock, Tag } from 'lucide-react';

const FeaturedClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchFeaturedClasses = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/public/featured-classes`);
                const data = await res.json();
                if (data.success) {
                    setClasses(data.classes);
                }
            } catch (error) {
                console.error("Failed to fetch featured classes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedClasses();
    }, [baseUrl]);

    // Framer Motion Container Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    // Card Motion Variants
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    if (loading) {
        return (
            <div className="py-20 w-full flex items-center justify-center bg-[#09090b]">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (classes.length === 0) return null;

    return (
        <section className="bg-[#09090b] text-[#fafafa] py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <span className="text-xs font-semibold text-zinc-100 tracking-widest uppercase">
                            Top Disciplines
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl mt-1">
                            Featured Classes
                        </h2>
                        <p className="text-sm text-zinc-500 mt-2 max-w-xl">
                            Discover our most popular sessions, handpicked based on member bookings and top-tier trainer recommendations.
                        </p>
                    </div>
                    <div>
                        <Link
                            href="/classes"
                            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-200 group border-b border-zinc-800 pb-1"
                        >
                            View All Classes
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>
                </div>

                {/* Grid Wrapper with Framer Motion */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {classes.map((cls) => (
                        <motion.div
                            key={cls._id}
                            variants={cardVariants}
                            className="group bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-800 transition-all duration-300"
                        >
                            {/* Thumbnail & Price Overlay */}
                            <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
                                <img
                                    src={cls.image || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600"}
                                    alt={cls.className}
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-zinc-800 px-2.5 py-1 rounded-md text-[11px] font-semibold text-zinc-100">
                                    ${cls.price}
                                </div>
                            </div>

                            {/* Content Block */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    {/* Category & Duration */}
                                    <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-medium mb-2.5">
                                        <span className="flex items-center gap-1 bg-zinc-900 px-2 py-0.5 rounded text-zinc-400">
                                            <Tag className="h-2.5 w-2.5" /> {cls.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-2.5 w-2.5" /> {cls.duration || "60 mins"}
                                        </span>
                                    </div>

                                    {/* Class Title */}
                                    <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
                                        {cls.className}
                                    </h3>

                                    {/* Trainer Information */}
                                    <p className="text-[11px] text-zinc-500 mt-1">
                                        by <span className="text-zinc-400 font-medium">{cls.trainerName || "Expert Trainer"}</span>
                                    </p>
                                </div>

                                {/* Booking Stats & Action Button */}
                                <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-zinc-400" title="Total Bookings">
                                        <Users className="h-3.5 w-3.5 text-emerald-500/80" />
                                        <span className="text-xs font-semibold">{cls.bookingCount || 0}</span>
                                        <span className="text-[10px] text-zinc-600 font-normal">booked</span>
                                    </div>

                                    <Link
                                        href={`/classes/${cls._id}`}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-100 border border-zinc-800 hover:border-zinc-100 text-zinc-300 hover:text-black font-medium text-[11px] rounded-lg transition-all duration-200"
                                    >
                                        Details
                                    </Link>
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedClasses;