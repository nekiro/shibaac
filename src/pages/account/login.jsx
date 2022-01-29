import React, { useState } from 'react';
import Panel from 'src/components/Panel';
import Head from 'src/layout/Head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { withSessionSsr } from 'src/util/session';
import { useUser } from 'src/hooks/useUser';
import { loginSchema } from 'src/schemas/Login';
import { fetchApi } from 'src/util/request';
import FormWrapper from 'src/components/FormWrapper';

const fields = [
  { type: 'password', name: 'name', label: { text: 'Account Name' } },
  { type: 'password', name: 'password', label: { text: 'Password' } },
];

const buttons = [
  { type: 'submit', btnType: 'primary', value: 'Submit' },
  { btnType: 'danger', href: '/account/lost', value: 'Lost Account?' },
];

export default function Login() {
  const { setUser } = useUser();
  const router = useRouter();
  const [response, setResponse] = useState(null);

  const onSubmit = async (values, { resetForm }) => {
    const response = await fetchApi('POST', '/api/accounts/login', {
      data: {
        name: values.name,
        password: values.password,
      },
    });

    setResponse(response);
    resetForm();

    if (response.success) {
      setUser(response.account);
      router.push('/account');
    }
  };

  return (
    <>
      <Head title="Login"></Head>
      <Panel header="Login">
        <p align="center">Please enter your account name and your password.</p>
        <p align="center">
          <Link href="/account/register">Create an account </Link>
          if you do not have one yet.
        </p>

        <FormWrapper
          validationSchema={loginSchema}
          onSubmit={onSubmit}
          fields={fields}
          buttons={buttons}
          response={response}
        ></FormWrapper>
      </Panel>
    </>
  );
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
  const { user } = req.session;
  if (user) {
    return {
      redirect: {
        destination: '/account',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});
