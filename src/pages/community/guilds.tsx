import React, { useState, useEffect, useCallback } from "react";
import Panel from "../../components/Panel";
import Head from "../../layout/Head";
import StrippedTable from "../../components/StrippedTable";
import FormWrapper from "../../components/FormWrapper";
import { withSessionSsr } from "../../lib/session";
import { fetchApi } from "../../lib/request";
import Link from "next/link";
import { ButtonType, ButtonColorType } from "../../components/Button";

import {
	Box,
	Flex,
	Button,
	Link as ChakraLink,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Avatar,
} from "@chakra-ui/react";

type Button = {
	type?: "submit" | "button" | "reset";
	btnType?:
		| "primary"
		| "default"
		| "secondary"
		| "danger"
		| "warning"
		| "info"
		| "light"
		| "dark";
	href?: string;
	value: string;
};

type Option = {
	label: string;
	value: string | number;
	text: string;
};

type Field = {
	type: string;
	name: string;
	placeholder?: string;
	label: {
		text: string;
		size: number;
	};
	size: number;
	options?: Option[];
};

interface FormValues {
	[key: string]: string;
}

type ApiResponse = {
	message: string;
	success: boolean;
	data: any;
};

interface Player {
	id: number;
	name: string;
	level: number;
}

interface Account {
	id: number;
	name: string;
	players: Player[];
}

export type FormButton = {
	type?: ButtonType;
	btnType: any;
	value: string;
	href?: string;
};

export default function Guilds({ user }: any) {
	const [guilds, setGuilds] = useState<any>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [response, setResponse] = useState<ApiResponse | null>(null);
	const [info, setInfo] = useState<Account | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const baseUrl = process.env.NEXT_PUBLIC_API_URL;

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);

			const response = await fetchApi("GET", `/api/account/${user.id}`);

			if (response.success) {
				setInfo(response.account);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, [user]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const fetchGuilds = useCallback(async () => {
		try {
			const response = await fetchApi("GET", "/api/community/guilds");

			setGuilds(response.data);
		} catch (error) {
			console.error("Failed to fetch guilds:", error);
		}
	}, []);

	useEffect(() => {
		fetchGuilds();
	}, [fetchGuilds]);

	const onSubmit = async (
		values: FormValues,
		{ resetForm }: { resetForm: () => void }
	) => {
		const leaderOption = fields[0].options?.find(
			(option) => option.value === Number(values.leader)
		);

		const response = await fetchApi("POST", "/api/community/guilds", {
			data: {
				leader_id: leaderOption ? leaderOption.value : null,
				leader_name: leaderOption ? leaderOption.label : null,
				guild_name: values.guild_name,
			},
		});

		setResponse(response.data);
		resetForm();

		if (response.success) {
			closeModal();
			fetchGuilds();
		}
	};

	const handleCreateGuild = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const fields: Field[] = [
		{
			type: "select",
			name: "leader",
			label: { text: "Character Name", size: 3 },
			size: 9,
			options: info
				? [
						{ label: "<Selecione>", value: "", text: "<Selecione>" },
						...info.players.map((player) => ({
							label: player.name,
							value: player.id,
							text: player.name,
						})),
				  ]
				: [{ label: "<Selecione>", value: "", text: "<Selecione>" }],
		},
		{
			type: "text",
			name: "guild_name",
			label: { text: "Guild Name", size: 3 },
			size: 9,
		},
	];

	const buttons: FormButton[] = [
		{ type: "submit", btnType: "primary", value: "Submit" },
	];

	if (!guilds) {
		return (
			<>
				<Head title="Guilds" />
				<Panel header="Guilds" isLoading={isLoading}></Panel>
			</>
		);
	}

	return (
		<>
			<Head title="Guilds" />
			<Panel header="Guilds">
				<Flex justifyContent="space-between" alignItems="center" mb="2">
					<Box></Box>
					<Button
						size="sm"
						colorScheme="purple"
						onClick={() => handleCreateGuild()}
					>
						<i className="fa fa-lock"></i> Create Guild
					</Button>
				</Flex>
				<StrippedTable
					head={[
						{ text: "Logo" },
						{ text: "Nome" },
						{ text: "Membros" },
						{ text: "Nível Médio" },
					]}
					body={
						guilds && guilds.length > 0
							? guilds.map((guild, index) => [
									{
										text: (
											<Avatar
												src={
													guild.logoUrl
														? `${baseUrl}/${guild.logoUrl}`
														: `/images/guild-logo-default.gif`
												}
												alt="Guild Logo"
												width="50"
												height="50"
											/>
										),
									},
									{
										text: (
											<Link
												href={`/community/guilds/${encodeURIComponent(
													guild.name
												)}`}
											>
												<a>{guild.name}</a>
											</Link>
										),
									},
									{
										text: guild.memberCount,
									},
									{
										text: guild.level,
									},
							  ])
							: [
									[
										{
											text: "There is no data to show",
											colspan: 4,
										},
									],
							  ]
					}
				/>
			</Panel>

			{isModalOpen && (
				<Modal isOpen={isModalOpen} onClose={closeModal}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Create guild</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<FormWrapper
								validationSchema={""}
								onSubmit={onSubmit}
								fields={fields}
								buttons={buttons}
								response={response}
							/>
						</ModalBody>
					</ModalContent>
				</Modal>
			)}
		</>
	);
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
	const { user } = req.session;
	if (!user) {
		return {
			redirect: {
				destination: "/account/login",
				permanent: false,
			},
		};
	}

	return {
		props: { user },
	};
});
