import React, { ReactNode } from 'react';
import Loader from './Loader';
import { Flex, Box, Text, Grid } from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import { formatDate } from '../lib/';

interface PanelProps {
  header?: string;
  date?: string | null;
  identifier?: string | null;
  children?: ReactNode;
  isLoading?: boolean;
}

const Panel: React.FC<PanelProps> = ({
  header = 'Loading...',
  date = null,
  identifier = null,
  children,
  isLoading = false,
}) => {
  return (
    <Flex
      key={identifier}
      width="calc(100% - 20)"
      flexDirection="column"
      color="rgb(178, 120, 255)"
      border="1px"
      borderColor="gray.700"
      mb="20px"
      ml="20"
      bgColor="rgb(17, 17, 17)"
      borderRadius="md"
      boxShadow="lg"
    >
      <Flex
        bg="rgb(14, 14, 14)"
        borderRadius="md"
        px={4}
        py={3}
        alignItems="center"
      >
        <Grid width="100%" templateColumns="1fr auto">
          <Text fontSize="xl" fontWeight="bold" color="rgb(178, 120, 255)">
            {header}
          </Text>
          {date && (
            <Box display="flex" justifyContent="flex-end">
              <Text
                display="flex"
                alignItems="center"
                color="rgb(178, 120, 255)"
              >
                <TimeIcon mr={2} /> {formatDate(date)}
              </Text>
            </Box>
          )}
        </Grid>
      </Flex>
      <Box padding="10px" bg="rgb(17, 17, 17)" borderBottomRadius="md">
        {isLoading ? <Loader /> : children}
      </Box>
    </Flex>
  );
};

export default Panel;
