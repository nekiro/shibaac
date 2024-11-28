import { authProcedure, router } from "../trpc";

export const meRouter = router({
	me: authProcedure.query(async ({ ctx }) => {
		const { session } = ctx;

		return {
			isLoggedIn: !!session.user,
			account: session.user,
		};
	}),
});
