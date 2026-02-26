import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PRIORITY_FILTER_ALL } from '../constants';
import { useTheme } from '../hooks/useTheme';
import { useTaskStore } from '../store/useTaskStore';
import { fonts } from '../theme';
import { Priority, type PriorityFilter as PriorityFilterType } from '../types';

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
	const priorityFilter = useTaskStore((state) => state.priorityFilter);
	const setPriorityFilter = useTaskStore((state) => state.setPriorityFilter);

	/* ===== Hooks ===== */
	const theme = useTheme();

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
		gap: 6,
		marginBottom: 10
	},
	filterButton: {
		borderRadius: 6,
		flex: 1,
		paddingVertical: 6
	},
	filterText: {
		fontSize: 12,
		textAlign: 'center'
	}
});
