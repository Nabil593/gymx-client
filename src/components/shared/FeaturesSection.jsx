"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sliders, Zap, MessageSquareCode, Shield } from 'lucide-react';

export default function FeaturesSection() {
    const features = [
        {
            title: "Tactical Dashboards",
            description: "Separate interactive portals built custom for admins, specialized trainers, and regular gym members.",
            icon: Sliders
        },
        {
            title: "BetterAuth Protocols",
            description: "Ultra-secure profile sessions and multi-layer route guarding to ensure user telemetry stays fully encrypted.",
            icon: Shield
        },
        {
            title: "Realtime Forums",
            description: "An integrated community center designed to exchange training protocols, nutrition strategies, and raw advice.",
            icon: MessageSquareCode
        },
        {
            title: "Instant Class Provisioning",
            description: "Zero-latency booking schedules allowing members to reserve high-intensity sessions instantly.",
            icon: Zap
        }
    ];

    return (
        <section className="w-full bg-black text-zinc-50 border-b border-zinc-800 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="max-w-3xl mb-12 sm:mb-20">
                    <span className="text-[11px] uppercase font-bold tracking-widest text-zinc-500">Core Architecture</span>
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tighter text-zinc-100 uppercase mt-2">
                        Built different. Train harder.
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-400 max-w-xl mt-4 leading-relaxed">
                        GymX eliminates scheduling overhead and unorganized workflows so you can focus strictly on operational output and strength progression.
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700 transition-colors group"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-md text-zinc-400 group-hover:text-zinc-50 transition-colors">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h3 className="text-base font-bold text-zinc-200 group-hover:text-zinc-50 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}