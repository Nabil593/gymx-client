"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Activity } from 'lucide-react';

export default function Banner() {
    return (
        <div className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-black text-zinc-50 border-b border-zinc-800">

            {/* Shadcn style minimalist subtle grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

            {/* Radical X-shaped background glow accents */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-zinc-800/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative max-w-4xl mx-auto px-4 text-center flex flex-col items-center z-10">

                {/* Top Mini Pill Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 mb-6"
                >
                    <Activity className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-300 tracking-wide">
                        Next Generation Fitness Management
                    </span>
                </motion.div>

                {/* Energetic Title with Framer Motion */}
                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-zinc-50 uppercase"
                >
                    PULSE UP.<br />
                    <span className="bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-50 bg-clip-text text-transparent">
                        OWN YOUR STRENGTH.
                    </span>
                </motion.h1>

                {/* Brief Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-6 text-zinc-400 text-sm sm:text-lg max-w-xl sm:max-w-2xl leading-relaxed font-normal tracking-normal"
                >
                    Discover elite fitness classes, track metrics seamlessly, and coordinate with professional instructors. A raw performance workspace engineered for athletes and tactical trainers.
                </motion.p>

                {/* CTA Buttons Block */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                >
                    {/* Main "Explore Classes" CTA */}
                    <Link
                        href="/all-classes"
                        className="group w-full sm:w-auto bg-zinc-50 hover:bg-zinc-200 text-black text-sm font-semibold h-11 px-6 rounded-md inline-flex items-center justify-center transition-colors gap-2"
                    >
                        <span>Explore Classes</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    {/* Secondary X-Style Outline CTA */}
                    <Link
                        href="/community-forum"
                        className="w-full sm:w-auto bg-black hover:bg-zinc-900 text-zinc-300 hover:text-zinc-50 text-sm font-medium h-11 px-6 rounded-md inline-flex items-center justify-center transition-colors border border-zinc-800"
                    >
                        Join the Forum
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}