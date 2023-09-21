import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Panel from 'src/components/Panel';
import Head from 'src/layout/Head';
import { fetchApi } from 'src/util/request';
import { withSessionSsr } from 'src/util/session';

import { CKEditorComponent } from 'src/components/Editor';

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
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  const fetchData = useCallback(async () => {
    const response = await fetchApi('GET', `/api/accounts/${user.id}`);

    const mappedResponse = {
      id: response.data.account.id,
      name: response.data.account.name,
      players: response.data.account.players,
    };

    setInfo(mappedResponse);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const findNameWithId = info?.players.find(
      (player) => player.name === playerNick
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
      <Head title="Create News"></Head>
      <Panel header="Create News">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Content</label>

            {isClient && (
              <CKEditorComponent setValue={setContent} value={content} />
            )}
          </div>
          <div className="form-group">
            <label>Author</label>
            <select
              className="form-control"
              value={playerNick}
              onChange={(e) => setPlayerNick(e.target.value)}
            >
              <option value="" disabled>
                Selecione
              </option>
              {info?.players?.map((player, index) => (
                <option key={index} value={player.name}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              className="form-control"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
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

  return {
    props: { user },
  };
});
