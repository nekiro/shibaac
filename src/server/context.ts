import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { withSessionRoute } from "@lib/session";

export async function createContext({ req, res }: CreateNextContextOptions) {
	await withSessionRoute(async () => {})(req, res);
	return { req, res, session: req.session };
}

export type Context = inferAsyncReturnType<typeof createContext>;
