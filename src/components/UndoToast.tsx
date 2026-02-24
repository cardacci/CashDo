import { useCallback, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import {
	TOAST_ANIMATION_DURATION,
	TOAST_AUTO_DISMISS_DURATION,
	TOAST_BOTTOM_OFFSET,
	TOAST_MESSAGE_DELETED,
	TOAST_TRANSLATE_Y_HIDDEN,
	TOAST_UNDO_LABEL
} from '../constants';
import { useTaskStore } from '../store/useTaskStore';
import { useUndoStore } from '../store/useUndoStore';
import { darkTheme, fonts, lightTheme, type ThemeColors } from '../theme';

/* ===== Constants ===== */
const TOAST_HORIZONTAL_MARGIN = 16;
const TOAST_BORDER_RADIUS = 12;
const TOAST_PADDING_HORIZONTAL = 16;
const TOAST_PADDING_VERTICAL = 14;
const TOAST_FONT_SIZE = 14;
const TOAST_UNDO_LETTER_SPACING = 0.5;
const TOAST_UNDO_PADDING_HORIZONTAL = 8;
const TOAST_UNDO_PADDING_VERTICAL = 4;
const TOAST_SHADOW_OFFSET_HEIGHT = 2;
const TOAST_SHADOW_RADIUS = 8;
const TOAST_ELEVATION = 6;

/* ===== Component ===== */
export function UndoToast() {
	/* ===== Store ===== */
	const darkMode = useTaskStore((state) => state.darkMode);
	const restoreTask = useTaskStore((state) => state.restoreTask);
	const clearPendingDelete = useUndoStore((state) => state.clearPendingDelete);
	const pendingDelete = useUndoStore((state) => state.pendingDelete);

	/* ===== Refs ===== */
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const translateY = useRef(new Animated.Value(TOAST_TRANSLATE_Y_HIDDEN)).current;

	/* ===== Derived Values ===== */
	const theme = darkMode ? darkTheme : lightTheme;
	const dynamicStyles = createDynamicStyles(theme);

	/* ===== Callbacks ===== */
	const clearTimer = useCallback(() => {
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	const handleDismiss = useCallback(() => {
		clearTimer();

		Animated.timing(translateY, {
			duration: TOAST_ANIMATION_DURATION,
			toValue: TOAST_TRANSLATE_Y_HIDDEN,
			useNativeDriver: true
		}).start(() => {
			clearPendingDelete();
		});
	}, [clearTimer, clearPendingDelete, translateY]);

	const handleUndo = useCallback(() => {
		clearTimer();

		if (pendingDelete) {
			restoreTask(pendingDelete);
		}

		Animated.timing(translateY, {
			duration: TOAST_ANIMATION_DURATION,
			toValue: TOAST_TRANSLATE_Y_HIDDEN,
			useNativeDriver: true
		}).start(() => {
			clearPendingDelete();
		});
	}, [clearTimer, clearPendingDelete, pendingDelete, restoreTask, translateY]);

	/* ===== Effects ===== */
	useEffect(() => {
		if (pendingDelete) {
			Animated.timing(translateY, {
				duration: TOAST_ANIMATION_DURATION,
				toValue: 0,
				useNativeDriver: true
			}).start();

			clearTimer();
			timerRef.current = setTimeout(handleDismiss, TOAST_AUTO_DISMISS_DURATION);
		}

		return clearTimer;
	}, [clearTimer, handleDismiss, pendingDelete, translateY]);

	/* ===== Render ===== */
	if (!pendingDelete) {
		return null;
	}

	return (
		<Animated.View style={[dynamicStyles.container, { transform: [{ translateY }] }]}>
			<Text style={[dynamicStyles.message, { fontFamily: fonts.bodySemiBold }]}>{TOAST_MESSAGE_DELETED}</Text>

			<Pressable onPress={handleUndo} style={styles.undoButton}>
				<Text style={[dynamicStyles.undoText, { fontFamily: fonts.bodyBold }]}>{TOAST_UNDO_LABEL}</Text>
			</Pressable>
		</Animated.View>
	);
}

/* ===== Styles ===== */
function createDynamicStyles(theme: ThemeColors) {
	return StyleSheet.create({
		container: {
			alignItems: 'center',
			backgroundColor: theme.primary,
			borderRadius: TOAST_BORDER_RADIUS,
			bottom: TOAST_BOTTOM_OFFSET,
			elevation: TOAST_ELEVATION,
			flexDirection: 'row',
			justifyContent: 'space-between',
			left: TOAST_HORIZONTAL_MARGIN,
			paddingHorizontal: TOAST_PADDING_HORIZONTAL,
			paddingVertical: TOAST_PADDING_VERTICAL,
			position: 'absolute',
			right: TOAST_HORIZONTAL_MARGIN,
			shadowColor: theme.cardShadow,
			shadowOffset: { height: TOAST_SHADOW_OFFSET_HEIGHT, width: 0 },
			shadowOpacity: 1,
			shadowRadius: TOAST_SHADOW_RADIUS
		},
		message: {
			color: theme.primaryText,
			fontSize: TOAST_FONT_SIZE
		},
		undoText: {
			color: theme.danger,
			fontSize: TOAST_FONT_SIZE,
			letterSpacing: TOAST_UNDO_LETTER_SPACING
		}
	});
}

const styles = StyleSheet.create({
	undoButton: {
		paddingHorizontal: TOAST_UNDO_PADDING_HORIZONTAL,
		paddingVertical: TOAST_UNDO_PADDING_VERTICAL
	}
});
