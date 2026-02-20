import React from 'react';
import clsx from 'clsx';

type StatusType = 'online' | 'offline' | 'busy' | 'warning' | 'error' | 'success';

interface StatusBadgeProps {
    status: StatusType;
    label?: string;
    className?: string;
    pulsing?: boolean;
}

const styles = {
    online: 'bg-neon-green/10 text-neon-green border-neon-green/30',
    success: 'bg-neon-green/10 text-neon-green border-neon-green/30',
    offline: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    busy: 'bg-neon-amber/10 text-neon-amber border-neon-amber/30',
    warning: 'bg-neon-amber/10 text-neon-amber border-neon-amber/30',
    error: 'bg-red-500/10 text-red-500 border-red-500/30',
};

const dotColors = {
    online: 'bg-neon-green',
    success: 'bg-neon-green',
    offline: 'bg-gray-500',
    busy: 'bg-neon-amber',
    warning: 'bg-neon-amber',
    error: 'bg-red-500',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    label,
    className,
    pulsing = false
}) => {
    return (
        <div className={clsx(
            'inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium uppercase tracking-wider',
            styles[status],
            className
        )}>
            <span className={clsx(
                'w-1.5 h-1.5 rounded-full',
                dotColors[status],
                pulsing && 'animate-pulse'
            )} />
            {label || status}
        </div>
    );
};
