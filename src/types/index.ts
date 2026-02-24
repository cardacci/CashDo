/* ===== Enums ===== */
export enum FilterStatus {
	All = 'all',
	Completed = 'completed',
	Pending = 'pending'
}

export enum Priority {
	High = 'high',
	Low = 'low',
	Medium = 'medium'
}

export enum StatusBarTheme {
	Dark = 'dark',
	Light = 'light'
}

/* ===== Constants ===== */
export const PRIORITY_FILTER_ALL = 'all' as const;

/* ===== Types & Interfaces ===== */
export type PriorityFilter = Priority | typeof PRIORITY_FILTER_ALL;
export interface Task {
	completed: boolean;
	createdAt: number;
	id: string;
	priority: Priority;
	text: string;
}
