import { transpile } from "typescript";
import { Result } from "../../Common/CommonModel";
import { selectedCodeSignal } from "../../context/GlobalState";
import indexRaw from "../../resources/index.js?raw"; // Note: index.js modified: export removed as well as __commonJS wrapper
import introRaw from "../../resources/intro?raw";
import { setConsoleType } from "../CodePart/CustomConsole";

setConsoleType("custom");

/**
 * Execute the generation of the data.
 * @param bPreview if the generation is for a preview
 * @returns the generated data
 */
export const executeGenerate_ = async (bPreview: boolean): Promise<Result> => {
	let replacedCode = selectedCodeSignal.value.value.code.slice(introRaw.length);
	const outroIndex = replacedCode.indexOf("// CALL ONLY GET RESULT BELOW");
	if (outroIndex !== -1) replacedCode = replacedCode.slice(0, outroIndex);
	if (bPreview) Object.assign(window, { process: { argv: ["--preview"] } });
	else Object.assign(window, { process: { argv: [] } });
	const replacedIntro = `const getResult = async (): Promise<Result> => {${replacedCode}`;
	const transpiledCode = transpile(replacedIntro);

	const f = new Function(`var exports = {}; ${indexRaw} ${transpiledCode} return getResult();`);
	return await f();
};

/**
 * Save a blob as a file with a filename.
 * @param blob blob to save
 * @param filename filename of the file
 */
export const saveAs = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
	a.remove();
};
