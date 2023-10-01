import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';
import { fetchApi } from '../../lib/request';
import { withSessionSsr } from '../../lib/session';
import { TextEditor } from '../../components/Editor';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
} from '@chakra-ui/react';

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

export default function CreateNews({ user }: any) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [playerNick, setPlayerNick] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [info, setInfo] = useState<Account | null>(null);

  const router = useRouter();

  const fetchData = useCallback(async () => {
    const response = await fetchApi('GET', `/api/account/${user.id}`);

    setInfo(response.account);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const findNameWithId = info?.players.find(
      (player) => player.name === playerNick,
    );

    try {
      await fetchApi('POST', '/api/news', {
        data: {
          title,
          content,
          playerNick,
          imageUrl,
          authorId: findNameWithId?.id,
        },
      });

      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head title="Create News" />
      <Panel header="Create News">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} w="100%">
            <FormControl id="title">
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl id="content">
              <FormLabel>Content</FormLabel>
              <TextEditor
                value={content}
                onChange={(value) => setContent(value)}
                onImageUpload={handleSubmit}
              />
            </FormControl>
            <FormControl id="author">
              <FormLabel>Author</FormLabel>
              <Select
                placeholder="Select"
                value={playerNick}
                onChange={(e) => setPlayerNick(e.target.value)}
              >
                {info?.players?.map((player, index) => (
                  <option key={index} value={player.name}>
                    {player.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Button colorScheme="blue" type="submit">
              Create
            </Button>
          </VStack>
        </form>
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

  if (user.type < Number(process.env.NEXT_PUBLIC_PERMISSION_ADMINPANEL)) {
    return {
      redirect: {
        destination: '/account',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
});
