import { Button } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { globalState, isHighOrHeaderDisplayed } from "../../context/GlobalState";
import { Horizontal, Vertical } from "../../utils/ComponentToolbox";
import { If } from "../../utils/MultiIf";
import { modeToMonacoTheme } from "../app/CustomDarkModeButton";
import { ReduceButton } from "../app/ReduceButton";
import { DarkModeButton } from "../DarkModeButton";
import { PreviewSegmentedControl } from "./PreviewSegmentedControl";

/**
 * Header of the PreviewPart, contains the dark mode and reduce buttons
 * @returns The header of the PreviewPart
 */
export const PreviewPartHeader = () => {
	const ref = useClickOutside(() => (globalState.isHeaderDisplayed.value = false));

	return (
		<If
			condition={isHighOrHeaderDisplayed.value}
			then={
				<Vertical gap={16}>
					<Horizontal ref={ref} justifyContent="space-between" height={36}>
						{!globalState.isAboveMd.value && (
							<ReduceButton
								isLeft={false}
								onClick={() => ((globalState.isCodePartReduced.value = false), (globalState.isPreviewPartReduced.value = true))}
							/>
						)}
						{globalState.isAboveMd.value && globalState.isCodePartReduced.value && (
							<ReduceButton isLeft={false} onClick={() => (globalState.isCodePartReduced.value = false)} />
						)}
						{globalState.isAboveMd.value && !globalState.isCodePartReduced.value && (
							<ReduceButton isLeft={true} onClick={() => (globalState.isCodePartReduced.value = true)} />
						)}
						<DarkModeButton
							useTransition
							onClick={(mode) => globalState.monacoEditor.value?.updateOptions({ theme: modeToMonacoTheme(mode) })}
						/>
					</Horizontal>
					<PreviewSegmentedControl />
				</Vertical>
			}
			else={
				<div>
					<Button onClick={() => (globalState.isHeaderDisplayed.value = true)} size="xs" fullWidth>
						Show Header
					</Button>
				</div>
			}
		/>
	);
};
