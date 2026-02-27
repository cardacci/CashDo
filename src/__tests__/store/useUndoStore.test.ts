import { Priority, type Task } from '../../types';
import { useUndoStore } from '../../store/useUndoStore';

/* ===== Constants ===== */
const MOCK_TASK: Task = {
	completed: false,
	createdAt: 1700000000000,
	id: 'task-1',
	priority: Priority.Medium,
	text: 'Test task',
	updatedAt: 1700000000000
};

describe('useUndoStore', () => {
	beforeEach(() => {
		useUndoStore.setState({ pendingDelete: null });
	});

	describe('initial state', () => {
		it('should have pendingDelete as null', () => {
			expect(useUndoStore.getState().pendingDelete).toBeNull();
		});
	});

	describe('setPendingDelete', () => {
		it('should store the given task', () => {
			useUndoStore.getState().setPendingDelete(MOCK_TASK);

			expect(useUndoStore.getState().pendingDelete).toEqual(MOCK_TASK);
		});
	});

	describe('clearPendingDelete', () => {
		it('should set pendingDelete to null', () => {
			useUndoStore.getState().setPendingDelete(MOCK_TASK);
			useUndoStore.getState().clearPendingDelete();

			expect(useUndoStore.getState().pendingDelete).toBeNull();
		});
	});
});
