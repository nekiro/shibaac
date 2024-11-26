import { procedure, router } from "../trpc";
import { getCache } from "../../cache/protocolStatus";

export const statusRouter = router({
	status: procedure.query(async () => {
		return await getCache();
	}),
});
