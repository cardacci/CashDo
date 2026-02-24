import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { generateId } from '../utils/generateId';
import { FilterStatus, PRIORITY_FILTER_ALL, Priority, type PriorityFilter, type Task } from '../types';

/* ===== Types & Interfaces ===== */
interface TaskState {
	addTask: (text: string, priority: Priority) => void;
	darkMode: boolean;
	deleteTask: (id: string) => void;
	editTask: (id: string, text: string) => void;
	filterStatus: FilterStatus;
	isHydrated: boolean;
	priorityFilter: PriorityFilter;
	setFilterStatus: (status: FilterStatus) => void;
	setPriorityFilter: (priority: PriorityFilter) => void;
	tasks: Task[];
	toggleDarkMode: () => void;
	toggleTask: (id: string) => void;
}

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

			filterStatus: FilterStatus.All,

			isHydrated: false,

			priorityFilter: PRIORITY_FILTER_ALL,

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
			name: 'cashdo-storage',
			onRehydrateStorage: () => {
				return (state, error) => {
					if (error) {
						console.error('Error rehydrating state:', error);
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
			storage: createJSONStorage(() => AsyncStorage)
		}
	)
);
