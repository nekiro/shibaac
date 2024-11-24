import sanitize from "sanitize-html";
import Panel from "../components/Panel";
import React from "react";
import { trpc } from "@util/trpc";

export default function Index() {
	const news = trpc.news.all.useQuery();

	if (!news.data || news.error) {
		if (news.error) {
			// TODO: properly handle errors
			console.error(news.error);
		}
		return <Panel isLoading={true} />;
	}

	// TODO: paginate?

	return (
		<>
			{news.data.map((post) => (
				<Panel key={`news-${post.id}`} header={post.title} date={post.createdAt}>
					<div dangerouslySetInnerHTML={{ __html: sanitize(post.content) }} />
				</Panel>
			))}
		</>
	);
}
