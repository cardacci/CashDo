import { formatDateTime } from '../../utils/formatDateTime';

describe('formatDateTime', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should combine date and time with the dot separator', () => {
		jest.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('Jan 1, 2025');
		jest.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue('14:30');

		expect(formatDateTime(1735729800000)).toBe('Jan 1, 2025 · 14:30');
	});

	it('should use en-US locale for the date', () => {
		const spy = jest.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('Feb 15, 2025');

		jest.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue('09:00');

		formatDateTime(1739616000000);

		expect(spy).toHaveBeenCalledWith('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
	});

	it('should use 24-hour format without AM/PM', () => {
		const spy = jest.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue('14:30');

		jest.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('Jan 1, 2025');

		formatDateTime(1735729800000);

		expect(spy).toHaveBeenCalledWith('en-US', { hour: '2-digit', hour12: false, minute: '2-digit' });
	});

	it('should handle midnight correctly', () => {
		jest.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('Jan 1, 2025');
		jest.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue('00:00');

		expect(formatDateTime(1735689600000)).toBe('Jan 1, 2025 · 00:00');
	});

	it('should handle end-of-day correctly', () => {
		jest.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('Jan 1, 2025');
		jest.spyOn(Date.prototype, 'toLocaleTimeString').mockReturnValue('23:59');

		expect(formatDateTime(1735775940000)).toBe('Jan 1, 2025 · 23:59');
	});
});
