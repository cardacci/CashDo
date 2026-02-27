import { Platform } from 'react-native';

export const API = {
	BASE_URL: Platform.select({
		android: 'http://10.0.2.2:3001',
		default: 'http://localhost:3001'
	}) as string,
	ENDPOINTS: {
		TASKS: '/tasks'
	},
	TIMEOUT: 5000
} as const;

export const API_ERROR_COOLDOWN = 60000;

export const API_ERROR = {
	BUTTON: 'Got it',
	MESSAGE: 'Your data is saved on this device. Changes will sync automatically when the connection is back.',
	TITLE: 'Working offline'
} as const;

export const CAN_USE_NATIVE_DRIVER = Platform.OS !== 'web';

export const CELEBRATION = {
	DURATION: 400,
	SCALE: 1.05
} as const;

export const CHAR_COUNT = {
	DANGER_THRESHOLD: 0.95,
	FONT_SIZE: 12,
	WARNING_THRESHOLD: 0.8
} as const;

export const IS_IOS = Platform.OS === 'ios';

export const KEYBOARD_SCROLL_DELAY = 300;

export const LAYOUT = {
	MAX_WIDTH: 600
} as const;

export const PRIORITY_FILTER_ALL = 'all';

export const PROGRESS = {
	ANIMATION_DURATION: 500,
	BAR_HEIGHT: 6
} as const;

export const STORAGE_ERROR = {
	BUTTON_CONTINUE: 'Continue',
	BUTTON_DISMISS: 'Dismiss',
	BUTTON_RETRY: 'Retry',
	MESSAGE_READ: 'There was a problem reading your saved data.',
	MESSAGE_WRITE: 'Your changes may not be saved. Please try again.',
	TITLE_READ: 'Could not load your data',
	TITLE_WRITE: 'Could not save your changes'
} as const;

export const TASK_LIST_REFRESH_DELAY = 500;

export const TASK_TEXT_MAX_LENGTH = 1000;

export const TOAST = {
	ANIMATION_DURATION: 300,
	AUTO_DISMISS_DURATION: 4000,
	BOTTOM_OFFSET: 32,
	MESSAGE_DELETED: 'Task deleted',
	TRANSLATE_Y_HIDDEN: 100,
	UNDO_LABEL: 'UNDO'
} as const;

export const UNKNOWN_ERROR_MESSAGE = 'Unknown error';
