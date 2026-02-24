import { create } from 'zustand';
import type { Task } from '../types';

/* ===== Types & Interfaces ===== */
interface UndoState {
	clearPendingDelete: () => void;
	pendingDelete: Task | null;
	setPendingDelete: (task: Task) => void;
}

export const useUndoStore = create<UndoState>()((set) => ({
	clearPendingDelete: () => set({ pendingDelete: null }),
	pendingDelete: null,
	setPendingDelete: (task: Task) => set({ pendingDelete: task })
}));
