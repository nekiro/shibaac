import React, { useState } from 'react';
import {
  Flex,
  IconButton,
  VStack,
  Box,
  Text,
  Divider,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import {
  FiUser,
  FiUsers,
  FiGrid,
  FiAward,
  FiUserCheck,
  FiShield,
  FiLogOut,
  FiArrowLeft,
  FiArrowRight,
} from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

const SideBar = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const toggleSidebar = () => setSidebarIsOpen(!sidebarIsOpen);

  const bg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const iconColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Flex
      direction="column"
      width={sidebarIsOpen ? '300px' : '72px'}
      height="100vh"
      bg={bg}
      borderRight="1px solid"
      borderColor={borderColor}
      position="fixed"
      top={0}
      left={0}
      transition="width 0.4s"
      boxShadow="20px 0px 20px 20px rgba(0, 0, 0, 0.1)"
    >
      <Box textAlign="center" my={4}>
        <Image
          src="/images/header.png"
          alt="Logo"
          width={sidebarIsOpen ? 72 : 40}
          height={sidebarIsOpen ? 72 : 40}
          style={{ cursor: 'pointer' }}
        />
      </Box>

      <VStack
        as="nav"
        align={sidebarIsOpen ? 'stretch' : 'center'}
        spacing={4}
        mt={8}
        flexGrow={1}
      >
        <Link href="/account">
          <Tooltip label="Account" isDisabled={sidebarIsOpen} placement="right">
            <Flex
              align="center"
              justify={sidebarIsOpen ? 'flex-start' : 'center'}
              px={sidebarIsOpen ? 5 : 0}
              py={2}
              _hover={{ bg: 'gray.700' }}
              cursor="pointer"
              width="100%"
            >
              <Box as={FiUser} color={iconColor} />
              {sidebarIsOpen && (
                <Text ml={4} color={textColor}>
                  Account
                </Text>
              )}
            </Flex>
          </Tooltip>
        </Link>
        <Link href="/my-team">
          <Tooltip label="My Team" isDisabled={sidebarIsOpen} placement="right">
            <Flex
              align="center"
              justify={sidebarIsOpen ? 'flex-start' : 'center'}
              px={sidebarIsOpen ? 5 : 0}
              py={2}
              _hover={{ bg: 'gray.700' }}
              cursor="pointer"
              width="100%"
            >
              <Box as={FiUsers} color={iconColor} />
              {sidebarIsOpen && (
                <Text ml={4} color={textColor}>
                  My Team
                </Text>
              )}
            </Flex>
          </Tooltip>
        </Link>

        <Divider borderColor={borderColor} />

        <Link href="/dashboard">
          <Tooltip
            label="Dashboard"
            isDisabled={sidebarIsOpen}
            placement="right"
          >
            <Flex
              align="center"
              justify={sidebarIsOpen ? 'flex-start' : 'center'}
              px={sidebarIsOpen ? 5 : 0}
              py={2}
              _hover={{ bg: 'gray.700' }}
              cursor="pointer"
              width="100%"
            >
              <Box as={FiGrid} color={iconColor} />
              {sidebarIsOpen && (
                <Text ml={4} color={textColor}>
                  Dashboard
                </Text>
              )}
            </Flex>
          </Tooltip>
        </Link>
        <Link href="/players">
          <Tooltip label="Players" isDisabled={sidebarIsOpen} placement="right">
            <Flex
              align="center"
              justify={sidebarIsOpen ? 'flex-start' : 'center'}
              px={sidebarIsOpen ? 5 : 0}
              py={2}
              _hover={{ bg: 'gray.700' }}
              cursor="pointer"
              width="100%"
            >
              <Box as={FiUserCheck} color={iconColor} />
              {sidebarIsOpen && (
                <Text ml={4} color={textColor}>
                  Players
                </Text>
              )}
            </Flex>
          </Tooltip>
        </Link>
        <Link href="/tournaments">
          <Tooltip
            label="Tournaments"
            isDisabled={sidebarIsOpen}
            placement="right"
          >
            <Flex
              align="center"
              justify={sidebarIsOpen ? 'flex-start' : 'center'}
              px={sidebarIsOpen ? 5 : 0}
              py={2}
              _hover={{ bg: 'gray.700' }}
              cursor="pointer"
              width="100%"
            >
              <Box as={FiAward} color={iconColor} />
              {sidebarIsOpen && (
                <Text ml={4} color={textColor}>
                  Tournaments
                </Text>
              )}
            </Flex>
          </Tooltip>
        </Link>
        <Link href="/matches">
          <Tooltip label="Matches" isDisabled={sidebarIsOpen} placement="right">
            <Flex
              align="center"
              justify={sidebarIsOpen ? 'flex-start' : 'center'}
              px={sidebarIsOpen ? 5 : 0}
              py={2}
              _hover={{ bg: 'gray.700' }}
              cursor="pointer"
              width="100%"
            >
              <Box as={FiShield} color={iconColor} />
              {sidebarIsOpen && (
                <Text ml={4} color={textColor}>
                  Matches
                </Text>
              )}
            </Flex>
          </Tooltip>
        </Link>
        <Link href="/community">
          <Tooltip
            label="Community"
            isDisabled={sidebarIsOpen}
            placement="right"
          >
            <Flex
              align="center"
              justify={sidebarIsOpen ? 'flex-start' : 'center'}
              px={sidebarIsOpen ? 5 : 0}
              py={2}
              _hover={{ bg: 'gray.700' }}
              cursor="pointer"
              width="100%"
            >
              <Box as={FiUsers} color={iconColor} />
              {sidebarIsOpen && (
                <Text ml={4} color={textColor}>
                  Community
                </Text>
              )}
            </Flex>
          </Tooltip>
        </Link>
      </VStack>

      <Flex
        align="center"
        justify={sidebarIsOpen ? 'flex-start' : 'center'}
        px={sidebarIsOpen ? 5 : 0}
        py={2}
        _hover={{ bg: 'gray.700' }}
        cursor="pointer"
        width="100%"
        mt="auto"
      >
        <Tooltip label="Logout" isDisabled={sidebarIsOpen} placement="right">
          <Flex align="center" justify="center" width="100%">
            <Box as={FiLogOut} color={iconColor} />
            {sidebarIsOpen && (
              <Text ml={4} color={textColor}>
                Logout
              </Text>
            )}
          </Flex>
        </Tooltip>
      </Flex>

      <IconButton
        aria-label="Toggle Sidebar"
        icon={sidebarIsOpen ? <FiArrowLeft /> : <FiArrowRight />}
        position="absolute"
        top="50%"
        right={sidebarIsOpen ? '-20px' : '-20px'}
        transform="translateY(-50%)"
        onClick={toggleSidebar}
        bg={bg}
        borderColor={borderColor}
        borderWidth="1px"
        borderRadius="full"
        shadow="lg"
        _hover={{
          transform: 'translateY(-50%) scale(1.1)',
          bg: borderColor,
        }}
      />
    </Flex>
  );
};

export default SideBar;
