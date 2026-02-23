import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTaskStore } from '../store/useTaskStore';
import { darkTheme, lightTheme, type ThemeColors } from '../theme';
import { type Priority } from '../types';

/* ===== Constants ===== */
const PRIORITIES: Priority[] = ['high', 'medium', 'low'];

const PRIORITY_LABELS: Record<Priority, string> = {
	high: 'High',
	medium: 'Medium',
	low: 'Low'
};

/* ===== Component ===== */
export function TaskInput() {
	/* ===== Store ===== */
	const addTask = useTaskStore((state) => state.addTask);
	const darkMode = useTaskStore((state) => state.darkMode);

	/* ===== State ===== */
	const [priority, setPriority] = useState<Priority>('medium');
	const [text, setText] = useState('');

	/* ===== Derived Values ===== */
	const theme = darkMode ? darkTheme : lightTheme;
	const dynamicStyles = createDynamicStyles(theme);

	/* ===== Functions ===== */
	function handleAddTask() {
		const trimmed = text.trim();
		if (!trimmed) return;

		addTask(trimmed, priority);
		setText('');
		setPriority('medium');
	}

	function getPriorityColor(p: Priority): string {
		switch (p) {
			case 'high':
				return theme.priorityHigh;
			case 'medium':
				return theme.priorityMedium;
			case 'low':
				return theme.priorityLow;
		}
	}

	/* ===== Render ===== */
	return (
		<View style={dynamicStyles.container}>
			<TextInput
				style={dynamicStyles.input}
				placeholder="Add a new task..."
				placeholderTextColor={theme.textSecondary}
				value={text}
				onChangeText={setText}
				onSubmitEditing={handleAddTask}
				returnKeyType="done"
			/>

			<View style={styles.priorityRow}>
				{PRIORITIES.map((p) => (
					<Pressable
						key={p}
						style={[
							styles.priorityButton,
							{
								backgroundColor: priority === p ? getPriorityColor(p) : theme.filterInactive,
								borderColor: getPriorityColor(p)
							}
						]}
						onPress={() => setPriority(p)}
					>
						<Text style={[styles.priorityButtonText, { color: priority === p ? '#ffffff' : theme.filterInactiveText }]}>{PRIORITY_LABELS[p]}</Text>
					</Pressable>
				))}
			</View>
			<Pressable style={[dynamicStyles.addButton, !text.trim() && styles.addButtonDisabled]} onPress={handleAddTask} disabled={!text.trim()}>
				<Text style={styles.addButtonText}>Add Task</Text>
			</Pressable>
		</View>
	);
}

/* ===== Styles ===== */
function createDynamicStyles(theme: ThemeColors) {
	return StyleSheet.create({
		container: {
			backgroundColor: theme.surface,
			borderColor: theme.border,
			borderRadius: 12,
			borderWidth: 1,
			marginBottom: 16,
			padding: 16
		},
		input: {
			backgroundColor: theme.inputBackground,
			borderColor: theme.border,
			borderRadius: 8,
			borderWidth: 1,
			color: theme.text,
			fontSize: 16,
			marginBottom: 12,
			paddingHorizontal: 12,
			paddingVertical: 10
		},
		addButton: {
			alignItems: 'center',
			backgroundColor: theme.primary,
			borderRadius: 8,
			paddingVertical: 12
		}
	});
}

const styles = StyleSheet.create({
	priorityRow: {
		flexDirection: 'row',
		gap: 8,
		marginBottom: 12
	},
	priorityButton: {
		borderRadius: 6,
		borderWidth: 1,
		flex: 1,
		paddingVertical: 8
	},
	priorityButtonText: {
		fontSize: 13,
		fontWeight: '600',
		textAlign: 'center'
	},
	addButtonDisabled: {
		opacity: 0.5
	},
	addButtonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '600'
	}
});
