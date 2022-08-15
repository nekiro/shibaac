import React from 'react';
import Head from './Head';
import Navigation from './NavBar';
import SideBar from './SideBar';
import Footer from './Footer';

import { Box, Image, Flex, Grid } from '@chakra-ui/react';

const Layout = ({ children }) => {
  return (
    <Box w="70%" margin="auto">
      <Head />
      <Image
        width="15%"
        marginLeft="auto"
        marginRight="auto"
        marginBottom="15px"
        marginTop="15px"
        src="/images/header.png"
        alt="shibaac"
      />
      <Navigation />
      <Flex>
        <Box flexGrow="1" marginRight="3em">
          {children}
          <Footer />
        </Box>
        <SideBar />
      </Flex>
    </Box>
  );
};

export default Layout;
