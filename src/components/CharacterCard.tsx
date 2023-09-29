import React, { useState } from 'react';

import {
  Box,
  Flex,
  Grid,
  Image,
  Text,
  VStack,
  Icon,
  Checkbox,
  Divider,
  Heading,
  Progress,
  Square,
  Collapse,
  Button,
  Tooltip,
} from '@chakra-ui/react';
import { getItemImageUrl } from '../lib';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Towns, vocationIdToName } from '../lib';

type BidList = {
  amount: number;
  bazarListingId: number;
  bidderPlayerName: string;
  id: number;
  createdAt: Date;
};

interface CharacterData {
  id: string;
  name: string;
  level: number;
  vocation: string;
  transfer: boolean;
  coins: number;
  pvpType: string;
  remainingTime: number;
  hasBeenBidded: boolean;
  battlEyeStatus: boolean;
  world: string;
  items: any[];
  skills: any[];
  quests: any[];
  extras: {
    wastedCoins: number;
  };
  equipedItems: any[];
  imbuements: any[];
  charms: {
    charm_points: string;
    charm_expansion: number;
    rune_wound: number;
  };
  BazarBids: BidList[];
}

interface Props {
  characterData: CharacterData;
  openBidModal: (CharacterData) => void;
}

const CharacterCard: React.FC<Props> = ({ characterData, openBidModal }) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    name,
    level,
    vocation,
    coins,
    remainingTime,
    world,
    pvpType,
    charms,
    quests,
    equipedItems,
    skills,
    extras,
    BazarBids,
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

  const renderBids = () => {
    return BazarBids.map((bid, index) => (
      <div key={bid.id}>
        {index + 1}. {bid.amount} coins by {bid.bidderPlayerName || 'Anonymous'}{' '}
        at {new Date(bid.createdAt).toLocaleString()}
      </div>
    ));
  };

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
            {level} - {vocationIdToName[vocation]}
          </Text>
        </VStack>

        <Button onClick={() => openBidModal(characterData)}>Bid</Button>
      </Flex>

      <Divider my="3" />

      <Grid templateColumns="repeat(2, 1fr)" gap={4} mb="3">
        {renderLabeledBox('Town', Towns[world])}
        {renderLabeledBox('Server Type', <span>{pvpType}</span>)}
        {renderLabeledBox('Final Auction', remainingTime)}
        {renderLabeledBox(
          'Current Bid',
          <Tooltip
            label={renderBids()}
            fontSize="sm"
            placement="top"
            maxW="300px"
            overflowWrap="break-word"
            bg="violet.700"
            color="white"
            p={2}
            borderRadius="md"
            border="1px solid"
            borderColor="violet.600"
            shadow="lg"
          >
            <Text display="flex" alignItems="center" justifyContent="center">
              <Image src="/images/ico-tibia-coin.png" marginRight="10px" />
              <span>
                {coins > BazarBids[0].amount ? coins : BazarBids[0].amount}
              </span>
            </Text>
          </Tooltip>,
        )}
      </Grid>

      <Divider my="3" />

      <Grid templateColumns="repeat(4, 1fr)" gap={4} mt="4">
        {equipedItems &&
          Object.values(equipedItems)
            .filter((item) => item !== null)
            .slice(0, 4)
            .map((equipaments: string) => {
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
            const color = getSkillColor(skills[skillName]);
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
                      {skills[skillName]}
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

      <Box position="relative">
        <Heading color="violet.400">Extras</Heading>
        <Divider my="3" />
        <Box
          position="absolute"
          top="10px"
          right="10px"
          cursor="pointer"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Box>

        <Collapse in={showDetails} animateOpacity>
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mt="15">
            <VStack spacing={4} align="start">
              {['imbuements', 'charms', 'quests'].map((itemName) => (
                <Box key={itemName} w="100%">
                  <Flex align="center" justify="space-between">
                    <Text fontWeight="semibold" fontSize="sm">
                      {itemName.charAt(0).toUpperCase() + itemName.slice(1)}
                    </Text>

                    {itemName === 'quests' ? (
                      <Tooltip
                        label={quests?.join(', ')}
                        fontSize="xs"
                        placement="top"
                        maxW="300px"
                        overflowWrap="break-word"
                        bg="violet.700"
                        color="white"
                        p={2}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="violet.600"
                        shadow="lg"
                      >
                        <Text fontSize="sm">{quests.length}/41</Text>
                      </Tooltip>
                    ) : itemName === 'charms' ? (
                      <Text fontSize="sm">
                        {charms.charm_points ? charms.charm_points : '0'}/19
                      </Text>
                    ) : (
                      <Text fontSize="sm">0</Text>
                    )}
                  </Flex>
                </Box>
              ))}
              <Box w="100%">
                <Flex align="center" justify="space-between">
                  <Text fontWeight="semibold" fontSize="sm">
                    Boss Points
                  </Text>
                  <Text fontSize="sm">0</Text>
                </Flex>
              </Box>
            </VStack>

            <VStack spacing={4} align="start">
              {extras &&
                Object.entries(extras).map(([key, value], index) => (
                  <Checkbox
                    key={index}
                    isChecked={true}
                    isReadOnly
                    size="lg"
                    colorScheme="purple"
                    fontSize="md"
                    fontWeight="medium"
                    borderColor="violet.600"
                    borderRadius="md"
                    px={2}
                    py={1}
                    _checked={{
                      bg: 'violet.200',
                      borderColor: 'violet.500',
                      color: 'violet.800',
                    }}
                  >
                    {key}: {value}
                  </Checkbox>
                ))}
            </VStack>
          </Grid>
        </Collapse>
      </Box>
    </Box>
  );
};

export default CharacterCard;
