import { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useTaskStore } from '../store/useTaskStore';
import { useTheme } from '../hooks/useTheme';
import { fonts, type ThemeColors } from '../theme';
import { CAN_USE_NATIVE_DRIVER, CELEBRATION, PROGRESS } from '../constants';

/* ===== Constants ===== */
const A11Y = {
	PROGRESS_LABEL: 'Task completion'
} as const;

/* ===== Component ===== */
function TaskCounterComponent() {
	/* ===== Store ===== */
	const tasks = useTaskStore((state) => state.tasks);

	/* ===== Hooks ===== */
	const theme = useTheme();

	/* ===== Derived Values ===== */
	const completedCount = tasks.filter((task) => task.completed).length;
	const dynamicStyles = createDynamicStyles(theme);
	const totalCount = tasks.length;
	const isAllCompleted = totalCount > 0 && completedCount === totalCount;
	const progress = totalCount > 0 ? completedCount / totalCount : 0;

	/* ===== Refs ===== */
	const celebrationOpacityAnim = useRef(new Animated.Value(0)).current;
	const celebrationScaleAnim = useRef(new Animated.Value(1)).current;
	const prevCompletedRef = useRef(isAllCompleted);
	const progressAnim = useRef(new Animated.Value(progress)).current;

	/* ===== Effects ===== */
	useEffect(() => {
		Animated.timing(progressAnim, {
			duration: PROGRESS.ANIMATION_DURATION,
			toValue: progress,
			useNativeDriver: false
		}).start();
	}, [progress, progressAnim]);

	useEffect(() => {
		const justCompleted = isAllCompleted && !prevCompletedRef.current;

		prevCompletedRef.current = isAllCompleted;

		if (justCompleted) {
			Animated.parallel([
				Animated.sequence([
					Animated.timing(celebrationScaleAnim, {
						duration: CELEBRATION.DURATION / 2,
						toValue: CELEBRATION.SCALE,
						useNativeDriver: CAN_USE_NATIVE_DRIVER
					}),
					Animated.timing(celebrationScaleAnim, {
						duration: CELEBRATION.DURATION / 2,
						toValue: 1,
						useNativeDriver: CAN_USE_NATIVE_DRIVER
					})
				]),
				Animated.timing(celebrationOpacityAnim, {
					duration: CELEBRATION.DURATION,
					toValue: 1,
					useNativeDriver: CAN_USE_NATIVE_DRIVER
				})
			]).start();
		} else if (!isAllCompleted) {
			celebrationOpacityAnim.setValue(0);
		}
	}, [celebrationOpacityAnim, celebrationScaleAnim, isAllCompleted]);

	/* ===== Render ===== */
	if (totalCount === 0) {
		return null;
	}

	const progressBarWidth = progressAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['0%', '100%']
	});

	const percentText = `${Math.round(progress * 100)}%`;

	return (
		<Animated.View
			accessibilityLiveRegion="polite"
			accessibilityRole="summary"
			style={[dynamicStyles.container, { transform: [{ scale: celebrationScaleAnim }] }]}
		>
			<View style={styles.topRow}>
				{isAllCompleted ? (
					<Animated.Text style={[dynamicStyles.statusText, { opacity: celebrationOpacityAnim }]}>{'🎉 All tasks completed!'}</Animated.Text>
				) : (
					<Text style={dynamicStyles.statusText}>
						{completedCount} of {totalCount} tasks completed
					</Text>
				)}
			</View>

			<View
				accessibilityLabel={A11Y.PROGRESS_LABEL}
				accessibilityRole="progressbar"
				accessibilityValue={{ max: 100, min: 0, now: Math.round(progress * 100) }}
				style={styles.progressRow}
			>
				<View style={dynamicStyles.progressTrack}>
					<Animated.View style={[dynamicStyles.progressFill, { width: progressBarWidth }]} />
				</View>

				<Text importantForAccessibility="no" style={dynamicStyles.percentText}>
					{percentText}
				</Text>
			</View>
		</Animated.View>
	);
}

export const TaskCounter = memo(TaskCounterComponent);

/* ===== Styles ===== */
const styles = StyleSheet.create({
	progressRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 10
	},
	topRow: {
		marginBottom: 8
	}
});

function createDynamicStyles(theme: ThemeColors) {
	return StyleSheet.create({
		container: {
			backgroundColor: theme.surface,
			borderColor: theme.border,
			borderRadius: 12,
			borderWidth: 1,
			marginBottom: 16,
			paddingHorizontal: 16,
			paddingVertical: 12
		},
		percentText: {
			color: theme.textSecondary,
			fontFamily: fonts.bodyMedium,
			fontSize: 12,
			minWidth: 36,
			textAlign: 'right'
		},
		progressFill: {
			backgroundColor: theme.progressFill,
			borderRadius: PROGRESS.BAR_HEIGHT / 2,
			height: PROGRESS.BAR_HEIGHT
		},
		progressTrack: {
			backgroundColor: theme.progressBackground,
			borderRadius: PROGRESS.BAR_HEIGHT / 2,
			flex: 1,
			height: PROGRESS.BAR_HEIGHT,
			overflow: 'hidden'
		},
		statusText: {
			color: theme.text,
			fontFamily: fonts.bodySemiBold,
			fontSize: 14
		}
	});
}
