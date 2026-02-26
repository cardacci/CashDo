import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { API_ERROR, STORAGE_ERROR } from '../constants';
import { useTheme } from '../hooks/useTheme';
import { useErrorStore } from '../store/useErrorStore';
import { useTaskStore } from '../store/useTaskStore';
import { fonts, type ThemeColors } from '../theme';
import { StorageErrorType } from '../types';

/* ===== Types ===== */
type ButtonAction = 'dismiss' | 'retry';

type ButtonVariant = 'brand' | 'danger' | 'secondary';

interface ErrorButtonConfig {
	action: ButtonAction;
	label: string;
	variant: ButtonVariant;
}

interface ErrorConfig {
	buttons: ErrorButtonConfig[]; // Array to support multiple buttons (e.g., retry + dismiss)
	icon: string;
	message: string;
	showDetail: boolean;
	title: string;
}

/* ===== Constants ===== */
const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.5)';
const ICON_SIZE = 32;
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
		buttons: [{ action: 'dismiss', label: API_ERROR.BUTTON, variant: 'brand' }],
		icon: '☁️',
		message: API_ERROR.MESSAGE,
		showDetail: false,
		title: API_ERROR.TITLE
	},
	[StorageErrorType.Rehydration]: {
		buttons: [
			{ action: 'retry', label: STORAGE_ERROR.BUTTON_RETRY, variant: 'danger' },
			{ action: 'dismiss', label: STORAGE_ERROR.BUTTON_CONTINUE, variant: 'secondary' }
		],
		icon: '⚠',
		message: STORAGE_ERROR.MESSAGE_READ,
		showDetail: true,
		title: STORAGE_ERROR.TITLE_READ
	},
	[StorageErrorType.Write]: {
		buttons: [{ action: 'dismiss', label: STORAGE_ERROR.BUTTON_DISMISS, variant: 'danger' }],
		icon: '⚠',
		message: STORAGE_ERROR.MESSAGE_WRITE,
		showDetail: true,
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

	const buttonVariantStyle: Record<ButtonVariant, object> = {
		brand: dynamicStyles.brandButton,
		danger: dynamicStyles.dangerButton,
		secondary: dynamicStyles.secondaryButton
	};

	const buttonVariantTextColor: Record<ButtonVariant, string> = {
		brand: theme.primaryText,
		danger: theme.dangerText,
		secondary: theme.text
	};

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
				<View accessibilityViewIsModal style={dynamicStyles.modal}>
					<Text importantForAccessibility="no" style={styles.icon}>
						{errorConfig?.icon}
					</Text>

					<Text accessibilityRole="header" style={[dynamicStyles.title, { fontFamily: fonts.headingSemiBold }]}>
						{errorConfig?.title}
					</Text>

					<Text style={[dynamicStyles.message, { fontFamily: fonts.body }]}>{errorConfig?.message}</Text>

					{errorConfig?.showDetail && <Text style={[dynamicStyles.detail, { fontFamily: fonts.body }]}>{storageError.message}</Text>}

					<View style={styles.buttonRow}>
						{errorConfig?.buttons.map((btn) => (
							<Pressable
								accessibilityLabel={btn.label}
								accessibilityRole="button"
								key={btn.label}
								onPress={actionHandlers[btn.action]}
								style={[styles.button, buttonVariantStyle[btn.variant]]}
							>
								<Text
									style={[
										styles.buttonText,
										{
											color: buttonVariantTextColor[btn.variant],
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
		justifyContent: 'center',
		minHeight: 44,
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
	icon: {
		fontSize: ICON_SIZE,
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
		brandButton: {
			backgroundColor: theme.primary
		},
		dangerButton: {
			backgroundColor: theme.danger
		},
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
