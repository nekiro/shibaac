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
import { Box, VStack, HStack, Circle, Text, Flex } from '@chakra-ui/react';

const player_deaths = [
  {
    player_id: 1,
    time: 1694755956,
    level: 5,
    killed_by: 'Orc Warrior',
    is_player: false,
    mostdamage_by: 'Dragon',
    mostdamage_is_player: false,
    unjustified: true,
    mostdamage_unjustified: true,
  },
  {
    player_id: 1,
    time: 1695155956,
    level: 10,
    killed_by: 'Player123',
    is_player: true,
    mostdamage_by: 'Player456',
    mostdamage_is_player: true,
    unjustified: false,
    mostdamage_unjustified: false,
  },
  {
    player_id: 1,
    time: 1693755956,
    level: 10,
    killed_by: 'Player123',
    is_player: true,
    mostdamage_by: 'Player456',
    mostdamage_is_player: true,
    unjustified: false,
    mostdamage_unjustified: false,
  },
  {
    player_id: 1,
    time: 1695745956,
    level: 10,
    killed_by: 'Player123',
    is_player: true,
    mostdamage_by: 'Player456',
    mostdamage_is_player: true,
    unjustified: false,
    mostdamage_unjustified: false,
  },
];

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

      const townResponse = await fetchApi(
        'GET',
        `/api/town/${state.player.town_id}`,
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

      {player_deaths.length > 0 && (
        <Box>
          <Panel header="Deaths">
            <Timeline
              items={player_deaths.map((death) => ({
                date: death.time,
                text: `Died at level ${death.level} by ${death.killed_by}`,
                killedByPlayer: death.is_player,
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
