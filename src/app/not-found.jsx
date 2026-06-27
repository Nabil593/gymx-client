import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-center px-4">
            <div className="mb-6">
                <AlertTriangle className="h-20 w-20 text-zinc-800" strokeWidth={1.5} />
            </div>

            <h1 className="text-4xl font-extrabold text-zinc-50 uppercase tracking-tighter mb-2">
                Page Not Found
            </h1>
            <p className="text-zinc-500 text-sm max-w-sm mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <Link
                href="/"
                className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-200 text-black px-6 py-2.5 rounded text-xs font-bold transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
            </Link>
        </div>
    );
}