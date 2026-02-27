import { PRIORITY_FILTER_ALL } from '../../constants';
import * as taskApi from '../../services/taskApi';
import { useErrorStore } from '../../store/useErrorStore';
import { useTaskStore } from '../../store/useTaskStore';
import { FilterStatus, Priority, StorageErrorType, type PriorityFilter, type Task } from '../../types';
import { generateId } from '../../utils/generateId';

jest.mock('../../services/taskApi', () => ({
	createTask: jest.fn().mockResolvedValue({}),
	deleteTask: jest.fn().mockResolvedValue(undefined),
	fetchTasks: jest.fn().mockResolvedValue([]),
	updateTask: jest.fn().mockResolvedValue({})
}));

jest.mock('../../utils/generateId', () => ({
	generateId: jest.fn().mockReturnValue('mock-id-1')
}));

/* ===== Constants ===== */
const MOCK_TIMESTAMP = 1700000000000;

const INITIAL_STATE = {
	darkMode: false,
	editingTaskId: null,
	filterStatus: FilterStatus.All,
	isHydrated: false,
	pendingDeletes: [] as string[],
	priorityFilter: PRIORITY_FILTER_ALL as PriorityFilter,
	tasks: [] as Task[]
};

const MOCK_TASK: Task = {
	completed: false,
	createdAt: MOCK_TIMESTAMP,
	id: 'mock-id-1',
	priority: Priority.High,
	text: 'Test task',
	updatedAt: MOCK_TIMESTAMP
};

/* ===== Helpers ===== */
/**
 * Utility function to wait for all pending promises to resolve in tests.
 * This is useful for testing async actions that update state after an API call.
 */
function flushPromises(): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, 0);
	});
}

/**
 * Helper function to seed the store with a task before tests.
 * @param task Optional task to seed, defaults to MOCK_TASK if not provided.
 */
function seedTask(task: Task = MOCK_TASK): void {
	useTaskStore.setState({ tasks: [task] }, false);
}

describe('useTaskStore', () => {
	let dateNowSpy: jest.SpyInstance;

	beforeEach(() => {
		useTaskStore.setState(INITIAL_STATE);
		useErrorStore.setState({ lastApiErrorAt: 0, storageError: null });
		dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(MOCK_TIMESTAMP);
		jest.clearAllMocks();
		(generateId as jest.Mock).mockReturnValue('mock-id-1');
	});

	afterEach(() => {
		dateNowSpy.mockRestore();
	});

	describe('addTask', () => {
		it('should create a new task with the given text and priority', () => {
			useTaskStore.getState().addTask('Buy milk', Priority.High);

			const task = useTaskStore.getState().tasks[0];

			expect(task).toEqual({
				completed: false,
				createdAt: MOCK_TIMESTAMP,
				id: 'mock-id-1',
				priority: Priority.High,
				text: 'Buy milk',
				updatedAt: MOCK_TIMESTAMP
			});
		});

		it('should prepend the new task to the array', () => {
			seedTask();
			(generateId as jest.Mock).mockReturnValueOnce('mock-id-2');

			useTaskStore.getState().addTask('Second task', Priority.Low);

			const tasks = useTaskStore.getState().tasks;

			expect(tasks).toHaveLength(2);
			expect(tasks[0].id).toBe('mock-id-2');
			expect(tasks[1].id).toBe('mock-id-1');
		});

		it('should use generateId for the task ID', () => {
			useTaskStore.getState().addTask('Task', Priority.Medium);

			expect(generateId).toHaveBeenCalledTimes(1);
		});

		it('should use Date.now for createdAt and updatedAt', () => {
			useTaskStore.getState().addTask('Task', Priority.Medium);

			const task = useTaskStore.getState().tasks[0];

			expect(task.createdAt).toBe(MOCK_TIMESTAMP);
			expect(task.updatedAt).toBe(MOCK_TIMESTAMP);
		});

		it('should call taskApi.createTask with the new task', () => {
			useTaskStore.getState().addTask('Task', Priority.High);

			expect(taskApi.createTask).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-id-1', priority: Priority.High, text: 'Task' }));
		});

		it('should report an API error when the API call fails', async () => {
			(taskApi.createTask as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

			useTaskStore.getState().addTask('Task', Priority.High);
			await flushPromises();

			expect(useErrorStore.getState().storageError).toEqual({
				message: 'Network error',
				type: StorageErrorType.Api
			});
		});
	});

	describe('deleteTask', () => {
		beforeEach(() => {
			seedTask();
		});

		it('should remove the task from the tasks array', () => {
			useTaskStore.getState().deleteTask('mock-id-1');

			expect(useTaskStore.getState().tasks).toHaveLength(0);
		});

		it('should add the task ID to pendingDeletes', () => {
			useTaskStore.getState().deleteTask('mock-id-1');

			expect(useTaskStore.getState().pendingDeletes).toContain('mock-id-1');
		});

		it('should call taskApi.deleteTask with the task ID', () => {
			useTaskStore.getState().deleteTask('mock-id-1');

			expect(taskApi.deleteTask).toHaveBeenCalledWith('mock-id-1');
		});

		it('should remove ID from pendingDeletes on successful API call', async () => {
			useTaskStore.getState().deleteTask('mock-id-1');
			await flushPromises();

			expect(useTaskStore.getState().pendingDeletes).not.toContain('mock-id-1');
		});

		it('should report an API error when the API call fails', async () => {
			(taskApi.deleteTask as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

			useTaskStore.getState().deleteTask('mock-id-1');
			await flushPromises();

			expect(useErrorStore.getState().storageError).toEqual({
				message: 'Server error',
				type: StorageErrorType.Api
			});
		});
	});

	describe('editTask', () => {
		beforeEach(() => {
			seedTask();
		});

		it('should update the task text', () => {
			useTaskStore.getState().editTask('mock-id-1', 'Updated text');

			expect(useTaskStore.getState().tasks[0].text).toBe('Updated text');
		});

		it('should update the task updatedAt timestamp', () => {
			const newTimestamp = MOCK_TIMESTAMP + 5000;

			dateNowSpy.mockReturnValue(newTimestamp);
			useTaskStore.getState().editTask('mock-id-1', 'Updated text');

			expect(useTaskStore.getState().tasks[0].updatedAt).toBe(newTimestamp);
		});

		it('should not modify other task properties', () => {
			useTaskStore.getState().editTask('mock-id-1', 'Updated text');

			const task = useTaskStore.getState().tasks[0];

			expect(task.completed).toBe(false);
			expect(task.priority).toBe(Priority.High);
			expect(task.createdAt).toBe(MOCK_TIMESTAMP);
		});

		it('should call taskApi.updateTask with id and partial update', () => {
			useTaskStore.getState().editTask('mock-id-1', 'Updated text');

			expect(taskApi.updateTask).toHaveBeenCalledWith('mock-id-1', {
				text: 'Updated text',
				updatedAt: MOCK_TIMESTAMP
			});
		});

		it('should report an API error when the API call fails', async () => {
			(taskApi.updateTask as jest.Mock).mockRejectedValueOnce(new Error('Timeout'));

			useTaskStore.getState().editTask('mock-id-1', 'Updated');
			await flushPromises();

			expect(useErrorStore.getState().storageError).toEqual({
				message: 'Timeout',
				type: StorageErrorType.Api
			});
		});
	});

	describe('toggleTask', () => {
		it('should toggle completed from false to true', () => {
			seedTask();

			useTaskStore.getState().toggleTask('mock-id-1');

			expect(useTaskStore.getState().tasks[0].completed).toBe(true);
		});

		it('should toggle completed from true to false', () => {
			seedTask({ ...MOCK_TASK, completed: true });

			useTaskStore.getState().toggleTask('mock-id-1');

			expect(useTaskStore.getState().tasks[0].completed).toBe(false);
		});

		it('should update the updatedAt timestamp', () => {
			seedTask();
			const newTimestamp = MOCK_TIMESTAMP + 1000;

			dateNowSpy.mockReturnValue(newTimestamp);

			useTaskStore.getState().toggleTask('mock-id-1');

			expect(useTaskStore.getState().tasks[0].updatedAt).toBe(newTimestamp);
		});

		it('should call taskApi.updateTask with new completed value', () => {
			seedTask();

			useTaskStore.getState().toggleTask('mock-id-1');

			expect(taskApi.updateTask).toHaveBeenCalledWith('mock-id-1', {
				completed: true,
				updatedAt: MOCK_TIMESTAMP
			});
		});

		it('should not call taskApi.updateTask if task ID does not exist', () => {
			seedTask();

			useTaskStore.getState().toggleTask('nonexistent');

			expect(taskApi.updateTask).not.toHaveBeenCalled();
		});

		it('should report an API error when the API call fails', async () => {
			seedTask();
			(taskApi.updateTask as jest.Mock).mockRejectedValueOnce(new Error('Fail'));

			useTaskStore.getState().toggleTask('mock-id-1');
			await flushPromises();

			expect(useErrorStore.getState().storageError).toEqual({
				message: 'Fail',
				type: StorageErrorType.Api
			});
		});
	});

	describe('restoreTask', () => {
		it('should add the task back to the tasks array', () => {
			useTaskStore.getState().restoreTask(MOCK_TASK);

			expect(useTaskStore.getState().tasks).toContainEqual(MOCK_TASK);
		});

		it('should remove the task ID from pendingDeletes', () => {
			useTaskStore.setState({ pendingDeletes: ['mock-id-1'] }, false);

			useTaskStore.getState().restoreTask(MOCK_TASK);

			expect(useTaskStore.getState().pendingDeletes).not.toContain('mock-id-1');
		});

		it('should call taskApi.createTask with the restored task', () => {
			useTaskStore.getState().restoreTask(MOCK_TASK);

			expect(taskApi.createTask).toHaveBeenCalledWith(MOCK_TASK);
		});

		it('should report an API error when the API call fails', async () => {
			(taskApi.createTask as jest.Mock).mockRejectedValueOnce(new Error('Fail'));

			useTaskStore.getState().restoreTask(MOCK_TASK);
			await flushPromises();

			expect(useErrorStore.getState().storageError).toEqual({
				message: 'Fail',
				type: StorageErrorType.Api
			});
		});
	});

	describe('setEditingTaskId', () => {
		it('should set editingTaskId to the given value', () => {
			useTaskStore.getState().setEditingTaskId('task-1');

			expect(useTaskStore.getState().editingTaskId).toBe('task-1');
		});

		it('should set editingTaskId to null', () => {
			useTaskStore.getState().setEditingTaskId('task-1');
			useTaskStore.getState().setEditingTaskId(null);

			expect(useTaskStore.getState().editingTaskId).toBeNull();
		});
	});

	describe('setFilterStatus', () => {
		it('should set filterStatus to the given value', () => {
			useTaskStore.getState().setFilterStatus(FilterStatus.Completed);

			expect(useTaskStore.getState().filterStatus).toBe(FilterStatus.Completed);
		});
	});

	describe('setPriorityFilter', () => {
		it('should set priorityFilter to the given value', () => {
			useTaskStore.getState().setPriorityFilter(Priority.High);

			expect(useTaskStore.getState().priorityFilter).toBe(Priority.High);
		});
	});

	describe('toggleDarkMode', () => {
		it('should toggle darkMode from false to true', () => {
			useTaskStore.getState().toggleDarkMode();

			expect(useTaskStore.getState().darkMode).toBe(true);
		});

		it('should toggle darkMode from true to false', () => {
			useTaskStore.setState({ darkMode: true }, false);

			useTaskStore.getState().toggleDarkMode();

			expect(useTaskStore.getState().darkMode).toBe(false);
		});
	});

	describe('handleApiError', () => {
		it('should set error with unknown error message for non-Error values', async () => {
			(taskApi.createTask as jest.Mock).mockRejectedValueOnce('string error');

			useTaskStore.getState().addTask('Task', Priority.High);
			await flushPromises();

			expect(useErrorStore.getState().storageError).toEqual({
				message: 'Unknown error',
				type: StorageErrorType.Api
			});
		});
	});
});
