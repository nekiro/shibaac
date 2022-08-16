import React, { useState } from 'react';
import Panel from 'src/components/Panel';
import Head from 'src/layout/Head';
import Link from 'src/components/Link';
import { useRouter } from 'next/router';
import { withSessionSsr } from 'src/util/session';
import { useUser } from 'src/hooks/useUser';
import { loginSchema } from 'src/schemas/Login';
import { fetchApi } from 'src/util/request';
import FormWrapper from 'src/components/FormWrapper';
import { Text } from '@chakra-ui/react';

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
    const response = await fetchApi('POST', '/api/account/login', {
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
        <Text align="center" margin="10px">
          Please enter your account name and your password.
        </Text>
        <Text align="center" margin="10px">
          <Link href="/account/register" text="Create an account " />
          if you do not have one yet.
        </Text>

        <FormWrapper
          validationSchema={loginSchema}
          onSubmit={onSubmit}
          fields={fields}
          buttons={buttons}
          response={response}
        />
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
