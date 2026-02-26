import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';
import { useErrorStore } from '../store/useErrorStore';
import { StorageErrorType } from '../types';

/* ===== Constants ===== */
const UNKNOWN_ERROR_MESSAGE = 'An unknown storage error occurred.';

/* ===== Functions ===== */
function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}

	return UNKNOWN_ERROR_MESSAGE;
}

export function createSafeStorage(): StateStorage {
	return {
		getItem: async (name: string): Promise<string | null> => {
			try {
				return await AsyncStorage.getItem(name);
			} catch (error) {
				useErrorStore.getState().setStorageError({
					message: getErrorMessage(error),
					type: StorageErrorType.Rehydration
				});

				throw error;
			}
		},

		removeItem: async (name: string): Promise<void> => {
			try {
				await AsyncStorage.removeItem(name);
			} catch (error) {
				useErrorStore.getState().setStorageError({
					message: getErrorMessage(error),
					type: StorageErrorType.Write
				});
			}
		},

		setItem: async (name: string, value: string): Promise<void> => {
			try {
				await AsyncStorage.setItem(name, value);
			} catch (error) {
				useErrorStore.getState().setStorageError({
					message: getErrorMessage(error),
					type: StorageErrorType.Write
				});
			}
		}
	};
}
