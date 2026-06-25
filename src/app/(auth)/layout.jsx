import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main className="flex-1 flex flex-col">
                {children}
                <Toaster />
            </main>
            <Footer />
        </div>
    );
};

export default AuthLayout;