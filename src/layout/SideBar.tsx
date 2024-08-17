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
  Collapse,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FiUserCheck,
  FiLogOut,
  FiArrowLeft,
  FiArrowRight,
  FiChevronDown,
  FiChevronRight,
  FiHome,
  FiDollarSign,
  FiBook,
  FiUsers,
  FiMenu,
} from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '../hooks/useUser';

const SideBar = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const { user } = useUser();

  const toggleSidebar = () => setSidebarIsOpen(!sidebarIsOpen);
  const toggleMenu = (menu) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const bgMaximized = useColorModeValue(
    'rgba(0, 0, 0, 0.7)',
    'rgba(0, 0, 0, 0.7)',
  );
  const bgMinimized = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const iconColor = useColorModeValue('gray.600', 'gray.400');

  const navigationItems = [
    { text: 'Home', href: '/', icon: FiHome },
    {
      hasMenu: true,
      menuItems: [
        { text: 'Highscores', url: '/community/highscores' },
        { text: 'Guilds', url: '/community/guilds' },
        { text: 'Houses', url: '/community/houses' },
        { text: 'Character Bazar', url: '/community/characterbazar' },
        { text: 'Support Team', url: '/community/support' },
      ],
      text: 'Community',
      icon: FiUsers,
    },
    {
      hasMenu: true,
      menuItems: [
        { text: 'Server Information', url: '/serverinfo' },
        { text: 'Downloads', url: '/downloads' },
      ],
      text: 'Library',
      icon: FiBook,
    },
    { text: 'Donate', href: '/donate', icon: FiDollarSign },
  ];

  const shopItem = {
    text: 'Shopping',
    href: '/shop',
    icon: FiDollarSign,
  };

  if (process.env.NEXT_PUBLIC_SHOP_ENABLED === 'true') {
    navigationItems.push(shopItem);
  }

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {isMobile && (
        <IconButton
          aria-label="Toggle Menu"
          icon={<FiMenu />}
          position="absolute"
          top={4}
          left={4}
          onClick={toggleSidebar}
          bg={bgMinimized}
          borderColor={borderColor}
          borderWidth="1px"
          borderRadius="full"
          shadow="lg"
          zIndex={21}
          _hover={{
            bg: borderColor,
          }}
        />
      )}

      <Flex
        direction="column"
        width={sidebarIsOpen || isMobile ? '300px' : '72px'}
        height="100vh"
        bg={sidebarIsOpen || isMobile ? bgMaximized : bgMinimized}
        borderRight="1px solid"
        borderColor={borderColor}
        position="fixed"
        top={0}
        left={0}
        transition="width 0.4s, background-color 0.4s"
        boxShadow="20px 0px 20px 20px rgba(0, 0, 0, 0.1)"
        zIndex={20}
        transform={isMobile && !sidebarIsOpen ? 'translateX(-100%)' : 'none'}
        transition="transform 0.3s ease, width 0.3s ease"
      >
        <Box textAlign="center" my={4}>
          <Image
            src="/images/header.png"
            alt="Logo"
            width={sidebarIsOpen || isMobile ? 72 : 40}
            height={sidebarIsOpen || isMobile ? 72 : 40}
            style={{ cursor: 'pointer' }}
          />
        </Box>

        <VStack
          as="nav"
          align={sidebarIsOpen || isMobile ? 'stretch' : 'center'}
          spacing={4}
          mt={8}
          flexGrow={1}
        >
          {navigationItems.map((item) =>
            item.hasMenu ? (
              <Box key={item.text} width="100%">
                <Tooltip
                  label={item.text}
                  isDisabled={sidebarIsOpen || isMobile}
                  placement="right"
                >
                  <Flex
                    align="center"
                    justify={
                      sidebarIsOpen || isMobile ? 'flex-start' : 'center'
                    }
                    px={sidebarIsOpen || isMobile ? 5 : 0}
                    py={2}
                    _hover={{ bg: 'gray.700' }}
                    cursor="pointer"
                    width="100%"
                    onClick={() => toggleMenu(item.text)}
                  >
                    <Box as={item.icon} color={iconColor} />
                    {(sidebarIsOpen || isMobile) && (
                      <>
                        <Text ml={4} color={textColor}>
                          {item.text}
                        </Text>
                        <Box
                          as={
                            openMenus[item.text]
                              ? FiChevronDown
                              : FiChevronRight
                          }
                          ml="auto"
                        />
                      </>
                    )}
                  </Flex>
                </Tooltip>
                <Collapse
                  in={sidebarIsOpen && openMenus[item.text]}
                  animateOpacity
                >
                  <VStack
                    pl={8}
                    spacing={2}
                    align="start"
                    w="full"
                    bg="gray.600"
                    rounded="md"
                    mt={2}
                  >
                    {item.menuItems.map((subItem) => (
                      <Link key={subItem.text} href={subItem.url}>
                        <Text color={textColor} px={4} py={2} w="full">
                          {subItem.text}
                        </Text>
                      </Link>
                    ))}
                  </VStack>
                </Collapse>
              </Box>
            ) : (
              <Link key={item.text} href={item.href}>
                <Tooltip
                  label={item.text}
                  isDisabled={sidebarIsOpen || isMobile}
                  placement="right"
                >
                  <Flex
                    align="center"
                    justify={
                      sidebarIsOpen || isMobile ? 'flex-start' : 'center'
                    }
                    px={sidebarIsOpen || isMobile ? 5 : 0}
                    py={2}
                    _hover={{ bg: 'gray.700' }}
                    cursor="pointer"
                    width="100%"
                  >
                    <Box as={item.icon} color={iconColor} />
                    {(sidebarIsOpen || isMobile) && (
                      <Text ml={4} color={textColor}>
                        {item.text}
                      </Text>
                    )}
                  </Flex>
                </Tooltip>
              </Link>
            ),
          )}

          <Divider borderColor={borderColor} />

          {user ? (
            <VStack
              spacing={4}
              align={sidebarIsOpen || isMobile ? 'stretch' : 'center'}
            >
              <Link href="/account">
                <Tooltip
                  label="Account"
                  isDisabled={sidebarIsOpen || isMobile}
                  placement="right"
                >
                  <Flex
                    align="center"
                    justify={
                      sidebarIsOpen || isMobile ? 'flex-start' : 'center'
                    }
                    px={sidebarIsOpen || isMobile ? 5 : 0}
                    py={2}
                    _hover={{ bg: 'gray.700' }}
                    cursor="pointer"
                    width="100%"
                  >
                    <Box as={FiUserCheck} color={iconColor} />
                    {(sidebarIsOpen || isMobile) && (
                      <Text ml={4} color={textColor}>
                        Account Management
                      </Text>
                    )}
                  </Flex>
                </Tooltip>
              </Link>
              <Link href="/account/logout">
                <Tooltip
                  label="Sign out"
                  isDisabled={sidebarIsOpen || isMobile}
                  placement="right"
                >
                  <Flex
                    align="center"
                    justify={
                      sidebarIsOpen || isMobile ? 'flex-start' : 'center'
                    }
                    px={sidebarIsOpen || isMobile ? 5 : 0}
                    py={2}
                    _hover={{ bg: 'gray.700' }}
                    cursor="pointer"
                    width="100%"
                  >
                    <Box as={FiLogOut} color={iconColor} />
                    {(sidebarIsOpen || isMobile) && (
                      <Text ml={4} color={textColor}>
                        Sign out
                      </Text>
                    )}
                  </Flex>
                </Tooltip>
              </Link>
            </VStack>
          ) : (
            <VStack
              spacing={4}
              align={sidebarIsOpen || isMobile ? 'stretch' : 'center'}
            >
              <Link href="/account/register">
                <Tooltip
                  label="Sign Up"
                  isDisabled={sidebarIsOpen || isMobile}
                  placement="right"
                >
                  <Flex
                    align="center"
                    justify={
                      sidebarIsOpen || isMobile ? 'flex-start' : 'center'
                    }
                    px={sidebarIsOpen || isMobile ? 5 : 0}
                    py={2}
                    _hover={{ bg: 'gray.700' }}
                    cursor="pointer"
                    width="100%"
                  >
                    <Box as={FiUserCheck} color={iconColor} />
                    {(sidebarIsOpen || isMobile) && (
                      <Text ml={4} color={textColor}>
                        Sign Up
                      </Text>
                    )}
                  </Flex>
                </Tooltip>
              </Link>
              <Link href="/account/login">
                <Tooltip
                  label="Sign In"
                  isDisabled={sidebarIsOpen || isMobile}
                  placement="right"
                >
                  <Flex
                    align="center"
                    justify={
                      sidebarIsOpen || isMobile ? 'flex-start' : 'center'
                    }
                    px={sidebarIsOpen || isMobile ? 5 : 0}
                    py={2}
                    _hover={{ bg: 'gray.700' }}
                    cursor="pointer"
                    width="100%"
                  >
                    <Box as={FiUserCheck} color={iconColor} />
                    {(sidebarIsOpen || isMobile) && (
                      <Text ml={4} color={textColor}>
                        Sign In
                      </Text>
                    )}
                  </Flex>
                </Tooltip>
              </Link>
            </VStack>
          )}
        </VStack>

        {!isMobile && (
          <IconButton
            aria-label="Toggle Sidebar"
            icon={sidebarIsOpen ? <FiArrowLeft /> : <FiArrowRight />}
            position="absolute"
            top="50%"
            right={sidebarIsOpen ? '-20px' : '-20px'}
            transform="translateY(-50%)"
            onClick={toggleSidebar}
            bg={bgMinimized}
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="full"
            shadow="lg"
            _hover={{
              transform: 'translateY(-50%) scale(1.1)',
              bg: borderColor,
            }}
          />
        )}
      </Flex>
    </>
  );
};

export default SideBar;
