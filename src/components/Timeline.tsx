import React from 'react';
import { Box, VStack, Circle, Text, Flex, Icon } from '@chakra-ui/react';
import { BiGhost, BiTargetLock } from 'react-icons/bi';
import { differenceInDays, formatDistanceToNow } from 'date-fns';

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
          />
        ))}
      </VStack>
    </Box>
  );
}

function TimelineItem({ date, text, deathType }) {
  let formattedDate = timestampToDaysAgo(date);

  let DeathIcon;
  if (deathType) {
    DeathIcon = BiTargetLock;
  } else {
    DeathIcon = BiGhost;
  }

  return (
    <Flex w="100%" alignItems="center" justifyContent="space-between">
      <Text flex="1" textAlign="right" pr={2} fontStyle="italic">
        {formattedDate}
      </Text>
      <Box position="relative" zIndex="1">
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
      <Text flex="1" pl={2}>
        {text}
      </Text>
    </Flex>
  );
}

export default Timeline;
