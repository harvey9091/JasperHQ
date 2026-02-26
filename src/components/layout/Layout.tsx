import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { LuffyChat } from '../LuffyChat';

export const Layout: React.FC = () => (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(160deg, #111215 0%, #161820 50%, #1C1E22 100%)' }}>
        {/* Fixed vignette + subtle top-highlight layer */}
        <div
            className="fixed inset-0 pointer-events-none"
            style={{
                background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)',
                zIndex: 1,
            }}
        />

        <TopNav />

        <main
            className="relative pt-[92px] pb-16 px-6 lg:px-12 xl:px-16 max-w-[1680px] mx-auto"
            style={{ zIndex: 10 }}
        >
            <Outlet />
        </main>

        <LuffyChat />
    </div>
);

