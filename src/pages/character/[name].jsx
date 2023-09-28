import React, { useState, useEffect, useCallback } from 'react';
import Panel from '../../components/Panel';
import { fetchApi } from '../../lib/request';
import {
  timestampToDate,
  vocationIdToName,
  groupToName,
  secondsToTime,
} from '../../lib';
import { useRouter } from 'next/router';
import StrippedTable from '../../components/StrippedTable';
import Label from '../../components/Label';
import { Timeline } from '../../components/Timeline';
import { Box } from '@chakra-ui/react';

export default function Character() {
  const router = useRouter();
  const { name } = router.query;

  const [state, setState] = useState(null);

  const fetchData = useCallback(async () => {
    if (!name) return;

    const state = {};

    const response = await fetchApi('GET', `/api/player/${name}`);
    if (response.success) {
      state.player = response.player;

      // const townResponse = await fetchApi(
      //   'GET',
      //   `/api/town/${state.player.town_id}`,
      // );

      // if (townResponse.success) {
      //   state.town = townResponse.town;
      // }
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
        <Label colorScheme="red">Character not found.</Label>
      </Panel>
    );
  }

  const lastLoginDate =
    state.player.lastlogin > 0
      ? timestampToDate(state.player.lastlogin)
      : 'Never logged in';

  const isPremium = state.player.premium_ends_at >= Date.now();

  return (
    <>
      <Panel header="Character Information">
        <StrippedTable
          body={[
            [{ text: 'Name' }, { text: state.player.name }],
            [{ text: 'Level' }, { text: state.player.level }],
            [
              { text: 'Sex' },
              { text: state.player.sex == 1 ? 'Male' : 'Female' },
            ],
            [
              { text: 'Profession' },
              { text: vocationIdToName[state.player.vocation] },
            ],
            ...(state.player.town
              ? [
                  {
                    text: 'Town',
                  },
                  { text: state.player.town },
                ]
              : []),
            ...(state.player.guild
              ? [
                  {
                    text: 'Guild',
                  },
                  {
                    text: state.player.guild.name,
                  },
                ]
              : []),
            [{ text: 'Last Login' }, { text: lastLoginDate }],
            [
              { text: 'Online Time' },
              {
                text:
                  state.player.onlinetime > 0
                    ? secondsToTime(state.player.onlinetime)
                    : 'Never logged in',
              },
            ],
          ]}
        />
      </Panel>

      <Panel header="Account Information">
        <StrippedTable
          body={[
            ...(state.player.group_id > 1
              ? [
                  [
                    { text: 'Position' },
                    { text: groupToName[state.player.group_id] },
                  ],
                ]
              : []),
            [
              { text: 'Created' },
              {
                text:
                  state.player.creation > 0
                    ? timestampToDate(state.player.creation)
                    : 'Unknown',
              },
            ],
            [
              { text: 'Account Status' },
              {
                text: `${isPremium ? 'Premium' : 'Free'} Account`,
              },
            ],
          ]}
        />
      </Panel>

      {state.player.player_deaths.length > 0 && (
        <Box>
          <Panel header="Deaths">
            <Timeline
              items={state.player.player_deaths.map((death) => ({
                date: death.time,
                text: `${
                  death.is_player ? 'Fragged a player' : 'Died'
                } at level ${death.level}.`,
                killedByPlayer: death.is_player,
                killer: {
                  killed_by: death.killed_by,
                  mostdamage_by: death.mostdamage_by,
                  unjustified: death.unjustified,
                  level: death.killerDetails.level,
                  vocation: death.killerDetails.vocation,
                  isMonster: death.killerDetails.isMonster,
                  lookaddons: death.killerDetails.lookaddons,
                  lookbody: death.killerDetails.lookbody,
                  lookfeet: death.killerDetails.lookfeet,
                  lookhead: death.killerDetails.lookhead,
                  looklegs: death.killerDetails.looklegs,
                  looktype: death.killerDetails.looktype,
                },
              }))}
            />
          </Panel>
        </Box>
      )}

      {/* <span className="label label-danger">Deleted</span>  */}

      <Panel header="Characters">
        <StrippedTable
          head={[
            { text: 'Name' },
            { text: 'Level' },
            { text: 'Profession' },
            { text: 'Status' },
          ]}
          body={state.player.accounts.players.map((player) => [
            { href: `/character/${player.name}`, text: player.name },
            { text: player.level },
            { text: vocationIdToName[player.vocation] },
            { text: player.players_online ? 'Online' : 'Offline' },
          ])}
        />
      </Panel>
    </>
  );
}
