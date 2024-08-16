import { ActionIcon, Paper } from "@mantine/core";
import { useOs } from "@mantine/hooks";
import { useSignal } from "@preact/signals";
import { ClipboardCopy, Pen, PenOff } from "lucide-react";
import type { editor } from "monaco-editor";
import type { MutableRefObject } from "preact/compat";
import toast from "react-hot-toast";
import { globalState, selectedCodeSignal } from "../../context/GlobalState";
import { MonacoEditor } from "../../libs/monaco/MonacoEditor";
import { Overlap, Vertical } from "../../utils/ComponentToolbox";
import { modeToMonacoTheme } from "../app/CustomDarkModeButton";
import { CodePartHeader } from "./CodePartHeader";
import { CustomConsole } from "./CustomConsole";

const copyCodeToClipboard = () => {
	navigator.clipboard.writeText(selectedCodeSignal.value.value.code);
	toast.success("Code copied to clipboard");
};

/**
 * The code part of the home page, contains the code header, the code editor and the console.
 * @param props the props
 * @param props.width the width of the code part
 * @param props.monacoEditor the monaco editor
 * @returns the code part
 */
export const CodePart = ({
	width,
	monacoEditor,
}: {
	width: string;
	monacoEditor: MutableRefObject<editor.IStandaloneCodeEditor | undefined>;
}) => {
	const os = useOs({ getValueInEffect: false });
	const isMobile = os === "android" || os === "ios";
	const isEditing = useSignal(!isMobile);

	const toggleEditing = () => {
		isEditing.value = !isEditing.value;
		monacoEditor.current?.updateOptions({ readOnly: !isEditing.value, domReadOnly: !isEditing.value });
		toast(isEditing.value ? "Editing enabled" : "Editing disabled");
	};

	return (
		<Vertical width={width} height={"100%"} padding={"0 16px"}>
			<CodePartHeader />
			<Overlap height={"100%"} flexGrow={1} style={{ position: "relative" }}>
				{isMobile && (
					<div>
						<ActionIcon style={{ position: "absolute", top: 60, right: "min(12%, 20px)", zIndex: 10 }}>
							{isEditing.value && <Pen onClick={toggleEditing} />}
							{!isEditing.value && <PenOff onClick={toggleEditing} />}
						</ActionIcon>
					</div>
				)}
				<div>
					<ActionIcon style={{ position: "absolute", top: 12, right: "min(12%, 20px)", zIndex: 10 }}>
						<ClipboardCopy onClick={copyCodeToClipboard} />
					</ActionIcon>
				</div>
				<Paper style={{ width: "100%", height: "100%" }} withBorder>
					<MonacoEditor
						editorRef={monacoEditor}
						automaticLayout
						language="typescript"
						theme={modeToMonacoTheme(globalState.colorScheme.value)}
						value={selectedCodeSignal.value.value.code}
						readOnly={!isEditing.value}
						domReadOnly={!isEditing.value}
					/>
				</Paper>
				<CustomConsole />
			</Overlap>
		</Vertical>
	);
};
