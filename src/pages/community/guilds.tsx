import React, { useState, useEffect, useCallback } from 'react';
import Panel from 'src/components/Panel';
import Head from 'src/layout/Head';
import StrippedTable from 'src/components/StrippedTable';
import FormWrapper from 'src/components/FormWrapper';
import { withSessionSsr } from 'src/util/session';
import { fetchApi } from 'src/util/request';
import Link from 'next/link';
import { FiX } from 'react-icons/fi';

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

type Option = {
  label: string;
  value: string | number;
  text: string;
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
  options?: Option[];
};

interface FormValues {
  [key: string]: string;
}

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
  const [filter, setFilter] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [info, setInfo] = useState<Account | null>(null);

  const fetchData = useCallback(async () => {
    const response = await fetchApi('GET', `/api/accounts/${user.id}`);

    const mappedResponse = {
      id: response.data.account.id,
      name: response.data.account.name,
      players: response.data.account.players,
    };

    setInfo(mappedResponse);
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
  }, [filter]);

  useEffect(() => {
    fetchGuilds();
  }, [fetchGuilds, filter]);

  const onSubmit = async (
    values: FormValues,
    { resetForm }: { resetForm: () => void },
  ) => {
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

    setResponse(response);
    resetForm();

    if (response.success) {
      closeModal();
      fetchGuilds();
    }
  };

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
        ? info.players.map((player) => ({
            label: player.name,
            value: player.id,
            text: player.name,
          }))
        : [],
    },
    {
      type: 'text',
      name: 'guild_name',
      label: { text: 'Guild Name', size: 3 },
      size: 9,
    },
  ];

  const buttons: Button[] = [
    { type: 'submit', btnType: 'primary', value: 'Submit' },
  ];

  if (!guilds) {
    return (
      <>
        <Head title="Guilds" />
        <Panel header="Guilds" isLoading={true}></Panel>
      </>
    );
  }

  return (
    <>
      <Head title="Guilds" />
      <Panel header="Guilds">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <div></div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleCreateGuild()}
          >
            <i className="fa fa-lock"></i> Create Guild
          </button>
        </div>

        <StrippedTable
          head={[
            { text: 'Logo' },
            { text: 'Nome' },
            { text: 'Membros' },
            { text: 'Nível Médio' },
          ]}
        >
          {guilds.map((guild: any, index: any) => (
            <tr key={index}>
              <td>
                <img src={guild.logo} alt={guild.name} width="50" height="50" />
              </td>
              <td>
                <Link
                  href={`/community/guilds/${encodeURIComponent(guild.name)}`}
                >
                  <a>{guild.name}</a>
                </Link>
              </td>
              <td>{guild.memberCount}</td>
              <td>{guild.level}</td>
            </tr>
          ))}
        </StrippedTable>
      </Panel>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          onClick={closeModal}
        >
          <div
            style={{
              width: '500px',
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '10px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h2>Create guild</h2>
              <FiX
                size={24}
                style={{ cursor: 'pointer' }}
                onClick={() => setIsModalOpen(false)}
              />
            </div>

            <FormWrapper
              validationSchema={null}
              onSubmit={onSubmit}
              fields={fields}
              buttons={buttons}
              response={response}
            />

            <button onClick={closeModal}>Close</button>
          </div>
        </div>
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
