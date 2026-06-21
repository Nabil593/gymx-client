import Sidebar from '@/components/dashboard/Sidebar';
import React from 'react';

const DashboardLayout = ({ children }) => {
    return (
        <div>
            <Sidebar />
            <main>
            {children}
            </main>
        </div>
    );
};

export default DashboardLayout;