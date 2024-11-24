import React from "react";
import Link from "./Link";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

export interface StripedTableProps {
	head?: { text: string }[];
	body: { text: string | number; href?: string }[][];
}

const StripedTable = ({ head, body }: StripedTableProps) => {
	return (
		<Table variant="simple">
			{head && (
				<Thead>
					<Tr>
						{head.map((row) => (
							<Th key={row.text}>{row.text}</Th>
						))}
					</Tr>
				</Thead>
			)}
			<Tbody>
				{body.map((row, index) => (
					<Tr key={`${index}`}>
						{row.map((data, dataIndex) => (
							<Td key={`${data.text} ${dataIndex}`}>{data.href ? <Link href={data.href} text={data.text} /> : data.text}</Td>
						))}
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};

export default StripedTable;
