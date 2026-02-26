import { memo, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CHAR_COUNT, TASK_TEXT_MAX_LENGTH } from '../constants';
import { useTheme } from '../hooks/useTheme';
import { useTaskStore } from '../store/useTaskStore';
import { fonts, type ThemeColors } from '../theme';
import { Priority } from '../types';

/* ===== Constants ===== */
const A11Y = {
	ADD_HINT: 'Adds the task with the selected priority',
	ADD_LABEL: 'Add task',
	CLEAR_LABEL: 'Clear input',
	INPUT_LABEL: 'New task description'
} as const;

const CLEAR_BUTTON_MIN_LENGTH = 10;

const PRIORITIES: Priority[] = [Priority.High, Priority.Medium, Priority.Low];

const PRIORITY_LABELS: Record<Priority, string> = {
	[Priority.High]: 'High',
	[Priority.Low]: 'Low',
	[Priority.Medium]: 'Medium'
};

/* ===== Component ===== */
function TaskInputComponent() {
	/* ===== Store ===== */
	const addTask = useTaskStore((state) => state.addTask);

	/* ===== Hooks ===== */
	const theme = useTheme();

	/* ===== State ===== */
	const [priority, setPriority] = useState<Priority>(Priority.Medium);
	const [text, setText] = useState('');

	/* ===== Derived Values ===== */
	const dynamicStyles = createDynamicStyles(theme);
	const charRatio = text.length / TASK_TEXT_MAX_LENGTH;
	const showCharCount = charRatio >= CHAR_COUNT.WARNING_THRESHOLD;
	const charCountColor = charRatio >= CHAR_COUNT.DANGER_THRESHOLD ? theme.danger : theme.textSecondary;
	const showClearButton = text.length >= CLEAR_BUTTON_MIN_LENGTH;

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

	function handleClearText() {
		setText('');
	}

	function handleAddTask() {
		const trimmed = text.trim();

		if (!trimmed) {
			return;
		}

		addTask(trimmed, priority);
		setText('');
		setPriority(Priority.Medium);
		Keyboard.dismiss();
	}

	/* ===== Render ===== */
	return (
		<View style={dynamicStyles.container}>
			<View style={styles.inputWrapper}>
				<TextInput
					accessibilityLabel={A11Y.INPUT_LABEL}
					autoComplete="off"
					autoCorrect={false}
					maxLength={TASK_TEXT_MAX_LENGTH}
					onChangeText={setText}
					onSubmitEditing={handleAddTask}
					placeholder="What needs to be done?"
					placeholderTextColor={theme.textSecondary}
					returnKeyType="done"
					spellCheck={false}
					style={[dynamicStyles.input, showClearButton && styles.inputWithClear, { fontFamily: fonts.body }]}
					value={text}
				/>

				{showClearButton && (
					<Pressable
						accessibilityLabel={A11Y.CLEAR_LABEL}
						accessibilityRole="button"
						hitSlop={12}
						onPress={handleClearText}
						style={[styles.clearButton, { backgroundColor: theme.textSecondary }]}
					>
						<Text importantForAccessibility="no" style={[styles.clearButtonText, { color: theme.surface }]}>
							✕
						</Text>
					</Pressable>
				)}
			</View>

			<Text
				accessibilityLiveRegion="polite"
				style={[styles.charCount, { color: charCountColor, fontFamily: fonts.body, opacity: showCharCount ? 1 : 0 }]}
			>
				{text.length}/{TASK_TEXT_MAX_LENGTH}
			</Text>

			<View accessibilityRole="radiogroup" style={styles.priorityRow}>
				{PRIORITIES.map((p) => (
					<Pressable
						accessibilityLabel={`${PRIORITY_LABELS[p]} priority`}
						accessibilityRole="radio"
						accessibilityState={{ selected: priority === p }}
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

			<Pressable
				accessibilityHint={A11Y.ADD_HINT}
				accessibilityLabel={A11Y.ADD_LABEL}
				accessibilityRole="button"
				accessibilityState={{ disabled: !text.trim() }}
				disabled={!text.trim()}
				onPress={handleAddTask}
				style={[dynamicStyles.addButton, !text.trim() && styles.addButtonDisabled]}
			>
				<Text style={[styles.addButtonText, { color: theme.primaryText, fontFamily: fonts.bodySemiBold }]}>Add Task</Text>
			</Pressable>
		</View>
	);
}

export const TaskInput = memo(TaskInputComponent);

/* ===== Styles ===== */
function createDynamicStyles(theme: ThemeColors) {
	return StyleSheet.create({
		addButton: {
			alignItems: 'center',
			backgroundColor: theme.primary,
			borderRadius: 10,
			justifyContent: 'center',
			minHeight: 44,
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
	clearButton: {
		alignItems: 'center',
		borderRadius: 10,
		height: 20,
		justifyContent: 'center',
		position: 'absolute',
		right: 10,
		top: '50%',
		transform: [{ translateY: -10 }],
		width: 20
	},
	clearButtonText: {
		fontSize: 11,
		fontWeight: '700'
	},
	inputWithClear: {
		paddingRight: 36
	},
	inputWrapper: {
		position: 'relative'
	},
	priorityButton: {
		borderRadius: 8,
		flex: 1,
		justifyContent: 'center',
		minHeight: 44,
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
