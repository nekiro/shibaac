import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import Panel from '../../components/Panel';

export default function Success() {
  return (
    <Panel header="Donate - Success">
      <Box padding="20px">
        <Heading as="h1" size="xl" textAlign="center" marginBottom="20px">
          Payment Successful!
        </Heading>
        <Text fontSize="lg" textAlign="center">
          Thank you for your payment! Your transaction was successful.
        </Text>
      </Box>
    </Panel>
  );
}
