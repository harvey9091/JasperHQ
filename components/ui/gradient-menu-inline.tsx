import React from 'react';
import { IoHomeOutline, IoVideocamOutline, IoCameraOutline, IoShareSocialOutline, IoHeartOutline } from 'react-icons/io5';

const menuItems = [
    { title: 'Home', icon: <IoHomeOutline />, gradientFrom: '#a955ff', gradientTo: '#ea51ff' },
    { title: 'Video', icon: <IoVideocamOutline />, gradientFrom: '#56CCF2', gradientTo: '#2F80ED' },
    { title: 'Photo', icon: <IoCameraOutline />, gradientFrom: '#FF9966', gradientTo: '#FF5E62' },
    { title: 'Share', icon: <IoShareSocialOutline />, gradientFrom: '#80FF72', gradientTo: '#7EE8FA' },
    { title: 'Tym', icon: <IoHeartOutline />, gradientFrom: '#ffa9c6', gradientTo: '#f434e2' }
];

export default function GradientMenuInline() {
    return (
        <div className="flex justify-center items-center py-8">
            <ul className="flex gap-4">
                {menuItems.map(({ title, icon, gradientFrom, gradientTo }, idx) => (
                    <li
                        key={idx}
                        style={{
                            '--gradient-from': gradientFrom,
                            '--gradient-to': gradientTo
                        } as React.CSSProperties}
                        className="relative w-[50px] h-[50px] bg-white/10 backdrop-blur-sm shadow-lg rounded-full flex items-center justify-center transition-all duration-500 hover:w-[160px] hover:shadow-none group cursor-pointer border border-white/20"
                    >
                        {/* Gradient background on hover */}
                        <span
                            className="absolute inset-0 rounded-full opacity-0 transition-all duration-500 group-hover:opacity-100"
                            style={{
                                background: `linear-gradient(45deg, ${gradientFrom}, ${gradientTo})`
                            }}
                        ></span>

                        {/* Blur glow */}
                        <span
                            className="absolute top-[8px] inset-x-0 h-full rounded-full blur-[15px] opacity-0 -z-10 transition-all duration-500 group-hover:opacity-50"
                            style={{
                                background: `linear-gradient(45deg, ${gradientFrom}, ${gradientTo})`
                            }}
                        ></span>

                        {/* Icon */}
                        <span className="relative z-10 transition-all duration-500 group-hover:scale-0 delay-0">
                            <span className="text-xl text-white/80">{icon}</span>
                        </span>

                        {/* Title */}
                        <span className="absolute text-white uppercase tracking-wide text-xs font-bold transition-all duration-500 scale-0 group-hover:scale-100 delay-150">
                            {title}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
