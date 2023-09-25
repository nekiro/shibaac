import React, { useState, useEffect } from 'react';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';
import { fetchApi } from '../../lib/request';
import StrippedTable from '../../components/StrippedTable';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react';

import { PlayerData } from '../../shared/interfaces/PlayerData';
import { vocationIdToName, getOutfitImageUrl } from '../../lib';
import { Pagination } from '../../components/Pagination';

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

  const buttonSize = useBreakpointValue({ base: 'xs', md: 'md' });
  const headingSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const textSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const imageHeight = useBreakpointValue({ base: '40px', md: '64px' });
  const imageWidth = useBreakpointValue({ base: '40px', md: '64px' });

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
  }, [filter, page]); // Added page to the effect dependencies

  if (!highscores) {
    return (
      <>
        <Head title="Highscores" />
        <Panel header="Highscores" isLoading={isLoading}></Panel>
      </>
    );
  }

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
        <Box textAlign="center" mb={4}>
          <Heading as="h2" size={headingSize} mb={2}>
            Rankings for {getCategoryLabel(filter.category)}
          </Heading>
          <Text mb={2} fontSize={textSize}>
            Vocation: {vocationIdToName[filter.vocation]}
          </Text>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="center"
            mb={4}
            wrap="wrap"
          >
            {categories.map((category, index) => (
              <Button
                key={index}
                size={buttonSize}
                onClick={() => handleCategoryChange(category.value)}
                colorScheme={
                  filter.category === category.value ? 'purple' : 'gray'
                }
                mb={{ base: 2, md: 0 }}
                mr={{ base: 0, md: 2 }}
              >
                {category.label}
              </Button>
            ))}
          </Flex>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="center"
            mb={4}
            wrap="wrap"
          >
            {vocations.map((vocation, index) => (
              <Button
                size={buttonSize}
                key={index}
                onClick={() => handleVocationChange(vocation.value)}
                colorScheme={
                  filter.vocation === vocation.value ? 'purple' : 'gray'
                }
                mb={{ base: 2, md: 0 }}
                mr={{ base: 0, md: 2 }}
              >
                {vocation.label}
              </Button>
            ))}
          </Flex>
        </Box>
        <StrippedTable
          head={[
            { text: 'Rank' },
            { text: 'Outfit' },
            { text: 'Name' },
            { text: 'Vocation' },
            { text: 'Level' },
            { text: 'Points' },
          ]}
          body={
            highscores && highscores.length > 0
              ? highscores.map((player, index) => [
                  { text: `${index + 1}` },
                  {
                    text: (
                      <Flex
                        height={imageHeight}
                        width={imageWidth}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Image
                          src={getOutfitImageUrl(player)}
                          alt={`${player.name}'s Outfit`}
                          height={imageHeight}
                          width={imageWidth}
                          objectFit="contain"
                        />
                      </Flex>
                    ),
                  },
                  { text: player.name, href: `/character/${player.name}` },
                  { text: vocationIdToName[player.vocation] },
                  { text: player.level },
                  { text: player.experience },
                ])
              : [
                  [
                    {
                      text: 'There is no data to show',
                      colspan: 6,
                    },
                  ],
                ]
          }
        />

        {highscores.length > 0 ? (
          <>
            <Box>
              <span>
                {page * perPage - perPage + 1} de {totalCount} registros
              </span>
            </Box>
            {perPage >= totalCount ? null : (
              <Box>
                <Box
                  className="dataTables_paginate paging_full_numbers"
                  id="datatable_paginate"
                >
                  <Pagination
                    totalCountOfRegisters={totalCount}
                    currentPage={page}
                    onPageChange={setPage}
                    registersPerPage={perPage}
                  />
                </Box>
              </Box>
            )}
          </>
        ) : null}
      </Panel>
    </>
  );
}
