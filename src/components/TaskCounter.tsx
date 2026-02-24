import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useTaskStore } from '../store/useTaskStore';
import { darkTheme, fonts, lightTheme, type ThemeColors } from '../theme';
import { CELEBRATION, PROGRESS } from '../constants';

/* ===== Component ===== */
export function TaskCounter() {
	/* ===== Store ===== */
	const darkMode = useTaskStore((state) => state.darkMode);
	const tasks = useTaskStore((state) => state.tasks);

	/* ===== Derived Values ===== */
	const completedCount = tasks.filter((task) => task.completed).length;
	const theme = darkMode ? darkTheme : lightTheme;
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
						useNativeDriver: true
					}),
					Animated.timing(celebrationScaleAnim, {
						duration: CELEBRATION.DURATION / 2,
						toValue: 1,
						useNativeDriver: true
					})
				]),
				Animated.timing(celebrationOpacityAnim, {
					duration: CELEBRATION.DURATION,
					toValue: 1,
					useNativeDriver: true
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
		<Animated.View style={[dynamicStyles.container, { transform: [{ scale: celebrationScaleAnim }] }]}>
			<View style={styles.topRow}>
				{isAllCompleted ? (
					<Animated.Text style={[dynamicStyles.statusText, { opacity: celebrationOpacityAnim }]}>{'🎉 All tasks completed!'}</Animated.Text>
				) : (
					<Text style={dynamicStyles.statusText}>
						{completedCount} of {totalCount} tasks completed
					</Text>
				)}
			</View>
			<View style={styles.progressRow}>
				<View style={dynamicStyles.progressTrack}>
					<Animated.View style={[dynamicStyles.progressFill, { width: progressBarWidth }]} />
				</View>
				<Text style={dynamicStyles.percentText}>{percentText}</Text>
			</View>
		</Animated.View>
	);
}

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
