import prisma from "..";

const seed = async () => {
	// wipe
	await prisma.aac_news.deleteMany();

	// seed
	await prisma.aac_news.createMany({
		data: [
			{
				title: "Welcome",
				authorId: null,
				content: "Welcome to shibaac, this is a live preview of current state of the AAC.",
			},
			{
				title: "Second News",
				authorId: null,
				content: "This is the second news for testing",
			},
			{
				title: "News 3",
				authorId: null,
				content: "xD",
			},
		],
	});
};

export default seed;
