import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "@util/trpc";

export default function Logout() {
	const router = useRouter();
	const user = trpc.me.me.useQuery().data;
	const logout = trpc.account.logout.useMutation();

	useEffect(() => {
		if (!user?.isLoggedIn) {
			router.push("/");
			return;
		}

		logout.mutate();
		router.push("/");
	}, []);

	return null;
}
