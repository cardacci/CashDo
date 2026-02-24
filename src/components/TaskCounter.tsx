import { StyleSheet, Text, View } from 'react-native';
import { useTaskStore } from '../store/useTaskStore';
import { darkTheme, fonts, lightTheme } from '../theme';

/* ===== Component ===== */
export function TaskCounter() {
	/* ===== Store ===== */
	const darkMode = useTaskStore((state) => state.darkMode);
	const tasks = useTaskStore((state) => state.tasks);

	/* ===== Derived Values ===== */
	const pendingCount = tasks.filter((task) => !task.completed).length;
	const theme = darkMode ? darkTheme : lightTheme;

	/* ===== Render ===== */
	return (
		<View style={[styles.badge, { backgroundColor: theme.badge }]}>
			<Text style={[styles.badgeText, { color: theme.badgeText, fontFamily: fonts.bodySemiBold }]}>
				{pendingCount} pending {pendingCount === 1 ? 'task' : 'tasks'}
			</Text>
		</View>
	);
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
	badge: {
		alignSelf: 'flex-start',
		borderRadius: 8,
		marginBottom: 16,
		paddingHorizontal: 14,
		paddingVertical: 6
	},
	badgeText: {
		fontSize: 13,
		letterSpacing: 0.2
	}
});
