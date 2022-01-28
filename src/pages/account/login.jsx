import React, { useState } from 'react';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Label from '../../components/Label';

import { useUser } from '../../hooks/useUser';

import * as Yup from 'yup';

import { fetchApi } from '../../util/request';
import FormWrapper from '../../components/FormWrapper';

const LoginSchema = Yup.object().shape({
  account: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const fields = [
  { type: 'password', name: 'account', label: { text: 'Account Name' } },
  { type: 'password', name: 'password', label: { text: 'Password' } },
];

const buttons = [
  { type: 'submit', btnType: 'primary', value: 'Submit' },
  { btnType: 'danger', href: '/account/lost', value: 'Lost Account?' },
];

export default function Login() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [response, setResponse] = useState(null);

  const onSubmit = async (values, { resetForm }) => {
    const response = await fetchApi('POST', '/api/accounts/login', {
      data: {
        name: values.account,
        password: values.password,
      },
    });

    setResponse(response);
    resetForm();

    if (response.success) {
      setUser(response.args.account);
      router.push('/account');
    }
  };

  if (user) {
    router.push('/account');
    return null;
  }

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
          validationSchema={LoginSchema}
          onSubmit={onSubmit}
          fields={fields}
          buttons={buttons}
          response={response}
        ></FormWrapper>
      </Panel>
    </>
  );
}
