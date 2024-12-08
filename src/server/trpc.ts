import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create();

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;
export const createCallerFactory = t.createCallerFactory;

export const authProcedure = t.procedure.use(
	middleware(async ({ ctx, next }) => {
		if (!ctx.session.account) {
			throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
		}
		return next();
	}),
);
export const adminProcedure = t.procedure.use(
	middleware(async ({ ctx, next }) => {
		if (!ctx.session.account || ctx.session.account.type !== 5) {
			throw new TRPCError({ code: "FORBIDDEN", message: "Forbidden" });
		}
		return next();
	}),
);
