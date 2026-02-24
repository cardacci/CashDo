import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTaskStore } from '../store/useTaskStore';
import { darkTheme, fonts, lightTheme, type ThemeColors } from '../theme';
import { CHAR_COUNT, TASK_TEXT_MAX_LENGTH } from '../constants';
import { Priority } from '../types';

/* ===== Constants ===== */

const PRIORITIES: Priority[] = [Priority.High, Priority.Medium, Priority.Low];

const PRIORITY_LABELS: Record<Priority, string> = {
	[Priority.High]: 'High',
	[Priority.Low]: 'Low',
	[Priority.Medium]: 'Medium'
};

/* ===== Component ===== */
export function TaskInput() {
	/* ===== Store ===== */
	const addTask = useTaskStore((state) => state.addTask);
	const darkMode = useTaskStore((state) => state.darkMode);

	/* ===== State ===== */
	const [priority, setPriority] = useState<Priority>(Priority.Medium);
	const [text, setText] = useState('');

	/* ===== Derived Values ===== */
	const theme = darkMode ? darkTheme : lightTheme;
	const dynamicStyles = createDynamicStyles(theme);
	const charRatio = text.length / TASK_TEXT_MAX_LENGTH;
	const showCharCount = charRatio >= CHAR_COUNT.WARNING_THRESHOLD;
	const charCountColor = charRatio >= CHAR_COUNT.DANGER_THRESHOLD ? theme.danger : theme.textSecondary;

	/* ===== Functions ===== */
	function getPriorityColor(p: Priority): string {
		switch (p) {
			case Priority.High:
				return theme.priorityHigh;
			case Priority.Medium:
				return theme.priorityMedium;
			case Priority.Low:
				return theme.priorityLow;
		}
	}

	function handleAddTask() {
		const trimmed = text.trim();

		if (!trimmed) {
			return;
		}

		addTask(trimmed, priority);
		setText('');
		setPriority(Priority.Medium);
	}

	/* ===== Render ===== */
	return (
		<View style={dynamicStyles.container}>
			<TextInput
				maxLength={TASK_TEXT_MAX_LENGTH}
				onChangeText={setText}
				onSubmitEditing={handleAddTask}
				placeholder="What needs to be done?"
				placeholderTextColor={theme.textSecondary}
				returnKeyType="done"
				style={[dynamicStyles.input, { fontFamily: fonts.body }]}
				value={text}
			/>

			<Text style={[styles.charCount, { color: charCountColor, fontFamily: fonts.body, opacity: showCharCount ? 1 : 0 }]}>
				{text.length}/{TASK_TEXT_MAX_LENGTH}
			</Text>

			<View style={styles.priorityRow}>
				{PRIORITIES.map((p) => (
					<Pressable
						key={p}
						onPress={() => setPriority(p)}
						style={[styles.priorityButton, { backgroundColor: priority === p ? getPriorityColor(p) : theme.filterInactive }]}
					>
						<Text
							style={[styles.priorityButtonText, { color: priority === p ? '#FFFFFF' : theme.filterInactiveText, fontFamily: fonts.bodyMedium }]}
						>
							{PRIORITY_LABELS[p]}
						</Text>
					</Pressable>
				))}
			</View>

			<Pressable disabled={!text.trim()} onPress={handleAddTask} style={[dynamicStyles.addButton, !text.trim() && styles.addButtonDisabled]}>
				<Text style={[styles.addButtonText, { color: theme.primaryText, fontFamily: fonts.bodySemiBold }]}>Add Task</Text>
			</Pressable>
		</View>
	);
}

/* ===== Styles ===== */
function createDynamicStyles(theme: ThemeColors) {
	return StyleSheet.create({
		addButton: {
			alignItems: 'center',
			backgroundColor: theme.primary,
			borderRadius: 10,
			paddingVertical: 14
		},
		container: {
			backgroundColor: theme.surface,
			borderRadius: 12,
			boxShadow: `0 2px 8px ${theme.cardShadow}`,
			elevation: 2,
			marginBottom: 16,
			padding: 16
		},
		input: {
			backgroundColor: theme.inputBackground,
			borderColor: theme.border,
			borderRadius: 10,
			borderWidth: 1,
			color: theme.text,
			fontSize: 15,
			paddingHorizontal: 14,
			paddingVertical: 12
		}
	});
}

const styles = StyleSheet.create({
	addButtonDisabled: {
		opacity: 0.4
	},
	addButtonText: {
		fontSize: 15,
		letterSpacing: 0.3
	},
	charCount: {
		fontSize: CHAR_COUNT.FONT_SIZE,
		marginBottom: 4,
		marginTop: 2,
		textAlign: 'right'
	},
	priorityButton: {
		borderRadius: 8,
		flex: 1,
		paddingVertical: 8
	},
	priorityButtonText: {
		fontSize: 13,
		textAlign: 'center'
	},
	priorityRow: {
		flexDirection: 'row',
		gap: 8,
		marginBottom: 12
	}
});
