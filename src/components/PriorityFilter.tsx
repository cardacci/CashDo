import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTaskStore } from '../store/useTaskStore';
import { darkTheme, lightTheme } from '../theme';
import { type PriorityFilter as PriorityFilterType } from '../types';

/* ===== Constants & Enums ===== */
const PRIORITY_OPTIONS: { key: PriorityFilterType; label: string; color: string }[] = [
	{ key: 'all', label: 'All', color: '#888888' },
	{ key: 'high', label: 'High', color: '#e74c3c' },
	{ key: 'medium', label: 'Medium', color: '#f39c12' },
	{ key: 'low', label: 'Low', color: '#3498db' }
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
				const isActive = priorityFilter === option.key;

				return (
					<Pressable
						key={option.key}
						style={[
							styles.filterButton,
							{
								backgroundColor: isActive ? option.color : theme.filterInactive,
								borderColor: option.color
							}
						]}
						onPress={() => setPriorityFilter(option.key)}
					>
						<Text style={[styles.filterText, { color: isActive ? '#ffffff' : theme.filterInactiveText }]}>{option.label}</Text>
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
		borderRadius: 20,
		borderWidth: 1,
		flex: 1,
		paddingVertical: 8
	},
	filterText: {
		fontSize: 13,
		fontWeight: '600',
		textAlign: 'center'
	}
});
