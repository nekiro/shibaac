import React, { useState } from 'react';
import { FormikHelpers } from 'formik';
import Panel from '../../components/Panel';
import FormWrapper from '../../components/FormWrapper';
import { fetchApi } from '../../lib/request';
import { withSessionSsr } from '../../lib/session';
import { changePasswordSchema } from '../../schemas/ChangePassword';
import { Text } from '@chakra-ui/react';
import { ApiResponse } from '../../shared/types/ApiResponse';
import { FormValues } from '../../shared/interfaces/FormValues';
import { ButtonProps } from '../../shared/types/FormButton';

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

export default function ChangePassword() {
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const onSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    const response: ApiResponse = await fetchApi(
      'POST',
      '/api/account/changepassword',
      {
        data: {
          newPassword: values.newPassword,
          repeatNewPassword: values.repeatNewPassword,
          password: values.password,
        },
      },
    );

    setResponse(response);
    formikHelpers.resetForm();
  };

  return (
    <>
      <Panel header="Change Password">
        <Text align="center" margin="10px">
          Please enter your current password and a new password. For your
          security, please enter the new password twice.
        </Text>

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
