import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';

const MainLayout = ({ children }) => {
    return (
        <div className='min-h-screen flex flex-col'>
            <Navbar />
            <main className="flex-1">
                {children}
                <Toaster />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;