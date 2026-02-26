import { API } from '../constants';
import type { Task } from '../types';

/* ===== Constants & Enums ===== */
enum ContentType {
	JSON = 'application/json'
}

enum Headers {
	CONTENT_TYPE = 'Content-Type'
}

enum Method {
	DELETE = 'DELETE',
	PATCH = 'PATCH',
	POST = 'POST'
}

/* ===== Helpers ===== */
function buildUrl(path: string): string {
	return `${API.BASE_URL}${path}`;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), API.TIMEOUT);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal
		});

		return response;
	} finally {
		clearTimeout(timeoutId);
	}
}

/* ===== Functions ===== */
export async function batchCreateTasks(tasks: Task[]): Promise<Task[]> {
	const response = await fetchWithTimeout(buildUrl(API.ENDPOINTS.TASKS), {
		body: JSON.stringify(tasks),
		headers: { [Headers.CONTENT_TYPE]: ContentType.JSON },
		method: Method.POST
	});

	if (!response.ok) {
		throw new Error();
	}

	return response.json();
}

export async function createTask(task: Task): Promise<Task> {
	const response = await fetchWithTimeout(buildUrl(API.ENDPOINTS.TASKS), {
		body: JSON.stringify(task),
		headers: { [Headers.CONTENT_TYPE]: ContentType.JSON },
		method: Method.POST
	});

	if (!response.ok) {
		throw new Error(`Failed to create task: ${response.status}`);
	}

	return response.json();
}

export async function deleteTask(id: string): Promise<void> {
	const response = await fetchWithTimeout(buildUrl(`${API.ENDPOINTS.TASKS}/${id}`), {
		method: Method.DELETE
	});

	if (!response.ok) {
		throw new Error(`Failed to delete task: ${response.status}`);
	}
}

export async function fetchTasks(): Promise<Task[]> {
	const response = await fetchWithTimeout(buildUrl(API.ENDPOINTS.TASKS));

	if (!response.ok) {
		throw new Error(`Failed to fetch tasks: ${response.status}`);
	}

	return response.json();
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
	const response = await fetchWithTimeout(buildUrl(`${API.ENDPOINTS.TASKS}/${id}`), {
		body: JSON.stringify(updates),
		headers: { [Headers.CONTENT_TYPE]: ContentType.JSON },
		method: Method.PATCH
	});

	if (!response.ok) {
		throw new Error(`Failed to update task: ${response.status}`);
	}

	return response.json();
}
