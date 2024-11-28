import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUser } from "@hook/useUser";
import { trpc } from "@util/trpc";

export default function Logout() {
	const router = useRouter();
	const { setUser, user } = useUser();
	const logout = trpc.account.logout.useMutation();

	useEffect(() => {
		if (!user) {
			router.push("/");
		}

		logout.mutate();
		setUser(null);
		router.push("/");
	}, []);

	return null;
}
