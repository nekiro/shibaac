import sanitize from "sanitize-html";
import NewsPanel from "../components/NewsPanel";
import React from "react";
import { trpc } from "@util/trpc";
import { Content } from "@component/Content";

export default function Index() {
	const news = trpc.news.all.useQuery();

	// TODO: paginate?

	return (
		<Content>
			<Content.Body>
				{news.data?.map((post) => (
					<NewsPanel borderRadius="none" key={`news-${post.id}`} header={post.title} date={post.createdAt}>
						<div dangerouslySetInnerHTML={{ __html: sanitize(post.content) }} />
					</NewsPanel>
				))}
			</Content.Body>
		</Content>
	);
}
