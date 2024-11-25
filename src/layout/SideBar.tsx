import React, { useState, useEffect } from "react";
import Panel from "@component/Panel";
import Label from "@component/Label";
import { fetchApi } from "@lib/request";
import Link from "@component/Link";
import { Box, BoxProps } from "@chakra-ui/react";
import StripedTable from "@component/StrippedTable";
import { type ProtocolStatusCache } from "../cache/protocolStatus";
import { trpc } from "@util/trpc";

export interface LayoutProps extends BoxProps {}

const SideBar = (props: LayoutProps) => {
	const [serverStatus, setServerStatus] = useState<ProtocolStatusCache>();

	const topPlayers = trpc.player.top5.useQuery();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);

			const [status] = await Promise.all([fetchApi<{ status: ProtocolStatusCache }>("GET", `/api/status`)]);

			if (status.success) {
				setIsLoading(false);
				setServerStatus(status.status);
			}
		};

		fetchData();
	}, []);

	return (
		<Box minWidth="15em" {...props}>
			<Panel header="Server Status" isLoading={isLoading || !topPlayers.data}>
				{serverStatus?.online ? <Label colorScheme="green">ONLINE</Label> : <Label colorScheme="red">OFFLINE</Label>}
				{serverStatus && <Link marginLeft="10px" href="/online" text={`${serverStatus.onlineCount} players online`} />}
			</Panel>

			<Panel header="Top 5 Level" isLoading={isLoading}>
				<StripedTable
					head={[{ text: "Name" }, { text: "Level" }]}
					body={
						topPlayers.data && topPlayers.data.length > 0
							? topPlayers.data.map((player, index) => [
									{
										text: `${index + 1}. ${player.name}`,
										href: `/character/${player.name}`,
									},
									{
										text: player.level.toString(),
									},
								])
							: [
									[
										{
											text: "There is no data to show",
											// colspan: 2,
										},
									],
								]
					}
				/>
			</Panel>
		</Box>
	);
};

export default SideBar;
