import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTaskStore } from '../store/useTaskStore';
import { useUndoStore } from '../store/useUndoStore';
import { darkTheme, fonts, lightTheme, type ThemeColors } from '../theme';
import { CHAR_COUNT, TASK_TEXT_MAX_LENGTH } from '../constants';
import { Priority, type Task } from '../types';
import { formatDateTime } from '../utils/formatDateTime';

/* ===== Constants ===== */
const ANIMATION_DURATION_EDIT = 150;
const ANIMATION_DURATION_ENTRY = 300;
const ANIMATION_DURATION_EXIT = 200;
const RECENTLY_CREATED_THRESHOLD = 1000;

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
	const setPendingDelete = useUndoStore((state) => state.setPendingDelete);

	/* ===== State ===== */
	const [editText, setEditText] = useState(task.text);
	const [isEditing, setIsEditing] = useState(false);

	/* ===== Refs ===== */
	const isNew = useRef(Date.now() - task.createdAt < RECENTLY_CREATED_THRESHOLD).current;
	const opacityAnim = useRef(new Animated.Value(isNew ? 0 : 1)).current;
	const scaleAnim = useRef(new Animated.Value(1)).current;

	/* ===== Derived Values ===== */
	const theme = darkMode ? darkTheme : lightTheme;
	const dynamicStyles = createDynamicStyles(theme);
	const editCharRatio = editText.length / TASK_TEXT_MAX_LENGTH;
	const editCharCountColor = editCharRatio >= CHAR_COUNT.DANGER_THRESHOLD ? theme.danger : theme.textSecondary;
	const showEditCharCount = isEditing && editCharRatio >= CHAR_COUNT.WARNING_THRESHOLD;

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

	function handleDelete() {
		Animated.timing(opacityAnim, { duration: ANIMATION_DURATION_EXIT, toValue: 0, useNativeDriver: true }).start(() => {
			setPendingDelete(task);
			deleteTask(task.id);
		});
	}

	function handleEdit() {
		setEditText(task.text);
		setIsEditing(true);
	}

	function handleSaveEdit() {
		const trimmed = editText.trim();

		if (trimmed && trimmed !== task.text) {
			editTask(task.id, trimmed);

			Animated.sequence([
				Animated.timing(scaleAnim, { duration: ANIMATION_DURATION_EDIT, toValue: 1.03, useNativeDriver: true }),
				Animated.timing(scaleAnim, { duration: ANIMATION_DURATION_EDIT, toValue: 1, useNativeDriver: true })
			]).start();
		}

		setIsEditing(false);
	}

	/* ===== Effects ===== */
	useEffect(() => {
		if (isNew) {
			Animated.timing(opacityAnim, { duration: ANIMATION_DURATION_ENTRY, toValue: 1, useNativeDriver: true }).start();
		}
	}, [isNew, opacityAnim]);

	/* ===== Render ===== */
	return (
		<Animated.View style={[dynamicStyles.container, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
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
					<>
						<View style={styles.editRow}>
							<TextInput
								autoFocus
								maxLength={TASK_TEXT_MAX_LENGTH}
								multiline
								onChangeText={setEditText}
								onSubmitEditing={handleSaveEdit}
								style={[dynamicStyles.editInput, { fontFamily: fonts.body }]}
								value={editText}
							/>

							<View style={styles.editActions}>
								<Pressable onPress={handleSaveEdit} style={[styles.editAction, { backgroundColor: theme.success }]}>
									<Text style={styles.editActionText}>✓</Text>
								</Pressable>

								<Pressable onPress={handleCancelEdit} style={[styles.editAction, { backgroundColor: theme.textSecondary }]}>
									<Text style={styles.editActionText}>✕</Text>
								</Pressable>
							</View>
						</View>

						<Text style={[styles.editCharCount, { color: editCharCountColor, fontFamily: fonts.body, opacity: showEditCharCount ? 1 : 0 }]}>
							{editText.length}/{TASK_TEXT_MAX_LENGTH}
						</Text>
					</>
				) : (
					<Pressable onLongPress={handleEdit}>
						<ScrollView nestedScrollEnabled showsVerticalScrollIndicator style={styles.taskTextScroll}>
							<Text style={[dynamicStyles.taskText, task.completed && styles.completedText, { fontFamily: fonts.body }]}>{task.text}</Text>
						</ScrollView>

						<Text style={[dynamicStyles.dateText, { fontFamily: fonts.body }]}>{formatDateTime(task.createdAt)}</Text>
					</Pressable>
				)}
			</View>

			{!isEditing && (
				<>
					<View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
						<Text style={[styles.priorityText, { fontFamily: fonts.bodySemiBold }]}>{PRIORITY_LABELS[task.priority]}</Text>
					</View>

					<Pressable onPress={handleEdit} style={styles.actionButton}>
						<Text style={[styles.actionButtonText, { color: theme.textSecondary }]}>✎</Text>
					</Pressable>

					<Pressable onPress={handleDelete} style={styles.actionButton}>
						<Text style={[styles.actionButtonText, { color: theme.danger }]}>✕</Text>
					</Pressable>
				</>
			)}
		</Animated.View>
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
			boxShadow: `0 1px 4px ${theme.cardShadow}`,
			elevation: 1,
			flexDirection: 'row',
			marginBottom: 8,
			paddingHorizontal: 14,
			paddingVertical: 16
		},
		dateText: {
			color: theme.textSecondary,
			fontSize: 11,
			marginTop: 4
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

const TASK_TEXT_LINE_HEIGHT = 20;
const TASK_TEXT_MAX_LINES = 3;
const TASK_TEXT_MAX_HEIGHT = TASK_TEXT_LINE_HEIGHT * TASK_TEXT_MAX_LINES;

const styles = StyleSheet.create({
	actionButton: {
		alignItems: 'center',
		height: 24,
		justifyContent: 'center',
		marginLeft: 4,
		width: 24
	},
	actionButtonText: {
		fontSize: 14
	},
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
	editActions: {
		gap: 6,
		justifyContent: 'center'
	},
	editCharCount: {
		fontSize: CHAR_COUNT.FONT_SIZE,
		marginTop: 4,
		textAlign: 'right'
	},
	editRow: {
		flexDirection: 'row',
		gap: 8
	},
	priorityBadge: {
		borderRadius: 6,
		marginLeft: 8,
		paddingHorizontal: 8,
		paddingVertical: 4
	},
	priorityText: {
		color: '#FFFFFF',
		fontSize: 9,
		letterSpacing: 0.5
	},
	taskTextScroll: {
		maxHeight: TASK_TEXT_MAX_HEIGHT
	}
});
