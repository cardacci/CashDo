import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFonts, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, FlatList, LayoutAnimation, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FilterBar } from './src/components/FilterBar';
import { PriorityFilter } from './src/components/PriorityFilter';
import { TaskCounter } from './src/components/TaskCounter';
import { TaskInput } from './src/components/TaskInput';
import { TaskItem } from './src/components/TaskItem';
import { useFilteredTasks } from './src/hooks/useFilteredTasks';
import { useTaskStore } from './src/store/useTaskStore';
import { darkTheme, fonts, lightTheme } from './src/theme';
import { StatusBarTheme, type Task } from './src/types';

/* ===== Component ===== */
export default function App() {
	/* ===== Store ===== */
	const darkMode = useTaskStore((state) => state.darkMode);
	const isHydrated = useTaskStore((state) => state.isHydrated);
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

	/* ===== Derived Values ===== */
	const theme = darkMode ? darkTheme : lightTheme;

	/* ===== Functions ===== */
	function handleRefresh() {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	}

	/* ===== Callbacks ===== */
	const renderItem = useCallback(({ item }: { item: Task }) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

		return <TaskItem task={item} />;
	}, []);

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
			<SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
				<StatusBar style={darkMode ? StatusBarTheme.Light : StatusBarTheme.Dark} />

				<View style={styles.container}>
					{/* Header */}
					<View style={[styles.header, { backgroundColor: theme.accent }]}>
						<Text style={[styles.title, { color: theme.accentText, fontFamily: fonts.heading }]}>CashDo</Text>

						<Pressable onPress={toggleDarkMode} style={[styles.themeToggle, { backgroundColor: theme.accentText }]}>
							<Text style={styles.themeToggleText}>{darkMode ? '☀️' : '🌙'}</Text>
						</Pressable>
					</View>

					<View style={styles.content}>
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
									<Text style={[styles.emptyText, { color: theme.textSecondary, fontFamily: fonts.headingSemiBold }]}>No tasks found</Text>
									<Text style={[styles.emptySubtext, { color: theme.textSecondary, fontFamily: fonts.body }]}>
										Add a task above to get started
									</Text>
								</View>
							}
							contentContainerStyle={styles.listContent}
							data={filteredTasks}
							keyExtractor={keyExtractor}
							refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={false} tintColor={theme.accent} />}
							renderItem={renderItem}
							showsVerticalScrollIndicator={false}
							style={styles.list}
						/>
					</View>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
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
		paddingBottom: 24
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
