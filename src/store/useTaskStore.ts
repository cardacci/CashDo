import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { PRIORITY_FILTER_ALL, UNKNOWN_ERROR_MESSAGE } from '../constants';
import * as taskApi from '../services/taskApi';
import { FilterStatus, Priority, StorageErrorType, type PriorityFilter, type Task } from '../types';
import { createSafeStorage } from '../utils/createSafeStorage';
import { generateId } from '../utils/generateId';
import { useErrorStore } from './useErrorStore';

/* ===== Constants ===== */
const STORAGE_KEY = 'cashdo-storage';

/* ===== Types & Interfaces ===== */
interface TaskState {
	addTask: (text: string, priority: Priority) => void;
	darkMode: boolean; // Indicates whether dark mode is enabled
	deleteTask: (id: string) => void;
	editTask: (id: string, text: string) => void;
	editingTaskId: string | null; // ID of the task currently being edited, or null if none
	filterStatus: FilterStatus; // Current filter status for task list (e.g., all, completed, incomplete)
	isHydrated: boolean; // Indicates whether the store has finished rehydrating from storage
	pendingDeletes: string[]; // IDs of tasks deleted locally but not yet confirmed by the API
	priorityFilter: PriorityFilter;
	restoreTask: (task: Task) => void;
	setEditingTaskId: (id: string | null) => void;
	setFilterStatus: (status: FilterStatus) => void;
	setPriorityFilter: (priority: PriorityFilter) => void;
	tasks: Task[];
	toggleDarkMode: () => void;
	toggleTask: (id: string) => void;
}

/* ===== Helpers ===== */
function handleApiError(error: unknown) {
	useErrorStore.getState().setStorageError({
		message: error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE,
		type: StorageErrorType.Api
	});
}

/* ===== Store ===== */
export const useTaskStore = create<TaskState>()(
	persist(
		(set) => ({
			addTask: (text: string, priority: Priority) => {
				const creationDate = Date.now();
				const newTask: Task = {
					completed: false,
					createdAt: creationDate,
					id: generateId(),
					priority,
					text,
					updatedAt: creationDate
				};

				set((state) => ({
					tasks: [newTask, ...state.tasks]
				}));

				taskApi.createTask(newTask).catch(handleApiError);
			},

			darkMode: false,

			deleteTask: (id: string) => {
				set((state) => ({
					pendingDeletes: [...state.pendingDeletes, id],
					tasks: state.tasks.filter((task) => task.id !== id)
				}));

				taskApi
					.deleteTask(id)
					.then(() => {
						useTaskStore.setState((state) => ({
							pendingDeletes: state.pendingDeletes.filter((pendingId) => pendingId !== id)
						}));
					})
					.catch(handleApiError);
			},

			editTask: (id: string, text: string) => {
				const updatedAt = Date.now();

				set((state) => ({
					tasks: state.tasks.map((task) => (task.id === id ? { ...task, text, updatedAt } : task))
				}));

				taskApi.updateTask(id, { text, updatedAt }).catch(handleApiError);
			},

			editingTaskId: null,

			filterStatus: FilterStatus.All,

			isHydrated: false,

			pendingDeletes: [],

			priorityFilter: PRIORITY_FILTER_ALL,

			restoreTask: (task: Task) => {
				set((state) => ({
					pendingDeletes: state.pendingDeletes.filter((id) => id !== task.id),
					tasks: [...state.tasks, task]
				}));

				taskApi.createTask(task).catch(handleApiError);
			},

			setEditingTaskId: (editingTaskId: string | null) => set({ editingTaskId }),

			setFilterStatus: (filterStatus: FilterStatus) => set({ filterStatus }),

			setPriorityFilter: (priorityFilter: PriorityFilter) => set({ priorityFilter }),

			tasks: [] satisfies Task[],

			toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

			toggleTask: (id: string) => {
				const updatedAt = Date.now();
				let newCompleted: boolean | undefined;

				set((state) => ({
					tasks: state.tasks.map((task) => {
						if (task.id === id) {
							newCompleted = !task.completed;

							return { ...task, completed: newCompleted, updatedAt };
						}

						return task;
					})
				}));

				if (newCompleted !== undefined) {
					taskApi.updateTask(id, { completed: newCompleted, updatedAt }).catch(handleApiError);
				}
			}
		}),
		{
			name: STORAGE_KEY,
			onRehydrateStorage: () => {
				return (state, error) => {
					if (error) {
						useErrorStore.getState().setStorageError({
							message: error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE,
							type: StorageErrorType.Rehydration
						});
					}

					if (state) {
						state.isHydrated = true;
					}
				};
			},
			partialize: (state) => ({
				darkMode: state.darkMode,
				pendingDeletes: state.pendingDeletes,
				tasks: state.tasks
			}),
			storage: createJSONStorage(() => createSafeStorage())
		}
	)
);
