import { globalState } from "../../context/GlobalState";
import { DarkModeButton } from "../DarkModeButton";

/**
 * Get the monaco theme from the mode
 * @param mode the mode
 * @returns the monaco theme
 */
export const modeToMonacoTheme = (mode: "light" | "dark") => (mode === "light" ? "custom-light" : "vs-dark");

/**
 * Dark mode button that also updates the monaco editor theme
 * @returns the dark mode button
 */
export const CustomDarkModeButton = () => (
	<DarkModeButton
		useTransition
		onClick={(mode) => globalState.monacoEditor.value?.updateOptions({ theme: modeToMonacoTheme(mode) })}
	/>
);
