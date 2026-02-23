import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTaskStore } from '../store/useTaskStore';
import { darkTheme, lightTheme, type ThemeColors } from '../theme';
import { type Priority, type Task } from '../types';

/* ===== Constants ===== */
const PRIORITY_LABELS: Record<Priority, string> = {
	high: 'HIGH',
	medium: 'MED',
	low: 'LOW'
};

/* ===== Types ===== */
interface TaskItemProps {
	task: Task;
}

/* ===== Component ===== */
function TaskItemComponent({ task }: TaskItemProps) {
	/* ===== Store ===== */
	const darkMode = useTaskStore((state) => state.darkMode);
	const deleteTask = useTaskStore((state) => state.deleteTask);
	const editTask = useTaskStore((state) => state.editTask);
	const toggleTask = useTaskStore((state) => state.toggleTask);

	/* ===== State ===== */
	const [editText, setEditText] = useState(task.text);
	const [isEditing, setIsEditing] = useState(false);

	/* ===== Derived Values ===== */
	const theme = darkMode ? darkTheme : lightTheme;
	const dynamicStyles = createDynamicStyles(theme);

	/* ===== Functions ===== */
	function getPriorityColor(): string {
		switch (task.priority) {
			case 'high':
				return theme.priorityHigh;
			case 'medium':
				return theme.priorityMedium;
			case 'low':
				return theme.priorityLow;
		}
	}

	function handleEdit() {
		setEditText(task.text);
		setIsEditing(true);
	}

	function handleSaveEdit() {
		const trimmed = editText.trim();

		if (trimmed && trimmed !== task.text) {
			editTask(task.id, trimmed);
		}

		setIsEditing(false);
	}

	function handleCancelEdit() {
		setEditText(task.text);
		setIsEditing(false);
	}

	/* ===== Render ===== */
	return (
		<View style={dynamicStyles.container}>
			<Pressable
				style={[
					styles.checkbox,
					{
						borderColor: task.completed ? theme.checkboxChecked : theme.checkboxBorder,
						backgroundColor: task.completed ? theme.checkboxChecked : 'transparent'
					}
				]}
				onPress={() => toggleTask(task.id)}
			>
				{task.completed && <Text style={styles.checkmark}>✓</Text>}
			</Pressable>

			<View style={styles.content}>
				{isEditing ? (
					<View style={styles.editRow}>
						<TextInput style={dynamicStyles.editInput} value={editText} onChangeText={setEditText} onSubmitEditing={handleSaveEdit} autoFocus />
						<Pressable style={styles.saveButton} onPress={handleSaveEdit}>
							<Text style={styles.saveButtonText}>✓</Text>
						</Pressable>
						<Pressable style={styles.cancelButton} onPress={handleCancelEdit}>
							<Text style={styles.cancelButtonText}>✕</Text>
						</Pressable>
					</View>
				) : (
					<Pressable onLongPress={handleEdit}>
						<Text style={[dynamicStyles.taskText, task.completed && styles.completedText]} numberOfLines={2}>
							{task.text}
						</Text>
					</Pressable>
				)}
			</View>

			<View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
				<Text style={styles.priorityText}>{PRIORITY_LABELS[task.priority]}</Text>
			</View>

			<Pressable style={[styles.deleteButton, { backgroundColor: theme.danger }]} onPress={() => deleteTask(task.id)}>
				<Text style={styles.deleteButtonText}>✕</Text>
			</Pressable>
		</View>
	);
}

/* ===== Memo ===== */
export const TaskItem = React.memo(TaskItemComponent);

/* ===== Styles ===== */
function createDynamicStyles(theme: ThemeColors) {
	return StyleSheet.create({
		container: {
			alignItems: 'center',
			backgroundColor: theme.surface,
			borderColor: theme.border,
			borderRadius: 10,
			borderWidth: 1,
			flexDirection: 'row',
			marginBottom: 8,
			padding: 12
		},
		editInput: {
			backgroundColor: theme.inputBackground,
			borderColor: theme.border,
			borderRadius: 6,
			borderWidth: 1,
			color: theme.text,
			flex: 1,
			fontSize: 15,
			paddingHorizontal: 8,
			paddingVertical: 4
		},
		taskText: {
			color: theme.text,
			fontSize: 15
		}
	});
}

const styles = StyleSheet.create({
	checkbox: {
		alignItems: 'center',
		borderRadius: 4,
		borderWidth: 2,
		height: 24,
		justifyContent: 'center',
		marginRight: 10,
		width: 24
	},
	checkmark: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: 'bold'
	},
	content: {
		flex: 1,
		marginRight: 8
	},
	editRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 6
	},
	saveButton: {
		alignItems: 'center',
		backgroundColor: '#27ae60',
		borderRadius: 4,
		height: 28,
		justifyContent: 'center',
		width: 28
	},
	saveButtonText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: 'bold'
	},
	cancelButton: {
		alignItems: 'center',
		backgroundColor: '#999999',
		borderRadius: 4,
		height: 28,
		justifyContent: 'center',
		width: 28
	},
	cancelButtonText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: 'bold'
	},
	completedText: {
		opacity: 0.5,
		textDecorationLine: 'line-through'
	},
	priorityBadge: {
		borderRadius: 4,
		marginRight: 8,
		paddingHorizontal: 6,
		paddingVertical: 3
	},
	priorityText: {
		color: '#ffffff',
		fontSize: 10,
		fontWeight: 'bold'
	},
	deleteButton: {
		alignItems: 'center',
		borderRadius: 4,
		height: 28,
		justifyContent: 'center',
		width: 28
	},
	deleteButtonText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: 'bold'
	}
});
