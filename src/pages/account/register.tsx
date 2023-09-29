import React, { useState } from 'react';
import { FormikHelpers } from 'formik';
import Panel from '../../components/Panel';
import Head from '../../layout/Head';
import { withSessionSsr } from '../../lib/session';
import { fetchApi } from '../../lib/request';
import FormWrapper from '../../components/FormWrapper';
import { registerSchema } from '../../schemas/Register';
import { ApiResponse } from '../../shared/types/ApiResponse';
import { FormValues } from '../../shared/interfaces/FormValues';
import { ButtonProps } from '../../shared/types/FormButton';

const fields = [
  {
    type: 'text',
    name: 'name',
    label: { text: 'Account Name', size: 3 },
    size: 9,
  },
  {
    type: 'password',
    name: 'password',
    label: { text: 'Password', size: 3 },
    size: 9,
  },
  {
    type: 'password',
    name: 'repeatPassword',
    label: { text: 'Repeat Password', size: 3 },
    size: 9,
  },
  {
    type: 'email',
    name: 'email',
    label: { text: 'Email Address', size: 3 },
    size: 9,
  },
];

const buttons: ButtonProps[] = [
  {
    type: 'submit',
    btnColorType: 'primary',
    value: 'Submit',
    isLoading: false,
    isActive: false,
    loadingText: 'Loading',
  },
  {
    href: '/account',
    value: 'Back',
    btnColorType: 'danger',
    isLoading: false,
    isActive: false,
    loadingText: 'Loading',
  },
];

export default function Register() {
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const onSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    const response: ApiResponse = await fetchApi(
      'POST',
      '/api/account/register',
      {
        data: {
          name: values.name,
          password: values.password,
          email: values.email,
        },
      },
    );

    setResponse(response);
    formikHelpers.resetForm();
  };

  return (
    <>
      <Head title="Register" />
      <Panel header="Register">
        <FormWrapper
          validationSchema={registerSchema}
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
