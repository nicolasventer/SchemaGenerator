import { transpile } from "typescript";
import { Result } from "../../Common/CommonModel";
import { selectedCodeSignal } from "../../context/GlobalState";
import indexRaw from "../../resources/indexRaw"; // Note: index.js modified: export removed as well as __commonJS wrapper
import introRaw from "../../resources/introRaw";
import { setConsoleType } from "../CodePart/CustomConsole";

setConsoleType("custom");

/**
 * Execute the generation of the data.
 * @param bPreview if the generation is for a preview
 * @returns the generated data
 */
export const executeGenerate_ = async (bPreview: boolean): Promise<Result> => {
	let replacedCode = selectedCodeSignal.value.value.code.slice(introRaw.length);
	if (bPreview) Object.assign(window, { process: { argv: ["--preview"] } });
	else Object.assign(window, { process: { argv: [] } });
	const replacedIntro = `const getResult = async (): Promise<Result> => {${replacedCode}`;
	const transpiledCode = transpile(replacedIntro);

	const f = new Function(`var exports = {}; ${indexRaw} ${transpiledCode} return getResult();`);
	return await f();
};
