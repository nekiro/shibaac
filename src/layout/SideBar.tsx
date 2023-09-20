import React, { useState, useEffect } from 'react';
import Panel from '../components/Panel';
import Label from '../components/Label';
import { fetchApi } from '../lib/request';
import Link from '../components/Link';
import { Box, LayoutProps } from '@chakra-ui/react';
import StripedTable from '../components/StrippedTable';
import { type ProtocolStatusCache } from '../cache/protocolStatus';
import { players } from '.prisma/client';

const SideBar = (props: LayoutProps) => {
  const [serverStatus, setServerStatus] = useState<ProtocolStatusCache>();
  const [topPlayers, setTopPlayers] = useState<players[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [players, status] = await Promise.all([
        fetchApi<{ players: player[] }>('GET', `/api/player/top5`),
        fetchApi<{ status: ProtocolStatusCache }>('GET', `/api/status`),
      ]);

      if (players.success && status.success) {
        setIsLoading(false);
        setTopPlayers(players.players || []);
        setServerStatus(status.status);
      }
    };

    fetchData();
  }, []);

  return (
    <Box minWidth="15em" {...props}>
      <Panel header="Server Status" isLoading={isLoading}>
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

      <Panel header="Top 5 Level" isLoading={isLoading}>
        <StripedTable
          head={[{ text: 'Name' }, { text: 'Level' }]}
          body={
            topPlayers && topPlayers.length > 0
              ? topPlayers.map((player, index) => [
                  {
                    text: `${index + 1}. ${player.name}`,
                    href: `/character/${player.name}`,
                  },
                  {
                    text: player.level,
                  },
                ])
              : [
                  [
                    {
                      text: 'Não há dados para mostrar',
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
