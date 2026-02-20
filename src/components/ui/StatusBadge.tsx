import React from 'react';
import clsx from 'clsx';

type StatusType = 'online' | 'offline' | 'busy' | 'warning' | 'error' | 'success' | 'active' | 'new' | 'negotiating' | 'archived' | 'hold';

interface StatusBadgeProps {
    status: StatusType;
    label?: string;
    className?: string;
    pulsing?: boolean;
}

// Map various nuances to core styles
const styleMap: Record<StatusType, string> = {
    // Core Statuses
    online: 'bg-ember-primary/10 text-ember-primary border-ember-primary/30',
    active: 'bg-ember-primary/10 text-ember-primary border-ember-primary/30',
    success: 'bg-ember-primary/10 text-ember-primary border-ember-primary/30',

    // Low Priority / Inactive
    offline: 'bg-phoenix-surface text-phoenix-muted border-phoenix-border',
    archived: 'bg-phoenix-surface text-phoenix-muted border-phoenix-border',

    // Warning / In Progress
    busy: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    negotiating: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    new: 'bg-blue-500/10 text-blue-500 border-white/10', // Keep new as blue or white for contrast? Let's use Blue-ish or White
    hold: 'bg-red-500/10 text-red-500 border-red-500/30',

    // Error
    error: 'bg-red-500/10 text-red-500 border-red-500/30',
};

const dotColors: Record<StatusType, string> = {
    online: 'bg-ember-primary',
    active: 'bg-ember-primary',
    success: 'bg-ember-primary',
    offline: 'bg-phoenix-muted',
    archived: 'bg-phoenix-muted',
    busy: 'bg-amber-500',
    warning: 'bg-amber-500',
    negotiating: 'bg-amber-500',
    new: 'bg-blue-500',
    hold: 'bg-red-500',
    error: 'bg-red-500',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    label,
    className,
    pulsing = false
}) => {
    // Fallback for unmapped statuses
    const safeStatus = styleMap[status] ? status : 'offline';

    return (
        <div className={clsx(
            'inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium uppercase tracking-wider',
            styleMap[safeStatus],
            className
        )}>
            <div className={clsx(
                'w-1.5 h-1.5 rounded-full',
                dotColors[safeStatus],
                (pulsing || status === 'online' || status === 'active') && 'animate-pulse shadow-orange-micro'
            )} />
            {label || status}
        </div>
    );
};
