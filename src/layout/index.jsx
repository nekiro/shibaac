import React, { useState } from 'react';
import {
  Flex,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  useColorModeValue,
  IconButton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FiSearch, FiMoon, FiBell } from 'react-icons/fi';
import { LiaCoinsSolid } from 'react-icons/lia';
import { IoIosArrowDown } from 'react-icons/io';
import SideBar from '../layout/SideBar';
import Footer from '../layout/Footer';
import { useUser } from '../hooks/useUser';

const TopBar = () => {
  const { user } = useUser();

  const bg = useColorModeValue('gray.900', 'gray.900');
  const color = useColorModeValue('white', 'white');
  const iconBg = useColorModeValue('gray.800', 'gray.800');

  console.log('user', user);
  const handleChangeTheme = () => {
    //TODO
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      paddingX="6"
      paddingY="2"
      bg={bg}
      width="100%"
      height="80px"
      position="fixed"
      top={0}
      zIndex={3}
    >
      <InputGroup width="400px" marginLeft="auto" marginRight="auto">
        <InputLeftElement pointerEvents="none">
          <FiSearch color="gray.500" />
        </InputLeftElement>
        <Input
          placeholder="Type / to search"
          variant="filled"
          bg={iconBg}
          color="white"
          _placeholder={{ color: 'gray.500' }}
        />
      </InputGroup>

      <Flex align="center" gap="1.5rem">
        <IconButton
          aria-label="Toggle theme"
          icon={<FiMoon />}
          onClick={handleChangeTheme}
          bg={iconBg}
          color="white"
          borderRadius="full"
        />

        {user && (
          <>
            <Box position="relative">
              <IconButton
                aria-label="Notifications"
                icon={<FiBell />}
                bg={iconBg}
                color="white"
                borderRadius="full"
              />
              <Box
                position="absolute"
                top="2px"
                right="2px"
                width="8px"
                height="8px"
                bg="red.500"
                borderRadius="full"
              />
            </Box>
            <Menu>
              <MenuButton>
                <Flex align="center">
                  <Box position="relative" width="34px" height="34px">
                    <Avatar
                      name={user?.email || 'User'}
                      src={user?.avatarUrl || ''}
                      width="34px"
                      height="34px"
                      borderRadius="full"
                      objectFit="cover"
                    />
                    <Box
                      position="absolute"
                      left="50%"
                      top="50%"
                      transform="translate(-50%, -50%)"
                      width="40px"
                      height="40px"
                      backgroundImage="url('/images/contorno.svg')"
                      backgroundSize="cover"
                      backgroundRepeat="no-repeat"
                      zIndex={10}
                      pointerEvents="none"
                    />
                  </Box>
                  <Box textAlign="left" marginLeft="0.5rem">
                    <Text fontSize="sm" fontWeight="bold" color={color}>
                      {user?.name || 'User'}
                    </Text>
                    <Flex align="center" fontSize="sm" color="gray.400">
                      <LiaCoinsSolid size={18} color="purple.500" />
                      <Text ml="1">{user?.coins || '0'}</Text>
                      <IoIosArrowDown ml="2" />
                    </Flex>
                  </Box>
                </Flex>
              </MenuButton>
              <MenuList bg={bg} borderColor="gray.700">
                <MenuItem>Profile</MenuItem>
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </Menu>
          </>
        )}
      </Flex>
    </Flex>
  );
};

const Layout = ({ children }) => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarMinimized((prev) => !prev);
  };

  return (
    <Flex direction="column" height="100vh" bg="gray.900">
      <TopBar />

      <Flex flex="1" marginTop="80px">
        <SideBar
          marginTop="80px"
          zIndex={1}
          isSidebarMinimized={isSidebarMinimized}
          toggleSidebar={toggleSidebar}
        />

        <Flex direction="column" flex="1">
          <Flex
            direction="column"
            flex="1"
            color="white"
            overflowY="auto"
            position="relative"
            width="100%"
          >
            {children}
          </Flex>
          <Footer width="100%" maxWidth="none" margin="0 auto" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Layout;
