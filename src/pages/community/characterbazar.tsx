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
} from '@chakra-ui/react';
import { withSessionSsr } from '../../lib/session';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';
import CharacterCard from '../../components/CharacterCard';
import { fetchApi } from '../../lib/request';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const listBazarCharacters = [
  {
    id: 1,
    name: 'Pantes',
    characterPage: 'auction-pantes',
    level: 500,
    vocation: 'Elite Knight',
    highlight: true,
    country: 'BR',
    world: 'Gentebra',
    pvpType: 'Optional',
    battlEyeStatus: 'Yellow BattlEyeOptional',
    remainingTime: '9h 5m',
    endingAt: '20:00',
    coins: 3001,
    skills: {
      Magic: 121,
      Club: 14,
      Fist: 49,
      Sword: 17,
      Fishing: 71,
      Axe: 29,
      Distance: 113,
      Shielding: 10,
    },
    equipedItems: [3079, 3397, 5741, 8863],
    imbuements: {
      total: 16,
      max: 23,
    },
    charms: {
      total: 4,
      max: 19,
    },
    quests: {
      total: 16,
      max: 41,
      completedQuests: [
        'Dawnport Quest',
        'Doublet Quest',
        'Behemoth Quest',
        'Black Knight Quest',
        'Crusader Helmet Quest',
        'The Annihilator Quest',
        'The Demon Oak Quest',
        'Demon Helmet Quest',
      ],
    },
    bossPoints: 920,
    extras: [
      'Charm Expansion',
      'Prey Slot',
      'Wasted Tibia Coin 2,400',
      'Soul War disponível',
      'Primal Ordeal disponível',
    ],
  },
  {
    id: 2,
    name: 'Pedrog',
    characterPage: 'Ir para a página do personagem',
    level: 999,
    vocation: 'Elder Druid',
    highlight: 'Destaque seu leilão!',
    country: 'BR',
    world: 'Amera',
    battlEyeStatus: 'Green BattlEye',
    remainingTime: '9h 5m',
    endingAt: '20:00',
    coins: 3001,
    skills: {
      Magic: 121,
      Club: 14,
      Fist: 49,
      Sword: 17,
      Fishing: 71,
      Axe: 29,
      Distance: 113,
      Shielding: 10,
    },
    equipedItems: [3397, 5741, 8863, 3419, 3276],
    imbuements: {
      total: 16,
      max: 23,
    },
    charms: {
      total: 4,
      max: 19,
    },
    quests: {
      total: 16,
      max: 41,
      completedQuests: [
        'Dawnport Quest',
        'Doublet Quest',
        'Behemoth Quest',
        'Black Knight Quest',
        'Crusader Helmet Quest',
        'The Annihilator Quest',
        'The Demon Oak Quest',
        'Demon Helmet Quest',
      ],
    },
    bossPoints: 920,
    extras: [
      'Charm Expansion',
      'Prey Slot',
      'Wasted Tibia Coin 2,400',
      'Soul War disponível',
      'Primal Ordeal disponível',
    ],
  },
];

type ApiResponse = {
  message: string;
  success: boolean;
  data: any;
};

export default function CharacterBazar({ user }) {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [info, setInfo] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchData = useCallback(async () => {
    const response = await fetchApi('GET', `/api/account/${user.id}`);
    setInfo(response.account);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formik = useFormik({
    initialValues: {
      charctername: '',
      initial_bid: '',
      end_date: '',
    },
    validationSchema: Yup.object({
      leader: Yup.string().required('O personagem é obrigatório.'),
      initial_bid: Yup.number()
        .required('O valor inicial é obrigatório.')
        .positive('O valor deve ser positivo.')
        .integer('O valor deve ser um número inteiro.'),
      end_date: Yup.date()
        .required('A data de término é obrigatória.')
        .min(new Date(), 'A data de término deve ser no futuro.'),
    }),
    onSubmit: async (values) => {
      // call api
      const response = await fetchApi('POST', '/api/community/characterbazar', {
        data: {
          playerId: values.charctername,
          initial_bid: values.initial_bid,
          end_date: values.end_date,
        },
      });

      if (response.success) {
        // Handle success logic
      } else {
        // toast({
        //   position: 'top',
        //   title: 'Error.',
        //   description: response?.message,
        //   status: 'error',
        //   duration: 9000,
        //   isClosable: true,
        // });
      }
    },
  });

  return (
    <>
      <Head title="Highscores" />

      <Panel header="Character Bazar">
        <Flex justifyContent="space-between" alignItems="center" mb="2">
          <Box></Box>
          <Button size="sm" colorScheme="purple" onClick={onOpen}>
            <i className="fa fa-lock"></i> Add Character to Bazar
          </Button>
        </Flex>

        <Grid templateColumns="repeat(auto-fit, minmax(240px, 1fr))" gap={6}>
          {listBazarCharacters.map((item, index) => (
            <CharacterCard key={index} characterData={item} />
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
                  {/* Select for Character */}
                  <FormControl id="charactername" mb={4}>
                    <FormLabel>Character Name</FormLabel>
                    <Select
                      name="charactername"
                      onChange={formik.handleChange}
                      value={formik.values.leader}
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

                  {/* Number input for Initial Bid */}
                  <FormControl id="initial_bid" mb={4}>
                    <FormLabel>Initial Value (coins)</FormLabel>
                    <Input
                      type="number"
                      name="initial_bid"
                      onChange={formik.handleChange}
                      value={formik.values.initial_bid}
                    />
                  </FormControl>

                  {/* Date input for Auction Ending Date */}
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
