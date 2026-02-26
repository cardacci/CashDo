import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFonts, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useCallback, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FilterBar } from './src/components/FilterBar';
import { ListEmpty } from './src/components/ListEmpty';
import { PriorityFilter } from './src/components/PriorityFilter';
import { StorageErrorModal } from './src/components/StorageErrorModal';
import { TaskCounter } from './src/components/TaskCounter';
import { TaskInput } from './src/components/TaskInput';
import { TaskItem } from './src/components/TaskItem';
import { UndoToast } from './src/components/UndoToast';
import { useFilteredTasks } from './src/hooks/useFilteredTasks';
import { useTaskSync } from './src/hooks/useTaskSync';
import { useTheme } from './src/hooks/useTheme';
import { useTaskStore } from './src/store/useTaskStore';
import { IS_IOS, KEYBOARD_SCROLL_DELAY, LAYOUT, PRIORITY_FILTER_ALL } from './src/constants';
import { fonts } from './src/theme';
import { FilterStatus, StatusBarTheme, type Task } from './src/types';

/* ===== Constants ===== */
const A11Y = {
	LOADING_LABEL: 'Loading application',
	SYNC_LABEL: 'Syncing tasks with server',
	TASK_LIST_LABEL: 'Task list',
	THEME_LABEL: 'Toggle dark mode',
	TITLE_LABEL: 'CashDo'
} as const;

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
	const { isSyncing, syncFromApi } = useTaskSync();
	const theme = useTheme();

	/* ===== Refs ===== */
	const flatListRef = useRef<FlatList<Task>>(null);

	/* ===== Derived Values ===== */
	const hasFiltersActive = filterStatus !== FilterStatus.All || priorityFilter !== PRIORITY_FILTER_ALL;
	const isFilteredEmpty = tasks.length > 0 && filteredTasks.length === 0 && hasFiltersActive;

	/* ===== Callbacks ===== */
	const resetFilters = useCallback(
		function resetFilters() {
			setFilterStatus(FilterStatus.All);
			setPriorityFilter(PRIORITY_FILTER_ALL);
		},
		[setFilterStatus, setPriorityFilter]
	);

	/* ===== Functions ===== */
	function keyExtractor(item: Task) {
		return item.id;
	}

	function renderItem({ item, index }: { item: Task; index: number }) {
		return (
			<TaskItem
				onEditStart={() => {
					setTimeout(() => {
						flatListRef.current?.scrollToIndex({ animated: true, index, viewPosition: 0.1 });
					}, KEYBOARD_SCROLL_DELAY);
				}}
				task={item}
			/>
		);
	}

	/* ===== Loading ===== */
	if (!isHydrated || !fontsLoaded) {
		return (
			<View accessibilityLabel={A11Y.LOADING_LABEL} style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
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
						<KeyboardAvoidingView behavior={IS_IOS ? 'padding' : 'height'} style={styles.container}>
							{/* Header */}
							<View style={[styles.header, { backgroundColor: theme.accent }]}>
								<View style={styles.headerTitleRow}>
									<Text accessibilityRole="header" style={[styles.title, { color: theme.accentText, fontFamily: fonts.heading }]}>
										{A11Y.TITLE_LABEL}
									</Text>

									{isSyncing && (
										<ActivityIndicator
											accessibilityLabel={A11Y.SYNC_LABEL}
											accessibilityLiveRegion="polite"
											color={theme.accentText}
											size="small"
										/>
									)}
								</View>

								<Pressable
									accessibilityLabel={A11Y.THEME_LABEL}
									accessibilityRole="switch"
									accessibilityState={{ checked: darkMode }}
									hitSlop={4}
									onPress={toggleDarkMode}
									style={[styles.themeToggle, { backgroundColor: theme.accentText }]}
								>
									<Text importantForAccessibility="no" style={styles.themeToggleText}>
										{darkMode ? '☀️' : '🌙'}
									</Text>
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
									ListEmptyComponent={<ListEmpty isFilteredEmpty={isFilteredEmpty} onResetFilters={resetFilters} theme={theme} />}
									accessibilityLabel={A11Y.TASK_LIST_LABEL}
									contentContainerStyle={styles.listContent}
									data={filteredTasks}
									keyExtractor={keyExtractor}
									keyboardDismissMode="on-drag"
									ref={flatListRef}
									refreshControl={
										<RefreshControl colors={[theme.accent]} onRefresh={syncFromApi} refreshing={isSyncing} tintColor={theme.accent} />
									}
									renderItem={renderItem}
									showsVerticalScrollIndicator={false}
									style={styles.list}
								/>
							</View>
						</KeyboardAvoidingView>

						<UndoToast />

						<StorageErrorModal />
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
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 14
	},
	headerTitleRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 8
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
