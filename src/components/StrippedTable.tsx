import React from "react";
import Link from "./Link";
import { Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react";
import Loader from "./Loader";

export interface StripedTableProps {
	head?: { text: string }[];
	body: { text: string | number; href?: string }[][];
	isLoading?: boolean;
}

const StripedTable = ({ head, body, isLoading }: StripedTableProps) => {
	if (isLoading) {
		return <Loader />;
	}

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
				{body.length === 0 ? (
					<Tr>
						<Td>
							<Text>No data.</Text>
						</Td>
					</Tr>
				) : (
					body.map((row, index) => (
						<Tr key={`${index}`}>
							{row.map((data, dataIndex) => (
								<Td key={`${data.text} ${dataIndex}`}>{data.href ? <Link href={data.href} text={String(data.text)} /> : data.text}</Td>
							))}
						</Tr>
					))
				)}
			</Tbody>
		</Table>
	);
};

export default StripedTable;
