import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "../../../components/Panel";
import Head from "../../../layout/Head";
import { withSessionSsr } from "../../../lib/session";
import Button from "../../../components/Button";
import { CKEditorComponent } from "../../../components/Editor";
import { trpc } from "@util/trpc";

function EditNews() {
	const router = useRouter();
	const { id } = router.query;

	const patchNews = trpc.news.patch.useMutation();
	const news = trpc.news.single.useQuery({ id: Number(id) });

	const [title, setTitle] = useState(news.data?.title);
	const [content, setContent] = useState(news.data?.content ?? "");
	const [imageUrl, setImageUrl] = useState(news.data?.imageUrl ?? undefined);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		try {
			patchNews.mutate({
				id: Number(id),
				title,
				content,
				imageUrl,
			});

			router.push("/admin");
		} catch (error) {
			console.error(error);
		}
	};

	if (!news.data) return <div>Loading...</div>;

	return (
		<>
			<Head title="Edit News" />
			<Panel header="Edit News">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "10px",
					}}
				>
					<div></div>
					<Button type="button" btnColorType="danger" value="< Voltar" onClick={() => router.push("/admin")} />
				</div>

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Title</label>
						<input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
					</div>
					<div className="form-group">
						<label>Content</label>
						{isClient && <CKEditorComponent setValue={setContent} value={content} />}
					</div>
					<div className="form-group">
						<label>Image URL</label>
						<input type="text" className="form-control" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
					</div>
					<button type="submit" className="btn btn-primary">
						Update
					</button>
				</form>
			</Panel>
		</>
	);
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
	const { account } = req.session;
	if (!account) {
		return {
			redirect: {
				destination: "/account/login",
				permanent: false,
			},
		};
	}

	return {
		props: { account },
	};
});

export default EditNews;
