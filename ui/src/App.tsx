import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { editor, languages } from "monaco-editor";
import { useEffect } from "preact/hooks";
import { Toaster } from "react-hot-toast";
import { clientEnv } from "./clientEnv";
import { globalState } from "./context/GlobalState";
import { initMonaco } from "./libs/monaco/initMonaco";
import { HomePage } from "./pages/exports_";
import type { HomePage as _HomePage } from "./pages/Home";
import dayJsRaw from "./resources/dayJsRaw";
import fakerjsRaw from "./resources/fakerjsRaw";
import SchemaGeneratorUtilsRaw from "./resources/SchemaGeneratorUtilsRaw";
import "./style.css";
import { WriteToolboxClasses } from "./utils/ComponentToolbox";

const theme = createTheme({ primaryColor: "green", white: "#e9ecef" }); // TODO: disable white ?

initMonaco();

languages.typescript.typescriptDefaults.addExtraLib(`declare module '@faker-js/faker' { ${fakerjsRaw} }`);
languages.typescript.typescriptDefaults.addExtraLib(`declare module 'dayjs' { ${dayJsRaw} }`);
languages.typescript.typescriptDefaults.addExtraLib(`declare module 'schema-generator-utils' { ${SchemaGeneratorUtilsRaw} }`);

// many themes here: https://editor.bitwiser.in/
editor.defineTheme("custom-light", {
	base: "vs",
	inherit: true,
	rules: [],
	colors: { "editor.background": "#e9ecef" },
});

/**
 * Renders all pages of the application based on the URL. All pages are lazy loaded. \
 * It also updates the {@link globalState | `global states`} `isAboveMd` and `isBelowXxs` based on the screen size. \
 * Renders the {@link _HomePage | `HomePage`} if the URL is `/` or `/coord`.
 * @returns The rendered application.
 */
export const App = () => {
	const url = new URL(window.location.href);

	const isAboveMd = useMediaQuery("(min-width: 62em)");
	const isBelowXxs = useMediaQuery("(max-width: 25em)");
	const { height, width } = useViewportSize();
	useEffect(() => void (globalState.isAboveMd.value = !!isAboveMd), [isAboveMd]);
	useEffect(() => void (globalState.isBelowXxs.value = !!isBelowXxs), [isBelowXxs]);
	useEffect(() => void (globalState.viewportSize.value = { height, width }), [height, width]);

	return (
		<>
			<WriteToolboxClasses />
			<Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
			<MantineProvider theme={theme} forceColorScheme={globalState.colorScheme.value}>
				{url.pathname === `${clientEnv.BASE_URL}/` && <HomePage />}
			</MantineProvider>
		</>
	);
};
