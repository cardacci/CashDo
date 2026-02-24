/**
 * Generates a unique ID using crypto.randomUUID() with a
 * Date.now() + Math.random() fallback for environments
 * where crypto.randomUUID is not available.
 */
export function generateId(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}

	return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`;
}
