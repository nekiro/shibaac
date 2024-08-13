import React, { useEffect, useState, useCallback } from 'react';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';
import { fetchApi } from '../../lib/request';
import { withSessionSsr } from '../../lib/session';
import Button from '../../components/Button';
import StripedTable from '../../components/StrippedTable';
import {
  Box,
  IconButton,
  Text,
  Alert,
  AlertIcon,
  Wrap,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Center,
  Image,
  Button as ChakraButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { vocationIdToName, timestampToDate } from '../../lib';
import { Toggle } from '../../components/Toggle';
import { SettingsIcon } from '@chakra-ui/icons';
import { UserData } from '../../shared/interfaces/UserData';
import { useRouter } from 'next/router';

interface AccountResponse {
  account: UserData;
}

interface TwoFactorResponse {
  success: boolean;
  dataURL?: string;
}

export default function Account({ user }) {
  const [info, setInfo] = useState<UserData | null>(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showAccountName, setShowAccountName] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const response: AccountResponse = await fetchApi(
        'GET',
        `/api/account/${user.id}`,
      );
      setInfo(response.account);
      setIs2FAEnabled(response.account.twoFAEnabled);
    } catch (error) {
      console.error('Failed to fetch account data', error);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggle = async () => {
    try {
      setIsLoading(true);

      const response: TwoFactorResponse = await fetchApi(
        'POST',
        '/api/account/two-factor/enable-2fa',
        {
          data: {
            isTwoFA: !is2FAEnabled,
          },
        },
      );

      if (response.success) {
        setIs2FAEnabled((prevState) => !prevState);

        if (response.dataURL) {
          showQRCode(response.dataURL);
          setIsOpenModal(true);
        } else {
          console.error('QR code data is missing');
        }
      }
    } catch (error) {
      setError('Failed to toggle 2FA');
      console.error('Failed to toggle 2FA', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showQRCode = (dataURL: string) => {
    setQRCodeDataURL(dataURL);
  };

  if (!info) {
    return (
      <>
        <Head title="Account Management" />
        <Panel header="Account Management" isLoading={true}></Panel>
      </>
    );
  }

  const maskText = (text, show) => (show ? text : '****');

  return (
    <>
      <Head title="Account Management" />
      <Panel header="Account Management">
        <Panel header="Informations">
          <StripedTable
            head={[]}
            body={[
              [
                { text: 'Account Name' },
                {
                  text: (
                    <Box display="flex" alignItems="center">
                      <Text>{maskText(info.name, showAccountName)}</Text>
                      <IconButton
                        aria-label="Toggle Account Name Visibility"
                        icon={showAccountName ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowAccountName(!showAccountName)}
                        ml={2}
                        variant="ghost"
                        color="purple.500"
                        _hover={{ color: 'purple.700' }}
                      />
                    </Box>
                  ),
                },
              ],
              [
                { text: 'E-mail Address' },
                {
                  text: (
                    <Box display="flex" alignItems="center">
                      <Text>{maskText(info.email, showEmail)}</Text>
                      <IconButton
                        aria-label="Toggle Email Visibility"
                        icon={showEmail ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowEmail(!showEmail)}
                        ml={2}
                        variant="ghost"
                        color="purple.500"
                        _hover={{ color: 'purple.700' }}
                      />
                    </Box>
                  ),
                },
              ],
              [
                { text: 'Creation Date' },
                {
                  text:
                    info.creation > 0
                      ? timestampToDate(info.creation)
                      : 'Unknown',
                },
              ],
              [{ text: 'Shop Coins' }, { text: info.coins }],
              info.type >= Number(process.env.NEXT_PUBLIC_PERMISSION_ADMINPANEL)
                ? [
                    { text: 'Admin Panel' },
                    {
                      text: (
                        <Box
                          position="relative"
                          display="flex"
                          alignItems="center"
                        >
                          <SettingsIcon
                            w={10}
                            h={10}
                            color="white"
                            bg="gray.700"
                            borderRadius="full"
                            p={3}
                            boxShadow="md"
                            _hover={{
                              bg: 'gray.600',
                              transform: 'scale(1.05)',
                            }}
                            cursor="pointer"
                            onClick={() => {
                              router.push('/admin');
                            }}
                          />
                        </Box>
                      ),
                    },
                  ]
                : [],
              [
                { text: 'Enable 2FA:' },
                {
                  text: (
                    <Box display="flex" alignItems="center">
                      <Toggle
                        isToggled={is2FAEnabled}
                        onToggle={handleToggle}
                      />
                    </Box>
                  ),
                },
              ],
            ]}
          />
        </Panel>

        <Panel header="Actions">
          {error && (
            <Alert status="error" mt={4} mb={2}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Wrap spacing={4} justify="center">
            <ChakraButton
              width={{ base: '100%', sm: 'auto' }}
              colorScheme="purple"
              bgGradient="linear(to-r, purple.400, purple.600)"
              _hover={{
                bgGradient: 'linear(to-r, purple.500, purple.700)',
                boxShadow: 'md',
              }}
              color="white"
              onClick={() => router.push('/account/changepassword')}
            >
              Change Password
            </ChakraButton>
            <ChakraButton
              width={{ base: '100%', sm: 'auto' }}
              colorScheme="purple"
              bgGradient="linear(to-r, purple.400, purple.600)"
              _hover={{
                bgGradient: 'linear(to-r, purple.500, purple.700)',
                boxShadow: 'md',
              }}
              color="white"
              onClick={() => router.push('/account/changeemail')}
            >
              Change Email
            </ChakraButton>
            <ChakraButton
              width={{ base: '100%', sm: 'auto' }}
              colorScheme="purple"
              bgGradient="linear(to-r, purple.400, purple.600)"
              _hover={{
                bgGradient: 'linear(to-r, purple.500, purple.700)',
                boxShadow: 'md',
              }}
              color="white"
              onClick={() => router.push('/account/createcharacter')}
            >
              Create Character
            </ChakraButton>
            <ChakraButton
              width={{ base: '100%', sm: 'auto' }}
              colorScheme="purple"
              bgGradient="linear(to-r, purple.400, purple.600)"
              _hover={{
                bgGradient: 'linear(to-r, purple.500, purple.700)',
                boxShadow: 'md',
              }}
              color="white"
              onClick={() => router.push('/account/deletecharacter')}
            >
              Delete Character
            </ChakraButton>

            {isLoading && <Spinner color="purple.500" />}

            {is2FAEnabled && qrCodeDataURL && (
              <Modal
                isOpen={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                isCentered
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Scan QR Code to enable 2FA</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Center>
                      <Image
                        src={qrCodeDataURL}
                        alt="QR Code"
                        boxSize="150px"
                        borderRadius="md"
                        border="2px solid"
                        borderColor="purple.400"
                        p={2}
                      />
                    </Center>
                  </ModalBody>
                  <ModalFooter>
                    <ChakraButton
                      variant="ghost"
                      onClick={() => setIsOpenModal(false)}
                      colorScheme="purple"
                    >
                      Close
                    </ChakraButton>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            )}
          </Wrap>
        </Panel>

        <Panel header="Characters">
          <StripedTable
            head={[{ text: 'Name' }, { text: 'Level' }, { text: 'Profession' }]}
            body={info.players.map((player) => [
              { href: `/character/${player.name}`, text: player.name },
              { text: player.level },
              { text: vocationIdToName[player.vocation] },
            ])}
          />
        </Panel>
      </Panel>
    </>
  );
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
  const { user } = req.session;
  if (!user) {
    return {
      redirect: {
        destination: '/account/login',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
});
