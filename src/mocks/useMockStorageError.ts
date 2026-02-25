import { useEffect } from 'react';
import { useErrorStore } from '../store/useErrorStore';
import { StorageErrorType } from '../types';

/* ===== Constants ===== */
const MOCK_DELAY = 1500;
const MOCK_ERROR_MESSAGE = 'AsyncStorage is not available';

/* ===== Hook ===== */
/**
 * Triggers a mock storage error after a short delay.
 * Import and call this hook in App.tsx to test StorageErrorModal.
 *
 * Usage: useMockStorageError(StorageErrorType.Rehydration);
 */
export function useMockStorageError(type: StorageErrorType = StorageErrorType.Rehydration) {
	useEffect(() => {
		const timer = setTimeout(() => {
			useErrorStore.getState().setStorageError({
				message: MOCK_ERROR_MESSAGE,
				type
			});
		}, MOCK_DELAY);

		return () => clearTimeout(timer);
	}, [type]);
}
