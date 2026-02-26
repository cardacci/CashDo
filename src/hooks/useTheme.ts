import { useTaskStore } from '../store/useTaskStore';
import { darkTheme, lightTheme, type ThemeColors } from '../theme';

/* ===== Hook ===== */
export function useTheme(): ThemeColors {
	/* ===== Store ===== */
	const darkMode = useTaskStore((state) => state.darkMode);

	return darkMode ? darkTheme : lightTheme;
}
