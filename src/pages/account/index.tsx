import React, { useEffect, useState } from "react";
import Panel from "@component/Panel";
import Head from "@layout/Head";
import { fetchApi } from "@lib/request";
import { User, withSessionSsr } from "@lib/session";
import Button from "@component/Button";
import StripedTable from "@component/StrippedTable";
import {
	Alert,
	AlertIcon,
	Box,
	Button as ChakraButton,
	Center,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	Text,
	Wrap,
} from "@chakra-ui/react";
import { timestampToDate, vocationIdToName } from "../../lib";
import { Toggle } from "../../components/Toggle";
import { trpc } from "@util/trpc";

// TODO: use proper types

export interface AccountProps {
	user: User;
}

// TODO: move qrcode to separate view

export default function Account({ user }: AccountProps) {
	const account = trpc.account.singleById.useQuery({ id: user.id });

	const [is2FAEnabled, setIs2FAEnabled] = useState(false);
	const [qrCodeDataURL, setQRCodeDataURL] = useState(null);
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!account.data) {
			return;
		}
		setIs2FAEnabled(account.data.twoFAEnabled);
	}, [account]);

	const handleToggle = async () => {
		try {
			setIsLoading(true);

			const response = await fetchApi("POST", "/api/account/two-factor/enable-2fa", {
				data: {
					isTwoFA: !is2FAEnabled,
				},
			});

			if (response.success) {
				setIs2FAEnabled((prevState) => !prevState);

				if (response.dataURL) {
					showQRCode(response.dataURL);
					setIsOpenModal(true);
				} else {
					console.error("QR code data is missing");
				}
			}
		} catch (error) {
			setError("Failed to toggle 2FA");
			console.error("Failed to toggle 2FA", error);
		} finally {
			setIsLoading(false);
		}
	};

	const showQRCode = (dataURL: any) => {
		setQRCodeDataURL(dataURL);
	};

	if (account.isLoading) {
		return (
			<>
				<Head title="Account Management" />
				<Panel header="Account Management" isLoading={true}></Panel>
			</>
		);
	}

	const info = account.data!;

	return (
		<>
			<Head title="Account Management" />
			<Panel header="Account Management">
				<Panel header="Informations">
					<StripedTable
						body={[
							[{ text: "Account Name" }, { component: <Text>{info.name}</Text> }],
							[{ text: "E-mail Address" }, { text: info.email }],
							[
								{ text: "Creation Date" },
								{
									text: info.creation > 0 ? timestampToDate(info.creation) : "Unknown",
								},
							],
							//{ name: 'Last Login', value: '11/02/2021' },
							[{ text: "Shop Coins" }, { text: info.coins }],
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
					{error && (
						<Alert status="error" mt={4} mb={2}>
							<AlertIcon />
							{error}
						</Alert>
					)}

					<Wrap>
						<Button size="sm" value="Change Password" btnColorType="primary" href="/account/changepassword" />
						<Button size="sm" value="Change Email" btnColorType="primary" href="/account/changeemail" />
						<Button size="sm" value="Create Character" btnColorType="primary" href="/account/createcharacter" />
						<Button size="sm" value="Delete Character" btnColorType="primary" href="/account/deletecharacter" />
						{isLoading && <Spinner />}

						<Box display="flex" alignItems="center" my={4}>
							<Text mr={4}>Enable 2FA:</Text>
							<Toggle isToggled={is2FAEnabled} onToggle={handleToggle} />
						</Box>
						{is2FAEnabled && qrCodeDataURL && (
							<Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
								<ModalOverlay />
								<ModalContent>
									<ModalHeader>Scan QR Code to enable 2FA</ModalHeader>
									<ModalCloseButton />
									<ModalBody>
										<Center>
											<Image src={qrCodeDataURL} alt="QR Code" boxSize="100px" />
										</Center>
									</ModalBody>
									<ModalFooter>
										<ChakraButton variant="ghost" onClick={() => setIsOpenModal(false)}>
											Close
										</ChakraButton>
									</ModalFooter>
								</ModalContent>
							</Modal>
						)}

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
						body={info.players.map((player: any) => [
							{ href: `/character/${player.name}`, text: player.name },
							{ text: player.level },
							{ text: vocationIdToName[player.vocation] },

							// {
							//   type: 'button',
							//   text: 'Edit',
							//   href: `/account/editcharacter/${player.name}`,
							// },
						])}
					></StripedTable>
				</Panel>
			</Panel>
		</>
	);
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
	const { user } = req.session;
	if (!user) {
		return {
			redirect: {
				destination: `/account/login?redirect=${encodeURIComponent(req.url!)}`,
				permanent: false,
			},
		};
	}

	return {
		props: { user },
	};
});
