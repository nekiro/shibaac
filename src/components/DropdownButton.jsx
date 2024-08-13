import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';

const DropdownButton = ({ hasMenu, text, href, list }) => {
  const router = useRouter();
  const isActive = hasMenu
    ? list.some((item) => router.asPath.startsWith(item.url))
    : router.asPath === href;

  const activeStyle = {
    bgColor: '#c3a6d9',
    color: 'white',
  };

  const defaultStyle = {
    bgColor: 'transparent',
    color: 'white',
  };

  if (hasMenu) {
    return (
      <Menu>
        <MenuButton
          as={Button}
          {...(isActive ? activeStyle : defaultStyle)}
          pt="25px"
          pb="25px"
          fontWeight="normal"
          rightIcon={<ChevronDownIcon />}
          _hover={{
            bgColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'scale(1.05)',
          }}
          _active={{ bgColor: 'rgba(255, 255, 255, 0.3)' }}
          _focus={{ outline: 0 }}
          borderRadius="md"
          transition="all 0.2s ease-in-out"
        >
          {text}
        </MenuButton>
        <MenuList
          p={0}
          borderRadius="md"
          boxShadow="lg"
          bgColor="gray.800"
          border="1px solid #c3a6d9"
          mt="2"
        >
          {list.map((item) => (
            <Link key={item.text} href={item.url} passHref>
              <MenuItem
                {...(router.asPath.startsWith(item.url) ? activeStyle : null)}
                _hover={{ bgColor: '#c3a6d9', color: 'white' }}
                _focus={{ bgColor: '#c3a6d9', color: 'white' }}
                borderRadius="md"
                px="3"
                py="2"
              >
                {item.text}
              </MenuItem>
            </Link>
          ))}
        </MenuList>
      </Menu>
    );
  } else if (href) {
    return (
      <Link href={href} passHref>
        <Button
          {...(isActive ? activeStyle : defaultStyle)}
          pt="25px"
          pb="25px"
          fontWeight="normal"
          _hover={{
            bgColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'scale(1.05)',
          }}
          _active={{ bgColor: 'rgba(255, 255, 255, 0.3)' }}
          _focus={{ outline: 0 }}
          borderRadius="md"
          transition="all 0.2s ease-in-out"
        >
          {text}
        </Button>
      </Link>
    );
  }

  return null;
};

DropdownButton.defaultProps = {
  hasMenu: false,
};

export default DropdownButton;
