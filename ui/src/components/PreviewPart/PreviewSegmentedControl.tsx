import { Input, SegmentedControl } from "@mantine/core";
import { DATA_PREVIEW_TYPES, DataPreviewType } from "../../Common/CommonModel";
import { globalState } from "../../context/GlobalState";

/**
 * The segmented control to select the data preview type
 * @returns The segmented control to select the data preview type
 */
export const PreviewSegmentedControl = () => (
	<div>
		<Input.Wrapper>
			<Input.Label>Preview</Input.Label>
		</Input.Wrapper>
		<SegmentedControl
			data={[...DATA_PREVIEW_TYPES]}
			value={globalState.dataPreviewType.value}
			onChange={(value) => (globalState.dataPreviewType.value = value as DataPreviewType)}
			color="green"
		/>
	</div>
);
