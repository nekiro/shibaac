import React, { useEffect, useState, useCallback } from 'react';
import Panel from '../components/Panel';
import StrippedTable from '../components/StrippedTable';
import Head from '../layout/Head';
import { fetchApi } from '../util/request';
import { vocationIdToName } from '../util';
import Label from '../components/Label';

export default function Online() {
  const [state, setState] = useState(null);

  const fetchData = useCallback(async () => {
    const players = await fetchApi('GET', `/api/player/online`);
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
        <Label colorScheme="violet" fontSize="sm">
          Overall Maximum: {state.status ? state.status.maxOnlineCount : '0'}{' '}
          players. There are currently{' '}
          {state.players ? state.players.length : 0} players online on{' '}
          {state.status ? state.status.name : '...'}
        </Label>

        {/* <Label colorScheme="violet" fontSize="sm">
          There are currently {state.players ? state.players.length : 0} players
          online on {state.status ? state.status.name : '...'}
        </Label> */}
        {state.players?.length > 0 && (
          <StrippedTable
            head={[{ text: 'Name' }, { text: 'Level' }, { text: 'Vocation' }]}
            body={state.players.map((player) => [
              { href: `/character/${player.name}`, text: player.name },
              { text: player.level },
              { text: vocationIdToName[player.vocation] },
            ])}
          />
        )}
      </Panel>
    </>
  );
}
