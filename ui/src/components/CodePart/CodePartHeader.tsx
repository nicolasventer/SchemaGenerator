import { ActionIcon, Button, Select, Tabs } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { Download, SquarePlus } from "lucide-react";
import { createCodeFn, defaultCode, globalState, isHighOrHeaderDisplayed } from "../../context/GlobalState";
import driverCarRaw from "../../resources/samples/driverCarRaw";
import userTeamRaw from "../../resources/samples/userTeamRaw";
import { TodoFn } from "../../utils/commonUtils";
import { Horizontal, Vertical } from "../../utils/ComponentToolbox";
import { If } from "../../utils/MultiIf";
import { CustomDarkModeButton } from "../app/CustomDarkModeButton";
import { GithubButton } from "../app/GithubButton";
import { ReduceButton } from "../app/ReduceButton";
import { CodeTab } from "./CodeTab";

const samples = [
	{
		name: "User Team",
		data: userTeamRaw,
	},
	{
		name: "Driver Car",
		data: driverCarRaw,
	},
] as const;
const sampleNames = samples.map((s) => s.name);
const selectSample = (name: string | null) => {
	const sample = samples.find((s) => s.name === name);
	if (!sample) throw new Error("Sample not found");
	createCodeFn({ fileName: name ?? "", code: sample.data })();
};

/**
 * Header of the CodePart, contains the Select sample and Import data button, the dark mode and reduce buttons and the code tabs with the download button
 * @returns The header of the CodePart
 */
export const CodePartHeader = () => {
	const ref = useClickOutside(() => (globalState.isHeaderDisplayed.value = false));

	return (
		<If
			condition={isHighOrHeaderDisplayed.value}
			then={
				<Vertical ref={ref} gap={16}>
					<Horizontal justifyContent="space-between">
						<Horizontal gap={16}>
							<Select data={sampleNames} placeholder="Select sample" value={null} onChange={selectSample} />
							<Button onClick={TodoFn("Import data")}>Import data</Button>
						</Horizontal>
						{!globalState.isAboveMd.value && (
							<Horizontal gap={16}>
								<GithubButton />
								<CustomDarkModeButton />
								<ReduceButton
									isLeft={true}
									onClick={() => ((globalState.isCodePartReduced.value = true), (globalState.isPreviewPartReduced.value = false))}
								/>
							</Horizontal>
						)}
						{globalState.isAboveMd.value && globalState.isPreviewPartReduced.value && (
							<Horizontal gap={16}>
								<GithubButton />
								<CustomDarkModeButton />
								<ReduceButton isLeft={true} onClick={() => (globalState.isPreviewPartReduced.value = false)} />
							</Horizontal>
						)}
						{globalState.isAboveMd.value && !globalState.isPreviewPartReduced.value && (
							<ReduceButton isLeft={false} onClick={() => (globalState.isPreviewPartReduced.value = true)} />
						)}
					</Horizontal>
					<Horizontal gap={16} justifyContent="space-between">
						<Tabs variant="outline" value={globalState.currentCodeIndex.value.toString()} style={{ height: "100%" }}>
							<Tabs.List>
								{globalState.codeList.value.map((code, index) => (
									// eslint-disable-next-line react/no-array-index-key
									<CodeTab key={index} code={code} index={index} />
								))}
								<ActionIcon style={{ margin: "auto 10px" }}>
									<SquarePlus onClick={createCodeFn(defaultCode)} />
								</ActionIcon>
							</Tabs.List>
						</Tabs>
						<ActionIcon>
							<Download onClick={TodoFn("Download Project")} />
						</ActionIcon>
					</Horizontal>
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
