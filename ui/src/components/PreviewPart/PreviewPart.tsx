import { Button, Kbd, Tooltip } from "@mantine/core";
import { computed, signal } from "@preact/signals";
import toast from "react-hot-toast";
import { globalState } from "../../context/GlobalState";
import { Horizontal, Vertical } from "../../utils/ComponentToolbox";
import { executeGenerate_ } from "../app/executeGenerate";
import { PreviewContent } from "./Preview";
import { PreviewPartHeader } from "./PreviewPartHeader";

const isPreviewLoading = signal(false);

const executePreview = () => {
	isPreviewLoading.value = true;
	return new Promise<boolean>((resolve) =>
		setTimeout(async () => {
			try {
				const result = await executeGenerate_(true);
				globalState.result.value = result;
				isPreviewLoading.value = false;
				globalState.isPreviewGenerated.value = true;
				toast.success("Preview generated");
				resolve(true);
			} catch (error) {
				toast.error("Failed to generate preview");
				console.error(error);
				isPreviewLoading.value = false;
				resolve(false);
			}
		}, 100)
	);
};

/**
 * Check if the preview part is displayed (i.e the code part is reduced or the preview part is not reduced and the screen is above md).
 */
export const isPreviewPartDisplayed = computed(
	() => globalState.isCodePartReduced.value || (!globalState.isPreviewPartReduced.value && globalState.isAboveMd.value)
);

/**
 * Execute the preview and open the preview modal if successful.
 * @returns
 */
export const openPreviewAfterPreview = async () =>
	(await executePreview()) && !isPreviewPartDisplayed.value && (globalState.isPreviewModalOpened.value = true);
/**
 * Execute the preview and open the generate modal if successful.
 * @returns
 */
export const openGenerateAfterPreview = async () =>
	(globalState.isPreviewGenerated.value || (await executePreview())) && (globalState.isGenerateModalOpened.value = true);

const Ctrl_S_Label = (
	<>
		<Kbd>Ctrl</Kbd> + <Kbd>S</Kbd> (in editor)
	</>
);

const Ctrl_Maj_S_Label = (
	<>
		<Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>S</Kbd> (in editor)
	</>
);

/**
 * Buttons to preview and generate the data.
 * @returns the buttons to preview and generate the data
 */
export const PreviewGenerateButtons = ({ sticky }: { sticky?: boolean }) => (
	<div style={{ position: sticky ? "sticky" : undefined, bottom: 0 }}>
		<Horizontal gap={16}>
			<Tooltip label={Ctrl_S_Label} withArrow position="bottom" bg="dark" c="white">
				<Button fullWidth size="compact-md" loading={isPreviewLoading.value} onClick={executePreview}>
					Preview
				</Button>
			</Tooltip>
			<Tooltip label={Ctrl_Maj_S_Label} withArrow position="bottom" bg="dark" c="white">
				<Button fullWidth size="compact-md" onClick={openGenerateAfterPreview}>
					Generate
				</Button>
			</Tooltip>
		</Horizontal>
	</div>
);

/**
 * The preview part of the home page, contains the preview header, the preview segmented control, the preview and the preview actions.
 * @param props the props
 * @param props.width the width of the preview part
 * @returns the preview part
 */
export const PreviewPart = ({ width }: { width: string }) => (
	<Vertical width={width} height={"100%"} padding={"0 16px"} gap={8}>
		<PreviewPartHeader />
		<PreviewContent />
		<PreviewGenerateButtons />
	</Vertical>
);
