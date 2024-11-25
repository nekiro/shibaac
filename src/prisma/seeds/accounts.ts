import prisma from "..";

const seed = async () => {
	// wipe
	await prisma.accounts.deleteMany();

	// seed
	await prisma.accounts.createMany({
		data: [
			{
				name: "nekiro",
				password: "1448f93979c89c4e6e8664df211b40ace882f6d5", // nekiro
				email: "nekiro@nekiro.dev",
			},
		],
	});
};

export default seed;
