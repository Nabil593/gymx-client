"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Flame, Award, ShieldCheck } from 'lucide-react';

export default function StatsSection() {
    const stats = [
        { id: 1, name: 'Active Athletes', value: '15,000+', icon: Users, desc: 'Trainers and members logging daily workouts.' },
        { id: 2, name: 'Calories Burned', value: '4.8M+', icon: Flame, desc: 'Collective energy tracked via automated logs.' },
        { id: 3, name: 'Expert Coaches', value: '120+', icon: Award, desc: 'Certified trainers across multiple disciplines.' },
        { id: 4, name: 'Success Rate', value: '99.4%', icon: ShieldCheck, desc: 'Members achieving target conditioning thresholds.' },
    ];

    return (
        <section className="w-full bg-black text-zinc-50 border-b border-zinc-800 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="max-w-2xl mb-12 sm:mb-16">
                    <span className="text-[11px] uppercase font-bold tracking-widest text-zinc-500">Platform Analytics</span>
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tighter text-zinc-100 uppercase mt-2">
                        Engineered for high performance
                    </h2>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-zinc-800 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="p-6 sm:p-8 flex flex-col justify-between hover:bg-zinc-950 transition-colors group"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                            {stat.name}
                                        </span>
                                        <Icon className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                    </div>
                                    <p className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-50 mt-4">
                                        {stat.value}
                                    </p>
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed mt-4">
                                    {stat.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}