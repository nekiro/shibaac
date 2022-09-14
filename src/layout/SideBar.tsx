import React, { useState, useEffect } from 'react';
import Panel from '../components/Panel';
import Label from '../components/Label';
import { fetchApi } from '../lib/request';
import Link from '../components/Link';
import { Box, LayoutProps } from '@chakra-ui/react';
import StripedTable from '../components/StrippedTable';
import { type ProtocolStatusCache } from '../cache/protocolStatus';
import { player } from '.prisma/client';

const SideBar = (props: LayoutProps) => {
  const [serverStatus, setServerStatus] = useState<ProtocolStatusCache>();
  const [topPlayers, setTopPlayers] = useState<player[]>();

  useEffect(() => {
    const fetchData = async () => {
      const [players, status] = await Promise.all([
        fetchApi<{ players: player[] }>('GET', `/api/player/top5`),
        fetchApi<{ status: ProtocolStatusCache }>('GET', `/api/status`),
      ]);

      if (players.success && status.success) {
        setTopPlayers(players.players);
        setServerStatus(status.status);
      }
    };

    fetchData();
  }, []);

  return (
    <Box minWidth="15em" {...props}>
      <Panel header="Server Status" isLoading={!topPlayers || !serverStatus}>
        <table className="table table-condensed table-content table-striped">
          <tbody>
            <tr>
              <td>
                {serverStatus?.online ? (
                  <Label colorScheme="green">ONLINE</Label>
                ) : (
                  <Label colorScheme="red">OFFLINE</Label>
                )}
              </td>
            </tr>
            <tr>
              <td>
                {serverStatus && (
                  <Link
                    href="/online"
                    text={`${serverStatus.onlineCount} players online`}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </Panel>

      <Panel header="Top 5 Level" isLoading={!topPlayers}>
        <StripedTable
          body={
            topPlayers
              ? topPlayers.map((player, index) => [
                  {
                    text: `${index + 1}. ${player.name}`,
                    href: `/character/${player.name}`,
                  },
                  {
                    text: player.level,
                  },
                ])
              : []
          }
        />
      </Panel>
    </Box>
  );
};

export default SideBar;
