import { generateId } from '../../utils/generateId';

/* ===== Constants ===== */
const MOCK_DATE_NOW = 1700000000000;
const MOCK_MATH_RANDOM = 0.123456789;
const MOCK_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('generateId', () => {
	const originalCrypto = global.crypto;

	afterEach(() => {
		global.crypto = originalCrypto;
		jest.restoreAllMocks();
	});

	describe('when crypto.randomUUID is available', () => {
		beforeEach(() => {
			global.crypto = {
				randomUUID: jest.fn().mockReturnValue(MOCK_UUID)
			} as unknown as Crypto;
		});

		it('should return a UUID from crypto.randomUUID', () => {
			expect(generateId()).toBe(MOCK_UUID);
		});

		it('should call crypto.randomUUID exactly once', () => {
			generateId();

			expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
		});
	});

	describe('when crypto is undefined', () => {
		beforeEach(() => {
			global.crypto = undefined as unknown as Crypto;
			jest.spyOn(Date, 'now').mockReturnValue(MOCK_DATE_NOW);
			jest.spyOn(Math, 'random').mockReturnValue(MOCK_MATH_RANDOM);
		});

		it('should return a fallback ID using Date.now and Math.random', () => {
			const expected = `${MOCK_DATE_NOW.toString(36)}-${MOCK_MATH_RANDOM.toString(36).substring(2, 11)}`;

			expect(generateId()).toBe(expected);
		});

		it('should return a string containing a hyphen', () => {
			expect(generateId()).toContain('-');
		});
	});

	describe('when crypto exists but randomUUID is not a function', () => {
		it('should use the fallback', () => {
			global.crypto = {} as Crypto;
			jest.spyOn(Date, 'now').mockReturnValue(MOCK_DATE_NOW);
			jest.spyOn(Math, 'random').mockReturnValue(MOCK_MATH_RANDOM);

			const result = generateId();

			expect(result).toContain('-');
			expect(result).toBe(`${MOCK_DATE_NOW.toString(36)}-${MOCK_MATH_RANDOM.toString(36).substring(2, 11)}`);
		});
	});
});
