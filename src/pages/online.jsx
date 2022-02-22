import React, { useEffect, useState, useCallback } from 'react';
import Panel from '../components/Panel';
import StrippedTable from '../components/StrippedTable';
import Head from '../layout/Head';
import Link from 'next/link';
import { fetchApi } from '../util/request';
import { vocationIdToName } from '../util';

export default function Online() {
  const [state, setState] = useState(null);

  const fetchData = useCallback(async () => {
    const players = await fetchApi('GET', `/api/players/online`);
    const status = await fetchApi('GET', `/api/status`);

    if (players.success && status.success) {
      setState({
        players: players.players,
        status: status.status,
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!state) {
    return <Panel header="Online List" isLoading={true} />;
  }

  return (
    <>
      <Head title="Online"></Head>
      <Panel header="Online List">
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
            {state.players.map((player) => (
              <tr key={player.name}>
                <td>
                  <Link href={`/character/${player.name}`}>{player.name}</Link>
                </td>
                <td>{player.level}</td>
                <td>{vocationIdToName[player.vocation]}</td>
              </tr>
            ))}
          </StrippedTable>
        )}
      </Panel>
    </>
  );
}
