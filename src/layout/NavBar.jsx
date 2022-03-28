import React from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../hooks/useUser';
import { Flex, Spacer, Box } from '@chakra-ui/react';
import DropdownButton from '../components/DropdownButton';
import TextInput from '../components/TextInput';

const Navigation = () => {
  const router = useRouter();
  const { user } = useUser();

  return (
    <Flex
      bgColor="violet.400"
      height="fit-content"
      marginBottom="1.5em"
      flexDir="row"
      borderRadius="md"
    >
      <DropdownButton text="Home" href="/" />
      <DropdownButton
        hasMenu={true}
        list={[{ text: 'Highscores', url: '/highscores' }]}
        text="Community"
      />
      <DropdownButton
        hasMenu={true}
        list={[{ text: 'Server Information', url: '/serverinfo' }]}
        text="Library"
      />

      <Box alignSelf="center">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (event.target.search.value) {
              router.push(`/character/${event.target.search.value}`);
              event.target.reset();
            }
          }}
        >
          <TextInput name="search" placeholder="Search character..." />
        </form>
      </Box>

      <Spacer />
      {user ? (
        <DropdownButton
          text={user.name}
          hasMenu={true}
          list={[
            { text: 'Account Management', url: '/account' },
            { text: 'Sign out', url: '/account/logout' },
          ]}
        />
      ) : (
        <>
          <DropdownButton text="Sign Up" href="/account/register" />
          <DropdownButton text="Sign In" href="/account/login" />
        </>
      )}
    </Flex>
  );
};

export default Navigation;
