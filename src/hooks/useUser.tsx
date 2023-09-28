import { useEffect, useState, createContext, useContext } from "react";
import { fetchApi } from "../lib/request";
import React from "react";
import { User } from "../lib/session";

export type UserContext = {
	user: User | null;
	setUser: (user: User | null) => void;
};

const context = createContext<UserContext>({
	user: null,
	setUser: (user: User | null) => user,
});

export const UserContextWrapper = ({ children }) => {
	const [user, setUserState] = useState<User | null>(null);

	const setUser = (user: User | null) => setUserState(user);

	const fetchUser = async () => {
		try {
			const response = (await fetchApi("GET", "/api/user")) as any;
			if (response.isLoggedIn) {
				setUser(response.user);
			}
		} catch {}
	};

	useEffect(() => {
		fetchUser();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<context.Provider value={{ user, setUser }}>{children}</context.Provider>
	);
};

export const useUser = (): UserContext => {
	return useContext(context);
};
