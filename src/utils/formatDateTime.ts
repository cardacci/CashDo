export function formatDateTime(timestamp: number): string {
	const date = new Date(timestamp);
	const dateStr = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
	const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false, minute: '2-digit' });

	return `${dateStr} · ${timeStr}`;
}
