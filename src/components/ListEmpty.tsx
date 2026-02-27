import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, type ThemeColors } from '../theme';

/* ===== Constants ===== */
const A11Y = {
	EMPTY_LABEL: 'No tasks to display',
	RESET_FILTERS_LABEL: 'Reset all filters'
} as const;

/* ===== Types ===== */
interface ListEmptyProps {
	isFilteredEmpty: boolean;
	onResetFilters: () => void;
	theme: ThemeColors;
}

/* ===== Component ===== */
function ListEmptyComponent({ isFilteredEmpty, onResetFilters, theme }: ListEmptyProps) {
	/* ===== Render ===== */
	return (
		<View accessibilityLabel={A11Y.EMPTY_LABEL} style={styles.emptyContainer}>
			<Text style={[styles.emptyText, { color: theme.textSecondary, fontFamily: fonts.headingSemiBold }]}>
				{isFilteredEmpty ? 'No tasks match the selected filters' : 'No tasks found'}
			</Text>

			<Text style={[styles.emptySubtext, { color: theme.textSecondary, fontFamily: fonts.body }]}>
				{isFilteredEmpty ? 'Try changing your filters or reset them' : 'Add a task above to get started'}
			</Text>

			{isFilteredEmpty && (
				<Pressable
					accessibilityLabel={A11Y.RESET_FILTERS_LABEL}
					accessibilityRole="button"
					onPress={onResetFilters}
					style={[styles.resetButton, { backgroundColor: theme.accent }]}
				>
					<Text style={[styles.resetButtonText, { color: theme.accentText, fontFamily: fonts.bodyMedium }]}>Reset Filters</Text>
				</Pressable>
			)}
		</View>
	);
}

export const ListEmpty = memo(ListEmptyComponent);

/* ===== Styles ===== */
const styles = StyleSheet.create({
	emptyContainer: {
		alignItems: 'center',
		paddingTop: 48
	},
	emptySubtext: {
		fontSize: 14
	},
	emptyText: {
		fontSize: 17,
		marginBottom: 6
	},
	resetButton: {
		borderRadius: 8,
		justifyContent: 'center',
		marginTop: 16,
		minHeight: 44,
		paddingHorizontal: 20,
		paddingVertical: 10
	},
	resetButtonText: {
		fontSize: 14
	}
});
