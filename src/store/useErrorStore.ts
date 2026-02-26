import { create } from 'zustand';
import { StorageErrorType } from '../types';

/* ===== Types & Interfaces ===== */
export interface StorageError {
	message: string;
	type: StorageErrorType;
}

interface ErrorState {
	clearStorageError: () => void;
	setStorageError: (error: StorageError) => void;
	storageError: StorageError | null;
}

/* ===== Store ===== */
export const useErrorStore = create<ErrorState>()((set) => ({
	clearStorageError: () => set({ storageError: null }),
	setStorageError: (storageError: StorageError) => set({ storageError }),
	storageError: null
}));
