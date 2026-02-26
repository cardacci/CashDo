import { useCallback, useEffect, useState } from 'react';
import { UNKNOWN_ERROR_MESSAGE } from '../constants';
import { batchCreateTasks, deleteTask as deleteTaskApi, fetchTasks, updateTask } from '../services/taskApi';
import { useErrorStore } from '../store/useErrorStore';
import { useTaskStore } from '../store/useTaskStore';
import { StorageErrorType } from '../types';

/* ===== Hook ===== */
export function useTaskSync() {
	/* ===== State ===== */
	const [isSyncing, setIsSyncing] = useState(false);

	/* ===== Store ===== */
	const isHydrated = useTaskStore((state) => state.isHydrated);

	/* ===== Callbacks ===== */
	const syncFromApi = useCallback(async function syncFromApi() {
		setIsSyncing(true);

		try {
			const { pendingDeletes, tasks: localTasks } = useTaskStore.getState();
			const remoteTasks = await fetchTasks();
			const remoteMap = new Map(remoteTasks.map((task) => [task.id, task]));

			// Retry deletions that failed while offline
			const unresolvedDeletes = pendingDeletes.filter((id) => remoteMap.has(id));
			const resolvedDeletes = new Set<string>();

			await Promise.all(
				unresolvedDeletes.map(
					(id) =>
						deleteTaskApi(id)
							.then(() => resolvedDeletes.add(id))
							.catch(() => {}) // silent: will retry on next sync
				)
			);

			// Remove all pending-delete IDs from the remote map so they never reappear
			pendingDeletes.forEach((id) => remoteMap.delete(id));

			// Clear successfully resolved pending deletes
			if (resolvedDeletes.size > 0) {
				useTaskStore.setState((state) => ({
					pendingDeletes: state.pendingDeletes.filter((id) => !resolvedDeletes.has(id))
				}));
			}

			// Tasks only in local → created while offline
			const offlineCreated = localTasks.filter((task) => !remoteMap.has(task.id));

			// Tasks in both stores, but local is newer → edited/toggled while offline
			const offlineUpdated = localTasks.filter((task) => {
				const remote = remoteMap.get(task.id);

				return remote !== undefined && task.updatedAt > (remote.updatedAt ?? 0);
			});

			// Push offline-created tasks in a single batch request
			if (offlineCreated.length > 0) {
				await batchCreateTasks(offlineCreated);
			}

			// Push offline-updated tasks (one PATCH per task, all in parallel)
			await Promise.all(offlineUpdated.map((task) => updateTask(task.id, { completed: task.completed, text: task.text, updatedAt: task.updatedAt })));

			// Build merged list: remote as base (pending-delete IDs already removed), apply local updates, append offline-created
			const mergedMap = new Map(remoteMap);

			offlineUpdated.forEach((task) => mergedMap.set(task.id, task));
			offlineCreated.forEach((task) => mergedMap.set(task.id, task));

			const mergedTasks = [...mergedMap.values()].sort((a, b) => b.createdAt - a.createdAt);

			useTaskStore.setState({ tasks: mergedTasks });
		} catch (error) {
			useErrorStore.getState().setStorageError({
				message: error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE,
				type: StorageErrorType.Api
			});
		} finally {
			setIsSyncing(false);
		}
	}, []);

	/* ===== Effects ===== */
	useEffect(() => {
		if (isHydrated) {
			// Fires once AsyncStorage hydration is complete, ensuring we don't overwrite local data with API data on app start.
			syncFromApi();
		}
	}, [isHydrated, syncFromApi]);

	return { isSyncing, syncFromApi };
}
