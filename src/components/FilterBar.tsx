import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTaskStore } from '../store/useTaskStore';
import { fonts } from '../theme';
import { FilterStatus } from '../types';

/* ===== Constants ===== */
const A11Y_LABELS: Record<FilterStatus, string> = {
	[FilterStatus.All]: 'All tasks',
	[FilterStatus.Completed]: 'Completed tasks',
	[FilterStatus.Pending]: 'Pending tasks'
} as const;

const FILTERS: { key: FilterStatus; label: string }[] = [
	{ key: FilterStatus.All, label: 'All' },
	{ key: FilterStatus.Completed, label: 'Completed' },
	{ key: FilterStatus.Pending, label: 'Pending' }
];

/* ===== Component ===== */
function FilterBarComponent() {
	/* ===== Store ===== */
	const filterStatus = useTaskStore((state) => state.filterStatus);
	const setFilterStatus = useTaskStore((state) => state.setFilterStatus);

	/* ===== Hooks ===== */
	const theme = useTheme();

	/* ===== Render ===== */
	return (
		<View accessibilityRole="radiogroup" style={styles.container}>
			{FILTERS.map((filter) => {
				const isActive = filterStatus === filter.key;

				return (
					<Pressable
						accessibilityLabel={A11Y_LABELS[filter.key]}
						accessibilityRole="radio"
						accessibilityState={{ selected: isActive }}
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

export const FilterBar = memo(FilterBarComponent);

/* ===== Styles ===== */
const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 6,
		marginBottom: 6
	},
	filterButton: {
		borderRadius: 6,
		flex: 1,
		justifyContent: 'center',
		minHeight: 44,
		paddingVertical: 6
	},
	filterText: {
		fontSize: 12,
		textAlign: 'center'
	}
});
