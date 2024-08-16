import { editor } from "monaco-editor";
import {
	forwardRef,
	useId,
	useRef,
	type ComponentPropsWithoutRef,
	type ForwardedRef,
	type MutableRefObject,
} from "preact/compat";
import { useMount } from "../../hooks/useMount";

/** The props for the MonacoEditor component */
export type MonacoEditorProps = {
	/** The element ID */
	elementId: string;
	/** The editor reference */
	editorRef?: MutableRefObject<editor.IStandaloneCodeEditor | undefined>;
} & editor.IStandaloneEditorConstructionOptions;

/** The monaco editor hook to get the editor reference */
export const useMonacoEditor = () => useRef<editor.IStandaloneCodeEditor>();

const PrivateMonacoEditor = ({ elementId, editorRef, ...options }: MonacoEditorProps) => {
	useMount(() => {
		const element = document.getElementById(elementId);
		if (!element) return;
		const editorInstance = editor.create(element, { ...options });
		if (editorRef) editorRef.current = editorInstance;
	});
	return <></>;
};

/** The MonacoEditor component */
export const MonacoEditor = forwardRef(
	(
		{ divProps, ...monacoProps }: Omit<MonacoEditorProps, "elementId"> & { divProps?: ComponentPropsWithoutRef<"div"> },
		ref: ForwardedRef<HTMLDivElement>
	) => {
		const id = useId();
		const divProps2 = divProps ?? { style: {} };
		const { style, ...rest } = divProps2;
		const styleObj = typeof style === "string" ? {} : style;

		return (
			<div ref={ref} id={id} style={{ width: "100%", height: "100%", ...styleObj }} {...rest}>
				<PrivateMonacoEditor elementId={id} {...monacoProps} />
			</div>
		);
	}
);
