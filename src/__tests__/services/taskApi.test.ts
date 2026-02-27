import { API } from '../../constants';
import { ContentType, Headers, Method } from '../../services/taskApi';
import * as taskApi from '../../services/taskApi';
import { Priority, type Task } from '../../types';

/* ===== Constants ===== */
const BASE_URL = API.BASE_URL;
const TASKS_URL = `${BASE_URL}${API.ENDPOINTS.TASKS}`;

const MOCK_TASK: Task = {
	completed: false,
	createdAt: 1700000000000,
	id: 'task-1',
	priority: Priority.High,
	text: 'Test task',
	updatedAt: 1700000000000
};

const JSON_HEADERS = { [Headers.CONTENT_TYPE]: ContentType.JSON };

/* ===== Helpers ===== */
/**
 * Mocks a successful fetch response with the specified data (default is an empty object).
 * @param data - The data to return in the mocked JSON response (default is an empty object).
 */
function mockFetchSuccess(data: unknown = {}): void {
	(global.fetch as jest.Mock).mockResolvedValueOnce({
		json: jest.fn().mockResolvedValue(data),
		ok: true
	});
}

/**
 * Mocks a failed fetch response with the specified status code (default 500).
 * @param status - The HTTP status code to return in the mocked response (default is 500).
 */
function mockFetchFailure(status = 500): void {
	(global.fetch as jest.Mock).mockResolvedValueOnce({
		ok: false,
		status
	});
}

describe('taskApi', () => {
	beforeEach(() => {
		global.fetch = jest.fn();
		jest.clearAllMocks();
	});

	describe('createTask', () => {
		it('should call fetch with POST method and JSON body', async () => {
			mockFetchSuccess(MOCK_TASK);

			await taskApi.createTask(MOCK_TASK);

			expect(global.fetch).toHaveBeenCalledWith(
				TASKS_URL,
				expect.objectContaining({
					body: JSON.stringify(MOCK_TASK),
					headers: JSON_HEADERS,
					method: Method.POST
				})
			);
		});

		it('should return the parsed JSON response on success', async () => {
			mockFetchSuccess(MOCK_TASK);

			const result = await taskApi.createTask(MOCK_TASK);

			expect(result).toEqual(MOCK_TASK);
		});

		it('should throw an error when response is not ok', async () => {
			mockFetchFailure(500);

			await expect(taskApi.createTask(MOCK_TASK)).rejects.toThrow('Failed to create task: 500');
		});
	});

	describe('updateTask', () => {
		const updates = { text: 'Updated', updatedAt: 1700000001000 };

		it('should call fetch with PATCH method and task ID in URL', async () => {
			mockFetchSuccess({ ...MOCK_TASK, ...updates });

			await taskApi.updateTask('task-1', updates);

			expect(global.fetch).toHaveBeenCalledWith(
				`${TASKS_URL}/task-1`,
				expect.objectContaining({
					body: JSON.stringify(updates),
					headers: JSON_HEADERS,
					method: Method.PATCH
				})
			);
		});

		it('should return the parsed JSON response on success', async () => {
			const updated = { ...MOCK_TASK, ...updates };
			mockFetchSuccess(updated);

			const result = await taskApi.updateTask('task-1', updates);

			expect(result).toEqual(updated);
		});

		it('should throw an error when response is not ok', async () => {
			mockFetchFailure(404);

			await expect(taskApi.updateTask('task-1', updates)).rejects.toThrow('Failed to update task: 404');
		});
	});

	describe('deleteTask', () => {
		it('should call fetch with DELETE method and task ID in URL', async () => {
			mockFetchSuccess();

			await taskApi.deleteTask('task-1');

			expect(global.fetch).toHaveBeenCalledWith(`${TASKS_URL}/task-1`, expect.objectContaining({ method: Method.DELETE }));
		});

		it('should not throw when response is ok', async () => {
			mockFetchSuccess();

			await expect(taskApi.deleteTask('task-1')).resolves.toBeUndefined();
		});

		it('should throw an error when response is not ok', async () => {
			mockFetchFailure(500);

			await expect(taskApi.deleteTask('task-1')).rejects.toThrow('Failed to delete task: 500');
		});
	});

	describe('fetchTasks', () => {
		it('should call fetch with the tasks URL', async () => {
			mockFetchSuccess([MOCK_TASK]);

			await taskApi.fetchTasks();

			expect(global.fetch).toHaveBeenCalledWith(TASKS_URL, expect.objectContaining({ signal: expect.any(AbortSignal) }));
		});

		it('should return the parsed JSON array on success', async () => {
			mockFetchSuccess([MOCK_TASK]);

			const result = await taskApi.fetchTasks();

			expect(result).toEqual([MOCK_TASK]);
		});

		it('should throw an error when response is not ok', async () => {
			mockFetchFailure(503);

			await expect(taskApi.fetchTasks()).rejects.toThrow('Failed to fetch tasks: 503');
		});
	});

	describe('batchCreateTasks', () => {
		const tasks = [MOCK_TASK, { ...MOCK_TASK, id: 'task-2' }];

		it('should call fetch with POST method and array body', async () => {
			mockFetchSuccess(tasks);

			await taskApi.batchCreateTasks(tasks);

			expect(global.fetch).toHaveBeenCalledWith(
				TASKS_URL,
				expect.objectContaining({
					body: JSON.stringify(tasks),
					headers: JSON_HEADERS,
					method: Method.POST
				})
			);
		});

		it('should return the parsed JSON response on success', async () => {
			mockFetchSuccess(tasks);

			const result = await taskApi.batchCreateTasks(tasks);

			expect(result).toEqual(tasks);
		});

		it('should throw an error when response is not ok', async () => {
			mockFetchFailure(500);

			await expect(taskApi.batchCreateTasks(tasks)).rejects.toThrow();
		});
	});

	describe('fetchWithTimeout (via exported functions)', () => {
		it('should pass an AbortController signal to fetch', async () => {
			mockFetchSuccess([]);

			await taskApi.fetchTasks();

			expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ signal: expect.any(AbortSignal) }));
		});

		it('should abort the request after timeout', async () => {
			jest.useFakeTimers();
			(global.fetch as jest.Mock).mockImplementation(
				(_url: string, options: RequestInit) =>
					new Promise<never>((_resolve, reject) => {
						options.signal?.addEventListener('abort', () => {
							reject(new DOMException('The operation was aborted.', 'AbortError'));
						});
					})
			);

			const promise = taskApi.fetchTasks();

			jest.advanceTimersByTime(API.TIMEOUT + 1);

			await expect(promise).rejects.toThrow();
			jest.useRealTimers();
		});
	});
});
