import React, { useState, useEffect } from 'react';
import Panel from '../../components/Panel';
import fetchJson from '../../util/fetchJson';
import {
  timestampToDate,
  vocationIdToName,
  groupToName,
  secondsToTime,
} from '../../util';
import { useRouter } from 'next/router';
import StrippedTable from '../../components/StrippedTable';
import Link from 'next/link';
import Label from '../../components/Label';

export default function Character() {
  const router = useRouter();
  const { name } = router.query;

  const [state, setState] = useState({
    character: null,
    town: null,
    loading: true,
  });

  useEffect(() => {
    if (!name) return;

    (async () => {
      let character = null;
      let town = null;

      try {
        character = await fetchJson(`/api/players/${name}`);
      } catch (error) {}

      try {
        // town is not really mandatory to show character page, so lets leave it here
        town = await fetchJson(`/api/towns/${character.town_id}`);
      } catch {}

      setState((currentState) => ({
        ...currentState,
        character,
        town,
        loading: false,
      }));
    })();
  }, [name]);

  if (state.loading) {
    return <Panel header="Character Information" isLoading={state.loading} />;
  }

  if (!state.character) {
    return (
      <Panel header="Character Info">
        <div className="alert alert-danger">Character not found.</div>
      </Panel>
    );
  }

  const lastLoginDate =
    state.character.lastlogin > 0
      ? timestampToDate(state.character.lastlogin)
      : 'Never logged in';
  const isPremium = state.character.premium_ends_at >= Date.now();

  return (
    <>
      <Panel header="Character Information">
        <StrippedTable>
          <tr>
            <td width="20%">Name</td>
            <td>{state.character.name}</td>
          </tr>
          <tr>
            <td>Sex</td>
            <td>{state.character.sex == 1 ? 'male' : 'female'}</td>
          </tr>
          <tr>
            <td>Profession</td>
            <td>{state.character.vocation}</td>
          </tr>
          <tr>
            <td>Level</td>
            <td>{state.character.level}</td>
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
            <td>{secondsToTime(state.character.onlinetime)}</td>
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
            <td>{groupToName[state.character.group_id]}</td>
          </tr>
          <tr>
            <td>Last Login</td>
            <td>{lastLoginDate}</td>
          </tr>
          <tr>
            <td>Created</td>
            <td>{timestampToDate(state.character.creation)}</td>
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
          {state.character.account.players.map((player) => (
            <tr key={player.name}>
              <td width="52%">
                {player.name == state.character.name ? (
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
