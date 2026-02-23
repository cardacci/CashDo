import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTaskStore } from '../store/useTaskStore';
import { darkTheme, lightTheme } from '../theme';
import { type FilterStatus } from '../types';

/* ===== Constants & Enums ===== */
const FILTERS: { key: FilterStatus; label: string }[] = [
	{ key: 'all', label: 'All' },
	{ key: 'completed', label: 'Completed' },
	{ key: 'pending', label: 'Pending' }
];

/* ===== Component ===== */
export function FilterBar() {
	/* ===== Store ===== */
	const darkMode = useTaskStore((state) => state.darkMode);
	const filterStatus = useTaskStore((state) => state.filterStatus);
	const setFilterStatus = useTaskStore((state) => state.setFilterStatus);

	/* ===== Derived Values ===== */
	const theme = darkMode ? darkTheme : lightTheme;

	/* ===== Render ===== */
	return (
		<View style={styles.container}>
			{FILTERS.map((filter) => {
				const isActive = filterStatus === filter.key;

				return (
					<Pressable
						key={filter.key}
						style={[
							styles.filterButton,
							{
								backgroundColor: isActive ? theme.filterActive : theme.filterInactive,
								borderColor: theme.filterActive
							}
						]}
						onPress={() => setFilterStatus(filter.key)}
					>
						<Text style={[styles.filterText, { color: isActive ? theme.filterActiveText : theme.filterInactiveText }]}>{filter.label}</Text>
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
