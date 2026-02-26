import { create } from 'zustand';
import { API_ERROR_COOLDOWN } from '../constants';
import { StorageErrorType } from '../types';

/* ===== Types & Interfaces ===== */
export interface StorageError {
	message: string;
	type: StorageErrorType;
}

interface ErrorState {
	clearStorageError: () => void;
	lastApiErrorAt: number;
	setStorageError: (error: StorageError) => void;
	storageError: StorageError | null;
}

/* ===== Store ===== */
export const useErrorStore = create<ErrorState>()((set, get) => ({
	clearStorageError: () => set({ storageError: null }),
	lastApiErrorAt: 0,
	setStorageError: (storageError: StorageError) => {
		if (storageError.type === StorageErrorType.Api) {
			const now = Date.now();

			if (now - get().lastApiErrorAt < API_ERROR_COOLDOWN) {
				return;
			}

			set({ lastApiErrorAt: now, storageError });
		} else {
			set({ storageError });
		}
	},
	storageError: null
}));
