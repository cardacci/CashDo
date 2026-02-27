import AsyncStorage from '@react-native-async-storage/async-storage';
import { useErrorStore } from '../../store/useErrorStore';
import { StorageErrorType } from '../../types';
import { createSafeStorage } from '../../utils/createSafeStorage';

/* ===== Constants ===== */
const MOCK_KEY = 'test-key';
const MOCK_VALUE = '{"data":"test"}';
const MOCK_ERROR = new Error('Storage failure');

describe('createSafeStorage', () => {
	const storage = createSafeStorage();

	beforeEach(() => {
		useErrorStore.setState({ lastApiErrorAt: 0, storageError: null });
		(AsyncStorage.clear as jest.Mock)();
		jest.clearAllMocks();
	});

	describe('getItem', () => {
		it('should return the value from AsyncStorage', async () => {
			(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(MOCK_VALUE);

			const result = await storage.getItem(MOCK_KEY);

			expect(result).toBe(MOCK_VALUE);
			expect(AsyncStorage.getItem).toHaveBeenCalledWith(MOCK_KEY);
		});

		it('should return null when key does not exist', async () => {
			(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

			const result = await storage.getItem(MOCK_KEY);

			expect(result).toBeNull();
		});

		it('should report a Rehydration error and re-throw when AsyncStorage.getItem fails', async () => {
			(AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(MOCK_ERROR);

			await expect(storage.getItem(MOCK_KEY)).rejects.toThrow('Storage failure');

			expect(useErrorStore.getState().storageError).toEqual({
				message: 'Storage failure',
				type: StorageErrorType.Rehydration
			});
		});

		it('should include the error message in the reported error', async () => {
			const customError = new Error('Disk full');

			(AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(customError);

			await expect(storage.getItem(MOCK_KEY)).rejects.toThrow();
			expect(useErrorStore.getState().storageError?.message).toBe('Disk full');
		});
	});

	describe('setItem', () => {
		it('should write the value to AsyncStorage', async () => {
			await storage.setItem(MOCK_KEY, MOCK_VALUE);

			expect(AsyncStorage.setItem).toHaveBeenCalledWith(MOCK_KEY, MOCK_VALUE);
		});

		it('should report a Write error when AsyncStorage.setItem fails', async () => {
			(AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(MOCK_ERROR);

			await storage.setItem(MOCK_KEY, MOCK_VALUE);

			expect(useErrorStore.getState().storageError).toEqual({
				message: 'Storage failure',
				type: StorageErrorType.Write
			});
		});

		it('should not re-throw the error', async () => {
			(AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(MOCK_ERROR);

			await expect(storage.setItem(MOCK_KEY, MOCK_VALUE)).resolves.toBeUndefined();
		});
	});

	describe('removeItem', () => {
		it('should call AsyncStorage.removeItem with the key', async () => {
			await storage.removeItem(MOCK_KEY);

			expect(AsyncStorage.removeItem).toHaveBeenCalledWith(MOCK_KEY);
		});

		it('should report a Write error when AsyncStorage.removeItem fails', async () => {
			(AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(MOCK_ERROR);

			await storage.removeItem(MOCK_KEY);

			expect(useErrorStore.getState().storageError).toEqual({
				message: 'Storage failure',
				type: StorageErrorType.Write
			});
		});

		it('should not re-throw the error', async () => {
			(AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(MOCK_ERROR);

			await expect(storage.removeItem(MOCK_KEY)).resolves.toBeUndefined();
		});
	});
});
