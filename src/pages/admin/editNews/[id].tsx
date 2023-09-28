import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "../../../components/Panel";
import Head from "../../../layout/Head";
import { fetchApi } from "../../../lib/request";
import { withSessionSsr } from "../../../lib/session";
import Button from "../../../components/Button";
import { CKEditorComponent } from "../../../components/Editor";

function EditNews() {
	const router = useRouter();
	const { id } = router.query;

	const [newsData, setNewsData] = useState(null);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		const fetchNewsDetails = async () => {
			if (!id) return;

			try {
				const response = await fetchApi("GET", `/api/news/${id}`);
				setNewsData(response.data.news);
				setTitle(response.data.news.title);
				setContent(response.data.news.content);
				setImageUrl(response.data.news.imageUrl);
			} catch (error) {
				console.error(error);
			}
		};

		fetchNewsDetails();
	}, [id]);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		try {
			await fetchApi("PUT", `/api/news/${id}`, {
				data: {
					title,
					content,
					imageUrl,
				},
			});

			router.push("/admin");
		} catch (error) {
			console.error(error);
		}
	};

	if (!newsData) return <div>Loading...</div>;

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
					<Button
						type="button"
						btnType="danger"
						value="< Voltar"
						onClick={() => router.push("/admin")}
					/>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Title</label>
						<input
							type="text"
							className="form-control"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>
					<div className="form-group">
						<label>Content</label>
						{isClient && (
							<CKEditorComponent setValue={setContent} value={content} />
						)}
					</div>
					<div className="form-group">
						<label>Image URL</label>
						<input
							type="text"
							className="form-control"
							value={imageUrl}
							onChange={(e) => setImageUrl(e.target.value)}
						/>
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
		props: { user },
	};
});

export default EditNews;
