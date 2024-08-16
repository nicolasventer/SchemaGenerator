//@ts-nocheck

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
// import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
// import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
// import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import jsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

/** Initialize Monaco */
export const initMonaco = () => {
	self.MonacoEnvironment = {
		getWorker(workerId, label) {
			switch (label) {
				// case "json":
				// 	return jsonWorker();
				// case "css":
				// case "scss":
				// case "less":
				// 	return cssWorker();
				// case "html":
				// case "handlebars":
				// case "razor":
				// 	return htmlWorker();
				case "typescript":
				case "javascript":
					return jsWorker();
				default:
					return editorWorker();
			}
		},
	};
};
