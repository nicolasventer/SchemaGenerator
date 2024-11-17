import { computed, effect } from "@preact/signals";
import { KeyCode, KeyMod } from "monaco-editor";
import { useEffect } from "preact/hooks";
import toast from "react-hot-toast";
import { GenerateModal } from "../components/app/GenerateModal";
import { PreviewModal } from "../components/app/PreviewModal";
import { CodePart } from "../components/CodePart/CodePart";
import {
	isPreviewPartDisplayed,
	openGenerateAfterPreview,
	openPreviewAfterPreview,
	PreviewPart,
} from "../components/PreviewPart/PreviewPart";
import { globalState, selectedCodeSignal } from "../context/GlobalState";
import { useMonacoEditor } from "../libs/monaco/MonacoEditor";
import introRaw from "../resources/intro?raw";
import { FullViewport, Horizontal } from "../utils/ComponentToolbox";

const isBothPartDisplayed = computed(
	() => !globalState.isCodePartReduced.value && !globalState.isPreviewPartReduced.value && globalState.isAboveMd.value
);

const partWidth = computed(() => (isBothPartDisplayed.value ? "50%" : "100%"));

const onCodeChange = () => {
	const monacoCurrentCode = globalState.monacoEditor.value?.getValue() ?? "";
	if (!monacoCurrentCode.startsWith(introRaw)) {
		// if the code doesn't start with the intro code
		const index = monacoCurrentCode.indexOf("// DO NOT CHANGE TEXT ABOVE");
		if (index !== -1) {
			// if the "DO NOT CHANGE TEXT ABOVE" is found
			globalState.monacoEditor.value?.setValue(introRaw + monacoCurrentCode.slice(index + "// DO NOT CHANGE TEXT ABOVE".length));
			toast("The text above has been reset", { icon: "ℹ️" });
			return;
		}
		globalState.monacoEditor.value?.setValue(introRaw + monacoCurrentCode);
		toast("The text above has been reset", { icon: "ℹ️" });
		return;
	}
	selectedCodeSignal.value.value = {
		fileName: selectedCodeSignal.value.value.fileName,
		code: globalState.monacoEditor.value?.getValue() ?? "",
	};
	globalState.isPreviewGenerated.value = false;
};

/**
 * Home page
 * @returns the home page
 */
export const HomePage = () => {
	const monacoEditor = useMonacoEditor();
	useEffect(() => {
		void (globalState.monacoEditor.value = monacoEditor.current);
		if (!monacoEditor.current) return;
		monacoEditor.current.onDidChangeModelContent(onCodeChange);
		monacoEditor.current.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, openPreviewAfterPreview);
		monacoEditor.current.addCommand(KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyS, openGenerateAfterPreview);
	}, [monacoEditor]);

	effect(() => {
		if (selectedCodeSignal.value.value.code === monacoEditor.current?.getValue()) return;
		monacoEditor.current?.setValue(selectedCodeSignal.value.value.code);
	});

	return (
		<FullViewport>
			<Horizontal height={"100%"} padding={16}>
				{!globalState.isCodePartReduced.value && <CodePart width={partWidth.value} monacoEditor={monacoEditor} />}
				{isPreviewPartDisplayed.value && <PreviewPart width={partWidth.value} />}
			</Horizontal>
			<PreviewModal />
			<GenerateModal />
		</FullViewport>
	);
};
