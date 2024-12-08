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
				type: 5,
			},
			{
				name: "admin",
				password: "d033e22ae348aeb5660fc2140aec35850c4da997", // admin
				email: "admin@admin.dev",
				type: 5,
			},
		],
	});
};

export default seed;
