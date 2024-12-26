import { NewsCard } from "../components/NewsCard";
import { trpc } from "@util/trpc";
import { Content } from "@component/Content";
import { Heading } from "@chakra-ui/react";

export default function Index() {
	const news = trpc.news.all.useQuery();

	// TODO: paginate?

	return (
		<Content>
			<Content.Body maxW="unset" gap={5}>
				<Heading size="lg">News</Heading>
				{news.data?.map((post) => (
					<NewsCard
						key={`news-${post.id}`}
						id={String(post.id)}
						image={post.imageUrl}
						header={post.title}
						author={post.playerNick}
						date={post.createdAt}
						html={post.content}
					/>
				))}
			</Content.Body>
		</Content>
	);
}
