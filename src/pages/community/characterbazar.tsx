import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  Grid,
  Button,
  Select,
  Flex,
  Box,
  useToast,
} from '@chakra-ui/react';
import { withSessionSsr } from '../../lib/session';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';
import CharacterCard from '../../components/CharacterCard';
import { fetchApi } from '../../lib/request';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CharacterData } from '../../shared/interfaces/CharacterAuctionBazar';

type ApiResponse = {
  message: string;
  success: boolean;
  data: any;
};

interface AccountInfo {
  players?: {
    id: string;
    name: string;
  }[];
}

export default function CharacterBazar({ user }) {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [info, setInfo] = useState<AccountInfo>({});
  const [characterBazarList, setCharacterBazarList] = useState<CharacterData[]>(
    [],
  );
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterData | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const fetchData = useCallback(async () => {
    const response = await fetchApi('GET', `/api/account/${user.id}`);

    setInfo(response.account);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchCharacterBazar = useCallback(async () => {
    const response = await fetchApi('GET', `/api/community/characterbazar`);
    setCharacterBazarList(response.data);
  }, [user]);

  useEffect(() => {
    fetchCharacterBazar();
  }, [fetchCharacterBazar]);

  const formik = useFormik({
    initialValues: {
      charactername: '',
      initial_bid: '',
      end_date: '',
    },
    validationSchema: Yup.object({
      charactername: Yup.string().required('O personagem é obrigatório.'),
      initial_bid: Yup.number()
        .required('O valor inicial é obrigatório.')
        .positive('O valor deve ser positivo.')
        .integer('O valor deve ser um número inteiro.'),
      end_date: Yup.date()
        .required('A data de término é obrigatória.')
        .min(new Date(), 'A data de término deve ser no futuro.'),
    }),
    onSubmit: async (values) => {
      const response = await fetchApi('POST', '/api/community/characterbazar', {
        data: {
          playerId: Number(values.charactername),
          initial_bid: values.initial_bid,
          end_date: values.end_date,
          oldAccountId: user.id,
        },
      });

      if (response.success) {
        onClose();
      }
    },
  });

  const bidFormik = useFormik({
    initialValues: {
      bid_amount: '',
    },
    validationSchema: Yup.object({
      bid_amount: Yup.number()
        .required('O valor do lance é obrigatório.')
        .positive('O valor deve ser positivo.')
        .integer('O valor deve ser um número inteiro.'),
    }),
    onSubmit: async (values) => {
      await submitBid(values.bid_amount);
    },
  });

  const submitBid = async (bidAmount: string) => {
    try {
      const response = await fetchApi(
        'POST',
        '/api/community/characterbazar/placebid',
        {
          data: {
            bazarListingId: selectedCharacter?.id,
            bidAmount: bidAmount,
            currentBidAmount: selectedCharacter?.coins,
            bidderAccountId: user.id,
          },
        },
      );

      if (response.success) {
        closeBidModal();
        fetchCharacterBazar();
      } else {
        toast({
          position: 'top',
          title: 'Error.',
          description: response.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
      return { success: false, message: 'Error submitting bid' };
    }
  };

  const openBidModal = (characterData: CharacterData) => {
    setSelectedCharacter(characterData);
    setIsBidModalOpen(true);
  };

  const closeBidModal = () => {
    setIsBidModalOpen(false);
    setSelectedCharacter(null);
  };

  return (
    <>
      <Head title="Character Bazar" />
      <Panel header="Character Bazar">
        <Flex justifyContent="space-between" alignItems="center" mb="2">
          <Box></Box>

          <Button size="sm" colorScheme="purple" onClick={onOpen}>
            <i className="fa fa-lock"></i> Add Character to Bazar
          </Button>
        </Flex>

        <Grid templateColumns="repeat(auto-fit, minmax(240px, 1fr))" gap={6}>
          {characterBazarList?.map((item, index) => (
            <CharacterCard
              key={index}
              characterData={item}
              openBidModal={openBidModal}
              characterBazarList={characterBazarList}
              setCharacterBazarList={setCharacterBazarList}
            />
          ))}
        </Grid>

        {isOpen && (
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add Character to Auction</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={formik.handleSubmit}>
                  <FormControl id="charactername" mb={4}>
                    <FormLabel>Character Name</FormLabel>
                    <Select
                      name="charactername"
                      onChange={formik.handleChange}
                      value={formik.values.charactername}
                    >
                      <option value="" label="<Selecione>" />
                      {info.players &&
                        info.players.map((player) => (
                          <option key={player.id} value={player.id}>
                            {player.name}
                          </option>
                        ))}
                    </Select>
                  </FormControl>

                  <FormControl id="initial_bid" mb={4}>
                    <FormLabel>Initial Value (coins)</FormLabel>
                    <Input
                      type="number"
                      name="initial_bid"
                      onChange={formik.handleChange}
                      value={formik.values.initial_bid}
                    />
                  </FormControl>

                  <FormControl id="end_date" mb={4}>
                    <FormLabel>End Date Auction</FormLabel>
                    <Input
                      type="date"
                      name="end_date"
                      onChange={formik.handleChange}
                      value={formik.values.end_date}
                    />
                  </FormControl>

                  <Button
                    width="100%"
                    mt={4}
                    size="sm"
                    colorScheme="purple"
                    type="submit"
                  >
                    <i className="fa fa-lock"></i> Make Entry
                  </Button>
                </form>
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {isBidModalOpen && selectedCharacter && (
          <Modal isOpen={isBidModalOpen} onClose={closeBidModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Place a bid for {selectedCharacter.name}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={bidFormik.handleSubmit}>
                  <FormControl id="bid_amount" mb={4}>
                    <FormLabel>Bid Amount</FormLabel>
                    <Input
                      type="number"
                      name="bid_amount"
                      onChange={bidFormik.handleChange}
                      value={bidFormik.values.bid_amount}
                    />
                  </FormControl>
                  <Button
                    width="100%"
                    mt={4}
                    size="sm"
                    colorScheme="purple"
                    type="submit"
                  >
                    <i className="fa fa-gavel"></i> Place Bid
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onClick={closeBidModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
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
