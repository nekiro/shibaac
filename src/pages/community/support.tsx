import React, { useState, useEffect, useCallback } from 'react';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';
import StrippedTable from '../../components/StrippedTable';
import { groupToName } from '../../lib';
import { fetchApi } from '../../lib/request';
import { Avatar } from '@chakra-ui/react';

interface SupportMember {
  id: number;
  name: string;
  group_id: string;
  avatarUrl?: string;
}

export default function SupportTeam() {
  const [supportTeam, setSupportTeam] = useState<SupportMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchSupportTeam = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchApi('GET', '/api/community/support');

      if (response.success) {
        setSupportTeam(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch support team:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSupportTeam();
  }, [fetchSupportTeam]);

  if (!supportTeam) {
    return (
      <>
        <Head title="Support Team" />
        <Panel header="Support Team" isLoading={isLoading}></Panel>
      </>
    );
  }

  return (
    <>
      <Head title="Support Team" />
      <Panel header="Support Team">
        <StrippedTable
          head={[{ text: 'Avatar' }, { text: 'Name' }, { text: 'Role' }]}
          body={
            supportTeam && supportTeam.length > 0
              ? supportTeam.map((member) => [
                  {
                    text: (
                      <Avatar
                        src={member.avatarUrl || `/images/default-avatar.jpg`}
                        alt={`${member.name}'s Avatar`}
                      />
                    ),
                  },
                  {
                    text: member.name,
                  },
                  {
                    text: groupToName[member.group_id],
                  },
                ])
              : [
                  [
                    {
                      text: 'There is no data to show',
                      colspan: 3,
                    },
                  ],
                ]
          }
        />
      </Panel>
    </>
  );
}
