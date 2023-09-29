import React, { useState, useEffect, useCallback } from 'react';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';
import StrippedTable from '../../components/StrippedTable';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { withSessionSsr } from '../../lib/session';
import { fetchApi } from '../../lib/request';
import Link from 'next/link';
import { Field } from '../../shared/types/Fields';

import {
  Box,
  Flex,
  Input,
  FormControl,
  FormLabel,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Avatar,
  Button,
  useToast,
} from '@chakra-ui/react';

type Button = {
  type?: 'submit' | 'button' | 'reset';
  btnType?:
    | 'primary'
    | 'default'
    | 'secondary'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';
  href?: string;
  value: string;
};

type ApiResponse = {
  message: string;
  success: boolean;
  data: any;
};

interface Player {
  id: number;
  name: string;
  level: number;
}

interface Account {
  id: number;
  name: string;
  players: Player[];
}

export default function Guilds({ user }: any) {
  const [guilds, setGuilds] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [info, setInfo] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetchApi('GET', `/api/account/${user.id}`);

      if (response.success) {
        setInfo(response.account);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchGuilds = useCallback(async () => {
    try {
      const response = await fetchApi('GET', '/api/community/guilds');

      setGuilds(response.data);
    } catch (error) {
      console.error('Failed to fetch guilds:', error);
    }
  }, []);

  useEffect(() => {
    fetchGuilds();
  }, [fetchGuilds]);

  const formik = useFormik({
    initialValues: {
      leader: '',
      guild_name: '',
    },
    validationSchema: Yup.object({
      leader: Yup.string().required('Required'),
      guild_name: Yup.string()
        .required('Required')
        .max(100, 'Must be 100 characters or less'),
    }),
    onSubmit: async (values) => {
      const leaderOption = fields[0].options?.find(
        (option) => option.value === Number(values.leader),
      );

      const response = await fetchApi('POST', '/api/community/guilds', {
        data: {
          leader_id: leaderOption ? leaderOption.value : null,
          leader_name: leaderOption ? leaderOption.label : null,
          guild_name: values.guild_name,
        },
      });

      setResponse(response.data);

      if (response.success) {
        closeModal();
        fetchGuilds();
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
    },
  });

  const handleCreateGuild = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fields: Field[] = [
    {
      type: 'select',
      name: 'leader',
      label: { text: 'Character Name', size: 3 },
      size: 9,
      options: info
        ? [
            { label: '<Selecione>', value: '', text: '<Selecione>' },
            ...info.players.map((player) => ({
              label: player.name,
              value: player.id,
              text: player.name,
            })),
          ]
        : [{ label: '<Selecione>', value: '', text: '<Selecione>' }],
    },
    {
      type: 'text',
      name: 'guild_name',
      label: { text: 'Guild Name', size: 3 },
      size: 9,
    },
  ];

  if (!guilds) {
    return (
      <>
        <Head title="Guilds" />
        <Panel header="Guilds" isLoading={isLoading}></Panel>
      </>
    );
  }

  return (
    <>
      <Head title="Guilds" />
      <Panel header="Guilds">
        <Flex justifyContent="space-between" alignItems="center" mb="2">
          <Box></Box>
          <Button
            size="sm"
            colorScheme="purple"
            onClick={() => handleCreateGuild()}
          >
            <i className="fa fa-lock"></i> Create Guild
          </Button>
        </Flex>
        <StrippedTable
          head={[
            { text: 'Logo' },
            { text: 'Nome' },
            { text: 'Membros' },
            { text: 'Nível Médio' },
          ]}
          body={
            guilds && guilds.length > 0
              ? guilds.map((guild, index) => [
                  {
                    text: (
                      <Avatar
                        src={
                          guild.logoUrl
                            ? `${baseUrl}/${guild.logoUrl}`
                            : `/images/guild-logo-default.gif`
                        }
                        alt="Guild Logo"
                        width="50"
                        height="50"
                      />
                    ),
                  },
                  {
                    text: (
                      <Link
                        href={`/community/guilds/${encodeURIComponent(
                          guild.name,
                        )}`}
                      >
                        <a>{guild.name}</a>
                      </Link>
                    ),
                  },
                  {
                    text: guild.memberCount,
                  },
                  {
                    text: guild.level,
                  },
                ])
              : [
                  [
                    {
                      text: 'There is no data to show',
                      colspan: 4,
                    },
                  ],
                ]
          }
        />
      </Panel>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create guild</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={formik.handleSubmit}>
                {fields.map((field) => {
                  switch (field.type) {
                    case 'text':
                      return (
                        <FormControl
                          key={field.name}
                          isInvalid={
                            formik.errors[field.name] &&
                            formik.touched[field.name]
                          }
                        >
                          <FormLabel>{field.label.text}</FormLabel>
                          <Input
                            placeholder={field.placeholder || ''}
                            name={field.name}
                            onChange={(e) => {
                              formik.handleChange(e);
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values[field.name]}
                          />
                          <span>{formik.errors[field.name]}</span>
                        </FormControl>
                      );
                    case 'select':
                      return (
                        <FormControl
                          key={field.name}
                          isInvalid={
                            formik.errors[field.name] &&
                            formik.touched[field.name]
                          }
                        >
                          <FormLabel>{field.label.text}</FormLabel>
                          <Select
                            placeholder={field.placeholder || ''}
                            name={field.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values[field.name]}
                          >
                            {field.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.text}
                              </option>
                            ))}
                          </Select>
                          <span>{formik.errors[field.name]}</span>
                        </FormControl>
                      );
                    default:
                      return null;
                  }
                })}
                <Button
                  width="100%"
                  mt={4}
                  size="sm"
                  colorScheme="purple"
                  type="submit"
                >
                  <i className="fa fa-lock"></i> Create Guild
                </Button>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
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
