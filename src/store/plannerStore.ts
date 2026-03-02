import { create } from 'zustand';

export interface TimeBlock {
    time: string;
    label: string;
    description: string;
    type: string;
    color: string;
    tag: string;
}

interface PlannerState {
    plan: TimeBlock[];
    notes: string;
    isGenerating: boolean;
    setPlan: (plan: TimeBlock[]) => void;
    setNotes: (notes: string) => void;
    setIsGenerating: (isGenerating: boolean) => void;
}

export const usePlannerStore = create<PlannerState>((set) => ({
    plan: [],
    notes: '',
    isGenerating: false,
    setPlan: (plan) => set({ plan }),
    setNotes: (notes) => set({ notes }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
}));
