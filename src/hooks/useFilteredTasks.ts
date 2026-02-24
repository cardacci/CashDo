import { useMemo } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { PRIORITY_FILTER_ALL } from '../constants';
import { FilterStatus, type Task } from '../types';

/* ===== Hook ===== */
export function useFilteredTasks(): Task[] {
	/* ===== Store ===== */
	const filterStatus = useTaskStore((state) => state.filterStatus);
	const priorityFilter = useTaskStore((state) => state.priorityFilter);
	const tasks = useTaskStore((state) => state.tasks);

	const filteredTasks = useMemo(() => {
		let result = [...tasks];

		// Filter by status
		if (filterStatus === FilterStatus.Completed) {
			result = result.filter((task) => task.completed);
		} else if (filterStatus === FilterStatus.Pending) {
			result = result.filter((task) => !task.completed);
		}

		// Filter by priority
		if (priorityFilter !== PRIORITY_FILTER_ALL) {
			result = result.filter((task) => task.priority === priorityFilter);
		}

		// Sort by creation date (newest first)
		result.sort((a, b) => b.createdAt - a.createdAt);

		return result;
	}, [filterStatus, priorityFilter, tasks]);

	return filteredTasks;
}
