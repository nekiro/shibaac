import { Box, Button, Flex, Grid, Icon, VStack } from '@chakra-ui/react';

import React from 'react';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';
import CharacterCard from '../../components/CharacterCard';

const listBazarCharacters = [
  {
    id: 1,
    name: 'Pantes',
    characterPage: 'Ir para a página do personagem',
    level: 500,
    vocation: 'Elite Knight',
    highlight: 'Destaque seu leilão!',
    country: 'BR',
    world: 'Gentebra',
    pvpType: 'Optional',
    battlEyeStatus: 'Yellow BattlEyeOptional',
    remainingTime: '9h 5m',
    endingAt: '20:00',
    coins: 3001,
    skills: {
      Magic: 121,
      Club: 14,
      Fist: 49,
      Sword: 17,
      Fishing: 71,
      Axe: 29,
      Distance: 113,
      Shielding: 10,
    },
    equipedItems: [3079, 3397, 5741, 8863],
    imbuements: {
      total: 16,
      max: 23,
    },
    charms: {
      total: 4,
      max: 19,
    },
    quests: {
      total: 16,
      max: 41,
    },
    bossPoints: 920,
    extras: [
      'Charm Expansion',
      'Prey Slot',
      'Tibia Coin 2,400 investido',
      'Soul War disponível 💀',
      'Primal Ordeal disponível 🦖',
    ],
  },
  {
    id: 2,
    name: 'Pedrog',
    characterPage: 'Ir para a página do personagem',
    level: 999,
    vocation: 'Elder Druid',
    highlight: 'Destaque seu leilão!',
    country: 'BR',
    world: 'Amera',
    battlEyeStatus: 'Green BattlEye',
    remainingTime: '9h 5m',
    endingAt: '20:00',
    coins: 3001,
    skills: {
      Magic: 121,
      Club: 14,
      Fist: 49,
      Sword: 17,
      Fishing: 71,
      Axe: 29,
      Distance: 113,
      Shielding: 10,
    },
    equipedItems: [3397, 5741, 8863, 3419, 3276],
    imbuements: {
      total: 16,
      max: 23,
    },
    charms: {
      total: 4,
      max: 19,
    },
    quests: {
      total: 16,
      max: 41,
    },
    bossPoints: 920,
    extras: [
      'Charm Expansion',
      'Prey Slot',
      'Tibia Coin 2,400 investido',
      'Soul War disponível 💀',
      'Primal Ordeal disponível 🦖',
    ],
  },
];

export default function CharacterBazar() {
  return (
    <>
      <Head title="Highscores" />

      <Panel header="Character Bazar">
        <Grid templateColumns="repeat(auto-fit, minmax(240px, 1fr))" gap={6}>
          {listBazarCharacters.map((item, index) => (
            <CharacterCard key={index} characterData={item} />
          ))}
        </Grid>
      </Panel>
    </>
  );
}
