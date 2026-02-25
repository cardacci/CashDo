import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTaskStore } from '../store/useTaskStore';
import { fonts } from '../theme';
import { FilterStatus } from '../types';

/* ===== Constants ===== */
const FILTERS: { key: FilterStatus; label: string }[] = [
	{ key: FilterStatus.All, label: 'All' },
	{ key: FilterStatus.Completed, label: 'Completed' },
	{ key: FilterStatus.Pending, label: 'Pending' }
];

/* ===== Component ===== */
export function FilterBar() {
	/* ===== Store ===== */
	const filterStatus = useTaskStore((state) => state.filterStatus);
	const setFilterStatus = useTaskStore((state) => state.setFilterStatus);

	/* ===== Hooks ===== */
	const theme = useTheme();

	/* ===== Render ===== */
	return (
		<View style={styles.container}>
			{FILTERS.map((filter) => {
				const isActive = filterStatus === filter.key;

				return (
					<Pressable
						key={filter.key}
						onPress={() => setFilterStatus(filter.key)}
						style={[styles.filterButton, { backgroundColor: isActive ? theme.filterActive : theme.filterInactive }]}
					>
						<Text
							style={[styles.filterText, { color: isActive ? theme.filterActiveText : theme.filterInactiveText, fontFamily: fonts.bodyMedium }]}
						>
							{filter.label}
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
		marginBottom: 8
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
