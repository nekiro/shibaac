import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import Panel from '../../components/Panel';

export default function Pending() {
  return (
    <Panel header="Donate - Success">
      <Box padding="20px">
        <Heading as="h1" size="xl" textAlign="center" marginBottom="20px">
          Payment Pending
        </Heading>
        <Text fontSize="lg" textAlign="center">
          Your payment is currently pending. We will notify you once it's
          confirmed.
        </Text>
      </Box>
    </Panel>
  );
}
