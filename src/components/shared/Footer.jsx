import React from 'react';
import Link from 'next/link';
import { MessageSquare, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full border-t border-zinc-800 bg-black text-zinc-400 text-xs sm:text-sm">
            <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">

                {/* Top Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-zinc-900">

                    {/* Column 1: Brand Info */}
                    <div className="flex flex-col space-y-3">
                        <Link href="/" className="flex items-center space-x-2 font-bold text-base text-zinc-50">
                            <span className="bg-zinc-50 text-black px-1.5 py-0.5 rounded font-black tracking-tighter text-sm">
                                G
                            </span>
                            <span className="uppercase tracking-wide text-sm font-extrabold">
                                GymX
                            </span>
                        </Link>
                        <p className="text-zinc-500 leading-relaxed max-w-xs">
                            A comprehensive system designed for fitness enthusiasts, trainers, and administrators to track, build, and connect.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col space-y-2.5">
                        <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">Quick Links</h4>
                        <Link href="/" className="hover:text-zinc-200 transition-colors w-fit">Home</Link>
                        <Link href="/all-classes" className="hover:text-zinc-200 transition-colors w-fit">All Classes</Link>
                        <Link href="/community-forum" className="hover:text-zinc-200 transition-colors w-fit">Community Forum</Link>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div className="flex flex-col space-y-2.5 text-zinc-500">
                        <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">Contact Information</h4>
                        <div className="flex items-center space-x-2">
                            <Mail className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="text-zinc-400">support@gymx.com</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="text-zinc-400">+880 1234-567890</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="text-zinc-400">Rajshahi, Bangladesh</span>
                        </div>
                    </div>

                    {/* Column 4: Social Media Links */}
                    <div className="flex flex-col space-y-3">
                        <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">Follow Us</h4>
                        <div className="flex items-center space-x-4">

                            {/* New X (Twitter) Logo using Custom SVG */}
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-zinc-50 transition-colors"
                                aria-label="X (formerly Twitter)"
                            >
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>

                            {/* Other standard platform placeholders */}
                            <a href="#" className="text-zinc-400 hover:text-zinc-50 transition-colors" aria-label="GitHub">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.48,0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Section: Copyright & Legal */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-6 text-zinc-600 text-[11px]">
                    <p>© {new Date().getFullYear()} GymX Platform. All rights reserved.</p>
                    <div className="flex space-x-4 mt-2 sm:mt-0">
                        <span className="hover:text-zinc-500 cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-zinc-500 cursor-pointer">Terms of Service</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}