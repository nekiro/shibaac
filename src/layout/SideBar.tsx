import React, { useState, useEffect } from "react";
import Panel from "../components/Panel";
import Label from "../components/Label";
import { fetchApi } from "../lib/request";
import Link from "../components/Link";
import { Box, LayoutProps } from "@chakra-ui/react";
import StripedTable from "../components/StrippedTable";
import { type ProtocolStatusCache } from "../cache/protocolStatus";
import { trpc } from "@util/trpc";

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
				<table className="table table-condensed table-content table-striped">
					<tbody>
						<tr>
							<td>{serverStatus?.online ? <Label colorScheme="green">ONLINE</Label> : <Label colorScheme="red">OFFLINE</Label>}</td>
						</tr>
						<tr>
							<td>{serverStatus && <Link href="/online" text={`${serverStatus.onlineCount} players online`} />}</td>
						</tr>
					</tbody>
				</table>
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
											colspan: 2,
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
