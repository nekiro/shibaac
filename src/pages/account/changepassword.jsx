import React, { useState } from 'react';
import Panel from '../../components/Panel';
import * as Yup from 'yup';
import FormWrapper from '../../components/FormWrapper';
import { fetchApi } from '../../util/request';
import { withSessionSsr } from '../../util/session';

const Schema = Yup.object().shape({
  newPassword: Yup.string().required('Required'),
  repeatNewPassword: Yup.string()
    .required('Required')
    .when('newPassword', {
      is: (val) => (val?.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref('newPassword')],
        'Both password need to be the same'
      ),
    }),
  password: Yup.string()
    .required('Required')
    .when('newPassword', {
      is: (val) => (val?.length > 0 ? true : false),
      then: Yup.string().notOneOf(
        [Yup.ref('newPassword')],
        'New password must be different than current one'
      ),
    }),
});

const fields = [
  {
    type: 'password',
    name: 'newPassword',
    placeholder: '4 to 30 characters',
    label: { text: 'New Password', size: 3 },
    size: 9,
  },
  {
    type: 'password',
    name: 'repeatNewPassword',
    label: { text: 'Repeat New Password', size: 3 },
    size: 9,
  },
  {
    type: 'password',
    name: 'password',
    label: { text: 'Password', size: 3 },
    size: 9,
  },
];

const buttons = [
  { type: 'submit', btnType: 'primary', value: 'Submit' },
  { href: '/account', value: 'Back' },
];

export default function ChangePassword() {
  const [response, setResponse] = useState(null);

  const onSubmit = async (values, { resetForm }) => {
    const response = await fetchApi('POST', '/api/accounts/changepassword', {
      data: {
        newPassword: values.newPassword,
        password: values.password,
      },
    });

    setResponse(response);
    resetForm();
  };

  return (
    <>
      <Panel header="Change Password">
        <p align="center">
          Please enter your current password and a new password. For your
          security, please enter the new password twice.
        </p>

        <FormWrapper
          validationSchema={Schema}
          onSubmit={onSubmit}
          fields={fields}
          buttons={buttons}
          response={response}
        />
      </Panel>
    </>
  );
}

export const getServerSideProps = withSessionSsr(function ({ req }) {
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
    props: {},
  };
});
