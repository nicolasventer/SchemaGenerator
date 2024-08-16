import { Modal } from "@mantine/core";
import { globalState } from "../../context/GlobalState";
import { Vertical } from "../../utils/ComponentToolbox";
import { PreviewContent } from "../PreviewPart/Preview";
import { PreviewGenerateButtons } from "../PreviewPart/PreviewPart";
import { PreviewSegmentedControl } from "../PreviewPart/PreviewSegmentedControl";

/**
 * Modal to preview the data, can be raw or as a table.
 * @returns
 */
export const PreviewModal = () => (
	<Modal
		title="Preview"
		onClose={() => (globalState.isPreviewModalOpened.value = false)}
		opened={globalState.isPreviewModalOpened.value}
		size="80%"
	>
		<Vertical gap={16}>
			<PreviewSegmentedControl />
			<PreviewContent />
			<PreviewGenerateButtons sticky />
		</Vertical>
	</Modal>
);
