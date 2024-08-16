import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Image, Button, Icon } from '@chakra-ui/react';
import { FiUsers } from 'react-icons/fi';

const slides = [
  {
    title: 'Forgotten Lands',
    description:
      'Explore a vast and dangerous world filled with mythical creatures, treacherous dungeons, and ancient mysteries. Join forces with fellow adventurers to conquer legendary quests and claim epic loot in this immersive MMORPG experience.',
    image: '/images/banner/paladin.png',
    backgroundImage: '/images/banner/bg.jpg',
    players: '+10k Online Players',
    avatars: [
      '/images/banner/banner1.png',
      '/images/banner/banner2.png',
      '/images/banner/banner3.png',
    ],
  },
];

const HeaderBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  const handleNextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  return (
    <Box
      position="relative"
      width="80%"
      height="500px"
      overflow="hidden"
      borderRadius="1.5rem"
      transition="width 0.3s ease"
      m="0 auto"
    >
      {slides.map((slide, index) => (
        <Box
          key={index}
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          opacity={index === currentSlide ? 1 : 0}
          zIndex={index === currentSlide ? 2 : 1}
          transition="opacity 0.4s ease-in-out"
          backgroundImage={`url(${slide.backgroundImage})`}
          backgroundSize="cover"
          backgroundPosition="center"
        >
          <Box
            position="absolute"
            width="100%"
            height="100%"
            bg="blackAlpha.700"
          />
          <Flex
            position="relative"
            zIndex="3"
            height="100%"
            padding="2rem"
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box maxWidth="600px" color="white">
              <Text fontSize="4xl" fontWeight="bold" mb="4">
                {slide.title}
              </Text>
              <Text fontSize="lg" mb="6">
                {slide.description}
              </Text>
              <Flex alignItems="center" mb="6">
                <Flex mr="4">
                  {slide.avatars.map((avatar, avatarIndex) => (
                    <Image
                      key={avatarIndex}
                      src={avatar}
                      alt={`Player ${avatarIndex + 1}`}
                      borderRadius="full"
                      boxSize="40px"
                      border="2px solid white"
                      ml={avatarIndex > 0 ? '-10px' : '0'}
                    />
                  ))}
                </Flex>
                <Flex alignItems="center">
                  <Icon as={FiUsers} w={5} h={5} mr="2" />
                  <Text>{slide.players}</Text>
                </Flex>
              </Flex>
              <Button colorScheme="purple" variant="solid" size="lg">
                See More
              </Button>
            </Box>
            <Image
              src={slide.image}
              alt={slide.title}
              maxWidth={{ base: '100%', md: '50%' }}
              position="relative"
              right={{ base: '-20px', md: '0' }}
              top={{ base: '10px', md: '0' }}
              zIndex="2"
            />
          </Flex>
        </Box>
      ))}
      <Flex
        position="absolute"
        bottom="10px"
        left="50%"
        transform="translateX(-50%)"
        zIndex="4"
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            width="12px"
            height="12px"
            bg={index === currentSlide ? 'purple.500' : 'white'}
            borderRadius="full"
            mx="5px"
            cursor="pointer"
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </Flex>
    </Box>
  );
};

export default HeaderBanner;
