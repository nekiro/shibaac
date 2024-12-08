import { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from "next";
import { dev } from "./config";
import { AccountWithPlayers } from "@shared/types/PrismaAccount";

declare module "iron-session" {
	interface IronSessionData {
		account?: AccountWithPlayers;
	}
}

const sessionOptions: IronSessionOptions = {
	cookieName: process.env.COOKIE_NAME as string,
	password: process.env.SESSION_PASSWORD as string,
	// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
	cookieOptions: {
		maxAge: undefined,
		secure: !dev,
	},
};

export const withSessionRoute = (handler: NextApiHandler) => {
	return withIronSessionApiRoute(handler, sessionOptions);
};

export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
	handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
	return withIronSessionSsr(handler, sessionOptions);
}
