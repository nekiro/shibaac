import React, { useEffect, useState, useCallback } from 'react';
import Panel from 'src/components/Panel';
import Head from 'src/layout/Head';
import { fetchApi } from 'src/lib/request';
import { withSessionSsr } from 'src/lib/session';
import Button from '../../components/Button';
import StripedTable from '../../components/StrippedTable';
import {
  Alert,
  AlertIcon,
  Box,
  Button as ChakraButton,
  Center,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Wrap,
} from '@chakra-ui/react';
import { vocationIdToName } from '../../lib';
import { Toggle } from '../../components/Toggle';

export default function Account({ user }) {
  const [info, setInfo] = useState(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCodeDataURL, setQRCodeDataURL] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const response = await fetchApi('GET', `/api/account/${user.id}`);
    setInfo(response.account);
    setIs2FAEnabled(response.account.twoFAEnabled);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggle = async () => {
    try {
      setIsLoading(true);

      const response = await fetchApi(
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

  const showQRCode = (dataURL) => {
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

  return (
    <>
      <Head title="Account Management" />
      <Panel header="Account Management">
        <Panel header="Informations">
          <StripedTable
            body={[
              [{ text: 'Account Name' }, { text: info.name }],
              [{ text: 'E-mail Address' }, { text: info.email }],
              [
                { text: 'Creation Date' },
                {
                  text:
                    info.creation > 0
                      ? timestampToDate(info.creation)
                      : 'Unknown',
                },
              ],
              //{ name: 'Last Login', value: '11/02/2021' },
              [{ text: 'Shop Coins' }, { text: info.coins }],
            ]}
          >
            {/* '.(!$rec_key ? '
                <a
                  href="?view=account&action=generatekey"
                  className="btn btn-primary btn-sm"
                >
                  <i className="fa fa-key"></i> Generate Recovery Key
                </a>
                ' : '').' */}
            {/* </td> */}
          </StripedTable>
        </Panel>

        <Panel header="Actions">
          {error && (
            <Alert status="error" mt={4} mb={2}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Wrap>
            <Button
              value="Change Password"
              btnType="primary"
              href="/account/changepassword"
            />
            <Button
              value="Change Email"
              btnType="primary"
              href="/account/changeemail"
            />
            <Button
              value="Create Character"
              btnType="primary"
              href="/account/createcharacter"
            />
            <Button
              value="Delete Character"
              btnType="primary"
              href="/account/deletecharacter"
            />
            {isLoading && <Spinner />}

            <Box display="flex" alignItems="center">
              <Text mr={4}>Enable 2FA:</Text>
              <Toggle isToggled={is2FAEnabled} onToggle={handleToggle} />
            </Box>
            {is2FAEnabled && qrCodeDataURL && (
              <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Scan QR Code to enable 2FA</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Center>
                      <Image
                        src={qrCodeDataURL}
                        alt="QR Code"
                        boxSize="100px"
                      />
                    </Center>
                  </ModalBody>
                  <ModalFooter>
                    <ChakraButton
                      variant="ghost"
                      onClick={() => setIsOpenModal(false)}
                    >
                      Close
                    </ChakraButton>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            )}

            {/* <Button
              value="Generate recovery key"
              btnType="primary"
              href="/account/deletecharacter"
            /> */}
          </Wrap>
        </Panel>

        <Panel header="Characters">
          {/* <div className="pull-right">
                      <Link
                        href={`/account/editcharacter/${player.name}`}
                        passHref
                      >
                        <button
                          className="btn btn-sm btn-primary"
                          style={{ margin: { right: '5px' } }}
                        >
                          <i className="fa fa-pencil"></i> Edit
                        </button>
                      </Link>
                    </div> */}

          <StripedTable
            head={[
              { text: 'Name' },
              { text: 'Level' },
              { text: 'Profession' },
              // { text: 'Edit' }
            ]}
            body={info.players.map((player) => [
              { href: `/character/${player.name}`, text: player.name },
              { text: player.level },
              { text: vocationIdToName[player.vocation] },

              // {
              //   type: 'button',
              //   text: 'Edit',
              //   href: `/account/editcharacter/${player.name}`,
              // },
            ])}
          ></StripedTable>
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
