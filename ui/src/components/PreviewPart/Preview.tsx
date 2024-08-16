import { Accordion, AccordionControlProps, Paper, Table, useMantineTheme } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { computed } from "@preact/signals";
import { useMemo } from "preact/hooks";
import ReactJson from "react-json-view";
import { globalState } from "../../context/GlobalState";
import { MultiIf } from "../../utils/MultiIf";

const resultNames = computed(() => globalState.result.value.map((result) => result.name));

const AccordionControl = (p: AccordionControlProps) => {
	const { hovered, ref } = useHover<HTMLButtonElement>();
	const theme = useMantineTheme();

	const bgObj = computed(() => (globalState.colorScheme.value === "light" ? { bg: theme.colors.gray[hovered ? 4 : 0] } : {}));

	return (
		<Accordion.Control ref={ref} {...bgObj.value}>
			{p.children}
		</Accordion.Control>
	);
};

const RawPreview = () => (
	<Accordion key={resultNames.value.join("-")} multiple defaultValue={resultNames.value}>
		{globalState.result.value.map((result, index) => (
			// eslint-disable-next-line react/no-array-index-key
			<Accordion.Item key={index} value={result.name}>
				<AccordionControl>{result.name}</AccordionControl>
				<Accordion.Panel>
					<ReactJson
						src={result.data}
						displayDataTypes={false}
						theme={globalState.colorScheme.value === "light" ? "rjv-default" : "apathy"}
					/>
				</Accordion.Panel>
			</Accordion.Item>
		))}
	</Accordion>
);

const DisplayValue = ({ data }: { data: any }) => (
	<MultiIf
		branches={[
			{
				condition: data instanceof Date,
				then: data instanceof Date ? data.toISOString() : null,
			},
			{
				condition: typeof data === "object",
				then: <TableArrayPreview data={Array.isArray(data) ? data : [data]} striped={false} />,
			},
		]}
		else={data?.toString()}
	/>
);

const INVALID_KEY = "$$$";

const TableArrayPreview = ({ data, striped }: { data: unknown[]; striped: boolean }) => {
	const theme = useMantineTheme();
	const keys = useMemo(() => (typeof data[0] === "object" ? Object.keys(data[0] ?? {}) : [INVALID_KEY]), [data]);

	return (
		<Table striped={striped} highlightOnHover withColumnBorders withTableBorder withRowBorders>
			<Table.Thead
				style={{
					position: "sticky",
					top: 0,
					background: globalState.colorScheme.value === "light" ? theme.colors.green[5] : theme.colors.green[8],
				}}
			>
				<Table.Tr>
					{keys.map((key, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<Table.Th key={index}>{key === INVALID_KEY ? "" : key}</Table.Th>
					))}
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{data.map((d: any, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<Table.Tr key={index}>
						{keys.map((key, index) => (
							// eslint-disable-next-line react/no-array-index-key
							<Table.Td key={index}>
								<DisplayValue data={key === INVALID_KEY ? d : d[key]} />
							</Table.Td>
						))}
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
	);
};

/**
 * The preview of the data, can be raw or in a table.
 * @returns
 */
export const PreviewContent = () => (
	<Paper withBorder style={{ flexGrow: 1, overflow: "auto" }}>
		{globalState.dataPreviewType.value === "raw" && <RawPreview />}
		{globalState.dataPreviewType.value === "table" && (
			<Accordion multiple defaultValue={resultNames.value}>
				{globalState.result.value.map((singleResult, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<Accordion.Item key={index} value={singleResult.name}>
						<AccordionControl>{singleResult.name}</AccordionControl>
						<Accordion.Panel style={{ width: "max-content" }}>
							<TableArrayPreview data={singleResult.data} striped />
						</Accordion.Panel>
					</Accordion.Item>
				))}
			</Accordion>
		)}
	</Paper>
);
