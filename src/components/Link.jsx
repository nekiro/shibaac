import React from 'react';
import { Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';

const Link = ({ href, text }) => {
  return (
    <NextLink href={href} passHref>
      <ChakraLink color="violet.500">{text ? text : href}</ChakraLink>
    </NextLink>
  );
};

export default Link;
