import { ActionIcon, Input, Tabs } from "@mantine/core";
import { batch, signal, Signal } from "@preact/signals";
import { Trash2 } from "lucide-react";
import { TargetedEvent } from "preact/compat";
import toast from "react-hot-toast";
import { Code } from "../../Common/CommonModel";
import { defaultCode, globalState, selectedCodeSignal } from "../../context/GlobalState";
import { Horizontal } from "../../utils/ComponentToolbox";

const setSelectedCodeFn = (index: number) => () => {
	globalState.currentCodeIndex.value = index;
	globalState.monacoEditor.value?.setValue(selectedCodeSignal.value.value.code);
};

const deleteCodeFn = (index: number) => () =>
	batch(() => {
		if (globalState.codeList.value.length === 1) {
			globalState.codeList.value = [signal({ ...defaultCode })];
			toast("Last code deleted, new code created");
		} else {
			if (globalState.currentCodeIndex.value == globalState.codeList.value.length - 1) globalState.currentCodeIndex.value--;
			globalState.codeList.value = globalState.codeList.value.filter((_, i) => i !== index);
		}
	});

/**
 * The tab of a code, contains the name of the file as input and a delete button
 * @param props the props
 * @param props.code the code
 * @param props.index the index of the code
 * @returns
 */
export const CodeTab = ({ code, index }: { code: Signal<Code>; index: number }) => (
	<Tabs.Tab value={index.toString()} onClick={setSelectedCodeFn(index)}>
		<Horizontal gap={16}>
			<Input
				value={code.value.fileName}
				onChange={(ev: TargetedEvent<HTMLInputElement>) =>
					(code.value = { fileName: ev.currentTarget.value, code: code.value.code })
				}
			/>
			<ActionIcon>
				<Trash2 onClick={(ev) => (ev.stopPropagation(), deleteCodeFn(index)())} />
			</ActionIcon>
		</Horizontal>
	</Tabs.Tab>
);
