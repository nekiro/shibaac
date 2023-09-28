import React from 'react';
import {
  Box,
  Flex,
  Grid,
  Image,
  Text,
  VStack,
  Badge,
  Icon,
  Button,
  Circle,
  Divider,
  Heading,
  Progress,
  Square,
} from '@chakra-ui/react';
import { getItemImageUrl } from '../lib';

interface CharacterData {
  id: string;
  name: string;
  level: number;
  vocation: string;
  transfer: boolean;
  auctionEnd: number;
  hasBeenBidded: boolean;
  currentBid: number;
  battlEyeStatus: boolean;
  world: string;
  items: any[];
  skills: any[];
  equipedItems: any[];
  imbuements: any[];
  charms: {
    total: number;
    max: number;
  };
}

interface Props {
  characterData: CharacterData;
}

const CharacterCard: React.FC<Props> = ({ characterData }) => {
  const {
    name,
    level,
    vocation,
    auctionEnd,
    battlEyeStatus,
    world,
    currentBid,
    charms,
    equipedItems,
    skills,
  } = characterData;

  const highestSkillValue = Math.max(...Object.values(characterData.skills));

  const getSkillColor = (skillValue: number) => {
    return skillValue === highestSkillValue ? 'green' : 'violet';
  };

  const renderLabeledBox = (label: string, children: React.ReactNode) => (
    <Box
      position="relative"
      borderWidth="1px"
      borderRadius="md"
      p="2"
      borderColor="#9261b8"
    >
      <Heading
        as="h4"
        size="xs"
        position="absolute"
        top="-10px"
        left="50%"
        transform="translateX(-50%)"
        bg="white"
        px="2"
      >
        {label}
      </Heading>
      <Box textAlign="center">{children}</Box>
    </Box>
  );

  const renderCardItem = (imgSrc: string) => (
    <Box
      boxSize="64px"
      bg="violet.500"
      display="flex"
      justifyContent="center"
      alignItems="center"
      borderRadius="md"
      overflow="hidden"
    >
      <Image boxSize="32px" src={imgSrc} alt="Item" />
    </Box>
  );

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      p="4"
      boxShadow="1px 1px 2px 1px rgba(0, 0, 0, 0.14)"
    >
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Box
          boxSize="60px"
          bg="#9261b8"
          borderRadius="50%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Image
            boxSize="56px"
            src={`https://static.tibia.com/images/charactertrade/outfits/1612_3.gif`}
            alt={name}
            objectFit="contain"
            transform="translate(-10px, -10px)"
          />
        </Box>
        <VStack align="start" flex="1" ml="4">
          <Text fontWeight="bold">{name}</Text>
          <Text fontSize="12px" color="gray.600">
            {level} - {vocation}
          </Text>
        </VStack>

        <Button>Fav</Button>
      </Flex>

      <Divider my="3" />

      <Grid templateColumns="repeat(2, 1fr)" gap={4} mb="3">
        {renderLabeledBox('Server', world)}
        {renderLabeledBox('PvP', <span>{battlEyeStatus}</span>)}
        {renderLabeledBox(
          'Fim do Leilão',
          new Date(auctionEnd * 1000).toLocaleString(),
        )}
        {renderLabeledBox(
          'Lance Atual',
          <Text>
            <Icon name="coin" />
            <span>{currentBid}</span>
          </Text>,
        )}
      </Grid>

      <Divider my="3" />

      <Grid templateColumns="repeat(4, 1fr)" gap={4} mt="4">
        {equipedItems &&
          equipedItems.slice(0, 4).map((equipaments: string) => {
            return (
              <div key={equipaments}>
                {renderCardItem(getItemImageUrl(equipaments))}
              </div>
            );
          })}
      </Grid>

      <Divider my="3" />

      <Grid templateColumns="repeat(2, 1fr)" gap={4} mt="4">
        <VStack spacing={4} align="start">
          {['Magic', 'Fist', 'Fishing', 'Distance'].map((skillName) => {
            const color = getSkillColor(characterData.skills[skillName]);
            return (
              <Box key={skillName} w="100%">
                <Flex align="center">
                  <Square
                    size="30px"
                    bg={`${color}.200`}
                    borderColor={`${color}.500`}
                    borderWidth="2px"
                    borderRadius="4px"
                    mr={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontWeight="bold"
                      fontSize="sm"
                      color={`${color}.800`}
                    >
                      {characterData.skills[skillName]}
                    </Text>
                  </Square>
                  <Text fontWeight="semibold" fontSize="sm">
                    {skillName}
                  </Text>
                </Flex>
                <Progress
                  value={characterData.skills[skillName]}
                  colorScheme={color}
                  size="xs"
                  mt={1}
                />
              </Box>
            );
          })}
        </VStack>
        <VStack spacing={4} align="start">
          {['Club', 'Sword', 'Axe', 'Shielding'].map((skillName) => {
            const color = getSkillColor(characterData.skills[skillName]);
            return (
              <Box key={skillName} w="100%">
                <Flex align="center">
                  <Square
                    size="30px"
                    bg={`${color}.200`}
                    borderColor={`${color}.500`}
                    borderWidth="2px"
                    borderRadius="4px"
                    mr={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontWeight="extrabold"
                      fontSize="sm"
                      color={`${color}.800`}
                    >
                      {characterData.skills[skillName]}
                    </Text>
                  </Square>
                  <Text fontWeight="semibold" fontSize="sm">
                    {skillName}
                  </Text>
                </Flex>
                <Progress
                  value={characterData.skills[skillName]}
                  colorScheme={color}
                  size="xs"
                  mt={1}
                />
              </Box>
            );
          })}
        </VStack>
      </Grid>

      <Divider my="3" />

      <Flex wrap="wrap" justifyContent="space-between">
        {`${charms.total}/${charms.max}`}
      </Flex>
    </Box>
  );
};

export default CharacterCard;
