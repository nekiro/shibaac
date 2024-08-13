import React, { useState, useEffect } from 'react';
import Panel from '../components/Panel';
import Label from '../components/Label';
import { fetchApi } from '../lib/request';
import Link from '../components/Link';
import { Box, LayoutProps, Button } from '@chakra-ui/react';
import StripedTable from '../components/StrippedTable';
import { type ProtocolStatusCache } from '../cache/protocolStatus';
import { players } from '.prisma/client';

const SideBar = (props: LayoutProps) => {
  const [serverStatus, setServerStatus] = useState<ProtocolStatusCache>();
  const [topPlayers, setTopPlayers] = useState<players[]>();
  const [isLoading, setIsLoading] = useState(false);

  const downloadURL = process.env.NEXT_PUBLIC_CLIENT_DOWNLOAD_URL;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [players, status] = await Promise.all([
        fetchApi<{ players: players[] }>('GET', `/api/player/top5`),
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
      <Panel header="Information" isLoading={isLoading}>
        <StripedTable
          head={[]}
          body={[
            [{ text: 'IP' }, { text: process.env.NEXT_PUBLIC_SERVER_ADDRESS }],
            [
              { text: 'Cliente' },
              { text: process.env.NEXT_PUBLIC_CLIENT_VERSION },
            ],
            [{ text: 'Tipo' }, { text: 'RPG/PVP' }],
          ]}
        />
        <Button
          width="100%"
          colorScheme="purple"
          onClick={() => window.open(downloadURL, '_blank')}
          color="white"
          mt={4}
          bgGradient="linear(to-r, violet.500, purple.600)"
          _hover={{
            bgGradient: 'linear(to-r, purple.600, violet.500)',
            boxShadow: 'lg',
          }}
          _active={{
            bgGradient: 'linear(to-r, purple.700, violet.600)',
            boxShadow: 'inner',
          }}
          _focus={{ outline: 0, boxShadow: 'outline' }}
          borderRadius="md"
          transition="all 0.2s ease-in-out"
        >
          Download Client
        </Button>
      </Panel>

      <Panel header="Server Status" isLoading={isLoading}>
        <StripedTable
          head={[]}
          body={[
            [
              {
                text: serverStatus?.online ? (
                  <Label colorScheme="green">ONLINE</Label>
                ) : (
                  <Label colorScheme="purple">OFFLINE</Label>
                ),
              },
            ],
            [
              {
                text: serverStatus
                  ? `${serverStatus.onlineCount} players online`
                  : '',
                component: serverStatus && (
                  <Link
                    href="/online"
                    text={`${serverStatus.onlineCount} players online`}
                  />
                ),
              },
            ],
          ]}
        />
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
                      text: 'There is no data to show',
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
