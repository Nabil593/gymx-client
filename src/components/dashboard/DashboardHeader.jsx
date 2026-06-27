"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from "@/lib/auth-client";
import { ChevronRight, User, Menu, Home } from 'lucide-react';

const DashboardHeader = ({ onMenuClick }) => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userRole = session?.user?.role || "user";

    const pathSegments = pathname
        .split('/')
        .filter(segment => segment && segment !== 'dashboard');

    return (
        <header className="h-14 w-full border-b border-zinc-900 bg-zinc-950 flex items-center justify-between px-4 sm:px-6 select-none z-30">

            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-1.5 text-zinc-400 hover:text-zinc-100 transition-colors rounded hover:bg-zinc-900 md:hidden cursor-pointer"
                >
                    <Menu className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    <span className="text-zinc-400">GymX</span>
                    <ChevronRight className="h-3 w-3 text-zinc-600" />
                    <span className="text-zinc-400 hidden sm:inline">Dashboard</span>
                    <ChevronRight className="h-3 w-3 text-zinc-600 hidden sm:inline" />

                    {pathSegments.map((segment, index) => {
                        const isLast = index === pathSegments.length - 1;
                        return (
                            <React.Fragment key={segment}>
                                {index > 0 && <ChevronRight className="h-3 w-3 text-zinc-600" />}
                                <span className={isLast ? "text-zinc-200 font-extrabold" : "text-zinc-400"}>
                                    {segment.replace('-', ' ')}
                                </span>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">

                <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2 sm:px-2.5 py-1 rounded-md">
                    <User className="h-3 w-3 text-zinc-400" />
                    <span className="text-[9px] sm:text-[10px] font-extrabold tracking-widest uppercase text-zinc-300">
                        {userRole}
                    </span>
                </div>

                <div className="h-4 w-[1px] bg-zinc-800" />

                <Link
                    href="/"
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 px-2.5 py-1 rounded-md transition-all duration-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer"
                    title="Back to Main Site"
                >
                    <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-400" />
                    <span className="hidden md:inline text-zinc-400 hover:text-zinc-100">Back to Site</span>
                </Link>

            </div>
        </header>
    );
};

export default DashboardHeader;