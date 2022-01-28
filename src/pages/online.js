import React, { useEffect, useState } from 'react';
import Panel from '../components/Panel';
import StrippedTable from '../components/StrippedTable';
import Head from '../layout/Head';
import fetchJson from '../util/fetchJson';
import Link from 'next/link';

export default function Online() {
  const [state, setState] = useState({ players: null, status: null });

  useEffect(() => {
    (async () => {
      const players = await fetchJson(`/api/players/online`);
      const status = await fetchJson(`/api/status`);
      setState((state) => {
        return {
          ...state,
          players,
          status,
        };
      });
    })();
  }, []);

  return (
    <>
      <Head title="Online"></Head>
      <Panel header="Online List" isLoading={!state.players}>
        <div className="alert alert-info">
          Overall Maximum: {state.status ? state.status.maxOnlineCount : '0'}{' '}
          players.
        </div>

        <div className="alert alert-info">
          There are currently {state.players ? state.players.length : 0} players
          online on {state.status ? state.status.name : '...'}
        </div>
        {state.players?.length > 0 && (
          <StrippedTable
            head={[
              { text: 'Name', style: { width: '70%' } },
              { text: 'Level', style: { width: '15%' } },
              { text: 'Vocation', style: { width: '15%' } },
            ]}
          >
            {state.players.map(({ player }) => (
              <tr key={player.name}>
                <td>
                  <Link href={`/character/${player.nam}`}>{player.name}</Link>
                </td>
                <td>{player.level}</td>
                <td>{player.vocation}</td>
              </tr>
            ))}
          </StrippedTable>
        )}
      </Panel>
    </>
  );
}
