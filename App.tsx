import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFonts, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FilterBar } from './src/components/FilterBar';
import { PriorityFilter } from './src/components/PriorityFilter';
import { TaskCounter } from './src/components/TaskCounter';
import { TaskInput } from './src/components/TaskInput';
import { TaskItem } from './src/components/TaskItem';
import { UndoToast } from './src/components/UndoToast';
import { useFilteredTasks } from './src/hooks/useFilteredTasks';
import { useTaskStore } from './src/store/useTaskStore';
import { LAYOUT, PRIORITY_FILTER_ALL, TASK_LIST_REFRESH_DELAY } from './src/constants';
import { darkTheme, fonts, lightTheme } from './src/theme';
import { FilterStatus, StatusBarTheme, type Task } from './src/types';

/* ===== Component ===== */
export default function App() {
	/* ===== Store ===== */
	const darkMode = useTaskStore((state) => state.darkMode);
	const filterStatus = useTaskStore((state) => state.filterStatus);
	const isHydrated = useTaskStore((state) => state.isHydrated);
	const priorityFilter = useTaskStore((state) => state.priorityFilter);
	const setFilterStatus = useTaskStore((state) => state.setFilterStatus);
	const setPriorityFilter = useTaskStore((state) => state.setPriorityFilter);
	const tasks = useTaskStore((state) => state.tasks);
	const toggleDarkMode = useTaskStore((state) => state.toggleDarkMode);

	/* ===== Hooks ===== */
	const filteredTasks = useFilteredTasks();
	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
		Poppins_600SemiBold,
		Poppins_700Bold
	});

	/* ===== State ===== */
	const [refreshing, setRefreshing] = useState(false);

	/* ===== Derived Values ===== */
	const hasFiltersActive = filterStatus !== FilterStatus.All || priorityFilter !== PRIORITY_FILTER_ALL;
	const isFilteredEmpty = tasks.length > 0 && filteredTasks.length === 0 && hasFiltersActive;
	const theme = darkMode ? darkTheme : lightTheme;

	/* ===== Functions ===== */
	function onRefresh() {
		setRefreshing(true);
		setTimeout(() => setRefreshing(false), TASK_LIST_REFRESH_DELAY);
	}

	function resetFilters() {
		setFilterStatus(FilterStatus.All);
		setPriorityFilter(PRIORITY_FILTER_ALL);
	}

	/* ===== Callbacks ===== */
	const renderItem = useCallback(({ item }: { item: Task }) => <TaskItem task={item} />, []);

	const keyExtractor = useCallback((item: Task) => item.id, []);

	/* ===== Loading ===== */
	if (!isHydrated || !fontsLoaded) {
		return (
			<View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
				<ActivityIndicator color={theme.accent} size="large" />

				<Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading...</Text>
			</View>
		);
	}

	/* ===== Render ===== */
	return (
		<SafeAreaProvider>
			<SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.accent }]}>
				<StatusBar style={StatusBarTheme.Dark} />

				<SafeAreaView edges={['bottom', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
					<View style={styles.appWrapper}>
						<View style={styles.container}>
							{/* Header */}
							<View style={[styles.header, { backgroundColor: theme.accent }]}>
								<Text style={[styles.title, { color: theme.accentText, fontFamily: fonts.heading }]}>CashDo</Text>

								<Pressable onPress={toggleDarkMode} style={[styles.themeToggle, { backgroundColor: theme.accentText }]}>
									<Text style={styles.themeToggleText}>{darkMode ? '☀️' : '🌙'}</Text>
								</Pressable>
							</View>

							<View style={[styles.content, { backgroundColor: theme.background }]}>
								{/* Task Counter */}
								<TaskCounter />

								{/* Task Input */}
								<TaskInput />

								{/* Filters */}
								<FilterBar />

								<PriorityFilter />

								{/* Task List */}
								<FlatList
									ListEmptyComponent={
										<View style={styles.emptyContainer}>
											<Text style={[styles.emptyText, { color: theme.textSecondary, fontFamily: fonts.headingSemiBold }]}>
												{isFilteredEmpty ? 'No tasks match the selected filters' : 'No tasks found'}
											</Text>

											<Text style={[styles.emptySubtext, { color: theme.textSecondary, fontFamily: fonts.body }]}>
												{isFilteredEmpty ? 'Try changing your filters or reset them' : 'Add a task above to get started'}
											</Text>

											{isFilteredEmpty && (
												<Pressable onPress={resetFilters} style={[styles.resetButton, { backgroundColor: theme.accent }]}>
													<Text style={[styles.resetButtonText, { color: theme.accentText, fontFamily: fonts.bodyMedium }]}>
														Reset Filters
													</Text>
												</Pressable>
											)}
										</View>
									}
									contentContainerStyle={styles.listContent}
									data={filteredTasks}
									keyExtractor={keyExtractor}
									refreshControl={
										<RefreshControl colors={[theme.accent]} onRefresh={onRefresh} refreshing={refreshing} tintColor={theme.accent} />
									}
									renderItem={renderItem}
									showsVerticalScrollIndicator={false}
									style={styles.list}
								/>
							</View>
						</View>

						<UndoToast />
					</View>
				</SafeAreaView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
	appWrapper: {
		alignSelf: 'center',
		flex: 1,
		maxWidth: LAYOUT.MAX_WIDTH,
		width: '100%'
	},
	container: {
		flex: 1
	},
	content: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16
	},
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
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 14
	},
	list: {
		flex: 1
	},
	listContent: {
		paddingBottom: 80
	},
	loadingContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center'
	},
	loadingText: {
		fontSize: 15,
		marginTop: 12
	},
	resetButton: {
		borderRadius: 8,
		marginTop: 16,
		paddingHorizontal: 20,
		paddingVertical: 10
	},
	resetButtonText: {
		fontSize: 14
	},
	safeArea: {
		flex: 1
	},
	themeToggle: {
		alignItems: 'center',
		borderRadius: 12,
		height: 36,
		justifyContent: 'center',
		width: 36
	},
	themeToggleText: {
		fontSize: 16
	},
	title: {
		fontSize: 26,
		letterSpacing: -0.5
	}
});
