import React, { useState } from 'react';
import Panel from 'src/components/Panel';
import { withSessionSsr } from 'src/lib/session';
import FormWrapper from 'src/components/FormWrapper';

const fields = [
  {
    type: 'text',
    name: 'nick',
    label: { text: 'Character Name', size: 3 },
    size: 9,
  },
  {
    as: 'select',
    name: 'vocation',
    label: { text: 'Option', size: 3 },
    size: 9,
    options: [
      {
        value: 'email',
        text: 'Use email address to receive account name and a new password',
      },
      {
        value: 'reckey',
        text: 'Use recovery key to change your email and password',
      },
    ],
  },
];

const buttons = [
  { type: 'submit', btnType: 'primary', value: 'Submit' },
  { value: 'Reset' },
];

export default function Lost() {
  const [response, setResponse] = useState(null);

  const onSubmit = async (values, { resetForm }) => {
    // const response = await fetchApi('POST', '/api/account/register', {
    //   data: {
    //     name: values.account,
    //     password: values.password,
    //     email: values.email,
    //   },
    // });
    // setResponse(response);
    // resetForm();
  };

  return (
    <Panel header="Lost Account">
      TODO
      {/* <p>
        The Lost Account Interface can help you to get back your account name
        and password. Please enter your character name and select what you want
        to do.
      </p>
      <br />

      <FormWrapper
        validationSchema={null}
        onSubmit={onSubmit}
        fields={fields}
        buttons={buttons}
        response={response}
      /> */}
    </Panel>
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
