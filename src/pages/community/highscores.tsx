import React, { useState, useEffect } from 'react';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';
import { fetchApi } from '../../lib/request';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Image,
  useBreakpointValue,
  ButtonGroup,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Stack,
  Icon,
} from '@chakra-ui/react';
import { FaCrown } from 'react-icons/fa';

import { PlayerData } from '../../shared/interfaces/PlayerData';
import { vocationIdToName, getOutfitImageUrl } from '../../lib';
import { Pagination } from '../../components/Pagination';
import Link from 'next/link';

export default function Highscores() {
  const [highscores, setHighscores] = useState<PlayerData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    category: 'level',
    vocation: 'all',
  });

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const headingSize = useBreakpointValue({ base: 'lg', md: 'xl' });
  const textSize = useBreakpointValue({ base: 'md', md: 'lg' });

  useEffect(() => {
    const fetchHighscores = async () => {
      try {
        setIsLoading(true);

        const response = await fetchApi('GET', '/api/community/highscores', {
          params: {
            vocation: filter.vocation,
            category: filter.category,
            page,
          },
        });

        if (response.success) {
          setHighscores(response.data);
          setTotalCount(response.xTotalCount);
        } else {
          setHighscores([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighscores();
  }, [filter, page]);

  const categories = [
    { label: 'Experience', value: 'level' },
    { label: 'Magic', value: 'maglevel' },
    { label: 'Shield', value: 'skill_shielding' },
    { label: 'Distance', value: 'skill_dist' },
    { label: 'Club', value: 'skill_club' },
    { label: 'Sword', value: 'skill_sword' },
    { label: 'Axe', value: 'skill_axe' },
    { label: 'Fist', value: 'skill_fist' },
    { label: 'Fishing', value: 'skill_fishing' },
  ];

  const vocations = [
    { label: 'All', value: 'all' },
    { label: 'Sorcerer', value: '2' },
    { label: 'Druid', value: '1' },
    { label: 'Paladin', value: '3' },
    { label: 'Knight', value: '4' },
    { label: 'No Vocation', value: '0' },
  ];

  const getCategoryLabel = (categoryValue) => {
    const category = categories.find((cat) => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  const handleCategoryChange = (categoryValue) => {
    setPage(1);
    setFilter((prevFilter) => ({
      ...prevFilter,
      category: categoryValue,
    }));
  };

  const handleVocationChange = (vocationValue) => {
    setPage(1);
    setFilter((prevFilter) => ({
      ...prevFilter,
      vocation: vocationValue,
    }));
  };

  return (
    <>
      <Head title="Highscores" />
      <Panel header={`Rankings for ${getCategoryLabel(filter.category)}`}>
        <Box textAlign="center" mb={6}>
          <Heading as="h2" size={headingSize} mb={4} color="purple.600">
            <Icon as={FaCrown} mr={2} />
            Rankings for {getCategoryLabel(filter.category)}
          </Heading>
          <Text mb={4} fontSize={textSize} color="gray.600">
            {filter.vocation === 'all'
              ? 'All Vocations'
              : vocationIdToName[filter.vocation]}
          </Text>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="center"
            align="center"
            mb={4}
            wrap="wrap"
          >
            <ButtonGroup spacing={2} mb={{ base: 2, md: 0 }}>
              {categories.map((category, index) => (
                <Button
                  key={index}
                  size={buttonSize}
                  onClick={() => handleCategoryChange(category.value)}
                  variant={
                    filter.category === category.value ? 'solid' : 'outline'
                  }
                  colorScheme="purple"
                >
                  {category.label}
                </Button>
              ))}
            </ButtonGroup>
          </Flex>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="center"
            align="center"
            mb={4}
            wrap="wrap"
          >
            <ButtonGroup spacing={2} mb={{ base: 2, md: 0 }}>
              {vocations.map((vocation, index) => (
                <Button
                  size={buttonSize}
                  key={index}
                  onClick={() => handleVocationChange(vocation.value)}
                  variant={
                    filter.vocation === vocation.value ? 'solid' : 'outline'
                  }
                  colorScheme="purple"
                >
                  {vocation.label}
                </Button>
              ))}
            </ButtonGroup>
          </Flex>
        </Box>

        {isLoading ? (
          <Flex justify="center" align="center" minHeight="200px">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="purple.500"
              size="xl"
            />
          </Flex>
        ) : (
          <>
            <Box overflowX="auto">
              <Table variant="striped" colorScheme="purple">
                <Thead>
                  <Tr>
                    <Th textAlign="center">Rank</Th>
                    <Th textAlign="center">Outfit</Th>
                    <Th>Name</Th>
                    <Th>Vocation</Th>
                    <Th textAlign="center">Level</Th>
                    <Th textAlign="center">Points</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {highscores && highscores.length > 0 ? (
                    highscores.map((player, index) => (
                      <Tr key={player.name}>
                        <Td textAlign="center" color="white">
                          {index + 1 + (page - 1) * perPage}
                        </Td>
                        <Td textAlign="center">
                          <Flex
                            height="50px"
                            width="50px"
                            alignItems="center"
                            justifyContent="center"
                            mx="auto"
                          >
                            <Image
                              src={getOutfitImageUrl(player)}
                              alt={`${player.name}'s Outfit`}
                              height="64px"
                              width="64px"
                              objectFit="contain"
                              transform="translate(-14px, -14px)"
                            />
                          </Flex>
                        </Td>
                        <Td>
                          <Link href={`/character/${player.name}`} passHref>
                            <Text
                              as="a"
                              color="white"
                              fontWeight="bold"
                              _hover={{ textDecoration: 'underline' }}
                            >
                              {player.name}
                            </Text>
                          </Link>
                        </Td>
                        <Td color="white">
                          {vocationIdToName[player.vocation]}
                        </Td>
                        <Td color="white" textAlign="center">
                          {player.level}
                        </Td>
                        <Td color="white" textAlign="center">
                          {player.experience}
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={6} textAlign="center">
                        No data available.
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>

            {highscores.length > 0 && (
              <Flex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                mt={6}
              >
                <Text mb={2} color="gray.600">
                  Showing{' '}
                  <strong>
                    {page * perPage - perPage + 1} -{' '}
                    {Math.min(page * perPage, totalCount)}
                  </strong>{' '}
                  of <strong>{totalCount}</strong> records
                </Text>
                {perPage >= totalCount ? null : (
                  <Pagination
                    totalCountOfRegisters={totalCount}
                    currentPage={page}
                    onPageChange={setPage}
                    registersPerPage={perPage}
                  />
                )}
              </Flex>
            )}
          </>
        )}
      </Panel>
    </>
  );
}
