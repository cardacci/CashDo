import { API_ERROR_COOLDOWN } from '../../constants';
import { useErrorStore } from '../../store/useErrorStore';
import { StorageErrorType } from '../../types';

/* ===== Constants ===== */
const INITIAL_STATE = {
	lastApiErrorAt: 0,
	storageError: null
};

const MOCK_API_ERROR = {
	message: 'Network error',
	type: StorageErrorType.Api
};

const MOCK_REHYDRATION_ERROR = {
	message: 'Storage read failed',
	type: StorageErrorType.Rehydration
};

const MOCK_WRITE_ERROR = {
	message: 'Storage write failed',
	type: StorageErrorType.Write
};

const MOCK_TIMESTAMP = 1700000000000;

describe('useErrorStore', () => {
	let dateNowSpy: jest.SpyInstance;

	beforeEach(() => {
		useErrorStore.setState(INITIAL_STATE);
		dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(MOCK_TIMESTAMP);
	});

	afterEach(() => {
		dateNowSpy.mockRestore();
	});

	describe('initial state', () => {
		it('should have storageError as null', () => {
			expect(useErrorStore.getState().storageError).toBeNull();
		});

		it('should have lastApiErrorAt as 0', () => {
			expect(useErrorStore.getState().lastApiErrorAt).toBe(0);
		});
	});

	describe('setStorageError', () => {
		describe('non-API errors', () => {
			it('should set the error immediately for Rehydration type', () => {
				useErrorStore.getState().setStorageError(MOCK_REHYDRATION_ERROR);

				expect(useErrorStore.getState().storageError).toEqual(MOCK_REHYDRATION_ERROR);
			});

			it('should set the error immediately for Write type', () => {
				useErrorStore.getState().setStorageError(MOCK_WRITE_ERROR);

				expect(useErrorStore.getState().storageError).toEqual(MOCK_WRITE_ERROR);
			});

			it('should not update lastApiErrorAt for non-API errors', () => {
				useErrorStore.getState().setStorageError(MOCK_REHYDRATION_ERROR);

				expect(useErrorStore.getState().lastApiErrorAt).toBe(0);
			});
		});

		describe('API errors with cooldown', () => {
			it('should set the error when no previous API error exists', () => {
				useErrorStore.getState().setStorageError(MOCK_API_ERROR);

				expect(useErrorStore.getState().storageError).toEqual(MOCK_API_ERROR);
				expect(useErrorStore.getState().lastApiErrorAt).toBe(MOCK_TIMESTAMP);
			});

			it('should skip setting the error if within the cooldown', () => {
				useErrorStore.setState({ lastApiErrorAt: MOCK_TIMESTAMP }, false);
				dateNowSpy.mockReturnValue(MOCK_TIMESTAMP + API_ERROR_COOLDOWN - 1);

				useErrorStore.getState().setStorageError(MOCK_API_ERROR);

				expect(useErrorStore.getState().storageError).toBeNull();
			});

			it('should set the error if the cooldown has elapsed', () => {
				useErrorStore.setState({ lastApiErrorAt: MOCK_TIMESTAMP }, false);

				const newTimestamp = MOCK_TIMESTAMP + API_ERROR_COOLDOWN + 1;

				dateNowSpy.mockReturnValue(newTimestamp);

				useErrorStore.getState().setStorageError(MOCK_API_ERROR);

				expect(useErrorStore.getState().storageError).toEqual(MOCK_API_ERROR);
				expect(useErrorStore.getState().lastApiErrorAt).toBe(newTimestamp);
			});

			it('should set the error if exactly at the cooldown boundary', () => {
				useErrorStore.setState({ lastApiErrorAt: MOCK_TIMESTAMP }, false);

				const boundaryTimestamp = MOCK_TIMESTAMP + API_ERROR_COOLDOWN;

				dateNowSpy.mockReturnValue(boundaryTimestamp);

				useErrorStore.getState().setStorageError(MOCK_API_ERROR);

				expect(useErrorStore.getState().storageError).toEqual(MOCK_API_ERROR);
				expect(useErrorStore.getState().lastApiErrorAt).toBe(boundaryTimestamp);
			});
		});
	});

	describe('clearStorageError', () => {
		it('should set storageError to null', () => {
			useErrorStore.getState().setStorageError(MOCK_REHYDRATION_ERROR);
			useErrorStore.getState().clearStorageError();

			expect(useErrorStore.getState().storageError).toBeNull();
		});

		it('should not reset lastApiErrorAt', () => {
			useErrorStore.getState().setStorageError(MOCK_API_ERROR);
			useErrorStore.getState().clearStorageError();

			expect(useErrorStore.getState().lastApiErrorAt).toBe(MOCK_TIMESTAMP);
		});
	});
});
