import React, { useState } from 'react';
import Panel from 'src/components/Panel';
import FormWrapper from 'src/components/FormWrapper';
import { fetchApi } from 'src/util/request';
import { withSessionSsr } from 'src/util/session';
import { changePasswordSchema } from 'src/schemas/ChangePassword';

const fields = [
  {
    type: 'password',
    name: 'newPassword',
    placeholder: '6 to 30 characters',
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
          validationSchema={changePasswordSchema}
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
