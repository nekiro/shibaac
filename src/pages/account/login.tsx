import React, { useState } from 'react';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';
import Link from '../../components/Link';
import { useRouter } from 'next/router';
import { User, withSessionSsr } from '../../lib/session';
import { useUser } from '../../hooks/useUser';
import { loginSchema } from '../../schemas/Login';
import { fetchApi, FetchResult } from '../../lib/request';
import FormWrapper, {
  FormField,
  FormButton,
} from '../../components/FormWrapper';
import { Text } from '@chakra-ui/react';
import { FormikHelpers } from 'formik';

const fields: FormField[] = [
  { type: 'password', name: 'name', label: { text: 'Account Name' } },
  { type: 'password', name: 'password', label: { text: 'Password' } },
  {
    type: 'text',
    name: 'twoFAToken',
    placeholder: 'If you have 2FA, code: XXX-XXX',
    label: { text: '2FA Token' },
  },
];

const buttons: FormButton[] = [
  { type: 'submit', btnColorType: 'primary', value: 'Submit' },
  { btnColorType: 'danger', href: '/account/lost', value: 'Lost Account?' },
];

export default function Login() {
  const { setUser } = useUser();
  const router = useRouter();
  const [response, setResponse] = useState<FetchResult | null>(null);

  const onSubmit = async (
    values: any,
    { resetForm }: FormikHelpers<object>,
  ) => {
    const response = await fetchApi<{ account: User }>(
      'POST',
      '/api/account/login',
      {
        data: {
          name: values.name,
          password: values.password,
        },
      },
    );

    setResponse(response);
    resetForm();

    if (response.success) {
      setUser(response.account);
      router.push('/account');
    }
  };

  return (
    <>
      <Head title="Login" />
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
