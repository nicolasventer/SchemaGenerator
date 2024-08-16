import { checkEnumObj } from "./CommonUtils";

/** Color scheme values */
export const COLOR_SCHEMES = ["light", "dark"] as const;
/**
 * Color scheme object
 * @enum
 * @property light - Light color scheme
 * @property dark - Dark color scheme
 */
export const COLOR_SCHEMES_OBJ = {
	/** Light color scheme */
	light: "light",
	/** Dark color scheme */
	dark: "dark",
} as const;
/** Color scheme type */
export type ColorSchemeType = (typeof COLOR_SCHEMES)[number];
checkEnumObj<ColorSchemeType>(COLOR_SCHEMES_OBJ);

/** Data preview types */
export const DATA_PREVIEW_TYPES = ["raw", "table"] as const;
/**
 * Data preview type object
 * @enum
 */
export const DATA_PREVIEW_TYPES_OBJ = {
	/** Raw data preview type */
	raw: "raw",
	/** Table data preview type */
	table: "table",
} as const;
/** Data preview type */
export type DataPreviewType = (typeof DATA_PREVIEW_TYPES)[number];
checkEnumObj<DataPreviewType>(DATA_PREVIEW_TYPES_OBJ);

/** Result type */
export type Result = {
	/** The name of the generated data */
	name: string;
	/** The generated data */
	data: unknown[];
}[];

/** Code type */
export type Code = {
	/** The name of the file */
	fileName: string;
	/** The code */
	code: string;
};

/** Log types */
export const LOG_TYPES = ["log", "info", "warn", "error"] as const;
/**
 * Log type object
 * @enum
 */
export const LOG_TYPES_OBJ = {
	/** Log log type */
	log: "log",
	/** Info log type */
	info: "info",
	/** Warn log type */
	warn: "warn",
	/** Error log type */
	error: "error",
} as const;
/** Log type */
export type LogType = (typeof LOG_TYPES)[number];
checkEnumObj<LogType>(LOG_TYPES_OBJ);

/** Log type */
export type Log = {
	/** The type of the message */
	type: LogType;
	/** The time of the message (format: HH:mm:ss.SSS) */
	time: string;
	/** The message */
	message: string;
};
