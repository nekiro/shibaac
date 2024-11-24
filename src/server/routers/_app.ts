import { router } from "../trpc";
import { newsRouter } from "./news";
import { playerRouter } from "./player";
import { townRouter } from "./town";

export const appRouter = router({
	news: newsRouter,
	player: playerRouter,
	town: townRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
