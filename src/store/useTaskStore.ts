import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { PRIORITY_FILTER_ALL } from '../constants';
import { FilterStatus, Priority, StorageErrorType, type PriorityFilter, type Task } from '../types';
import { createSafeStorage } from '../utils/createSafeStorage';
import { generateId } from '../utils/generateId';
import { useErrorStore } from './useErrorStore';

/* ===== Constants ===== */
const STORAGE_KEY = 'cashdo-storage';
const UNKNOWN_ERROR_MESSAGE = 'Unknown error';

/* ===== Types & Interfaces ===== */
interface TaskState {
	addTask: (text: string, priority: Priority) => void;
	darkMode: boolean;
	deleteTask: (id: string) => void;
	editTask: (id: string, text: string) => void;
	editingTaskId: string | null;
	filterStatus: FilterStatus;
	isHydrated: boolean;
	priorityFilter: PriorityFilter;
	restoreTask: (task: Task) => void;
	setEditingTaskId: (id: string | null) => void;
	setFilterStatus: (status: FilterStatus) => void;
	setPriorityFilter: (priority: PriorityFilter) => void;
	tasks: Task[];
	toggleDarkMode: () => void;
	toggleTask: (id: string) => void;
}

/* ===== Store ===== */
export const useTaskStore = create<TaskState>()(
	persist(
		(set) => ({
			addTask: (text: string, priority: Priority) =>
				set((state) => ({
					tasks: [
						{
							completed: false,
							createdAt: Date.now(),
							id: generateId(),
							priority,
							text
						},
						...state.tasks
					]
				})),

			darkMode: false,

			deleteTask: (id: string) =>
				set((state) => ({
					tasks: state.tasks.filter((task) => task.id !== id)
				})),

			editTask: (id: string, text: string) =>
				set((state) => ({
					tasks: state.tasks.map((task) => (task.id === id ? { ...task, text } : task))
				})),

			editingTaskId: null,

			filterStatus: FilterStatus.All,

			isHydrated: false,

			priorityFilter: PRIORITY_FILTER_ALL,

			restoreTask: (task: Task) =>
				set((state) => ({
					tasks: [...state.tasks, task]
				})),

			setEditingTaskId: (editingTaskId: string | null) => set({ editingTaskId }),

			setFilterStatus: (filterStatus: FilterStatus) => set({ filterStatus }),

			setPriorityFilter: (priorityFilter: PriorityFilter) => set({ priorityFilter }),

			tasks: [] satisfies Task[],

			toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

			toggleTask: (id: string) =>
				set((state) => ({
					tasks: state.tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
				}))
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
				tasks: state.tasks
			}),
			storage: createJSONStorage(() => createSafeStorage())
		}
	)
);
