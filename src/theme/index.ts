/* ===== Types & Interfaces ===== */
export interface ThemeColors {
	accent: string;
	accentText: string;
	background: string;
	badge: string;
	badgeText: string;
	border: string;
	cardShadow: string;
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
	progressBackground: string;
	progressFill: string;
	success: string;
	surface: string;
	text: string;
	textSecondary: string;
}

/* ===== Fonts ===== */
export const fonts = {
	body: 'Inter_400Regular',
	bodyBold: 'Inter_700Bold',
	bodyMedium: 'Inter_500Medium',
	bodySemiBold: 'Inter_600SemiBold',
	heading: 'Poppins_700Bold',
	headingSemiBold: 'Poppins_600SemiBold'
};

/* ===== Themes ===== */
export const lightTheme: ThemeColors = {
	accent: '#FDFA3D',
	accentText: '#303134',
	background: '#FAFAFA',
	badge: '#303134',
	badgeText: '#FDFA3D',
	border: '#E8E8E8',
	cardShadow: 'rgba(0, 0, 0, 0.06)',
	checkboxBorder: '#DBDBDB',
	checkboxChecked: '#0277BD',
	danger: '#C6212F',
	dangerText: '#FFFFFF',
	filterActive: '#303134',
	filterActiveText: '#FDFA3D',
	filterInactive: '#F0F0F0',
	filterInactiveText: '#5E5E5E',
	inputBackground: '#FFFFFF',
	primary: '#303134',
	primaryText: '#FDFA3D',
	priorityHigh: '#C6212F',
	priorityLow: '#0277BD',
	priorityMedium: '#BF4707',
	progressBackground: '#E8E8E8',
	progressFill: '#006837',
	success: '#007A41',
	surface: '#FFFFFF',
	text: '#303134',
	textSecondary: '#5E5E5E'
};

export const darkTheme: ThemeColors = {
	accent: '#FDFA3D',
	accentText: '#1A1A1A',
	background: '#1A1A1A',
	badge: '#FDFA3D',
	badgeText: '#1A1A1A',
	border: '#2E2E2E',
	cardShadow: 'rgba(0, 0, 0, 0.3)',
	checkboxBorder: '#555555',
	checkboxChecked: '#039BE5',
	danger: '#C6212F',
	dangerText: '#FFFFFF',
	filterActive: '#FDFA3D',
	filterActiveText: '#1A1A1A',
	filterInactive: '#2A2A2A',
	filterInactiveText: '#9A9A9A',
	inputBackground: '#252525',
	primary: '#FDFA3D',
	primaryText: '#1A1A1A',
	priorityHigh: '#FF4D5E',
	priorityLow: '#4DB8E8',
	priorityMedium: '#E8860A',
	progressBackground: '#2A2A2A',
	progressFill: '#00A854',
	success: '#00A854',
	surface: '#222222',
	text: '#F0F0F0',
	textSecondary: '#999999'
};
