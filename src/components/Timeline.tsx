import React from 'react';
import {
  Box,
  VStack,
  Circle,
  Text,
  Flex,
  Icon,
  Badge,
  Avatar,
  Image,
} from '@chakra-ui/react';
import { BiGhost, BiTargetLock } from 'react-icons/bi';
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import { vocationIdToName, getOutfitImageUrl } from '../lib';

export function timestampToDaysAgo(timestamp) {
  const date = new Date(timestamp * 1000);
  const daysDifference = differenceInDays(new Date(), date);

  if (daysDifference <= 1) {
    return formatDistanceToNow(date) + ' ago';
  } else {
    return daysDifference + ' days ago';
  }
}

export function Timeline({ items }) {
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack align="start" spacing={10} w="100%" position="relative">
        <Box
          position="absolute"
          bg="purple.300"
          width="2px"
          height="calc(100% - 20px)"
          left="calc(50% - 1px)"
          top="10px"
          zIndex="1"
        />
        {items.map((item, index) => (
          <TimelineItem
            key={index}
            date={item.date}
            text={item.text}
            deathType={item.killedByPlayer}
            killer={item.killer}
          />
        ))}
      </VStack>
    </Box>
  );
}

function TimelineItem({ date, text, deathType, killer }) {
  let formattedDate = timestampToDaysAgo(date);

  const monsterImageUrl = 'https://www.tibiawiki.com.br/images/1/19/Hydra.gif';

  const player = {
    lookaddons: killer.lookaddons,
    lookbody: killer.lookbody,
    lookfeet: killer.lookfeet,
    lookhead: killer.lookhead,
    looklegs: killer.looklegs,
    looktype: killer.looktype,
  };

  let DeathIcon;
  if (deathType) {
    DeathIcon = BiTargetLock;
  } else {
    DeathIcon = BiGhost;
  }

  return (
    <Flex w="100%" justifyContent="space-between" alignItems="center">
      <Text flex="1" textAlign="right" pr={2} fontStyle="italic">
        {formattedDate}
      </Text>
      <Box position="relative" zIndex="1" alignSelf="flex-start">
        <Circle
          size="34px"
          bg="purple.300"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={DeathIcon} color="white" fontSize={20} />
        </Circle>
      </Box>
      <Flex flex="1" pl={2} direction="column">
        <Text mb="10px">
          {text} {deathType && <Badge colorScheme="red">unjustified</Badge>}
        </Text>
        <Flex alignItems="center">
          {' '}
          <Box
            border="3px solid #9261b8"
            borderRadius="50%"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            width="68px"
            height="68px"
          >
            <Circle size="64px" bg="#b794f4" position="relative">
              <Image
                src={
                  killer.isMonster ? monsterImageUrl : getOutfitImageUrl(player)
                }
                alt={`${killer.name}'s Outfit`}
                height="68px"
                width="68px"
                objectFit="contain"
                position="absolute"
                top="50%"
                left="50%"
                transform={
                  killer.isMonster
                    ? 'translate(-50%, -50%)'
                    : 'translate(-50%, -50%) translate(-14px, -14px)'
                }
                zIndex="1"
              />
            </Circle>
          </Box>
          <Text display="flex" ml="16px">
            <Text color="#b794f4" mr="8px">
              {killer.killed_by}
            </Text>
            {!killer.isMonster &&
              ` ${killer.level} ${vocationIdToName[killer.vocation]}`}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Timeline;
