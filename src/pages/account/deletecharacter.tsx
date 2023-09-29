import React, { useEffect, useState, useCallback } from 'react';
import { FormikHelpers } from 'formik';
import Panel from '../../components/Panel';
import { withSessionSsr } from '../../lib/session';
import { fetchApi } from '../../lib/request';
import FormWrapper from '../../components/FormWrapper';
import { deleteCharacterSchema } from '../../schemas/DeleteCharacter';
import { Select, Text } from '@chakra-ui/react';
import { ButtonProps } from '../../shared/types/FormButton';
import { ApiResponse } from '../../shared/types/ApiResponse';
import { FormValues } from '../../shared/interfaces/FormValues';

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

type DataState = {
  fields: any[];
  initialValues: any;
} | null;

export default function DeleteCharacter({ user }) {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [data, setData] = useState<DataState>(null);

  const fetchCharacters = useCallback(async () => {
    const response = await fetchApi('GET', `/api/account/${user.id}`);
    if (response.success) {
      setData({
        fields: [
          {
            as: Select,
            type: 'select',
            name: 'name',
            label: { text: 'Name', size: 3 },
            size: 9,
            options: response.account.players.map((char) => ({
              value: char.name,
              text: char.name,
            })),
          },
          {
            type: 'password',
            name: 'password',
            label: { text: 'Password', size: 3 },
            size: 9,
          },
        ],
        initialValues: {
          name: response.account.players[0]?.name,
          password: '',
        },
      });
    }
  }, [user]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  if (!data) {
    return <Panel isLoading={true} />;
  }

  const onSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    const response: ApiResponse = await fetchApi(
      'POST',
      '/api/account/deletecharacter',
      {
        data: {
          name: values.name,
          password: values.password,
        },
      },
    );

    setResponse(response);
    formikHelpers.resetForm();
  };

  return (
    <Panel header="Delete Character">
      <Text align="center" margin="10px">
        To delete a character choose the character and enter your password.
      </Text>

      <FormWrapper
        validationSchema={deleteCharacterSchema}
        onSubmit={onSubmit}
        fields={data.fields}
        buttons={buttons}
        response={response}
        initialValues={data.initialValues}
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
    props: { user },
  };
});
