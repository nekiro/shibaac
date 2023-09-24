import React from 'react';
import Link from './Link';
import { Table, Thead, Tbody, Tr, Th, Td, Box } from '@chakra-ui/react';

const StripedTable = ({ head, body }) => {
  return (
    <Box overflowX={{ base: 'auto', md: 'hidden' }}>
      <Table variant="simple">
        {head && (
          <Thead>
            <Tr>
              {head.map((row) => (
                <Th key={row.text}>{row.text}</Th>
              ))}
            </Tr>
          </Thead>
        )}
        <Tbody>
          {body.map((row, index) => (
            <Tr key={`${row.text} ${index}`}>
              {row.map((data, dataIndex) => (
                <Td key={`${data.text} ${dataIndex}`}>
                  {data.href ? (
                    <Link href={data.href} text={data.text} />
                  ) : (
                    data.text
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default StripedTable;
