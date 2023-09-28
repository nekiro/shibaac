import prisma from ".";
import fs from "fs/promises";
import path from "path";

async function main() {
	const seedsPath = path.join(__dirname, "/seeds");

	for (const file of await fs.readdir(seedsPath)) {
		const seed = require(path.join(seedsPath, file)).default;
		// @ts-ignore
		await prisma[seed.table].createMany({
			data: seed.data,
		});
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
