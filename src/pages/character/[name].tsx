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
  Grid,
  GridItem,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  useColorModeValue,
  Heading,
  Divider,
  Flex,
  Container,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const Card = ({ children, ...props }) => (
  <Box
    as={motion.div}
    p={6}
    bg={useColorModeValue('gray.900', 'gray.700')}
    boxShadow="lg"
    borderRadius="lg"
    whileHover={{ scale: 1.02 }}
    transition="0.2s"
    {...props}
  >
    {children}
  </Box>
);

const Section = ({ title, children, ...props }) => (
  <VStack align="flex-start" spacing={4} {...props}>
    <Heading size="md" color="purple.500">
      {title}
    </Heading>
    <Divider borderColor="gray.600" />
    {children}
  </VStack>
);

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
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Character Overview */}
        <Card>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            spacing={6}
          >
            <Avatar
              size="2xl"
              name={player.name}
              src={`/images/characters/${player.name}.jpg`}
              border="2px solid purple"
              mb={{ base: 4, md: 0 }}
            />
            <VStack align="flex-start" spacing={3} ml={{ md: 6 }}>
              <Heading size="lg" color="purple.500">
                {player.name}
              </Heading>
              <HStack spacing={4}>
                <Badge colorScheme="purple">
                  {vocationIdToName[player.vocation]}
                </Badge>
                <Badge colorScheme={player.sex === 1 ? 'blue' : 'pink'}>
                  {player.sex === 1 ? 'Male' : 'Female'}
                </Badge>
                {isPremium && <Badge colorScheme="yellow">Premium</Badge>}
              </HStack>
              <Text fontSize="lg" color="gray.400">
                Level {player.level} - {state.town || 'Unknown Town'}
              </Text>
            </VStack>
          </Flex>
        </Card>

        {/* Character Information */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Card>
            <Section title="Account Information">
              <Text fontWeight="bold" color="purple.500">
                Account Status:
              </Text>
              <Text color="gray.300">
                {isPremium ? 'Premium Account' : 'Free Account'}
              </Text>

              <Text fontWeight="bold" color="purple.500">
                Last Login:
              </Text>
              <Text color="gray.300">{lastLoginDate}</Text>

              <Text fontWeight="bold" color="purple.500">
                Online Time:
              </Text>
              <Text color="gray.300">
                {player.onlinetime > 0
                  ? secondsToTime(player.onlinetime)
                  : 'Never logged in'}
              </Text>
            </Section>
          </Card>

          <Card>
            <Section title="Inventory">
              <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                {player.items?.map((item, index) => (
                  <GridItem key={index} w="100%" h="100%">
                    <Avatar
                      size="lg"
                      src={`/images/items/${item.image}`}
                      alt={item.name}
                      border="1px solid gray"
                      borderRadius="md"
                      bg="gray.800"
                    />
                  </GridItem>
                ))}
              </Grid>
            </Section>
          </Card>

          {player.guild && (
            <Card>
              <Section title="Guild">
                <Text fontWeight="bold" color="purple.500">
                  Guild Name:
                </Text>
                <Text color="gray.300">{player.guild.name}</Text>
              </Section>
            </Card>
          )}
        </SimpleGrid>

        {/* Deaths Timeline */}
        {player.player_deaths.length > 0 && (
          <Card>
            <Section title="Deaths">
              {player.player_deaths.map((death, index) => (
                <Box key={index} color="gray.300">
                  <Text>
                    {`${
                      death.is_player ? 'Fragged a player' : 'Died'
                    } at level ${death.level} by ${death.killed_by}.`}
                  </Text>
                  {index < player.player_deaths.length - 1 && (
                    <Divider borderColor="gray.600" my={3} />
                  )}
                </Box>
              ))}
            </Section>
          </Card>
        )}

        {/* Other Characters */}
        <Card>
          <Section title="Other Characters">
            {player.accounts?.players?.length > 0 ? (
              player.accounts.players.map((p) => (
                <HStack
                  key={p.name}
                  spacing={4}
                  w="full"
                  justify="space-between"
                >
                  <Text
                    as="a"
                    href={`/character/${p.name}`}
                    fontWeight="bold"
                    color="purple.500"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {p.name}
                  </Text>
                  <Text color="gray.300">Level {p.level}</Text>
                  <Badge colorScheme={p.players_online ? 'green' : 'gray'}>
                    {p.players_online ? 'Online' : 'Offline'}
                  </Badge>
                </HStack>
              ))
            ) : (
              <Text color="gray.300">No other characters found.</Text>
            )}
          </Section>
        </Card>
      </VStack>
    </Container>
  );
}
