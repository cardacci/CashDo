import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTaskStore } from '../store/useTaskStore';
import { darkTheme, fonts, lightTheme, type ThemeColors } from '../theme';
import { Priority, type Task } from '../types';

/* ===== Constants ===== */
const PRIORITY_LABELS: Record<Priority, string> = {
	[Priority.High]: 'HIGH',
	[Priority.Low]: 'LOW',
	[Priority.Medium]: 'MED'
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
			case Priority.High:
				return theme.priorityHigh;
			case Priority.Medium:
				return theme.priorityMedium;
			case Priority.Low:
				return theme.priorityLow;
		}
	}

	function handleCancelEdit() {
		setEditText(task.text);
		setIsEditing(false);
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

	/* ===== Render ===== */
	return (
		<View style={dynamicStyles.container}>
			<Pressable
				onPress={() => toggleTask(task.id)}
				style={[
					styles.checkbox,
					{
						backgroundColor: task.completed ? theme.checkboxChecked : 'transparent',
						borderColor: task.completed ? theme.checkboxChecked : theme.checkboxBorder
					}
				]}
			>
				{task.completed && <Text style={styles.checkmark}>✓</Text>}
			</Pressable>

			<View style={styles.content}>
				{isEditing ? (
					<View style={styles.editRow}>
						<TextInput
							autoFocus
							onChangeText={setEditText}
							onSubmitEditing={handleSaveEdit}
							style={[dynamicStyles.editInput, { fontFamily: fonts.body }]}
							value={editText}
						/>

						<Pressable onPress={handleSaveEdit} style={[styles.editAction, { backgroundColor: theme.success }]}>
							<Text style={styles.editActionText}>✓</Text>
						</Pressable>

						<Pressable onPress={handleCancelEdit} style={[styles.editAction, { backgroundColor: theme.textSecondary }]}>
							<Text style={styles.editActionText}>✕</Text>
						</Pressable>
					</View>
				) : (
					<Pressable onLongPress={handleEdit}>
						<Text numberOfLines={2} style={[dynamicStyles.taskText, task.completed && styles.completedText, { fontFamily: fonts.body }]}>
							{task.text}
						</Text>
					</Pressable>
				)}
			</View>

			<View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
				<Text style={[styles.priorityText, { fontFamily: fonts.bodySemiBold }]}>{PRIORITY_LABELS[task.priority]}</Text>
			</View>

			<Pressable onPress={() => deleteTask(task.id)} style={[styles.deleteButton, { backgroundColor: theme.danger }]}>
				<Text style={styles.deleteButtonText}>✕</Text>
			</Pressable>
		</View>
	);
}

export const TaskItem = React.memo(TaskItemComponent);

/* ===== Styles ===== */
function createDynamicStyles(theme: ThemeColors) {
	return StyleSheet.create({
		container: {
			alignItems: 'center',
			backgroundColor: theme.surface,
			borderRadius: 10,
			elevation: 1,
			flexDirection: 'row',
			marginBottom: 8,
			padding: 14,
			shadowColor: theme.cardShadow,
			shadowOffset: { height: 1, width: 0 },
			shadowOpacity: 1,
			shadowRadius: 4
		},
		editInput: {
			backgroundColor: theme.inputBackground,
			borderColor: theme.border,
			borderRadius: 8,
			borderWidth: 1,
			color: theme.text,
			flex: 1,
			fontSize: 14,
			paddingHorizontal: 10,
			paddingVertical: 6
		},
		taskText: {
			color: theme.text,
			fontSize: 14,
			lineHeight: 20
		}
	});
}

const styles = StyleSheet.create({
	checkbox: {
		alignItems: 'center',
		borderRadius: 6,
		borderWidth: 2,
		height: 22,
		justifyContent: 'center',
		marginRight: 12,
		width: 22
	},
	checkmark: {
		color: '#FFFFFF',
		fontSize: 13,
		fontWeight: 'bold'
	},
	completedText: {
		opacity: 0.45,
		textDecorationLine: 'line-through'
	},
	content: {
		flex: 1,
		marginRight: 10
	},
	deleteButton: {
		alignItems: 'center',
		borderRadius: 6,
		height: 28,
		justifyContent: 'center',
		width: 28
	},
	deleteButtonText: {
		color: '#FFFFFF',
		fontSize: 13,
		fontWeight: 'bold'
	},
	editAction: {
		alignItems: 'center',
		borderRadius: 6,
		height: 28,
		justifyContent: 'center',
		width: 28
	},
	editActionText: {
		color: '#FFFFFF',
		fontSize: 13,
		fontWeight: 'bold'
	},
	editRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 6
	},
	priorityBadge: {
		borderRadius: 6,
		marginRight: 10,
		paddingHorizontal: 8,
		paddingVertical: 4
	},
	priorityText: {
		color: '#FFFFFF',
		fontSize: 9,
		letterSpacing: 0.5
	}
});
