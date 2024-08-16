import { transpile } from "typescript";
import { Result } from "../../Common/CommonModel";
import { selectedCodeSignal } from "../../context/GlobalState";
import indexRaw from "../../resources/indexRaw";
import introRaw from "../../resources/introRaw";
import { setConsoleType } from "../CodePart/CustomConsole";

const aliasStr = `var [faker, generate, getIdFn, getRandomElementFn, getRandomElementsFn, getRandomFloatFn, getRandomIntFn, randomBoolean, randomDate, randomFloat, randomInt, randomString, shuffle, unique_] = [
	faker2, generate3, getIdFn2, getRandomElementFn2, getRandomElementsFn2, getRandomFloatFn2, getRandomIntFn2, randomBoolean2, randomDate2, randomFloat2, randomInt2, randomString2, shuffle2, unique_2];`;

setConsoleType("custom");

/**
 * Execute the generation of the data.
 * @param bPreview if the generation is for a preview
 * @returns the generated data
 */
export const executeGenerate_ = async (bPreview: boolean): Promise<Result> => {
	let replacedCode = selectedCodeSignal.value.value.code.slice(introRaw.length);
	if (bPreview) replacedCode = replacedCode.replace(/generate/g, "generatePreview");
	const replacedIntro = `const getResult = async (): Promise<Result> => {${replacedCode}`;
	const transpiledCode = transpile(replacedIntro);

	const f = new Function(`var exports = {}; ${indexRaw} ${aliasStr} ${transpiledCode} return getResult();`);
	return await f();
};
