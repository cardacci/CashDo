import { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, FlatList, LayoutAnimation, Platform, Pressable, RefreshControl, StyleSheet, Text, UIManager, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { FilterBar } from './src/components/FilterBar';
import { PriorityFilter } from './src/components/PriorityFilter';
import { TaskCounter } from './src/components/TaskCounter';
import { TaskInput } from './src/components/TaskInput';
import { TaskItem } from './src/components/TaskItem';
import { useFilteredTasks } from './src/hooks/useFilteredTasks';
import { useTaskStore } from './src/store/useTaskStore';
import { darkTheme, lightTheme } from './src/theme';
import { type Task } from './src/types';

/* ===== Layout Animation Setup ===== */
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* ===== Component ===== */
export default function App() {
	/* ===== Store ===== */
	const darkMode = useTaskStore((state) => state.darkMode);
	const toggleDarkMode = useTaskStore((state) => state.toggleDarkMode);
	const isHydrated = useTaskStore((state) => state.isHydrated);

	/* ===== Theme ===== */
	const theme = darkMode ? darkTheme : lightTheme;

	/* ===== Hooks ===== */
	const filteredTasks = useFilteredTasks();

	/* ===== Functions ===== */
	const renderItem = useCallback(({ item }: { item: Task }) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		return <TaskItem task={item} />;
	}, []);

	const keyExtractor = useCallback((item: Task) => item.id, []);

	function handleRefresh() {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	}

	/* ===== Loading ===== */
	if (!isHydrated) {
		return (
			<View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
				<ActivityIndicator size="large" color={theme.primary} />
				<Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading tasks...</Text>
			</View>
		);
	}

	/* ===== Render ===== */
	return (
		<SafeAreaProvider>
			<SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
				<StatusBar style={darkMode ? 'light' : 'dark'} />
				<View style={styles.container}>
					{/* Header */}
					<View style={styles.header}>
						<Text style={[styles.title, { color: theme.text }]}>CashDo</Text>
						<Pressable style={[styles.themeToggle, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={toggleDarkMode}>
							<Text style={styles.themeToggleText}>{darkMode ? '☀️' : '🌙'}</Text>
						</Pressable>
					</View>

					{/* Task Counter */}
					<TaskCounter />

					{/* Task Input */}
					<TaskInput />

					{/* Filters */}
					<FilterBar />
					<PriorityFilter />

					{/* Task List */}
					<FlatList
						data={filteredTasks}
						renderItem={renderItem}
						keyExtractor={keyExtractor}
						style={styles.list}
						contentContainerStyle={styles.listContent}
						showsVerticalScrollIndicator={false}
						refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} tintColor={theme.primary} />}
						ListEmptyComponent={
							<View style={styles.emptyContainer}>
								<Text style={[styles.emptyText, { color: theme.textSecondary }]}>No tasks found</Text>
								<Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>Add a task above to get started</Text>
							</View>
						}
					/>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
	safeArea: {
		flex: 1
	},
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: Platform.OS === 'android' ? 40 : 0
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16,
		paddingVertical: 8
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold'
	},
	themeToggle: {
		alignItems: 'center',
		borderRadius: 20,
		borderWidth: 1,
		height: 40,
		justifyContent: 'center',
		width: 40
	},
	themeToggleText: {
		fontSize: 18
	},
	list: {
		flex: 1
	},
	listContent: {
		paddingBottom: 20
	},
	emptyContainer: {
		alignItems: 'center',
		paddingTop: 40
	},
	emptyText: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 4
	},
	emptySubtext: {
		fontSize: 14
	},
	loadingContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center'
	},
	loadingText: {
		fontSize: 16,
		marginTop: 12
	}
});
