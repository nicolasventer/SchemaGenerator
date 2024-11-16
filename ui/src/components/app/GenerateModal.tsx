import { Button, Checkbox, Modal, Table } from "@mantine/core";
import { signal, useComputed, useSignal } from "@preact/signals";
import JSZip from "jszip";
import { globalState } from "../../context/GlobalState";
import { Horizontal } from "../../utils/ComponentToolbox";
import { executeGenerate_ } from "./executeGenerate";

const isGenerateLoading = signal(false);

const dataToFile = (data: unknown[], name: string) => ({
	filename: `${name}.json`,
	type: "application/json",
	content: data.length <= 1000 ? JSON.stringify(data, null, "\t") : JSON.stringify(data),
});

const saveAs = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
	a.remove();
};

const executeGenerate = (selected: boolean[], bZip: boolean) => {
	isGenerateLoading.value = true;
	setTimeout(async () => {
		const result = await executeGenerate_(false);
		if (bZip) {
			const zip = new JSZip();
			for (let i = 0; i < result.length; i++) {
				if (!selected[i]) continue;
				const { filename, content } = dataToFile(result[i].data, result[i].name);
				zip.file(filename, content);
			}
			const content = await zip.generateAsync({ type: "blob" });
			saveAs(content, "data.zip");
		} else {
			for (let i = 0; i < result.length; i++) {
				if (!selected[i]) continue;
				const { filename, type, content } = dataToFile(result[i].data, result[i].name);
				saveAs(new Blob([content], { type }), filename);
			}
		}
		isGenerateLoading.value = false;
	}, 10);
};

/**
 * Modal to generate the data, display a table with the data that can be selected to download. The data can be downloaded as a zip or as separate files.
 * @returns The modal to generate the data
 */
export const GenerateModal = () => {
	const selected = useSignal<boolean[]>(globalState.result.value.map(() => true));
	const selectedCount = useComputed(() => selected.value.filter((value) => value).length);
	const notSelectedCount = useComputed(() => selected.value.length - selectedCount.value);
	const isIndeterminate = useComputed(() => selectedCount.value > 0 && notSelectedCount.value > 0);
	const bZip = useSignal(false);

	return (
		<Modal
			title="Generate"
			onClose={() => (globalState.isGenerateModalOpened.value = false)}
			opened={globalState.isGenerateModalOpened.value}
			size="md"
		>
			<Table striped highlightOnHover withColumnBorders>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>
							<Checkbox
								checked={selectedCount.value === selected.value.length}
								indeterminate={isIndeterminate.value}
								onChange={(ev) => (selected.value = selected.value.map(() => ev.currentTarget.checked))}
							/>
						</Table.Th>
						<Table.Th>
							<Horizontal justifyContent="space-between">
								<Button
									onClick={() => executeGenerate(selected.value, bZip.value)}
									disabled={selectedCount.value === 0}
									loading={isGenerateLoading.value}
								>
									Download selection
								</Button>
								<Checkbox
									label="zip"
									labelPosition="left"
									checked={bZip.value}
									onChange={(ev) => (bZip.value = ev.currentTarget.checked)}
								/>
							</Horizontal>
						</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{globalState.result.value.map((result, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<Table.Tr key={index}>
							<Table.Td>
								<Checkbox
									checked={selected.value[index]}
									onChange={(ev) =>
										(selected.value = selected.value.map((value, i) => (i === index ? ev.currentTarget.checked : value)))
									}
								/>
							</Table.Td>
							<Table.Td>{result.name}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</Modal>
	);
};
