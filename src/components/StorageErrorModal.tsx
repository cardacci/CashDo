import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { API_ERROR, STORAGE_ERROR } from '../constants';
import { useTheme } from '../hooks/useTheme';
import { useErrorStore } from '../store/useErrorStore';
import { useTaskStore } from '../store/useTaskStore';
import { fonts, type ThemeColors } from '../theme';
import { StorageErrorType } from '../types';

/* ===== Types ===== */
type ButtonAction = 'dismiss' | 'retry';

type ButtonVariant = 'primary' | 'secondary';

interface ErrorButtonConfig {
	action: ButtonAction;
	label: string;
	variant: ButtonVariant;
}

interface ErrorConfig {
	buttons: ErrorButtonConfig[];
	message: string;
	title: string;
}

/* ===== Constants ===== */
const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.5)';
const ERROR_ICON = '⚠';
const ERROR_ICON_SIZE = 32;
const MODAL_BORDER_RADIUS = 16;
const MODAL_MAX_WIDTH = 340;
const MODAL_PADDING = 24;
const BUTTON_BORDER_RADIUS = 10;
const BUTTON_PADDING_HORIZONTAL = 20;
const BUTTON_PADDING_VERTICAL = 12;
const TITLE_FONT_SIZE = 18;
const MESSAGE_FONT_SIZE = 14;
const BUTTON_FONT_SIZE = 15;
const DETAIL_FONT_SIZE = 12;

const ERROR_CONFIG: Record<StorageErrorType, ErrorConfig> = {
	[StorageErrorType.Api]: {
		buttons: [{ action: 'dismiss', label: STORAGE_ERROR.BUTTON_DISMISS, variant: 'primary' }],
		message: API_ERROR.MESSAGE,
		title: API_ERROR.TITLE
	},
	[StorageErrorType.Rehydration]: {
		buttons: [
			{ action: 'retry', label: STORAGE_ERROR.BUTTON_RETRY, variant: 'primary' },
			{ action: 'dismiss', label: STORAGE_ERROR.BUTTON_CONTINUE, variant: 'secondary' }
		],
		message: STORAGE_ERROR.MESSAGE_READ,
		title: STORAGE_ERROR.TITLE_READ
	},
	[StorageErrorType.Write]: {
		buttons: [{ action: 'dismiss', label: STORAGE_ERROR.BUTTON_DISMISS, variant: 'primary' }],
		message: STORAGE_ERROR.MESSAGE_WRITE,
		title: STORAGE_ERROR.TITLE_WRITE
	}
};

/* ===== Component ===== */
export function StorageErrorModal() {
	/* ===== Store ===== */
	const clearStorageError = useErrorStore((state) => state.clearStorageError);
	const storageError = useErrorStore((state) => state.storageError);

	/* ===== Hooks ===== */
	const theme = useTheme();

	/* ===== Derived Values ===== */
	const dynamicStyles = createDynamicStyles(theme);
	const errorConfig = storageError ? ERROR_CONFIG[storageError.type] : null;

	/* ===== Functions ===== */
	function handleDismiss() {
		clearStorageError();
	}

	function handleRetry() {
		clearStorageError();
		useTaskStore.persist.rehydrate();
	}

	const actionHandlers: Record<ButtonAction, () => void> = {
		dismiss: handleDismiss,
		retry: handleRetry
	};

	/* ===== Render ===== */
	if (!storageError) {
		return null;
	}

	return (
		<Modal animationType="fade" transparent visible>
			<View style={styles.overlay}>
				<View style={dynamicStyles.modal}>
					<Text style={styles.errorIcon}>{ERROR_ICON}</Text>

					<Text style={[dynamicStyles.title, { fontFamily: fonts.headingSemiBold }]}>{errorConfig?.title}</Text>

					<Text style={[dynamicStyles.message, { fontFamily: fonts.body }]}>{errorConfig?.message}</Text>

					<Text style={[dynamicStyles.detail, { fontFamily: fonts.body }]}>{storageError.message}</Text>

					<View style={styles.buttonRow}>
						{errorConfig?.buttons.map((btn) => (
							<Pressable
								key={btn.label}
								onPress={actionHandlers[btn.action]}
								style={[styles.button, btn.variant === 'primary' ? { backgroundColor: theme.danger } : dynamicStyles.secondaryButton]}
							>
								<Text
									style={[
										styles.buttonText,
										{
											color: btn.variant === 'primary' ? theme.dangerText : theme.text,
											fontFamily: fonts.bodySemiBold
										}
									]}
								>
									{btn.label}
								</Text>
							</Pressable>
						))}
					</View>
				</View>
			</View>
		</Modal>
	);
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		borderRadius: BUTTON_BORDER_RADIUS,
		flex: 1,
		paddingHorizontal: BUTTON_PADDING_HORIZONTAL,
		paddingVertical: BUTTON_PADDING_VERTICAL
	},
	buttonRow: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 20
	},
	buttonText: {
		fontSize: BUTTON_FONT_SIZE
	},
	errorIcon: {
		fontSize: ERROR_ICON_SIZE,
		marginBottom: 12,
		textAlign: 'center'
	},
	overlay: {
		alignItems: 'center',
		backgroundColor: OVERLAY_COLOR,
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 24
	}
});

function createDynamicStyles(theme: ThemeColors) {
	return StyleSheet.create({
		detail: {
			color: theme.textSecondary,
			fontSize: DETAIL_FONT_SIZE,
			marginTop: 8,
			textAlign: 'center'
		},
		message: {
			color: theme.textSecondary,
			fontSize: MESSAGE_FONT_SIZE,
			lineHeight: 20,
			marginTop: 8,
			textAlign: 'center'
		},
		modal: {
			alignItems: 'center',
			backgroundColor: theme.surface,
			borderRadius: MODAL_BORDER_RADIUS,
			maxWidth: MODAL_MAX_WIDTH,
			padding: MODAL_PADDING,
			width: '100%'
		},
		secondaryButton: {
			backgroundColor: theme.filterInactive
		},
		title: {
			color: theme.text,
			fontSize: TITLE_FONT_SIZE,
			textAlign: 'center'
		}
	});
}
