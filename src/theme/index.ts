/* ===== Types & Interfaces ===== */
export interface ThemeColors {
	background: string;
	badge: string;
	badgeText: string;
	border: string;
	checkboxBorder: string;
	checkboxChecked: string;
	danger: string;
	dangerText: string;
	filterActive: string;
	filterActiveText: string;
	filterInactive: string;
	filterInactiveText: string;
	inputBackground: string;
	primary: string;
	primaryText: string;
	priorityHigh: string;
	priorityLow: string;
	priorityMedium: string;
	success: string;
	surface: string;
	text: string;
	textSecondary: string;
}

/* ===== Themes ===== */
export const lightTheme: ThemeColors = {
	background: '#f5f5f5',
	badge: '#4a90d9',
	badgeText: '#ffffff',
	border: '#e0e0e0',
	checkboxBorder: '#cccccc',
	checkboxChecked: '#27ae60',
	danger: '#e74c3c',
	dangerText: '#ffffff',
	filterActive: '#4a90d9',
	filterActiveText: '#ffffff',
	filterInactive: '#e8e8e8',
	filterInactiveText: '#666666',
	inputBackground: '#ffffff',
	primary: '#4a90d9',
	primaryText: '#ffffff',
	priorityHigh: '#e74c3c',
	priorityLow: '#3498db',
	priorityMedium: '#f39c12',
	success: '#27ae60',
	surface: '#ffffff',
	text: '#1a1a1a',
	textSecondary: '#666666'
};

export const darkTheme: ThemeColors = {
	background: '#121212',
	badge: '#5a9fe6',
	badgeText: '#ffffff',
	border: '#333333',
	checkboxBorder: '#555555',
	checkboxChecked: '#2ecc71',
	danger: '#e85d4a',
	dangerText: '#ffffff',
	filterActive: '#5a9fe6',
	filterActiveText: '#ffffff',
	filterInactive: '#2a2a2a',
	filterInactiveText: '#999999',
	inputBackground: '#2a2a2a',
	primary: '#5a9fe6',
	primaryText: '#ffffff',
	priorityHigh: '#e85d4a',
	priorityLow: '#5dade2',
	priorityMedium: '#f5ab35',
	success: '#2ecc71',
	surface: '#1e1e1e',
	text: '#e0e0e0',
	textSecondary: '#999999'
};
