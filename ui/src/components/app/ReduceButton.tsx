import { ActionIcon } from "@mantine/core";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { flushSync } from "preact/compat";

/**
 * Button to change a isReduced state
 * @param props the props
 * @param props.isLeft whether the button should be ChevronsLeft or ChevronsRight
 * @param props.onClick the function to call when the button is clicked
 * @returns the button
 */
export const ReduceButton = ({ isLeft, onClick }: { isLeft: boolean; onClick: () => void }) => (
	<ActionIcon>
		{isLeft ? (
			<ChevronsLeft onClick={() => document.startViewTransition(() => flushSync(() => onClick()))} />
		) : (
			<ChevronsRight onClick={() => document.startViewTransition(() => flushSync(() => onClick()))} />
		)}
	</ActionIcon>
);
