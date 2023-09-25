import React from 'react';
import { Button } from '@chakra-ui/react';

export function PaginationItem({ number, isCurrent = false, onPageChange }) {
  return (
    <Button
      as="li"
      m="1"
      onClick={() => onPageChange(number)}
      bgColor={isCurrent ? 'purple.500' : 'gray.200'}
      color={isCurrent ? 'white' : 'black'}
    >
      {number}
    </Button>
  );
}
