import React, { useEffect, useState, useCallback } from 'react';
import Panel from 'src/components/Panel';
import Head from 'src/layout/Head';
import { fetchApi } from 'src/lib/request';
import { withSessionSsr } from 'src/lib/session';
import Button from '../../components/Button';
import StripedTable from '../../components/StrippedTable';
import { Wrap } from '@chakra-ui/react';
import { vocationIdToName } from '../../lib';

export default function Account({ user }) {
  const [info, setInfo] = useState(null);

  const fetchData = useCallback(async () => {
    const response = await fetchApi('GET', `/api/account/${user.id}`);
    setInfo(response.account);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      <Head title="Account Management"></Head>
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
              [{ text: 'Shop Coins' }, { text: 0 }],
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
