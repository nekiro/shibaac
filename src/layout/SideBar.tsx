import React from "react";
import Panel from "@component/Panel";
import Label from "@component/Label";
import Link from "@component/Link";
import { Box, BoxProps, Flex } from "@chakra-ui/react";
import StripedTable from "@component/StrippedTable";
import { trpc } from "@util/trpc";

export interface LayoutProps extends BoxProps {}

const SideBar = (props: LayoutProps) => {
	const topPlayers = trpc.player.top5.useQuery();
	const status = trpc.status.status.useQuery();

	return (
		<Box minWidth="15em" {...props}>
			<Panel header="Server Status" isLoading={status.isLoading}>
				<Flex alignItems="center">
					{status.data?.online ? <Label colorScheme="green">ONLINE</Label> : <Label colorScheme="red">OFFLINE</Label>}
					<Link marginLeft="10px" href="/online" text={`${status.data?.onlineCount} players online`} />
				</Flex>
			</Panel>

			<Panel header="Top 5 Level" isLoading={topPlayers.isLoading}>
				<StripedTable
					head={[{ text: "Name" }, { text: "Level" }]}
					body={
						topPlayers.data &&
						topPlayers.data.map((player, index) => [
							{
								text: `${index + 1}. ${player.name}`,
								href: `/character/${player.name}`,
							},
							{
								text: player.level.toString(),
							},
						])
					}
				/>
			</Panel>
		</Box>
	);
};

export default SideBar;
