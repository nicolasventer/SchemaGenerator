import { batch, computed, effect, signal, Signal } from "@preact/signals";
import type { editor } from "monaco-editor";
import { Code, ColorSchemeType, DataPreviewType, Log, Result } from "../Common/CommonModel";
import demoRaw from "../resources/demoRaw";
import { SignalToValue } from "../utils/signalUtils";

/** The type of the global state of the application. */
export type GlobalState = {
	/** the color scheme of the application */
	colorScheme: Signal<ColorSchemeType>;
	/** if the screen is above md */
	isAboveMd: Signal<boolean>;
	/** if the screen is below xxs */
	isBelowXxs: Signal<boolean>;
	/** the size of the viewport */
	viewportSize: Signal<{
		/** the height of the viewport */
		height: number;
		/** the width of the viewport */
		width: number;
	}>;
	/** the list of codes */
	codeList: Signal<Signal<Code>[]>;
	/** the index of the current code */
	currentCodeIndex: Signal<number>;
	/** the type of the data preview */
	dataPreviewType: Signal<DataPreviewType>;
	/** the result of the generation */
	result: Signal<Result>;
	/** if the code part is reduced */
	isCodePartReduced: Signal<boolean>;
	/** if the preview part is reduced */
	isPreviewPartReduced: Signal<boolean>;
	/** if the console is displayed */
	isConsoleDisplayed: Signal<boolean>;
	/** the height of the console */
	consoleHeight: Signal<number>;
	/** the monaco editor */
	monacoEditor: Signal<editor.IStandaloneCodeEditor | undefined>;
	/** the list of logs */
	logList: Signal<Log[]>;
	/** the number of logs to see */
	logToSeeCount: Signal<number>;
	/** if the header is displayed */
	isHeaderDisplayed: Signal<boolean>;
	/** if the preview is generated */
	isPreviewGenerated: Signal<boolean>;
	/** if the preview modal is opened */
	isPreviewModalOpened: Signal<boolean>;
	/** if the generate modal is opened */
	isGenerateModalOpened: Signal<boolean>;
};

type LocalStorageState = SignalToValue<
	Pick<
		GlobalState,
		| "colorScheme"
		| "codeList"
		| "currentCodeIndex"
		| "dataPreviewType"
		| "result"
		| "isCodePartReduced"
		| "isPreviewPartReduced"
		| "isConsoleDisplayed"
		| "consoleHeight"
	>
>;

/** The default code. */
export const defaultCode = { fileName: "New file", code: demoRaw };

const loadGlobalState = (): GlobalState => {
	const storedGlobalState = JSON.parse(localStorage.getItem("globalState") ?? "{}") as Partial<SignalToValue<LocalStorageState>>;

	return {
		colorScheme: signal(storedGlobalState.colorScheme ?? "dark"),
		isAboveMd: signal(false),
		isBelowXxs: signal(false),
		viewportSize: signal({ height: 0, width: 0 }),
		codeList: signal((storedGlobalState.codeList ?? [{ ...defaultCode }]).map((c) => signal(c))),
		currentCodeIndex: signal(storedGlobalState.currentCodeIndex ?? 0),
		dataPreviewType: signal<DataPreviewType>(storedGlobalState.dataPreviewType ?? "raw"),
		result: signal<Result>(storedGlobalState.result ?? []),
		isCodePartReduced: signal(storedGlobalState.isCodePartReduced ?? false),
		isPreviewPartReduced: signal(storedGlobalState.isPreviewPartReduced ?? false),
		isConsoleDisplayed: signal(storedGlobalState.isConsoleDisplayed ?? false),
		consoleHeight: signal(storedGlobalState.consoleHeight ?? 300),
		monacoEditor: signal(undefined),
		logList: signal([]),
		logToSeeCount: signal(0),
		isHeaderDisplayed: signal(true),
		isPreviewGenerated: signal(false),
		isPreviewModalOpened: signal(false),
		isGenerateModalOpened: signal(false),
	};
};

/** The global state of the application. */
export const globalState: GlobalState = loadGlobalState();

const localStorageState = computed(
	(): LocalStorageState => ({
		colorScheme: globalState.colorScheme.value,
		codeList: globalState.codeList.value.map((c) => c.value),
		currentCodeIndex: globalState.currentCodeIndex.value,
		dataPreviewType: globalState.dataPreviewType.value,
		result: globalState.result.value,
		isCodePartReduced: globalState.isCodePartReduced.value,
		isPreviewPartReduced: globalState.isPreviewPartReduced.value,
		isConsoleDisplayed: globalState.isConsoleDisplayed.value,
		consoleHeight: globalState.consoleHeight.value,
	})
);

/** "md" if the screen is above md, "sm" otherwise. */
export const smMd = computed(() => (globalState.isAboveMd.value ? "md" : "sm"));
/** "sm" if the screen is above md, "xs" otherwise. */
export const xsSm = computed(() => (globalState.isAboveMd.value ? "sm" : "xs"));
/** "compact-md" if the screen is above md, "compact-sm" otherwise. */
export const compactXsSm = computed(() => `compact-${xsSm.value}`);

effect(() => localStorage.setItem("globalState", JSON.stringify(localStorageState.value)));

effect(() => void document.body.classList.toggle("dark", globalState.colorScheme.value === "dark"));

/**
 * Create a new code.
 * @param newCode the new code
 * @returns
 */
export const createCodeFn = (newCode: Code) => () =>
	batch(() => {
		globalState.codeList.value = [...globalState.codeList.value, signal(newCode)];
		globalState.currentCodeIndex.value = globalState.codeList.value.length - 1;
	});

/** The selected code signal. */
export const selectedCodeSignal = computed(() => globalState.codeList.value[globalState.currentCodeIndex.value]);

/** If the header is displayed or the viewport height is above 440. */
export const isHighOrHeaderDisplayed = computed(
	() => globalState.isHeaderDisplayed.value || globalState.viewportSize.value.height > 440
);
