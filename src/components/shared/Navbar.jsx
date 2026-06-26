"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import { useSession, authClient } from '@/lib/auth-client';

export default function Navbar() {
    const { data: sessionData, isPending, refetch } = useSession();
    const user = sessionData?.user;

    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const profileDropdownRef = useRef(null);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);


    // Handler to close dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target)
            ) {
                setIsProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileOpen]);

    // BetterAuth- Logout function
    const handleLogout = async () => {
        try {
            await authClient.signOut();

            setIsOpen(false);
            setIsProfileOpen(false);

            await refetch();

            router.push('/login');
            router.refresh();

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // shadcn/ui + X inspired active link styles
    const getLinkClass = (path) => {
        const isActive = pathname === path;
        return `text-sm font-medium transition-colors duration-200 py-1 relative ${isActive
            ? 'text-zinc-50 font-semibold'
            : 'text-zinc-400 hover:text-zinc-200'
            }`;
    };

    // Main Navigation Routing List
    const renderNavLinks = (isMobile = false) => (
        <>
            <Link href="/" onClick={() => isMobile && setIsOpen(false)} className={getLinkClass('/')}>Home</Link>
            <Link href="/classes" onClick={() => isMobile && setIsOpen(false)} className={getLinkClass('/all-classes')}>All Classes</Link>
            <Link href="/forum" onClick={() => isMobile && setIsOpen(false)} className={getLinkClass('/community-forum')}>Community Forum</Link>
            {user && (
                <Link
                    href={`/dashboard/${user.role || 'user'}/overview`}
                    onClick={() => isMobile && setIsOpen(false)}
                    className={getLinkClass(`/dashboard/${user.role || 'user'}`)}
                >
                    Dashboard
                </Link>
            )}
        </>
    );

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md text-zinc-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">

                    {/* Logo Section */}
                    <Link href="/" className="flex items-center space-x-2 font-bold tracking-tight text-lg">
                        <span className="bg-zinc-50 text-black px-1.5 py-0.5 rounded-md font-black tracking-tighter text-sm">
                            G
                        </span>
                        <span className="text-zinc-50 font-extrabold uppercase tracking-wide text-base">
                            GymX
                        </span>
                    </Link>

                    {/* Desktop Center Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        {renderNavLinks(false)}
                    </div>

                    {/* Desktop Right Action Area */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isPending ? (
                            <div className="h-8 w-8 rounded-full bg-zinc-800 animate-pulse" />
                        ) : user ? (
                            <div className="relative flex items-center space-x-3" ref={profileDropdownRef}>
                                <p className="text-sm font-medium text-zinc-300 hidden lg:block select-none">
                                    {user.name}
                                </p>
                                <button
                                    onClick={toggleProfile}
                                    className="flex items-center focus:outline-none focus:ring-1 focus:ring-zinc-700 rounded-full"
                                >
                                    <Image
                                        className="h-8 w-8 rounded-full object-cover border border-zinc-700 hover:opacity-80 transition-opacity"
                                        src={user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"}
                                        alt={user.name || "User"}
                                        width={32}
                                        height={32}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-2 top-full mt-2 w-56 bg-zinc-950 rounded-md border border-zinc-800 shadow-xl py-1 z-50 text-zinc-200 animate-in fade-in slide-in-from-top-1 duration-100">
                                        <div className="px-3 py-2 border-b border-zinc-800">
                                            <p className="text-xs font-medium text-zinc-400 truncate">Signed in as</p>
                                            <p className="text-sm font-semibold text-zinc-100 truncate">{user.name}</p>
                                            {user.role && (
                                                <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                                                    {user.role}
                                                </span>
                                            )}
                                        </div>

                                        <Link
                                            href={`/dashboard/${user.role || 'user'}/overview`}
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-zinc-900 transition-colors"
                                        >
                                            <LayoutDashboard className="h-4 w-4 text-zinc-400" />
                                            <span>Dashboard Overview</span>
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-900/50 transition-colors border-t border-zinc-800 mt-1"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Log out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-xs font-medium text-zinc-400 hover:text-zinc-50 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-zinc-50 hover:bg-zinc-200 text-black text-xs font-semibold h-9 px-4 rounded-md inline-flex items-center justify-center transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-zinc-400 hover:text-zinc-100 p-1 rounded-md"
                            aria-label="Toggle Menu"
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Expandable Navigation Panel */}
            {isOpen && (
                <div className="md:hidden bg-black border-t border-zinc-800 text-zinc-200 absolute left-0 w-full shadow-2xl animate-in fade-in duration-200">
                    <div className="px-4 pt-3 pb-5 space-y-4">
                        <div className="flex flex-col space-y-3 pb-3 border-b border-zinc-900">
                            {renderNavLinks(true)}
                        </div>

                        {user ? (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 px-1">
                                    <Image
                                        className="h-8 w-8 rounded-full object-cover border border-zinc-700"
                                        src={user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"}
                                        alt={user.name || "User"}
                                        width={32}
                                        height={32}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-zinc-200">{user.name}</p>
                                        <span className="text-[10px] uppercase font-bold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                                            {user.role || 'user'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Link
                                        href={`/dashboard/${user.role || 'user'}`}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center space-x-2 bg-zinc-900 text-zinc-100 py-2.5 rounded-md font-medium text-sm border border-zinc-800"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>Dashboard Menu</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center space-x-2 bg-zinc-950 text-red-400 py-2.5 rounded-md font-medium text-sm border border-zinc-900"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 pt-1">
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center bg-zinc-900 text-zinc-100 py-2.5 rounded-md font-medium text-sm border border-zinc-800"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center bg-zinc-50 text-black py-2.5 rounded-md font-semibold text-sm hover:bg-zinc-200 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}