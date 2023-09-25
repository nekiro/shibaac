import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import Panel from '../../components/Panel';

export default function Failure() {
  return (
    <Panel header="Donate - Success">
      <Box padding="20px">
        <Heading as="h1" size="xl" textAlign="center" marginBottom="20px">
          Payment Failed
        </Heading>
        <Text fontSize="lg" textAlign="center">
          We're sorry, but your transaction failed. Please try again or contact
          our support for assistance.
        </Text>
      </Box>
    </Panel>
  );
}
