import React from 'react';
import Loader from './Loader';
import { Flex, Box, Text, Grid } from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';

const Panel = ({ header, date, identifier, children, isLoading }) => {
  return (
    <Flex
      key={identifier}
      width="100%"
      flexDirection="column"
      color="black"
      border="1px"
      borderColor="#ddd"
      mb="20px"
      bgColor="#fff"
      borderRadius="md"
    >
      <Flex bg="#f5f5f5" border="1px" borderColor="#ddd" borderRadius="md">
        <Grid margin="10px" width="100%" templateColumns="1fr auto">
          <Text colSpan={1}>{header}</Text>
          {date && (
            <Box>
              <Text colSpan={2} align="right">
                <TimeIcon /> {date}
              </Text>
            </Box>
          )}
        </Grid>
      </Flex>
      <Box padding="10px">{isLoading ? <Loader /> : children}</Box>
    </Flex>
  );
};

Panel.defaultProps = {
  header: 'Loading...',
  date: null,
  identifier: null,
  isLoading: false,
};

export default Panel;
