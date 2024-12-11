import Panel from "@component/Panel";
import Head from "@layout/Head";
import { withSessionSsr } from "@lib/session";
import Button from "@component/Button";
import StripedTable from "@component/StrippedTable";
import { Text, Wrap } from "@chakra-ui/react";
import { timestampToDate, vocationIdToName } from "../../lib";
import { appRouter } from "src/server/routers/_app";
import { createCallerFactory } from "src/server/trpc";
import type { AccountWithPlayers } from "@shared/types/PrismaAccount";
import { Content } from "@component/Content";

export interface AccountProps {
	account: AccountWithPlayers;
}

// TODO: refactor this view, because its really ugly

// TODO: move qrcode to separate view

export default function Account({ account }: AccountProps) {
	if (!account) {
		return null;
	}

	return (
		<>
			<Head title="Account Management" />
			<Content>
				<Content.Header>Account Management</Content.Header>
				<Content.Body maxW="100%">
					<Panel header="Informations">
						<StripedTable
							body={[
								[{ text: "Account Name" }, { component: <Text>{account.name}</Text> }],
								[{ text: "E-mail Address" }, { text: account.email }],
								[
									{ text: "Creation Date" },
									{
										text: account.creation > 0 ? timestampToDate(account.creation) : "Unknown",
									},
								],
								//{ name: 'Last Login', value: '11/02/2021' },
								[{ text: "Shop Coins" }, { text: account.coins }],
							]}
						>
							{/* '.(!$rec_key ? '
                <a
                  href="?view=account&action=generatekey"
                  className="btn btn-primary btn-sm"
                >
                  <i className="fa fa-key"></i> Generate Recovery Key
                </a>
                ' : '').' */}
							{/* </td> */}
						</StripedTable>
					</Panel>

					<Panel header="Actions">
						<Wrap>
							<Button size="sm" value="Change Password" btnColorType="primary" href="/account/changepassword" />
							<Button size="sm" value="Change Email" btnColorType="primary" href="/account/changeemail" />
							<Button size="sm" value="Create Character" btnColorType="primary" href="/account/createcharacter" />
							<Button size="sm" value="Delete Character" btnColorType="primary" href="/account/deletecharacter" />

							{/* <Button
              value="Generate recovery key"
              btnType="primary"
              href="/account/deletecharacter"
            /> */}
						</Wrap>
					</Panel>

					<Panel header="Characters">
						{/* <div className="pull-right">
                      <Link
                        href={`/account/editcharacter/${player.name}`}
                        passHref
                      >
                        <button
                          className="btn btn-sm btn-primary"
                          style={{ margin: { right: '5px' } }}
                        >
                          <i className="fa fa-pencil"></i> Edit
                        </button>
                      </Link>
                    </div> */}

						<StripedTable
							head={[
								{ text: "Name" },
								{ text: "Level" },
								{ text: "Profession" },
								// { text: 'Edit' }
							]}
							body={account.players.map((player: any) => [
								{ href: `/character/${player.name}`, text: player.name },
								{ text: player.level },
								{ text: vocationIdToName[player.vocation] },

								// {
								//   type: 'button',
								//   text: 'Edit',
								//   href: `/account/editcharacter/${player.name}`,
								// },
							])}
						/>
					</Panel>
				</Content.Body>
			</Content>
		</>
	);
}

export const getServerSideProps = withSessionSsr(async function ({ req, res }) {
	const { account: sessionAcc } = req.session;
	if (!sessionAcc) {
		return {
			redirect: {
				destination: `/account/login?redirect=${encodeURIComponent(req.url!)}`,
				permanent: false,
			},
		};
	}

	const trpc = createCallerFactory(appRouter)({ req: req as any, res: res as any, session: req.session });

	const account = await trpc.account.singleById({ id: sessionAcc.id });
	if (!account) {
		return {
			redirect: {
				destination: `/account/logout`,
				permanent: false,
			},
		};
	}

	return {
		props: { account },
	};
});
