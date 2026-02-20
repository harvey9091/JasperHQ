import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, Calendar, DollarSign, User } from 'lucide-react';
import { PhoenixCard } from '../components/ui/PhoenixCard';
import { IndustrialButton } from '../components/ui/IndustrialButton';
import clsx from 'clsx';

// Type Definitions
interface Task {
    id: string;
    title: string;
    company: string;
    value: string;
    date: string;
    tag: 'High' | 'Medium' | 'Low';
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

// Initial Data
const initialColumns: Column[] = [
    {
        id: 'new',
        title: 'New Leads',
        tasks: [
            { id: 't1', title: 'Enterprise License', company: 'Acme Corp', value: '$50k', date: '2d ago', tag: 'High' },
            { id: 't2', title: 'Q3 Consultation', company: 'Globex', value: '$12k', date: '1d ago', tag: 'Medium' },
        ],
    },
    {
        id: 'qualifying',
        title: 'Qualifying',
        tasks: [
            { id: 't3', title: 'System Upgrade', company: 'Soylent Corp', value: '$120k', date: '4d ago', tag: 'High' },
        ],
    },
    {
        id: 'proposal',
        title: 'Proposal Sent',
        tasks: [
            { id: 't4', title: 'Security Audit', company: 'Umbrella Corp', value: '$85k', date: '1w ago', tag: 'Medium' },
            { id: 't5', title: 'AI Integration', company: 'Cyberdyne', value: '$250k', date: '3d ago', tag: 'High' },
        ],
    },
    {
        id: 'negotiation',
        title: 'Negotiation',
        tasks: [
            { id: 't6', title: 'Fleet Management', company: 'Weyland-Yutani', value: '$1.2M', date: '2w ago', tag: 'High' },
        ],
    },
    {
        id: 'closed',
        title: 'Closed Won',
        tasks: [],
    },
];

export const Crm = () => {
    const [columns, setColumns] = useState<Column[]>(initialColumns);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        // Dropped outside the list
        if (!destination) return;

        // Dropped in the same place
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceColIndex = columns.findIndex(col => col.id === source.droppableId);
        const destColIndex = columns.findIndex(col => col.id === destination.droppableId);

        const sourceCol = columns[sourceColIndex];
        const destCol = columns[destColIndex];

        const sourceTasks = Array.from(sourceCol.tasks);
        const destTasks = Array.from(destCol.tasks);

        const [removed] = sourceTasks.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
            // Reorder within same column
            sourceTasks.splice(destination.index, 0, removed);
            const newColumns = [...columns];
            newColumns[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
            setColumns(newColumns);
        } else {
            // Move to different column
            destTasks.splice(destination.index, 0, removed);
            const newColumns = [...columns];
            newColumns[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
            newColumns[destColIndex] = { ...destCol, tasks: destTasks };
            setColumns(newColumns);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1 tracking-tight">Deal Pipeline</h1>
                    <p className="text-phoenix-muted font-light">Manage deal flow and progression.</p>
                </div>
                <IndustrialButton icon={Plus}>New Deal</IndustrialButton>
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                    <div className="flex gap-6 h-full min-w-max">
                        {columns.map((column) => (
                            <div key={column.id} className="w-80 flex flex-col">
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-4 p-3 bg-phoenix-surface/50 border border-white/5 rounded-lg border-l-4 border-l-ember-primary backdrop-blur-sm shadow-stone-bevel">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">{column.title}</h3>
                                        <span className="text-xs font-mono text-phoenix-muted px-1.5 py-0.5 bg-white/5 rounded">
                                            {column.tasks.length}
                                        </span>
                                    </div>
                                    <button className="text-phoenix-muted hover:text-white transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={clsx(
                                                "flex-1 rounded-xl transition-colors p-2 -mx-2",
                                                snapshot.isDraggingOver ? "bg-white/5" : "bg-transparent"
                                            )}
                                        >
                                            <div className="space-y-3">
                                                {column.tasks.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{ ...provided.draggableProps.style }}
                                                            >
                                                                <PhoenixCard
                                                                    className={clsx(
                                                                        "p-4 cursor-grab active:cursor-grabbing hover:border-ember-primary/50 transition-colors group",
                                                                        snapshot.isDragging && "shadow-orange-glow rotate-2 scale-105"
                                                                    )}
                                                                >
                                                                    {/* Tag & Menu */}
                                                                    <div className="flex justify-between items-start mb-3">
                                                                        <span className={clsx(
                                                                            "text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border",
                                                                            task.tag === 'High' ? "bg-ember-primary/10 text-ember-primary border-ember-primary/20" :
                                                                                task.tag === 'Medium' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                                                    "bg-phoenix-muted/10 text-phoenix-muted border-phoenix-muted/20"
                                                                        )}>
                                                                            {task.tag} Priority
                                                                        </span>
                                                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-phoenix-muted hover:text-white">
                                                                            <MoreHorizontal className="w-4 h-4" />
                                                                        </button>
                                                                    </div>

                                                                    <h4 className="text-white font-bold mb-1">{task.title}</h4>
                                                                    <div className="flex items-center gap-1 text-phoenix-muted text-xs mb-4">
                                                                        <User className="w-3 h-3" />
                                                                        {task.company}
                                                                    </div>

                                                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                                        <div className="flex items-center gap-1 text-ember-primary font-mono font-bold text-xs">
                                                                            <DollarSign className="w-3 h-3" />
                                                                            {task.value}
                                                                        </div>
                                                                        <div className="flex items-center gap-1 text-phoenix-muted text-[10px]">
                                                                            <Calendar className="w-3 h-3" />
                                                                            {task.date}
                                                                        </div>
                                                                    </div>
                                                                </PhoenixCard>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
};
