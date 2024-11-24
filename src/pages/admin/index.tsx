import React from "react";
import Link from "next/link";
import Head from "../../layout/Head";
import Panel from "../../components/Panel";
import { withSessionSsr } from "../../lib/session";
import { Button, Table, Thead, Tbody, Tr, Th, Td, Link as ChakraLink, VStack } from "@chakra-ui/react";
import { trpc } from "@util/trpc";

function AdminPanel() {
	const news = trpc.news.all.useQuery();
	const deleteNews = trpc.news.delete.useMutation();

	async function handleDelete(newsId: number) {
		try {
			await deleteNews.mutateAsync({ id: newsId });
			news.refetch();
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<>
			<Head title="Admin Panel" />
			<Panel header="Admin Panel">
				<Link href="/admin/createnews" passHref>
					<ChakraLink>
						<Button colorScheme="purple" mb={3}>
							Create News
						</Button>
					</ChakraLink>
				</Link>

				<Table variant="simple">
					<Thead>
						<Tr>
							<Th>ID</Th>
							<Th>Title</Th>
							<Th>Author</Th>
							<Th>Actions</Th>
						</Tr>
					</Thead>
					<Tbody>
						{news.data?.map((news, index) => (
							<Tr key={news.id}>
								<Td>{news.id}</Td>
								<Td>{news.title}</Td>
								<Td>{news.playerNick}</Td>
								<Td>
									<VStack spacing={2} direction="row">
										<Link href={`/admin/editNews/${news.id}`} passHref>
											<ChakraLink>
												<Button colorScheme="teal" size="sm">
													Edit
												</Button>
											</ChakraLink>
										</Link>
										<Button colorScheme="red" size="sm" onClick={() => handleDelete(news.id)}>
											Delete
										</Button>
									</VStack>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</Panel>
		</>
	);
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
	const { user } = req.session;
	if (!user) {
		return {
			redirect: {
				destination: "/account/login",
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
});

export default AdminPanel;
