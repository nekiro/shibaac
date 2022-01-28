import React, { useState } from 'react';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';
import { fetchApi } from '../../util/request';
import * as Yup from 'yup';
import FormWrapper from '../../components/FormWrapper';
import { useUser } from '../../hooks/useUser';

const Schema = Yup.object().shape({
  account: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
  repeatPassword: Yup.string().when('password', {
    is: (val) => (val?.length > 0 ? true : false),
    then: Yup.string().oneOf(
      [Yup.ref('password')],
      'Both password need to be the same'
    ),
  }),
  email: Yup.string().email().required('Required'),
});

const fields = [
  {
    type: 'text',
    name: 'account',
    placeholder: '4 to 30 characters',
    label: { text: 'Account Name', size: 3 },
    size: 9,
  },
  {
    type: 'password',
    name: 'password',
    placeholder: '6 to 50 characters',
    label: { text: 'Password', size: 3 },
    size: 9,
  },
  {
    type: 'password',
    name: 'repeatPassword',
    placeholder: 'Repeat your password',
    label: { text: 'Repeat Password', size: 3 },
    size: 9,
  },
  {
    type: 'email',
    name: 'email',
    placeholder: '3 to 255 characters',
    label: { text: 'Email Address', size: 3 },
    size: 9,
  },
];

const buttons = [
  { type: 'submit', btnType: 'primary', value: 'Submit' },
  { value: 'Reset' },
];

export default function Register() {
  const [response, setResponse] = useState(null);
  const { user, setUser } = useUser();

  const onSubmit = async (values, { resetForm }) => {
    const response = await fetchApi('POST', '/api/accounts/register', {
      data: {
        name: values.account,
        password: values.password,
        email: values.email,
      },
    });

    setResponse(response);
    resetForm();
  };

  if (user) {
    router.push('/account');
    return null;
  }

  return (
    <>
      <Head title="Register"></Head>
      <Panel header="Register">
        <FormWrapper
          validationSchema={Schema}
          onSubmit={onSubmit}
          fields={fields}
          buttons={buttons}
          response={response}
        ></FormWrapper>
      </Panel>
    </>
  );
}
