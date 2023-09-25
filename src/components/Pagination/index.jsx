import React from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { PaginationItem } from './PaginationItem';

const siblingsCount = 1;

function generatePagesArray(from, to) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1;
    })
    .filter((page) => page > 0);
}

export function Pagination({
  totalCountOfRegisters,
  registersPerPage = 10,
  currentPage = 1,
  onPageChange,
}) {
  const lastPage = Math.ceil(totalCountOfRegisters / registersPerPage);

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage),
        )
      : [];

  return (
    <Box as="nav" aria-label="pagination-nav">
      <Flex as="ul" className="pagination">
        {currentPage > 1 + siblingsCount && (
          <>
            <Button as="li" onClick={() => onPageChange(1)} m="1">
              1
            </Button>
            {currentPage > 2 + siblingsCount && (
              <Box as="li" m="1">
                <PaginationItem />
              </Box>
            )}
          </>
        )}

        {previousPages.length > 0 &&
          previousPages.map((page) => (
            <Button as="li" key={page} onClick={() => onPageChange(page)} m="1">
              {page}
            </Button>
          ))}

        <Button as="li" m="1" bgColor="purple.500" color="white">
          {currentPage}
        </Button>

        {nextPages.length > 0 &&
          nextPages.map((page) => (
            <Button as="li" key={page} onClick={() => onPageChange(page)} m="1">
              {page}
            </Button>
          ))}

        {currentPage + siblingsCount < lastPage && (
          <>
            {currentPage + 1 + siblingsCount < lastPage && (
              <Box as="li" m="1">
                <PaginationItem />
              </Box>
            )}
            <Button as="li" onClick={() => onPageChange(lastPage)} m="1">
              {lastPage}
            </Button>
          </>
        )}
      </Flex>
    </Box>
  );
}
