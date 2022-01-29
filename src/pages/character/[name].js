import React, { useState, useEffect, useCallback } from 'react';
import Panel from 'src/components/Panel';
import { fetchApi } from 'src/util/request';
import {
  timestampToDate,
  vocationIdToName,
  groupToName,
  secondsToTime,
} from 'src/util';
import { useRouter } from 'next/router';
import StrippedTable from 'src/components/StrippedTable';
import Link from 'next/link';
import Label from 'src/components/Label';

export default function Character() {
  const router = useRouter();
  const { name } = router.query;

  const [state, setState] = useState(null);

  const fetchData = useCallback(async () => {
    if (!name) return;

    const state = {};

    const response = await fetchApi('GET', `/api/players/${name}`);
    if (response.success) {
      state.player = response.player;

      const townResponse = await fetchApi(
        'GET',
        `/api/towns/${state.player.town_id}`
      );

      if (townResponse.success) {
        state.town = townResponse.town;
      }
    }

    setState(state);
  }, [name]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!state) {
    return <Panel header="Character Information" isLoading={true} />;
  }

  if (!state.player) {
    return (
      <Panel header="Character Info">
        <div className="alert alert-danger">Character not found.</div>
      </Panel>
    );
  }

  const lastLoginDate =
    state.player.lastlogin > 0
      ? timestampToDate(state.player.lastlogin)
      : 'Never logged in';

  const isPremium = state.player.premium_ends_at >= Date.now();

  // TODO: fix this page to show all informations

  return (
    <>
      <Panel header="Character Information">
        <StrippedTable>
          <tr>
            <td width="20%">Name</td>
            <td>{state.player.name}</td>
          </tr>
          <tr>
            <td>Sex</td>
            <td>{state.player.sex == 1 ? 'male' : 'female'}</td>
          </tr>
          <tr>
            <td>Profession</td>
            <td>{state.player.vocation}</td>
          </tr>
          <tr>
            <td>Level</td>
            <td>{state.player.level}</td>
          </tr>
          <tr>
            <td>Residence</td>
            <td>{state.town?.name}</td>
          </tr>
          <tr>
            <td>Guild</td>
            <td>none</td>
          </tr>
          <tr>
            <td>Last Login</td>
            <td>{lastLoginDate}</td>
          </tr>
          <tr>
            <td>Online Time</td>
            <td>{secondsToTime(state.player.onlinetime)}</td>
          </tr>
          {/* <tr>
            <td>Comment</td>
            <td>lol</td>
          </tr> */}
        </StrippedTable>
      </Panel>

      <Panel header="Account Information">
        <StrippedTable>
          <tr>
            <td>Position</td>
            <td>{groupToName[state.player.group_id]}</td>
          </tr>
          <tr>
            <td>Last Login</td>
            <td>{lastLoginDate}</td>
          </tr>
          <tr>
            <td>Created</td>
            <td>{timestampToDate(state.player.creation)}</td>
          </tr>
          <tr>
            <td>Account Status</td>
            <td>
              <Label
                success={isPremium}
                text={`${isPremium ? 'Premium' : 'Free'} Account`}
              />
              {/* <font color="red"> [Banished FOREVER]</font> */}
            </td>
          </tr>
        </StrippedTable>
      </Panel>

      <Panel header="Deaths">
        <StrippedTable>
          <tr>
            <td width="10%" align="center">
              date
            </td>
            <td>Died at level 22 by Nekiro and xD</td>
          </tr>
        </StrippedTable>
      </Panel>

      <Panel header="Characters">
        <StrippedTable
          head={[{ text: 'Name' }, { text: 'Level' }, { text: 'Status' }]}
        >
          {state.player.account.players.map((player) => (
            <tr key={player.name}>
              <td width="52%">
                {player.name == state.player.name ? (
                  player.name
                ) : (
                  <Link href={`/character/${player.name}`}>{player.name}</Link>
                )}
                {/* <span className="label label-danger">Deleted</span> */}
              </td>
              <td width="35%">
                {player.level} {vocationIdToName[player.vocation]}
              </td>
              <td>
                <Label
                  success={player.players_online ?? false}
                  text={player.players_online ? 'Online' : 'Offline'}
                />
              </td>
            </tr>
          ))}
        </StrippedTable>
      </Panel>
    </>
  );
}
