import React, { useEffect, useState, useCallback } from 'react';
import Panel from 'src/components/Panel';
import Head from 'src/layout/Head';
import Link from 'next/link';
import { fetchApi } from 'src/util/request';
import { withSessionSsr } from 'src/util/session';

export default function Account({ user }) {
  const [info, setInfo] = useState(null);

  const fetchData = useCallback(async () => {
    const response = await fetchApi('GET', `/api/accounts/${user.id}`);
    console.log(response);
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
        <table className="table table-striped table-condensed table-bordered">
          <tbody>
            <tr>
              <td width="20%">Account Name</td>
              <td>{info.name}</td>
            </tr>
            <tr>
              <td>E-mail Address</td>
              <td>{info.email}</td>
            </tr>
            <tr>
              <td>Creation Date</td>
              <td>{info.creation}</td>
            </tr>
            {/* <tr>
              <td>Last Login</td>
              <td>11/02/2021</td>
            </tr> */}
            <tr>
              <td>Shop Coins</td>
              <td>0</td>
            </tr>
            <tr>
              <td colSpan={2}>
                <Link href="/account/changepassword" passHref>
                  <button className="btn btn-primary btn-sm">
                    <i className="fa fa-lock"></i> Change Password
                  </button>
                </Link>

                <Link href="/account/changeemail" passHref>
                  <button className="btn btn-primary btn-sm">
                    <i className="fa fa-pencil-square-o"></i> Change Email
                  </button>
                </Link>

                {/* '.(!$rec_key ? '
                <a
                  href="?view=account&action=generatekey"
                  className="btn btn-primary btn-sm"
                >
                  <i className="fa fa-key"></i> Generate Recovery Key
                </a>
                ' : '').' */}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="panel panel-default">
          <div className="panel-heading">
            <div
              className="btn-group pull-right"
              style={{ top: '-5px', position: 'relative' }}
            >
              <Link href="/account/createcharacter" passHref>
                <button
                  className="btn btn-sm btn-success"
                  style={{ margin: { right: '5px' } }}
                >
                  <i className="fa fa-plus"></i> Create a new character
                </button>
              </Link>

              <Link href="/account/deletecharacter" passHref>
                <button
                  className="btn btn-sm btn-danger"
                  style={{ margin: { right: '5px' } }}
                >
                  <i className="fa fa-trash"></i> Delete a character
                </button>
              </Link>
            </div>
            Characters
          </div>
          <table className="table table-striped table-condensed table-bordered">
            <tbody>
              {info.players.map((player) => (
                <tr key={player.name}>
                  <td>
                    <Link href={`/character/${player.name}`}>
                      <a>{player.name}</a>
                    </Link>

                    <div className="pull-right">
                      <a
                        className="btn btn-sm btn-primary"
                        href="?view=account&action=editcharacter"
                      >
                        <i className="fa fa-pencil"></i> Edit
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
