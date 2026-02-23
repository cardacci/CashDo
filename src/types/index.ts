/* ===== Types & Interfaces ===== */
export type Priority = 'high' | 'low' | 'medium';

export type FilterStatus = 'all' | 'completed' | 'pending';

export type PriorityFilter = 'all' | 'high' | 'low' | 'medium';

export interface Task {
	completed: boolean;
	createdAt: number;
	id: string;
	priority: Priority;
	text: string;
}
