import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTaskStore } from '../store/useTaskStore';
import { darkTheme, fonts, lightTheme } from '../theme';
import { PRIORITY_FILTER_ALL, Priority, type PriorityFilter as PriorityFilterType } from '../types';

/* ===== Constants ===== */
const PRIORITY_OPTIONS: { color: string; key: PriorityFilterType; label: string }[] = [
	{ color: '#5E5E5E', key: PRIORITY_FILTER_ALL, label: 'All' },
	{ color: '#ED273E', key: Priority.High, label: 'High' },
	{ color: '#BF4707', key: Priority.Medium, label: 'Medium' },
	{ color: '#039BE5', key: Priority.Low, label: 'Low' }
];

/* ===== Component ===== */
export function PriorityFilter() {
	/* ===== Store ===== */
	const darkMode = useTaskStore((state) => state.darkMode);
	const priorityFilter = useTaskStore((state) => state.priorityFilter);
	const setPriorityFilter = useTaskStore((state) => state.setPriorityFilter);

	/* ===== Derived Values ===== */
	const theme = darkMode ? darkTheme : lightTheme;

	/* ===== Render ===== */
	return (
		<View style={styles.container}>
			{PRIORITY_OPTIONS.map((option) => {
				const { color, key, label } = option;
				const isActive = priorityFilter === key;

				return (
					<Pressable
						key={key}
						onPress={() => setPriorityFilter(key)}
						style={[styles.filterButton, { backgroundColor: isActive ? color : theme.filterInactive }]}
					>
						<Text style={[styles.filterText, { color: isActive ? '#FFFFFF' : theme.filterInactiveText, fontFamily: fonts.bodyMedium }]}>
							{label}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 8,
		marginBottom: 16
	},
	filterButton: {
		borderRadius: 8,
		flex: 1,
		paddingVertical: 10
	},
	filterText: {
		fontSize: 13,
		textAlign: 'center'
	}
});
