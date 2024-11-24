import React, { useState, useEffect, useCallback } from "react";
import Panel from "../../components/Panel";
import Head from "../../layout/Head";
import StrippedTable from "../../components/StrippedTable";
import { fetchApi } from "../../lib/request";
import { withSessionSsr } from "../../lib/session";
import { Box, Text, FormControl, FormLabel, Select, Input, Button, useToast } from "@chakra-ui/react";
import { House } from "../../shared/interfaces/Houses";

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

export default function HousePage({ user }: any) {
	const [houses, setHouses] = useState<House[]>([]);
	const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
	const [bid, setBid] = useState({ character: "", amount: "" });
	const [account, setAccount] = useState<Account | null>(null);

	const toast = useToast();

	const fetchData = useCallback(async () => {
		const response = await fetchApi("GET", `/api/account/${user.id}`);

		setAccount(response.account);
	}, [user]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const fetchHouses = useCallback(async () => {
		try {
			const response = await fetchApi("GET", "/api/houses");
			setHouses(response.data);
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		fetchHouses();
	}, [fetchHouses]);

	const handleBidChange = (e: any) => {
		const { name, value } = e.target;
		setBid((prev) => ({ ...prev, [name]: value }));
	};

	const handleBidSubmit = async (e: any) => {
		e.preventDefault();
		// if (bid.character && bid.amount >= 1000) {
		// 	try {
		// 		const response = await fetchApi("POST", `/api/houses/${selectedHouse?.id}`, {
		// 			data: {
		// 				houseId: selectedHouse?.id,
		// 				characterId: Number(bid.character),
		// 				bid: Number(bid.amount),
		// 			},
		// 		});

		// 		if (response.success) {
		// 			toast({
		// 				position: "top",
		// 				title: response.message,
		// 				status: "success",
		// 				duration: 9000,
		// 				isClosable: true,
		// 			});

		// 			setBid({ character: "", amount: "" });

		// 			await fetchHouses();

		// 			const updatedHouse = houses.find((h) => h.id === selectedHouse?.id);
		// 			// setSelectedHouse(updatedHouse);
		// 		}
		// 	} catch (error) {
		// 		console.error("Bid submission failed", error);
		// 	}
		// } else {
		// 	console.log("Invalid bid");
		// }
	};

	return (
		<>
			<Head title="Houses" />
			<Panel header="Houses">
				<Box display="flex" flexDirection="row">
					<Box width="50%" marginRight="4">
						<Text fontSize="2xl">List Houses</Text>

						{/* <StrippedTable
							head={[{ text: "Name" }, { text: "Size" }, { text: "Owner" }]}
							body={
								houses && houses.length > 0
									? houses.map((house) => [
											{
												text: <span onClick={() => setSelectedHouse(house)}>{house.name}</span>,
											},
											{
												text: house.size,
											},
											{
												text: house.owner,
											},
										])
									: [
											[
												{
													text: "There is no data to show",
													colspan: 3,
												},
											],
										]
							}
						/> */}
					</Box>
					{selectedHouse && (
						<Box width="50%">
							<Text fontSize="3xl">{selectedHouse.name}</Text>
							<Text>
								Owner:
								{selectedHouse.owner === 0 ? " Available for an auction!" : selectedHouse.owner}
							</Text>
							<Text>Town: Venore</Text>
							<Text>Size: {selectedHouse.size} square meters</Text>
							<Text>Beds: {selectedHouse.beds}</Text>
							<Text>Monthly rent: {selectedHouse.rent * 1000} gold coins</Text>
							<Text>Last bid: {selectedHouse.bid} gold coins</Text>
							<Text>Highest Bidder: {selectedHouse.highest_bidder}</Text>
							<Text>Last bid date: {new Date(selectedHouse.last_bid * 1000).toLocaleString()}</Text>
							<form onSubmit={handleBidSubmit}>
								<FormControl mb="3">
									<FormLabel>Character</FormLabel>
									<Select name="character" onChange={handleBidChange} value={bid.character}>
										<option value="">Selecione</option>
										{account?.players.map((player) => (
											<option value={player.id} key={player.id}>
												{player.name} (Level {player.level})
											</option>
										))}
									</Select>
								</FormControl>
								<FormControl mb="3">
									<FormLabel>Bid on gold</FormLabel>
									<Input type="number" min="1000" name="amount" value={bid.amount} onChange={handleBidChange} />
								</FormControl>
								<Button type="submit">Dar Bid</Button>
							</form>
							<Text mt="3" color="red.500">
								Caution! When you bid a house, is NOT possible to cancel the bid!
							</Text>
						</Box>
					)}
				</Box>
			</Panel>
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
