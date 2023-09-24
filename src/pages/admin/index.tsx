import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../lib/request';
import Head from '../../layout/Head';
import Panel from '../../components/Panel';
import StrippedTable from '../../components/StrippedTable';
import { withSessionSsr } from '../../lib/session';
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link as ChakraLink,
  HStack,
  Box,
} from '@chakra-ui/react';

interface INewsList {
  authorId: number;
  content: string;
  createdAt: string;
  id: number;
  imageUrl: string;
  playerNick: string;
  title: string;
}

function AdminPanel() {
  const [newsList, setNewsList] = useState<INewsList[]>([]);
  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [totalGuilds, setTotalGuilds] = useState<number>(0);
  const [totalHouses, setTotalHouses] = useState<number>(0);
  const [lastLogins, setLastLogins] = useState<any[]>([]);
  const [topCoins, setTopCoins] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [accounts, players, guilds, houses, logins, coins] =
          await Promise.all([
            fetchApi('GET', '/api/admin/totalAccounts'),
            fetchApi('GET', '/api/admin/totalPlayers'),
            fetchApi('GET', '/api/admin/totalGuilds'),
            fetchApi('GET', '/api/admin/totalHouses'),
            fetchApi('GET', '/api/admin/last10Logins'),
            fetchApi('GET', '/api/admin/top10Coins'),
          ]);

        setTotalAccounts(accounts.accounts);
        setTotalPlayers(players.players);
        setTotalGuilds(guilds.guilds);
        setTotalHouses(houses.houses);
        setLastLogins(logins.logins);
        setTopCoins(coins.coins);
      } catch (error) {
        console.error(error);
      }
    }

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetchApi('GET', '/api/news');

        setNewsList(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNews();
  }, []);

  async function handleDelete(newsId: number) {
    try {
      await fetchApi('DELETE', `/api/news/${newsId}`);
      setNewsList((prevList) => prevList.filter((news) => news.id !== newsId));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Head title="Admin Panel" />
      <Panel header="Admin Panel">
        <Box mb={5}>
          <Box>
            <strong>Total Accounts:</strong> {totalAccounts}
          </Box>
          <Box>
            <strong>Total Players:</strong> {totalPlayers}
          </Box>
          <Box>
            <strong>Total Guilds:</strong> {totalGuilds}
          </Box>
          <Box>
            <strong>Total Houses:</strong> {totalHouses}
          </Box>
        </Box>

        <Panel header="Last 10 Logins">
          {lastLogins.map((login, index) => (
            <div key={index}>{login.name}</div>
          ))}
        </Panel>

        <Panel header="Top 10 Most Coins">
          <StrippedTable
            head={[{ text: '#' }, { text: 'Name' }, { text: 'Coins' }]}
            body={
              topCoins && topCoins.length > 0
                ? topCoins.map((account, index) => [
                    { text: `${index + 1}` },
                    { text: account.players[0]?.name },
                    { text: `${account.coins} Coins` },
                  ])
                : [
                    [
                      {
                        text: 'There is no data to show',
                        colspan: 6,
                      },
                    ],
                  ]
            }
          />
        </Panel>

        <Link href="/admin/createnews" passHref>
          <ChakraLink>
            <Button colorScheme="purple" mb={3}>
              Create News
            </Button>
          </ChakraLink>
        </Link>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>Author</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {newsList.map((news, index) => (
              <Tr key={index}>
                <Td>{news.id}</Td>
                <Td>{news.title}</Td>
                <Td>{news.playerNick}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Link href={`/admin/editNews/${news.id}`} passHref>
                      <ChakraLink>
                        <Button colorScheme="teal" size="sm">
                          Edit
                        </Button>
                      </ChakraLink>
                    </Link>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(news.id)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Panel>
    </>
  );
}
export const getServerSideProps = withSessionSsr(async function ({ req }) {
  const { user } = req.session;
  if (!user) {
    return {
      redirect: {
        destination: '/account/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});

export default AdminPanel;
