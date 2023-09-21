import React, { useState, useEffect } from 'react';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';

import { fetchApi } from '../../lib/request';
import StrippedTable from '../../components/StrippedTable';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';

export default function Highscores() {
  const [highscores, setHighscores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    category: 'level',
    vocation: 'all',
  });

  useEffect(() => {
    const fetchHighscores = async () => {
      try {
        setIsLoading(true);

        const response = await fetchApi('GET', '/api/community/highscores', {
          params: { vocation: filter.vocation, category: filter.category },
          headers: { page: 1 },
        });

        if (response.success) {
          setHighscores(response.data);
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
  }, [filter]);

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

  const getVocationLabel = (vocationValue) => {
    const vocation = vocations.find((voc) => voc.value === vocationValue);
    return vocation ? vocation.label : vocationValue;
  };

  const handleCategoryChange = (categoryValue) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      category: categoryValue,
    }));
  };

  const handleVocationChange = (vocationValue) => {
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
          <Heading as="h2" size="lg" mb={2}>
            Rankings for {getCategoryLabel(filter.category)}
          </Heading>
          <Text mb={2}>Vocation: {getVocationLabel(filter.vocation)}</Text>
          <Flex justify="center" mb={4}>
            <ButtonGroup variant="outline" spacing={2}>
              {categories.map((category, index) => (
                <Button
                  key={index}
                  onClick={() => handleCategoryChange(category.value)}
                  colorScheme={
                    filter.category === category.value ? 'purple' : 'gray'
                  }
                >
                  {category.label}
                </Button>
              ))}
            </ButtonGroup>
          </Flex>
          <Flex justify="center" mb={4}>
            <ButtonGroup variant="outline" spacing={2}>
              {vocations.map((vocation, index) => (
                <Button
                  key={index}
                  onClick={() => handleVocationChange(vocation.value)}
                  colorScheme={
                    filter.vocation === vocation.value ? 'purple' : 'gray'
                  }
                >
                  {vocation.label}
                </Button>
              ))}
            </ButtonGroup>
          </Flex>
        </Box>
        <StrippedTable
          head={[
            { text: 'Rank' },
            { text: 'Name' },
            { text: 'Vocation' },
            { text: 'World' },
            { text: 'Level' },
            { text: 'Points' },
          ]}
          body={
            highscores && highscores.length > 0
              ? highscores.map((player, index) => [
                  { text: `${index + 1}` },
                  { text: player.name, href: `/character/${player.name}` },
                  { text: getVocationLabel(player.vocation) },
                  { text: '' /*World info*/ },
                  { text: player.level },
                  { text: '' /*Points info*/ },
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
      </Panel>
    </>
  );
}
