import React, { useState } from 'react';
import { FormikHelpers } from 'formik';
import Panel from '../../components/Panel';
import FormWrapper from '../../components/FormWrapper';
import { fetchApi } from '../../lib/request';
import { withSessionSsr } from '../../lib/session';
import { changeEmailSchema } from '../../schemas/ChangeEmail';
import { ApiResponse } from '../../shared/types/ApiResponse';
import { FormValues } from '../../shared/interfaces/FormValues';
import { ButtonProps } from '../../shared/types/FormButton';

const fields = [
  {
    type: 'email',
    name: 'newEmail',
    label: { text: 'E-mail Address', size: 2 },
    size: 10,
  },
  {
    type: 'password',
    name: 'password',
    label: { text: 'Password', size: 2 },
    size: 10,
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

export default function ChangeEmail() {
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const onSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    const response: ApiResponse = await fetchApi(
      'POST',
      '/api/account/changeemail',
      {
        data: {
          email: values.newEmail,
          password: values.password,
        },
      },
    );

    if (response.success || response.data) {
      setResponse(response);
      formikHelpers.resetForm();
    } else {
      console.error('Error:', response.message);
    }
  };

  return (
    <Panel header="Change Email">
      <FormWrapper
        validationSchema={changeEmailSchema}
        onSubmit={onSubmit}
        fields={fields}
        buttons={buttons}
        response={response}
      />
    </Panel>
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
    props: {},
  };
});
