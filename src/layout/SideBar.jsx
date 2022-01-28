import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import fetchJson from '../util/fetchJson';
import Panel from '../components/Panel';
import Label from '../components/Label';

const SideBar = () => {
  const [state, setState] = useState({
    topPlayers: null,
    serverStatus: null,
  });

  useEffect(() => {
    (async () => {
      const topPlayers = await fetchJson(`/api/players/top5`);
      const serverStatus = await fetchJson(`/api/status`);
      setState((state) => {
        return {
          ...state,
          topPlayers,
          serverStatus,
        };
      });
    })();
  }, []);

  return (
    <div className="sidebar">
      <Panel
        header="Server Status"
        isLoading={!state.topPlayers || !state.serverStatus}
      >
        <table className="table table-condensed table-content table-striped">
          <tbody>
            <tr>
              <td>
                {state.serverStatus && state.serverStatus.online ? (
                  <Label text="ONLINE" success={true} />
                ) : (
                  <Label text="OFFLINE" success={false} />
                )}
              </td>
            </tr>
            <tr>
              <td>
                {state.serverStatus ? (
                  <Link href="/online">{`${state.serverStatus.onlineCount} players online`}</Link>
                ) : null}
              </td>
            </tr>
          </tbody>
        </table>
      </Panel>

      <Panel header="Top 5 Level" isLoading={!state.topPlayers}>
        <table className="table table-condensed table-content table-striped">
          <tbody>
            {state.topPlayers
              ? state.topPlayers.map((player) => (
                  <tr key={player.name}>
                    <td style={{ width: '80%' }}>
                      <strong>1.</strong>{' '}
                      <Link href={`/character/${player.name}`} passHref>
                        <a>
                          <b>{player.name}</b>
                        </a>
                      </Link>
                    </td>
                    <td>
                      <span className="label label-primary">
                        {player.level}
                      </span>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </Panel>
    </div>
  );
};

export default SideBar;
