"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AllClassesPage = () => {
    
    const [classes, setClasses] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    
    const categories = ['Yoga', 'Cardio', 'Weights', 'Zumba', 'CrossFit', 'Martial Arts'];

    // Data Fetch
    const fetchClasses = async (currentSearch = search, currentCategory = category, currentPage = page) => {
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:5000/api/public/classes?page=${currentPage}&limit=6&search=${currentSearch}&category=${currentCategory}`
            );
            const data = await res.json();

            if (data.success) {
                setClasses(data.classes);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchClasses(search, category, page);
    }, [page, category]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchClasses(search, category, 1);
    };

    const handleReset = () => {
        setSearch('');
        setCategory('');
        setPage(1);
        fetchClasses('', '', 1);
    };
    return (
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] py-16 px-4 sm:px-6 lg:px-8 font-sans antialiased">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header section */}
                <div className="flex flex-col items-center text-center mb-12 border-b border-[#27272a] pb-8">
                    <div className="inline-flex items-center gap-2 bg-[#27272a]/50 text-[#a1a1aa] text-xs font-medium px-3 py-1 rounded-full border border-[#3f3f46] mb-3 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Fitness Programs
                    </div>
                    <h1 className="text-3xl font-bold text-[#f4f4f5] tracking-tight sm:text-4xl bg-gradient-to-b from-[#ffffff] to-[#a1a1aa] bg-clip-text text-transparent">
                        All Fitness Classes
                    </h1>
                    <p className="mt-2 text-sm text-[#a1a1aa] max-w-xl mx-auto">
                        Discover premium workout sessions engineered for your peak performance. Filter, search, and book instantly.
                    </p>
                </div>

                {/* Control Panel */}
                <div className="bg-[#18181b] p-5 rounded-xl border border-[#27272a] mb-10 shadow-xl shadow-black/40">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search Input */}
                        <div className="w-full lg:flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search classes by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#09090b] text-[#f4f4f5] px-4 py-2.5 rounded-lg border border-[#27272a] focus:outline-none focus:border-[#a1a1aa] focus:ring-1 focus:ring-[#a1a1aa] transition-all text-sm placeholder-[#52525b]"
                            />
                        </div>

                        {/* Filter Dropdown */}
                        <div className="w-full lg:w-60">
                            <select
                                value={category}
                                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                                className="w-full bg-[#09090b] text-[#f4f4f5] px-4 py-2.5 rounded-lg border border-[#27272a] focus:outline-none focus:border-[#a1a1aa] transition-all text-sm cursor-pointer appearance-none"
                            >
                                <option value="" className="bg-[#18181b]">All Categories</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat} className="bg-[#18181b]">{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Actions Buttons */}
                        <div className="w-full lg:w-auto flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 lg:flex-none px-6 py-2.5 bg-[#fafafa] hover:bg-[#e4e4e7] text-[#09090b] font-medium text-sm rounded-lg transition-colors duration-200"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-4 py-2.5 bg-[#27272a] hover:bg-[#3f3f46] text-[#e4e4e7] font-medium text-sm rounded-lg border border-[#3f3f46] transition-colors duration-200"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {/*  Class grid / Loading */}
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
                ) : classes.length === 0 ? (
                    <div className="text-center py-20 bg-[#18181b] rounded-xl border border-[#27272a]">
                        <p className="text-[#a1a1aa] text-sm">No approved fitness programs found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((cls) => (
                            <div
                                key={cls._id}
                                className="bg-[#18181b] rounded-xl border border-[#27272a] overflow-hidden flex flex-col hover:border-[#3f3f46] transition-all duration-300 group"
                            >
                                <div className="h-44 w-full bg-[#09090b] relative overflow-hidden">
                                    <img
                                        src={cls.image || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop"}
                                        alt={cls.className}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                    />
                                    <span className="absolute bottom-3 left-3 bg-[#09090b]/80 border border-[#27272a] text-[#f4f4f5] text-[11px] font-medium px-2.5 py-0.5 rounded-md backdrop-blur-md">
                                        {cls.category}
                                    </span>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <p className="text-xs text-emerald-500 font-medium mb-1 tracking-wider uppercase">
                                        Trainer: {cls.trainerName || 'Elite Instructor'}
                                    </p>
                                    <h3 className="text-lg font-semibold text-[#f4f4f5] mb-2 line-clamp-1 group-hover:text-white transition-colors">
                                        {cls.className}
                                    </h3>
                                    <p className="text-[#a1a1aa] text-xs line-clamp-2 mb-5 flex-grow leading-relaxed">
                                        {cls.description}
                                    </p>

                                    <div className="border-t border-[#27272a] pt-4 mt-auto">
                                        <div className="flex items-center justify-between text-xs mb-4">
                                            <div>
                                                <p className="text-[10px] text-[#52525b] uppercase font-bold tracking-wider">Investment</p>
                                                <p className="font-semibold text-[#f4f4f5] text-sm mt-0.5">${cls.price} <span className="text-[#71717a] font-normal">/ {cls.duration}</span></p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-[#52525b] uppercase font-bold tracking-wider">Enrolled</p>
                                                <p className="font-medium text-[#e4e4e7] bg-[#27272a] px-2 py-0.5 rounded border border-[#3f3f46] inline-block mt-0.5">
                                                    {cls.bookingCount || 0} Slots
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/classes/${cls._id}`}
                                            className="block w-full text-center py-2 bg-[#27272a] hover:bg-[#fafafa] text-[#e4e4e7] hover:text-[#09090b] border border-[#3f3f46] hover:border-white text-xs font-medium rounded-lg transition-all duration-200"
                                        >
                                            View Program Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-12 border-t border-[#27272a] pt-6">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${page === 1
                                ? 'bg-[#09090b] border-[#27272a] text-[#3f3f46] cursor-not-allowed'
                                : 'bg-[#18181b] border-[#27272a] hover:bg-[#27272a] text-[#a1a1aa]'
                                }`}
                        >
                            Previous
                        </button>

                        <span className="text-xs text-[#71717a] font-medium">
                            Page <span className="text-[#f4f4f5]">{page}</span> of {totalPages}
                        </span>

                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${page === totalPages
                                ? 'bg-[#09090b] border-[#27272a] text-[#3f3f46] cursor-not-allowed'
                                : 'bg-[#18181b] border-[#27272a] hover:bg-[#27272a] text-[#a1a1aa]'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AllClassesPage;