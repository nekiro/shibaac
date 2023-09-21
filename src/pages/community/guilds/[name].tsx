import React, { useState, useEffect, useCallback } from 'react';
import Panel from 'src/components/Panel';
import { fetchApi } from 'src/util/request';
import FormWrapper from 'src/components/FormWrapper';
import { useRouter } from 'next/router';
import StrippedTable from 'src/components/StrippedTable';
import Link from 'next/link';
import { vocationIdToName, RankGuild, ToastConfig } from 'src/util';
import { withSessionSsr } from 'src/util/session';
import Button from 'src/components/Button';
import { toast } from 'react-toastify';
import { CgUserRemove } from 'react-icons/cg';

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

const buttons: Button[] = [
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

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchGuildData = useCallback(async () => {
    if (name) {
      try {
        const response = await fetchApi(
          'GET',
          `/api/community/guilds/${encodeURIComponent(name)}`
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
          `/api/community/guilds/inviteplayer/?guildId=${guild.id}`
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
    { resetForm }: { resetForm: () => void }
  ) => {
    const response = await fetchApi(
      'POST',
      '/api/community/guilds/inviteplayer',
      {
        data: {
          player_invite: values.player_invite,
          guild_id: guild?.id,
        },
      }
    );

    if (response.success) {
      toast.success('Player invited successfuly!', ToastConfig);

      setResponse(response);
      resetForm();
      fetchGuildInvites();
    }
  };

  const handleDeleteInvite = async (inviteId: number) => {
    try {
      const response = await fetchApi(
        'DELETE',
        `/api/community/guilds/inviteplayer?inviteId=${inviteId}&guildId=${guild?.id}`
      );

      if (response.success) {
        setResponse({
          message: 'Invite deleted successfully',
          success: true,
          data: {},
        });

        toast.success('Player deleted successfuly!', ToastConfig);

        fetchGuildInvites();
      } else {
        setResponse({
          message: 'Failed to delete invite',
          success: false,
          data: {},
        });
      }
    } catch (error) {
      toast.success('Ahhhh! Failed to delete invite', ToastConfig);
      console.error('Failed to delete invite:', error);
      setResponse({
        message: 'Failed to delete invite',
        success: false,
        data: {},
      });
    }
  };

  const handleAcceptInvite = async (inviteId: number) => {
    const findIdByAccept = guildInvites.find(
      (invite) => invite.player_id === inviteId
    );

    try {
      const response = await fetchApi(
        'POST',
        `/api/community/guilds/acceptinvite?inviteId=${inviteId}&player_name=${findIdByAccept?.player.name}`
      );

      if (response.success) {
        setResponse({
          message: 'Invite deleted successfully',
          success: true,
          data: {},
        });

        toast.success('Player deleted successfuly!', ToastConfig);

        fetchGuildInvites();
        fetchGuildData();
      } else {
        setResponse({
          message: 'Failed to delete invite',
          success: false,
          data: {},
        });
      }
    } catch (error) {
      toast.success('Ahhhh! Failed to delete invite', ToastConfig);
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
        `/api/community/guilds/leaveguild?guildId=${guild?.id}&memberId=${memberId}`
      );

      if (response.success) {
        toast.success('Você saiu da guilda com sucesso!', ToastConfig);
        fetchGuildData();
      } else {
        toast.error('Falha ao sair da guilda', ToastConfig);
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao sair da guilda', ToastConfig);
      console.error('Failed to leave guild:', error);
    }
  };

  const handleExpelMember = async (playerId: number) => {
    const findLeader = guild?.guild_membership.filter(
      (member) => member.rank_id === 1
    );

    if (!findLeader || findLeader.length === 0) {
      toast.error('Leader not found', ToastConfig);
      return;
    }

    const leaderId = findLeader[0]?.player_id;

    try {
      const response = await fetchApi(
        'POST',
        `/api/community/guilds/expelMember?guildId=${guild?.id}&playerId=${playerId}&leaderId=${leaderId}`
      );

      if (response.success) {
        toast.success('Member expelled successfully!', ToastConfig);

        fetchGuildData();
      } else {
        toast.error('Failed to expel member', ToastConfig);
      }
    } catch (error) {
      toast.error(
        'An error occurred while trying to expel the member',
        ToastConfig
      );
      console.error('Failed to expel member:', error);
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
        { data: formData, multipart: true }
      );

      fetchGuildData();

      setPreviewUrl(null);
      setFile(null);
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  if (!guild) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Panel header="Guild Information">
        <div className="tab-pills">
          <button
            className={activeTab === 'members' ? 'active' : ''}
            onClick={() => setActiveTab('members')}
          >
            Membros
          </button>
          <button
            className={activeTab === 'config' ? 'active' : ''}
            onClick={() => setActiveTab('config')}
          >
            Configuração
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={`${baseUrl}/${guild.logoUrl}`}
            alt={`${guild.name} logo`}
            style={{ width: '64px', height: '64px', marginRight: '20px' }}
          />
          <h1>{guild.name}</h1>
        </div>
        <p>
          A guilda foi fundada em{' '}
          {new Date(guild.creationdata).toLocaleString()}.
        </p>
        <p>{guild.motd || 'Nova guilda. O líder deve editar este texto :)'}</p>

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
            >
              {guild.guild_membership.map((member, index) => (
                <tr key={index}>
                  <td>{RankGuild[member.rank_id]}</td>
                  <td>{member.nick}</td>
                  <td>{member.online ? 'Online' : 'Offline'}</td>
                  <td>
                    {member.player
                      ? `${member.player.level}/${
                          vocationIdToName[member.player.vocation]
                        }`
                      : 'N/A'}
                  </td>
                  <td>
                    {user.id === guild.ownerid &&
                    user.id !== member.player_id ? (
                      <CgUserRemove
                        size={24}
                        cursor="pointer"
                        color="red"
                        onClick={() => handleExpelMember(member.player_id)}
                      />
                    ) : (
                      user.id === member.player_id &&
                      user.id !== guild.ownerid && (
                        <Button
                          onClick={() => handleLeaveGuild(member.player_id)}
                          type="button"
                          btnType="danger"
                          value="Leave Guild"
                        />
                      )
                    )}
                  </td>
                </tr>
              ))}
            </StrippedTable>
          </Panel>
        )}

        {activeTab === 'config' && (
          <Panel header="Configuração da Guild">
            <div style={{ marginBottom: '20px' }}>
              <h2>Logo da Guild</h2>
              <img
                src={`${baseUrl}/${guild.logoUrl}`}
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
      </Panel>

      <Panel header="Player Invites">
        <StrippedTable
          head={[
            { text: 'Player Name' },
            { text: 'Level/Vocation' },
            { text: 'Invite Date' },
            { text: 'Actions' },
          ]}
        >
          {guildInvites.length > 0 ? (
            guildInvites.map((invite, index) => (
              <tr key={index}>
                <td>
                  <Link href={`/character/${invite.player.name}`}>
                    {invite.player.name}
                  </Link>
                </td>
                <td>{`${invite.player.level} - ${
                  vocationIdToName[invite.player.vocation]
                }`}</td>
                <td>{new Date(invite.date).toLocaleString()}</td>
                <td>
                  {user.id === guild.ownerid ? (
                    <Button
                      onClick={() => handleDeleteInvite(invite.player_id)}
                      type="button"
                      btnType="danger"
                      value="Delete"
                    />
                  ) : invite.player_id === user.id ? (
                    <Button
                      onClick={() => handleAcceptInvite(invite.player_id)}
                      type="button"
                      btnType="primary"
                      value="Aceitar"
                    />
                  ) : null}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>
                Sem dados para mostrar
              </td>
            </tr>
          )}
        </StrippedTable>

        {user.id === guild.ownerid ? (
          <FormWrapper
            validationSchema={null}
            onSubmit={onSubmit}
            fields={fields}
            buttons={buttons}
            response={response}
          />
        ) : null}
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
