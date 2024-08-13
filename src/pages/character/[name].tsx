import React, { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '../../lib/request';
import {
  timestampToDate,
  vocationIdToName,
  groupToName,
  secondsToTime,
} from '../../lib';
import { useRouter } from 'next/router';
import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  StackDivider,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Define the types for the state
interface Player {
  name: string;
  level: number;
  sex: number;
  vocation: number;
  town?: string;
  guild?: { name: string };
  lastlogin: number;
  onlinetime: number;
  premium_ends_at: number;
  creation: number;
  group_id: number;
  player_deaths: Death[];
  accounts?: { players: PlayerSummary[] };
}

interface Death {
  time: number;
  level: number;
  is_player: number;
  killed_by: string;
  killerDetails: KillerDetails;
}

interface KillerDetails {
  level: number;
  vocation: number;
  isMonster: number;
  lookaddons: number;
  lookbody: number;
  lookfeet: number;
  lookhead: number;
  looklegs: number;
  looktype: number;
}

interface PlayerSummary {
  name: string;
  level: number;
  vocation: number;
  players_online: boolean;
}

interface State {
  player?: Player;
  town?: string;
}

export default function Character() {
  const router = useRouter();
  const { name } = router.query;

  const [state, setState] = useState<State | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!name) return;

    try {
      const response = await fetchApi('GET', `/api/player/${name}`);
      if (response.success) {
        const playerData = response.player;
        const townResponse = await fetchApi(
          'GET',
          `/api/town/${playerData.town_id}`,
        );

        const state: State = {
          player: playerData,
          town: townResponse.success ? townResponse.town : undefined,
        };

        setState(state);
      } else {
        setError('Character not found.');
      }
    } catch (err) {
      setError('Failed to fetch character data.');
    } finally {
      setIsLoading(false);
    }
  }, [name]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('lg', 'dark-lg');

  if (isLoading) {
    return (
      <VStack justify="center" align="center" h="100vh">
        <Spinner size="xl" color="purple.500" />
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack justify="center" align="center" h="100vh">
        <Alert status="error" maxW="md">
          <AlertIcon />
          {error}
        </Alert>
      </VStack>
    );
  }

  if (!state?.player) {
    return (
      <VStack justify="center" align="center" h="100vh">
        <Text fontSize="xl" color="red.500">
          Character not found.
        </Text>
      </VStack>
    );
  }

  const { player } = state;
  const lastLoginDate =
    player.lastlogin > 0
      ? timestampToDate(player.lastlogin)
      : 'Never logged in';
  const isPremium = player.premium_ends_at >= Date.now();

  return (
    <VStack
      spacing={6}
      align="stretch"
      p={4}
      maxW="6xl"
      mx="auto"
      divider={<StackDivider borderColor="gray.200" />}
    >
      {/* Character Overview */}
      <HStack
        as={motion.div}
        p={6}
        bg={cardBg}
        boxShadow={cardShadow}
        borderRadius="md"
        align="center"
        spacing={6}
        whileHover={{ scale: 1.02 }}
        transition="0.2s"
      >
        <Avatar
          size="xl"
          name={player.name}
          src={`/images/characters/${player.name}.jpg`}
        />
        <VStack align="flex-start" spacing={1}>
          <Heading size="lg">{player.name}</Heading>
          <HStack>
            <Badge colorScheme="purple">
              {vocationIdToName[player.vocation]}
            </Badge>
            <Badge colorScheme={player.sex === 1 ? 'blue' : 'pink'}>
              {player.sex === 1 ? 'Male' : 'Female'}
            </Badge>
            {isPremium && <Badge colorScheme="yellow">Premium</Badge>}
          </HStack>
          <Text fontSize="sm" color="gray.500">
            Level {player.level} - {state.town || 'Unknown Town'}
          </Text>
        </VStack>
      </HStack>

      {/* Character Information */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <VStack
          as={motion.div}
          p={6}
          bg={cardBg}
          boxShadow={cardShadow}
          borderRadius="md"
          align="flex-start"
          spacing={3}
          whileHover={{ scale: 1.02 }}
          transition="0.2s"
        >
          <Text fontWeight="bold">Account Status:</Text>
          <Text>{isPremium ? 'Premium Account' : 'Free Account'}</Text>

          <Text fontWeight="bold">Last Login:</Text>
          <Text>{lastLoginDate}</Text>

          <Text fontWeight="bold">Online Time:</Text>
          <Text>
            {player.onlinetime > 0
              ? secondsToTime(player.onlinetime)
              : 'Never logged in'}
          </Text>
        </VStack>

        {player.guild && (
          <VStack
            as={motion.div}
            p={6}
            bg={cardBg}
            boxShadow={cardShadow}
            borderRadius="md"
            align="flex-start"
            spacing={3}
            whileHover={{ scale: 1.02 }}
            transition="0.2s"
          >
            <Text fontWeight="bold">Guild:</Text>
            <Text>{player.guild.name}</Text>
          </VStack>
        )}
      </SimpleGrid>

      {/* Deaths Timeline */}
      {player.player_deaths.length > 0 && (
        <VStack
          as={motion.div}
          p={6}
          bg={cardBg}
          boxShadow={cardShadow}
          borderRadius="md"
          align="flex-start"
          spacing={3}
          whileHover={{ scale: 1.02 }}
          transition="0.2s"
        >
          <Heading size="md">Deaths</Heading>
          <Timeline
            items={player.player_deaths.map((death) => ({
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
        </VStack>
      )}

      {/* Other Characters */}
      <VStack
        as={motion.div}
        p={6}
        bg={cardBg}
        boxShadow={cardShadow}
        borderRadius="md"
        align="flex-start"
        spacing={3}
        whileHover={{ scale: 1.02 }}
        transition="0.2s"
      >
        <Heading size="md">Other Characters</Heading>
        {player.accounts?.players?.length > 0 ? (
          player.accounts.players.map((p) => (
            <HStack key={p.name} spacing={4}>
              <Text
                as="a"
                href={`/character/${p.name}`}
                fontWeight="bold"
                color="purple.500"
              >
                {p.name}
              </Text>
              <Text>Level {p.level}</Text>
              <Badge colorScheme={p.players_online ? 'green' : 'gray'}>
                {p.players_online ? 'Online' : 'Offline'}
              </Badge>
            </HStack>
          ))
        ) : (
          <Text>No other characters found.</Text>
        )}
      </VStack>
    </VStack>
  );
}
