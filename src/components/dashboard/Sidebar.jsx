"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Dumbbell,
    Calendar,
    Settings,
    User,
    LogOut,
    TrendingUp,
    ShieldAlert,
    PlusCircle,
    FilePlus,
    BookOpen,
    UserCheck,
    CreditCard,
    MessageSquareCode,
    ClipboardList,
    UserPlus,
    Heart,
} from 'lucide-react';
import { authClient, useSession } from '@/lib/auth-client';
import Image from 'next/image';


export default function Sidebar() {

    const { data: sessionData, isPending, refetch } = useSession();
    const user = sessionData?.user;

    const router = useRouter();
    const role = user?.role;
    const pathname = usePathname();


    // Dynamic navigation matrix by role
    const linksByRole = {
        admin: [
            { name: 'Overview', href: '/dashboard/admin/overview', icon: LayoutDashboard },
            { name: 'Manage Users', href: '/dashboard/admin/manage-users', icon: Users },
            { name: 'Applied Trainers', href: '/dashboard/admin/applied-trainers', icon: UserCheck },
            { name: 'Manage Trainers', href: '/dashboard/admin/manage-trainers', icon: ShieldAlert },
            { name: 'Manage Classes', href: '/dashboard/admin/manage-classes', icon: Calendar },
            { name: 'Add Forum Post', href: '/dashboard/admin/add-forum-post', icon: FilePlus },
            { name: 'Transactions', href: '/dashboard/admin/transactions', icon: CreditCard },
            { name: 'Forum Post Manage', href: '/dashboard/admin/forum-manage', icon: MessageSquareCode },
        ],
        trainer: [
            { name: 'Overview', href: '/dashboard/trainer/overview', icon: LayoutDashboard },
            { name: 'Add Class', href: '/dashboard/trainer/add-class', icon: PlusCircle },
            { name: 'My Classes', href: '/dashboard/trainer/my-classes', icon: Dumbbell },
            { name: 'Add Forum Post', href: '/dashboard/trainer/add-forum-post', icon: FilePlus },
            { name: 'My Forum Posts', href: '/dashboard/trainer/my-forum-posts', icon: BookOpen },
        ],
        user: [
            { name: 'Overview', href: '/dashboard/user/overview', icon: LayoutDashboard },
            { name: 'Booked Classes', href: '/dashboard/user/booked-classes', icon: ClipboardList },
            { name: 'Apply as Trainer', href: '/dashboard/user/apply-trainer', icon: UserPlus },
            { name: 'Favorite Classes', href: '/dashboard/user/favorites', icon: Heart },
        ]
    };

    const currentNavLinks = linksByRole[role] || linksByRole['user'];

    const handleLogout = async () => {
        try {
            await authClient.signOut();

            await refetch();

            router.push('/login');
            router.refresh();

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between text-zinc-400 select-none font-sans sticky top-0">
            {/* Top Side: Brand & Navigation */}
            <div className="flex flex-col pt-6 px-4">
                {/* GymX Logo Header */}
                <div className="flex items-center gap-3 px-3 mb-8">
                    <div className="h-6 w-6 bg-zinc-50 rounded flex items-center justify-center">
                        <span className="text-black font-extrabold text-sm tracking-tighter">X</span>
                    </div>
                    <span className="text-sm font-black tracking-widest text-zinc-100 uppercase">GymX Panel</span>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-1">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-600 px-3 mb-2">Management</p>
                    {currentNavLinks.map((item) => {
                        const Icon = item.icon;

                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`w-full h-9 px-3 text-xs font-medium rounded flex items-center gap-3 transition-all duration-200 group cursor-pointer ${isActive
                                    ? 'bg-zinc-100 text-black font-bold shadow-sm'
                                    : 'text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200'
                                    }`}
                            >
                                <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive
                                    ? 'text-black'
                                    : 'text-zinc-500 group-hover:text-zinc-400'
                                    }`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Side: User Profile & Actions */}
            <div className="p-4 border-t border-zinc-900 bg-zinc-950/50">

                {/* User Info Block */}
                <div className="flex items-center justify-between p-2 rounded bg-zinc-900/40 border border-zinc-900/60 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div>
                            <Image
                                className="h-8 w-8 rounded-full object-cover border border-zinc-700"
                                src={user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"}
                                alt={user?.name || "User"}
                                width={32}
                                height={32}
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-zinc-200 truncate">{user?.name}</span>
                            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{user?.role}</span>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full h-8 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded flex items-center gap-3 px-3 transition-colors cursor-pointer"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
}