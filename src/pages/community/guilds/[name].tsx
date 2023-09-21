import React, { useState, useEffect, useCallback } from 'react';
import Panel from '../../../components/Panel';
import { fetchApi } from '../../../lib/request';
import FormWrapper from '../../../components/FormWrapper';
import { useRouter } from 'next/router';
import StrippedTable from '../../../components/StrippedTable';
import Link from 'next/link';
import { vocationIdToName, RankGuild } from '../../../lib';
import { withSessionSsr } from '../../../lib/session';
import Button from '../../../components/Button';
import { CgUserRemove } from 'react-icons/cg';

import {
  Box,
  Button as ChakraButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';

export type FormButton = {
  type?: 'submit' | 'button' | 'reset';
  btnType: any;
  value: string;
  href?: string;
};

type Field = {
  type: string;
  name: string;
  placeholder?: string;
  label: {
    text: string;
    size: number;
  };
  size: number;
};

interface GuildMember {
  player_id: number;
  guild_id: number;
  rank_id: number;
  nick: string;
  player?: {
    level: number;
    vocation: string;
  };
}

interface Guild {
  id: number;
  level: number;
  name: string;
  ownerid: number;
  creationdata: string;
  motd: string;
  residence: number;
  balance: number;
  points: number;
  guild_membership: GuildMember[];
  logoUrl?: string;
}

interface FormValues {
  [key: string]: string;
}

type ApiResponse = {
  message: string;
  success: boolean;
  data: any;
};

interface GuildInvite {
  player: {
    name: string;
    level: number;
    vocation: number;
  };
  date: string;
  player_id: number;
}

interface GuildMember {
  id: number;
  player_id: number;
  guild_id: number;
  rank_id: number;
  nick: string;
  online?: boolean;
  player?: {
    level: number;
    vocation: string;
  };
}

const fields: Field[] = [
  {
    type: 'text',
    name: 'player_invite',
    label: { text: 'Player Name', size: 3 },
    size: 9,
  },
];

const buttons: FormButton[] = [
  { type: 'submit', btnType: 'primary', value: 'Submit' },
];

export default function Guild({ user }: any) {
  const router = useRouter();
  const { name } = router.query;
  const [guild, setGuild] = useState<Guild | null>(null);
  const [guildInvites, setGuildInvites] = useState<GuildInvite[]>([]);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [activeTab, setActiveTab] = useState('members');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);

  const toast = useToast();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchGuildData = useCallback(async () => {
    if (name) {
      try {
        const response = await fetchApi(
          'GET',
          `/api/community/guilds/${encodeURIComponent(name)}`,
        );

        setGuild(response.data);
      } catch (error) {
        console.error('Failed to fetch guild data:', error);
      }
    }
  }, [name]);

  useEffect(() => {
    fetchGuildData();
  }, [fetchGuildData]);

  const fetchGuildInvites = useCallback(async () => {
    try {
      if (guild?.id) {
        const response = await fetchApi(
          'GET',
          `/api/community/guilds/inviteplayer/?guildId=${guild.id}`,
        );

        setGuildInvites(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch guild data:', error);
    }
  }, [guild?.id]);

  useEffect(() => {
    fetchGuildInvites();
  }, [fetchGuildInvites]);

  const onSubmit = async (
    values: FormValues,
    { resetForm }: { resetForm: () => void },
  ) => {
    const response = await fetchApi(
      'POST',
      '/api/community/guilds/inviteplayer',
      {
        data: {
          player_invite: values.player_invite,
          guild_id: guild?.id,
        },
      },
    );

    if (response.success) {
      toast({
        position: 'top',
        title: 'Player invited successfully!',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });

      setResponse(response);
      resetForm();
      fetchGuildInvites();
    } else {
      toast({
        position: 'top',
        title: response.message,
        status: 'warning',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleDeleteInvite = async (inviteId: number) => {
    console.log('inviteId', inviteId);

    try {
      const response = await fetchApi(
        'DELETE',
        `/api/community/guilds/inviteplayer?inviteId=${inviteId}&guildId=${guild?.id}`,
      );

      if (response.success) {
        setResponse({
          message: 'Invite deleted successfully',
          success: true,
          data: {},
        });

        toast({
          position: 'top',
          title: 'Invite deleted successfully',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });

        fetchGuildInvites();
      } else {
        toast({
          position: 'top',
          title: 'Failed to delete invite',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        setResponse({
          message: 'Failed to delete invite',
          success: false,
          data: {},
        });
      }
    } catch (error) {
      console.error('Failed to delete invite:', error);
      toast({
        position: 'top',
        title: 'Failed to delete invite',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setResponse({
        message: 'Failed to delete invite',
        success: false,
        data: {},
      });
    }
  };

  const handleAcceptInvite = async (inviteId: number) => {
    const findIdByAccept = guildInvites.find(
      (invite) => invite.player_id === inviteId,
    );

    try {
      const response = await fetchApi(
        'POST',
        `/api/community/guilds/acceptinvite?inviteId=${inviteId}&player_name=${findIdByAccept?.player.name}`,
      );

      if (response.success) {
        setResponse({
          message: 'Invite deleted successfully',
          success: true,
          data: {},
        });

        toast({
          position: 'top',
          title: 'Player deleted successfuly!',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });

        fetchGuildInvites();
        fetchGuildData();
      }
    } catch (error) {
      toast({
        position: 'top',
        title: 'Player deleted successfuly!',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      console.error('Failed to delete invite:', error);
      setResponse({
        message: 'Failed to delete invite',
        success: false,
        data: {},
      });
    }
  };

  const handleLeaveGuild = async (memberId: number) => {
    try {
      const response = await fetchApi(
        'POST',
        `/api/community/guilds/leaveguild?guildId=${guild?.id}&memberId=${memberId}`,
      );

      if (response.success) {
        toast({
          position: 'top',
          title: 'You have successfully left the guild!',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        fetchGuildData();
      }
    } catch (error) {
      console.error('Failed to leave guild:', error);
      toast({
        position: 'top',
        title: 'There was a problem leaving the guild!',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleExpelMember = async (playerId: number) => {
    const findLeader = guild?.guild_membership.filter(
      (member) => member.rank_id === 1,
    );

    if (!findLeader || findLeader.length === 0) {
      toast({
        position: 'top',
        title: 'Leader not found',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const leaderId = findLeader[0]?.player_id;

    try {
      const response = await fetchApi(
        'POST',
        `/api/community/guilds/expelMember?guildId=${guild?.id}&playerId=${playerId}&leaderId=${leaderId}`,
      );

      if (response.success) {
        toast({
          position: 'top',
          title: 'Member expelled successfully',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });

        fetchGuildData();
      }
    } catch (error) {
      console.error('Failed to expel member:', error);
      toast({
        position: 'top',
        title: 'An error occurred while trying to expel the member',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleFileChange = (e: any) => {
    if (e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };

      reader.readAsDataURL(e.target.files[0]);
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    try {
      await fetchApi(
        'PATCH',
        `/api/community/guilds/updateLogoGuild?guildId=${guild?.id}`,
        { data: formData, multipart: true },
      );

      fetchGuildData();

      setPreviewUrl(null);
      setFile(null);
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index === 0 ? 'members' : 'settings');
  };

  if (!guild) {
    return <div>Loading...</div>;
  }

  return !guild ? (
    <Text>Loading...</Text>
  ) : (
    <Panel>
      <VStack spacing={4} align="start">
        <Box borderWidth={1} borderRadius="lg" p={4} width="full">
          <Tabs
            variant="enclosed"
            index={activeTab === 'members' ? 0 : 1}
            onChange={handleTabChange}
          >
            <TabList>
              <Tab>Membros</Tab>
              <Tab>Configuração</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {activeTab === 'members' && (
                  <Panel header="Guild Information">
                    <StrippedTable
                      head={[
                        { text: 'Classificação' },
                        { text: 'Nome' },
                        { text: 'Status' },
                        { text: 'Level/Vocação' },
                        { text: 'Ações' },
                      ]}
                      body={
                        guild.guild_membership &&
                        guild.guild_membership.length > 0
                          ? guild.guild_membership.map((member, index) => [
                              { text: RankGuild[member.rank_id] },
                              { text: member.nick },
                              { text: member.online ? 'Online' : 'Offline' },
                              {
                                text: member.player
                                  ? `${member.player.level}/${
                                      vocationIdToName[member.player.vocation]
                                    }`
                                  : 'N/A',
                              },
                              {
                                element: (
                                  <td>
                                    {user.id === guild.ownerid &&
                                    user.id !== member.player_id ? (
                                      <CgUserRemove
                                        size={24}
                                        cursor="pointer"
                                        color="red"
                                        onClick={() =>
                                          handleExpelMember(member.player_id)
                                        }
                                      />
                                    ) : (
                                      user.id === member.player_id &&
                                      user.id !== guild.ownerid && (
                                        <Button
                                          onClick={() =>
                                            handleLeaveGuild(member.player_id)
                                          }
                                          type="button"
                                          btnType="danger"
                                          value="Leave Guild"
                                        />
                                      )
                                    )}
                                  </td>
                                ),
                              },
                            ])
                          : [
                              [
                                {
                                  text: 'There is no data to show',
                                  colspan: 5,
                                },
                              ],
                            ]
                      }
                    />
                  </Panel>
                )}
              </TabPanel>
              <TabPanel>
                {activeTab === 'settings' && (
                  <Panel header="Configuração da Guild">
                    <div style={{ marginBottom: '20px' }}>
                      <h2>Logo da Guild</h2>
                      <img
                        src={
                          guild.logoUrl
                            ? `${baseUrl}/${guild.logoUrl}`
                            : `/images/guild-logo-default.gif`
                        }
                        alt={`${guild.name} logo`}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          marginBottom: '20px',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <h2>Atualizar Logo</h2>
                      <input type="file" onChange={handleFileChange} />
                      {previewUrl && (
                        <div style={{ marginTop: '20px' }}>
                          <h3>Preview</h3>
                          <img
                            src={previewUrl}
                            alt="Preview"
                            style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <button onClick={handleUpload}>Upload Logo</button>
                  </Panel>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <Box borderWidth={1} borderRadius="lg" p={4} width="full">
          <StrippedTable
            head={[
              { text: 'Player Name' },
              { text: 'Level/Vocation' },
              { text: 'Invite Date' },
              { text: 'Actions' },
            ]}
            body={
              guildInvites && guildInvites.length > 0
                ? guildInvites.map((invite, index) => [
                    {
                      text: (
                        <Link href={`/character/${invite.player.name}`}>
                          {invite.player.name}
                        </Link>
                      ),
                    },
                    {
                      text: `${invite.player.level} - ${
                        vocationIdToName[invite.player.vocation]
                      }`,
                    },
                    { text: new Date(invite.date).toLocaleString() },
                    {
                      text: (
                        <td>
                          {user.id === guild.ownerid ? (
                            <ChakraButton
                              onClick={() =>
                                handleDeleteInvite(invite.player_id)
                              }
                              colorScheme="red"
                              type="button"
                            >
                              Delete
                            </ChakraButton>
                          ) : invite.player_id === user.id ? (
                            <ChakraButton
                              onClick={() =>
                                handleAcceptInvite(invite.player_id)
                              }
                              colorScheme="green"
                              type="button"
                            >
                              Aceitar
                            </ChakraButton>
                          ) : null}
                        </td>
                      ),
                    },
                  ])
                : [
                    [
                      {
                        text: 'There is no data to show',
                        colspan: 6,
                      },
                    ],
                  ]
            }
          />

          {user.id === guild.ownerid ? (
            <FormWrapper
              validationSchema={''}
              onSubmit={onSubmit}
              fields={fields}
              buttons={buttons}
              response={response}
            />
          ) : null}
        </Box>
      </VStack>
    </Panel>
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
